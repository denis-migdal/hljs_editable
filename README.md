# hljs_editable
Make highlight.js codes editables

Usage :
```js
const code = document.querySelector(...);
new HLJSEditable(code);
```

Other features :
-> history
-> support for enter/tabulation keys.

Get lang :
```js
// instance
hljs.lang

// standalone
HLJSEditable.lang(elem);
```

Manage cursor :
```js
// instance
hljs.getCursorPos();
hljs.setCursorPos(cursor); // an integer giving the caret position.

// standalone
HLJSEditable.getCursorPos(elem);
HLJSEditable.setCursorPos(elem, cursor);
```

Change language
```js
// instance
hljs.changeLang(lang);

// standalone :
HLJSEditatable.changeLang(html, code); // remove unnecessary line break and indentation.
```

Trim (not yet implemented)
```js
// option :
new HLJSEditable(code, {trim: true});

// standalone :
HLJSEditatable.trim(code); // remove unnecessary line break and indentation.
```

! requires :
```html
<style>
code[contenteditable]::after {
    content: "\200b"
}
</style>
```

TODO: history (ctrl+Z/etc)
TODO: change event... (when focus out)
TODO: script for HTML code ?