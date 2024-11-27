export class HLJSEditable {

    #html;

    constructor(html) {

        this.#html = html;

        html.toggleAttribute('contenteditable', true);
        html.setAttribute("spellcheck", "false");

        html.addEventListener("input", () => {
            //const code = html.textContent;
            const cursor = this.getCursorPos();
            this.updateHighlight();
            this.setCursorPos(cursor);
        });

        html.addEventListener('keydown', (ev) => {

            let char = null;
            if( ev.code === "Tab")
                char = "\t";
            if( ev.code === "Enter") // may or may not be needed.
                char = "\n";

            if( char !== null) {
                ev.preventDefault();
    
                // https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur
                var doc = this.#html.ownerDocument.defaultView;
                var sel = doc.getSelection();
                var range = sel.getRangeAt(0);
    
                var tabNode = document.createTextNode(char);
                range.insertNode(tabNode);
    
                range.setStartAfter(tabNode);
                range.setEndAfter(tabNode); 
                sel.removeAllRanges();
                sel.addRange(range);

                this.#html.dispatchEvent(new Event("input"));
            }
        });
    }

    updateHighlight() {

        const code = this.#html.textContent;
        const language = this.lang;

        this.#html.innerHTML = hljs.highlight(code, { language }).value;
    }

    get lang() {
        return HLJSEditable.lang(this.#html);
    }

    static lang(html) {
        return [...html.classList].filter( c => c.startsWith('language-') )[0].slice(9);
    }

    changeLang(lang) {
        HLJSEditable.changeLang(this.#html, lang);
    }

    static changeLang(html, language) {
        const to_remove = [...html.classList].filter(c => c.startsWith('language-'));
        html.classList.remove(...to_remove);
        html.classList.add(`language-${language}`);

        const cursor = HLJSEditable.getCursorPos(html);

        html.innerHTML = hljs.highlight(html.textContent, { language }).value;

        HLJSEditable.setCursorPos(html, cursor);        
    }

    getCursorPos() {
        return HLJSEditable.getCursorPos(this.#html);
    }
    setCursorPos(cursor) {
        return HLJSEditable.setCursorPos(this.#html, cursor);
    }

    static getCursorPos(html) {

        const target = html;

        if( target.getRootNode().activeElement !== target )
            return null;
    
        let rrange = window.getSelection().getRangeAt(0);
    
        let path = [];
        let cur  = rrange.startContainer;
    
        while(cur !== target) {
            path.push(cur); 
            cur = cur.parentNode;
        }
    
        let cursor = 0;
    
        let children = target.childNodes;
        for(let i = path.length-1; i >= 0; --i) {
            for(let j = 0; j < children.length; ++j) {
                if( children[j] === path[i])
                    break;
                cursor += children[j].textContent.length;
            }
            children = path[i].childNodes;
        }
    
        let offset = rrange.startOffset;
    
        // https://developer.mozilla.org/en-US/docs/Web/API/Range/startOffset
        if( rrange.startContainer.nodeType === Node.TEXT_NODE)
            cursor += offset;
        else {
            for(let i = 0; i < offset ; ++i)
                cursor += rrange.startContainer.childNodes[i].textContent.length;
        }
    
        return cursor;
    }
    static setCursorPos(html, cursor) {

        const target = html;

        if( cursor === null)
            return;
    
        let cur = target;
    
        while(cur.nodeType !== Node.TEXT_NODE) {
            if( cur.childNodes.length === 0)
                break;
    
            for( let i = 0; i < cur.childNodes.length; ++i ) {
                const clen = cur.childNodes[i].textContent.length;
                if( cursor <= clen ) {
                    cur = cur.childNodes[i];
                    break;
                }
                cursor -= clen;
            }
        }
    
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(cur, cursor);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    static trim(elem) {
        //TODO...
    }
}