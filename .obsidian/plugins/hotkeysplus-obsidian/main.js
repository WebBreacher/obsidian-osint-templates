'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var HotkeysPlus = /** @class */ (function (_super) {
    __extends(HotkeysPlus, _super);
    function HotkeysPlus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HotkeysPlus.prototype.onload = function () {
        var _this = this;
        console.log('Loading Hotkeys++ plugin');
        this.addCommand({
            id: 'better-toggle-todo',
            name: 'Toggle to-do lists',
            callback: function () { return _this.toggleTodos(); },
            hotkeys: [
                {
                    modifiers: ['Mod'],
                    key: 'm',
                },
            ],
        });
        this.addCommand({
            id: 'toggle-bullet-number',
            name: 'Toggle line to bulleted or numbered lists',
            callback: function () { return _this.toggleLists(); },
            hotkeys: [
                {
                    modifiers: ['Mod', 'Shift'],
                    key: 'm',
                },
            ],
        });
        this.addCommand({
            id: 'toggle-block-quote',
            name: 'Toggle line to block quote',
            callback: function () { return _this.toggleBlockQuote(); },
            hotkeys: [
                {
                    modifiers: ['Mod'],
                    key: '<',
                },
            ],
        });
        this.addCommand({
            id: 'toggle-embed',
            name: 'Toggle line to embed internal links',
            callback: function () { return _this.toggleEmbed(); },
            hotkeys: [
                {
                    modifiers: ['Mod', 'Shift'],
                    key: '1',
                },
            ],
        });
        this.addCommand({
            id: 'duplicate-lines-down',
            name: 'Copy line(s) down',
            callback: function () { return _this.duplicateLines('down'); },
        });
        this.addCommand({
            id: 'duplicate-lines-up',
            name: 'Copy line(s) up',
            callback: function () { return _this.duplicateLines('up'); },
        });
        this.addCommand({
            id: 'clean-selected',
            name: 'Trims selected text and removes new line characters.',
            callback: function () { return _this.cleanSelected(); },
        });
        this.addCommand({
            id: 'insert-line-above',
            name: 'Insert line above current line',
            callback: function () { return _this.insertLine('above'); },
        });
        this.addCommand({
            id: 'insert-line-below',
            name: 'Insert line below current line',
            callback: function () { return _this.insertLine('below'); },
        });
        this.addCommand({
            id: 'clear-current-line',
            name: 'Clear current line',
            callback: function () { return _this.clearCurrentLine(); },
        });
        this.addCommand({
            id: 'toggle-readable-length',
            name: 'Toggle Readable Line Length',
            callback: function () {
                return _this.app.vault.setConfig('readableLineLength', !_this.app.vault.getConfig('readableLineLength'));
            },
        });
    };
    HotkeysPlus.prototype.clearCurrentLine = function () {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view)
            return;
        var editor = view.editor;
        var lineNumber = editor.getCursor().line;
        editor.setLine(lineNumber, '');
    };
    HotkeysPlus.prototype.insertLine = function (mode) {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view)
            return;
        var editor = view.editor;
        var lineNumber = editor.getCursor().line;
        var currentLineText = editor.getLine(lineNumber);
        var newLineText = '';
        if (currentLineText.trim().startsWith('- ')) {
            newLineText = currentLineText.substring(0, currentLineText.indexOf('- ') + 2);
        }
        for (var i = 1; i < 30; i++) {
            if (currentLineText.trim().startsWith(i.toString() + '. ')) {
                var correction = void 0;
                if (mode == 'above')
                    correction = -1;
                else
                    correction = 1;
                newLineText =
                    currentLineText.substring(0, currentLineText.indexOf(i.toString() + '. ')) +
                        (i + correction).toString() +
                        '. ';
            }
        }
        if (mode == 'above') {
            editor.replaceRange(newLineText + '\n', { line: lineNumber, ch: 0 });
            editor.setSelection({ line: lineNumber, ch: newLineText.length });
        }
        else {
            editor.replaceRange('\n' + newLineText, {
                line: lineNumber,
                ch: currentLineText.length,
            });
            editor.setSelection({ line: lineNumber + 1, ch: newLineText.length });
        }
    };
    HotkeysPlus.prototype.duplicateLines = function (mode) {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view)
            return;
        var editor = view.editor;
        var selectedText = this.getSelectedText(editor);
        var newString = selectedText.content + '\n';
        if (mode === 'down') {
            editor.replaceRange(newString, selectedText.start, selectedText.start);
        }
        else {
            if (selectedText.end.line === editor.lastLine()) {
                // create a new line so that lastLine + 1 exists
                var newLastLineContent = editor.getLine(editor.lastLine()) + '\n';
                var cursorAnchor = editor.getCursor('anchor');
                var cursorHead = editor.getCursor('head');
                editor.setLine(editor.lastLine(), newLastLineContent);
                editor.setSelection(cursorAnchor, cursorHead); // preserve original cursor / selection state (adding a new line may have pushed the cursor down)
                newString = selectedText.content; // because there is no other content on the newly created line, we don't need a trailing newline char
            }
            var nextLineStart = {
                line: selectedText.end.line + 1,
                ch: 0,
            };
            editor.replaceRange(newString, nextLineStart, nextLineStart);
        }
    };
    HotkeysPlus.prototype.cleanSelected = function () {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view)
            return;
        var editor = view.editor;
        var selectedText = this.getSelectedText(editor);
        var newString = selectedText.content.trim().replace(/(\r\n|\n|\r)/gm, ' ');
        newString = newString.replace(/  +/gm, ' ');
        editor.replaceRange(newString, selectedText.start, selectedText.end);
    };
    HotkeysPlus.prototype.onunload = function () {
        console.log('Unloading Hotkeys++ plugin');
    };
    HotkeysPlus.prototype.getSelectedText = function (editor) {
        if (editor.somethingSelected()) {
            // Toggle to-dos under the selection
            var cursorStart = editor.getCursor('from');
            var cursorEnd = editor.getCursor('to');
            var content = editor.getRange({ line: cursorStart.line, ch: 0 }, { line: cursorEnd.line, ch: editor.getLine(cursorEnd.line).length });
            return {
                start: { line: cursorStart.line, ch: 0 },
                end: {
                    line: cursorEnd.line,
                    ch: editor.getLine(cursorEnd.line).length,
                },
                content: content,
            };
        }
        else {
            // Toggle the todo in the line
            var lineNr = editor.getCursor().line;
            var contents = editor.getDoc().getLine(lineNr);
            var cursorStart = {
                line: lineNr,
                ch: 0,
            };
            var cursorEnd = {
                line: lineNr,
                ch: contents.length,
            };
            var content = editor.getRange(cursorStart, cursorEnd);
            return { start: cursorStart, end: cursorEnd, content: content };
        }
    };
    HotkeysPlus.prototype.toggleElement = function (re, subst) {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view)
            return;
        var editor = view.editor;
        var selection = editor.somethingSelected();
        var selectedText = this.getSelectedText(editor);
        var newString = selectedText.content.replace(re, subst);
        editor.replaceRange(newString, selectedText.start, selectedText.end);
        // Keep cursor in the same place
        if (selection) {
            editor.setSelection(selectedText.start, {
                line: selectedText.end.line,
                ch: editor.getLine(selectedText.end.line).length,
            });
        }
    };
    HotkeysPlus.prototype.toggleTodos = function () {
        var re = /(^\s*|^\t*)(-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d*\.\s|\*\s|\b|^)([^\n\r]*)/gim;
        return this.toggleElement(re, this.replaceTodoElement);
    };
    HotkeysPlus.prototype.toggleLists = function () {
        var re = /(^\s*|^\t*)(-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d*\.\s|\*\s|\b|^)([^\n\r]*)/gim;
        return this.toggleElement(re, this.replaceListElement);
    };
    HotkeysPlus.prototype.toggleBlockQuote = function () {
        var re = />\s|^/gim;
        return this.toggleElement(re, this.replaceBlockQuote);
    };
    HotkeysPlus.prototype.toggleEmbed = function () {
        var re = /\S*\[\[/gim;
        return this.toggleElement(re, this.replaceEmbed);
    };
    HotkeysPlus.prototype.replaceListElement = function (match, spaces, startText, sentence) {
        if (startText === '- ') {
            return spaces + '1. ' + sentence;
        }
        else if (startText === '') {
            return spaces + '- ' + sentence;
        }
        else if (startText === '1. ') {
            return spaces + '' + sentence;
        }
        else {
            return spaces + '- ' + sentence;
        }
    };
    HotkeysPlus.prototype.replaceBlockQuote = function (startText) {
        if (startText === '> ') {
            return '';
        }
        else if (startText === '') {
            return '> ';
        }
        else {
            return '> ';
        }
    };
    HotkeysPlus.prototype.replaceEmbed = function (startText) {
        if (startText === '![[') {
            return '[[';
        }
        else if (startText === '[[') {
            return '![[';
        }
        else {
            return '';
        }
    };
    HotkeysPlus.prototype.replaceTodoElement = function (match, spaces, startText, sentence) {
        if (startText === '- [ ] ') {
            return spaces + '- [x] ' + sentence;
        }
        else if (startText === '- [x] ') {
            return spaces + '- ' + sentence;
        }
        else {
            return spaces + '- [ ] ' + sentence;
        }
    };
    return HotkeysPlus;
}(obsidian.Plugin));

module.exports = HotkeysPlus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyBFZGl0b3IsIE1hcmtkb3duVmlldywgUGx1Z2luIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuaW50ZXJmYWNlIFZhdWx0Q29uZmlnIHtcclxuICByZWFkYWJsZUxpbmVMZW5ndGg6IGJvb2xlYW47XHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlICdvYnNpZGlhbicge1xyXG4gIGludGVyZmFjZSBWYXVsdCB7XHJcbiAgICBnZXRDb25maWc8VCBleHRlbmRzIGtleW9mIFZhdWx0Q29uZmlnPihjb25maWc6IFQpOiBWYXVsdENvbmZpZ1tUXTtcclxuICAgIHNldENvbmZpZzxUIGV4dGVuZHMga2V5b2YgVmF1bHRDb25maWc+KGNvbmZpZzogVCwgdmFsdWU6IFZhdWx0Q29uZmlnW1RdKTogdm9pZDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvdGtleXNQbHVzIGV4dGVuZHMgUGx1Z2luIHtcclxuICBvbmxvYWQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnTG9hZGluZyBIb3RrZXlzKysgcGx1Z2luJyk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6ICdiZXR0ZXItdG9nZ2xlLXRvZG8nLFxyXG4gICAgICBuYW1lOiAnVG9nZ2xlIHRvLWRvIGxpc3RzJyxcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMudG9nZ2xlVG9kb3MoKSxcclxuICAgICAgaG90a2V5czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG1vZGlmaWVyczogWydNb2QnXSxcclxuICAgICAgICAgIGtleTogJ20nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ3RvZ2dsZS1idWxsZXQtbnVtYmVyJyxcclxuICAgICAgbmFtZTogJ1RvZ2dsZSBsaW5lIHRvIGJ1bGxldGVkIG9yIG51bWJlcmVkIGxpc3RzJyxcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMudG9nZ2xlTGlzdHMoKSxcclxuICAgICAgaG90a2V5czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG1vZGlmaWVyczogWydNb2QnLCAnU2hpZnQnXSxcclxuICAgICAgICAgIGtleTogJ20nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ3RvZ2dsZS1ibG9jay1xdW90ZScsXHJcbiAgICAgIG5hbWU6ICdUb2dnbGUgbGluZSB0byBibG9jayBxdW90ZScsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnRvZ2dsZUJsb2NrUXVvdGUoKSxcclxuICAgICAgaG90a2V5czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG1vZGlmaWVyczogWydNb2QnXSxcclxuICAgICAgICAgIGtleTogJzwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ3RvZ2dsZS1lbWJlZCcsXHJcbiAgICAgIG5hbWU6ICdUb2dnbGUgbGluZSB0byBlbWJlZCBpbnRlcm5hbCBsaW5rcycsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnRvZ2dsZUVtYmVkKCksXHJcbiAgICAgIGhvdGtleXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBtb2RpZmllcnM6IFsnTW9kJywgJ1NoaWZ0J10sXHJcbiAgICAgICAgICBrZXk6ICcxJyxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6ICdkdXBsaWNhdGUtbGluZXMtZG93bicsXHJcbiAgICAgIG5hbWU6ICdDb3B5IGxpbmUocykgZG93bicsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLmR1cGxpY2F0ZUxpbmVzKCdkb3duJyksXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ2R1cGxpY2F0ZS1saW5lcy11cCcsXHJcbiAgICAgIG5hbWU6ICdDb3B5IGxpbmUocykgdXAnLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5kdXBsaWNhdGVMaW5lcygndXAnKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiAnY2xlYW4tc2VsZWN0ZWQnLFxyXG4gICAgICBuYW1lOiAnVHJpbXMgc2VsZWN0ZWQgdGV4dCBhbmQgcmVtb3ZlcyBuZXcgbGluZSBjaGFyYWN0ZXJzLicsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLmNsZWFuU2VsZWN0ZWQoKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiAnaW5zZXJ0LWxpbmUtYWJvdmUnLFxyXG4gICAgICBuYW1lOiAnSW5zZXJ0IGxpbmUgYWJvdmUgY3VycmVudCBsaW5lJyxcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuaW5zZXJ0TGluZSgnYWJvdmUnKSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6ICdpbnNlcnQtbGluZS1iZWxvdycsXHJcbiAgICAgIG5hbWU6ICdJbnNlcnQgbGluZSBiZWxvdyBjdXJyZW50IGxpbmUnLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5pbnNlcnRMaW5lKCdiZWxvdycpLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6ICdjbGVhci1jdXJyZW50LWxpbmUnLFxyXG4gICAgICBuYW1lOiAnQ2xlYXIgY3VycmVudCBsaW5lJyxcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuY2xlYXJDdXJyZW50TGluZSgpLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6ICd0b2dnbGUtcmVhZGFibGUtbGVuZ3RoJyxcclxuICAgICAgbmFtZTogJ1RvZ2dsZSBSZWFkYWJsZSBMaW5lIExlbmd0aCcsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PlxyXG4gICAgICAgIHRoaXMuYXBwLnZhdWx0LnNldENvbmZpZyhcclxuICAgICAgICAgICdyZWFkYWJsZUxpbmVMZW5ndGgnLFxyXG4gICAgICAgICAgIXRoaXMuYXBwLnZhdWx0LmdldENvbmZpZygncmVhZGFibGVMaW5lTGVuZ3RoJyksXHJcbiAgICAgICAgKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJDdXJyZW50TGluZSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xyXG4gICAgaWYgKCF2aWV3KSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZWRpdG9yID0gdmlldy5lZGl0b3I7XHJcbiAgICBjb25zdCBsaW5lTnVtYmVyID0gZWRpdG9yLmdldEN1cnNvcigpLmxpbmU7XHJcbiAgICBlZGl0b3Iuc2V0TGluZShsaW5lTnVtYmVyLCAnJyk7XHJcbiAgfVxyXG5cclxuICBpbnNlcnRMaW5lKG1vZGU6ICdhYm92ZScgfCAnYmVsb3cnKTogdm9pZCB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuICAgIGlmICghdmlldykgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGVkaXRvciA9IHZpZXcuZWRpdG9yO1xyXG4gICAgY29uc3QgbGluZU51bWJlciA9IGVkaXRvci5nZXRDdXJzb3IoKS5saW5lO1xyXG4gICAgY29uc3QgY3VycmVudExpbmVUZXh0ID0gZWRpdG9yLmdldExpbmUobGluZU51bWJlcik7XHJcbiAgICBsZXQgbmV3TGluZVRleHQgPSAnJztcclxuICAgIGlmIChjdXJyZW50TGluZVRleHQudHJpbSgpLnN0YXJ0c1dpdGgoJy0gJykpIHtcclxuICAgICAgbmV3TGluZVRleHQgPSBjdXJyZW50TGluZVRleHQuc3Vic3RyaW5nKDAsIGN1cnJlbnRMaW5lVGV4dC5pbmRleE9mKCctICcpICsgMik7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDMwOyBpKyspIHtcclxuICAgICAgaWYgKGN1cnJlbnRMaW5lVGV4dC50cmltKCkuc3RhcnRzV2l0aChpLnRvU3RyaW5nKCkgKyAnLiAnKSkge1xyXG4gICAgICAgIGxldCBjb3JyZWN0aW9uOiBudW1iZXI7XHJcbiAgICAgICAgaWYgKG1vZGUgPT0gJ2Fib3ZlJykgY29ycmVjdGlvbiA9IC0xO1xyXG4gICAgICAgIGVsc2UgY29ycmVjdGlvbiA9IDE7XHJcbiAgICAgICAgbmV3TGluZVRleHQgPVxyXG4gICAgICAgICAgY3VycmVudExpbmVUZXh0LnN1YnN0cmluZygwLCBjdXJyZW50TGluZVRleHQuaW5kZXhPZihpLnRvU3RyaW5nKCkgKyAnLiAnKSkgK1xyXG4gICAgICAgICAgKGkgKyBjb3JyZWN0aW9uKS50b1N0cmluZygpICtcclxuICAgICAgICAgICcuICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChtb2RlID09ICdhYm92ZScpIHtcclxuICAgICAgZWRpdG9yLnJlcGxhY2VSYW5nZShuZXdMaW5lVGV4dCArICdcXG4nLCB7IGxpbmU6IGxpbmVOdW1iZXIsIGNoOiAwIH0pO1xyXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0aW9uKHsgbGluZTogbGluZU51bWJlciwgY2g6IG5ld0xpbmVUZXh0Lmxlbmd0aCB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UoJ1xcbicgKyBuZXdMaW5lVGV4dCwge1xyXG4gICAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXHJcbiAgICAgICAgY2g6IGN1cnJlbnRMaW5lVGV4dC5sZW5ndGgsXHJcbiAgICAgIH0pO1xyXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0aW9uKHsgbGluZTogbGluZU51bWJlciArIDEsIGNoOiBuZXdMaW5lVGV4dC5sZW5ndGggfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkdXBsaWNhdGVMaW5lcyhtb2RlOiAndXAnIHwgJ2Rvd24nKTogdm9pZCB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuICAgIGlmICghdmlldykgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGVkaXRvciA9IHZpZXcuZWRpdG9yO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gdGhpcy5nZXRTZWxlY3RlZFRleHQoZWRpdG9yKTtcclxuICAgIGxldCBuZXdTdHJpbmcgPSBzZWxlY3RlZFRleHQuY29udGVudCArICdcXG4nO1xyXG5cclxuICAgIGlmIChtb2RlID09PSAnZG93bicpIHtcclxuICAgICAgZWRpdG9yLnJlcGxhY2VSYW5nZShuZXdTdHJpbmcsIHNlbGVjdGVkVGV4dC5zdGFydCwgc2VsZWN0ZWRUZXh0LnN0YXJ0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChzZWxlY3RlZFRleHQuZW5kLmxpbmUgPT09IGVkaXRvci5sYXN0TGluZSgpKSB7XHJcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGxpbmUgc28gdGhhdCBsYXN0TGluZSArIDEgZXhpc3RzXHJcbiAgICAgICAgY29uc3QgbmV3TGFzdExpbmVDb250ZW50ID0gZWRpdG9yLmdldExpbmUoZWRpdG9yLmxhc3RMaW5lKCkpICsgJ1xcbic7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnNvckFuY2hvciA9IGVkaXRvci5nZXRDdXJzb3IoJ2FuY2hvcicpO1xyXG4gICAgICAgIGNvbnN0IGN1cnNvckhlYWQgPSBlZGl0b3IuZ2V0Q3Vyc29yKCdoZWFkJyk7XHJcblxyXG4gICAgICAgIGVkaXRvci5zZXRMaW5lKGVkaXRvci5sYXN0TGluZSgpLCBuZXdMYXN0TGluZUNvbnRlbnQpO1xyXG4gICAgICAgIGVkaXRvci5zZXRTZWxlY3Rpb24oY3Vyc29yQW5jaG9yLCBjdXJzb3JIZWFkKTsgLy8gcHJlc2VydmUgb3JpZ2luYWwgY3Vyc29yIC8gc2VsZWN0aW9uIHN0YXRlIChhZGRpbmcgYSBuZXcgbGluZSBtYXkgaGF2ZSBwdXNoZWQgdGhlIGN1cnNvciBkb3duKVxyXG5cclxuICAgICAgICBuZXdTdHJpbmcgPSBzZWxlY3RlZFRleHQuY29udGVudDsgLy8gYmVjYXVzZSB0aGVyZSBpcyBubyBvdGhlciBjb250ZW50IG9uIHRoZSBuZXdseSBjcmVhdGVkIGxpbmUsIHdlIGRvbid0IG5lZWQgYSB0cmFpbGluZyBuZXdsaW5lIGNoYXJcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbmV4dExpbmVTdGFydCA9IHtcclxuICAgICAgICBsaW5lOiBzZWxlY3RlZFRleHQuZW5kLmxpbmUgKyAxLFxyXG4gICAgICAgIGNoOiAwLFxyXG4gICAgICB9O1xyXG4gICAgICBlZGl0b3IucmVwbGFjZVJhbmdlKG5ld1N0cmluZywgbmV4dExpbmVTdGFydCwgbmV4dExpbmVTdGFydCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbGVhblNlbGVjdGVkKCk6IHZvaWQge1xyXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XHJcbiAgICBpZiAoIXZpZXcpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBlZGl0b3IgPSB2aWV3LmVkaXRvcjtcclxuICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IHRoaXMuZ2V0U2VsZWN0ZWRUZXh0KGVkaXRvcik7XHJcbiAgICBsZXQgbmV3U3RyaW5nID0gc2VsZWN0ZWRUZXh0LmNvbnRlbnQudHJpbSgpLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sICcgJyk7XHJcbiAgICBuZXdTdHJpbmcgPSBuZXdTdHJpbmcucmVwbGFjZSgvICArL2dtLCAnICcpO1xyXG4gICAgZWRpdG9yLnJlcGxhY2VSYW5nZShuZXdTdHJpbmcsIHNlbGVjdGVkVGV4dC5zdGFydCwgc2VsZWN0ZWRUZXh0LmVuZCk7XHJcbiAgfVxyXG5cclxuICBvbnVubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdVbmxvYWRpbmcgSG90a2V5cysrIHBsdWdpbicpO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2VsZWN0ZWRUZXh0KGVkaXRvcjogRWRpdG9yKSB7XHJcbiAgICBpZiAoZWRpdG9yLnNvbWV0aGluZ1NlbGVjdGVkKCkpIHtcclxuICAgICAgLy8gVG9nZ2xlIHRvLWRvcyB1bmRlciB0aGUgc2VsZWN0aW9uXHJcbiAgICAgIGNvbnN0IGN1cnNvclN0YXJ0ID0gZWRpdG9yLmdldEN1cnNvcignZnJvbScpO1xyXG4gICAgICBjb25zdCBjdXJzb3JFbmQgPSBlZGl0b3IuZ2V0Q3Vyc29yKCd0bycpO1xyXG4gICAgICBjb25zdCBjb250ZW50ID0gZWRpdG9yLmdldFJhbmdlKFxyXG4gICAgICAgIHsgbGluZTogY3Vyc29yU3RhcnQubGluZSwgY2g6IDAgfSxcclxuICAgICAgICB7IGxpbmU6IGN1cnNvckVuZC5saW5lLCBjaDogZWRpdG9yLmdldExpbmUoY3Vyc29yRW5kLmxpbmUpLmxlbmd0aCB9LFxyXG4gICAgICApO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdGFydDogeyBsaW5lOiBjdXJzb3JTdGFydC5saW5lLCBjaDogMCB9LFxyXG4gICAgICAgIGVuZDoge1xyXG4gICAgICAgICAgbGluZTogY3Vyc29yRW5kLmxpbmUsXHJcbiAgICAgICAgICBjaDogZWRpdG9yLmdldExpbmUoY3Vyc29yRW5kLmxpbmUpLmxlbmd0aCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQsXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBUb2dnbGUgdGhlIHRvZG8gaW4gdGhlIGxpbmVcclxuICAgICAgY29uc3QgbGluZU5yID0gZWRpdG9yLmdldEN1cnNvcigpLmxpbmU7XHJcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gZWRpdG9yLmdldERvYygpLmdldExpbmUobGluZU5yKTtcclxuICAgICAgY29uc3QgY3Vyc29yU3RhcnQgPSB7XHJcbiAgICAgICAgbGluZTogbGluZU5yLFxyXG4gICAgICAgIGNoOiAwLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCBjdXJzb3JFbmQgPSB7XHJcbiAgICAgICAgbGluZTogbGluZU5yLFxyXG4gICAgICAgIGNoOiBjb250ZW50cy5sZW5ndGgsXHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBlZGl0b3IuZ2V0UmFuZ2UoY3Vyc29yU3RhcnQsIGN1cnNvckVuZCk7XHJcbiAgICAgIHJldHVybiB7IHN0YXJ0OiBjdXJzb3JTdGFydCwgZW5kOiBjdXJzb3JFbmQsIGNvbnRlbnQ6IGNvbnRlbnQgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRvZ2dsZUVsZW1lbnQocmU6IFJlZ0V4cCwgc3Vic3Q6IGFueSkge1xyXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XHJcbiAgICBpZiAoIXZpZXcpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBlZGl0b3IgPSB2aWV3LmVkaXRvcjtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGVkaXRvci5zb21ldGhpbmdTZWxlY3RlZCgpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gdGhpcy5nZXRTZWxlY3RlZFRleHQoZWRpdG9yKTtcclxuXHJcbiAgICBjb25zdCBuZXdTdHJpbmcgPSBzZWxlY3RlZFRleHQuY29udGVudC5yZXBsYWNlKHJlLCBzdWJzdCk7XHJcbiAgICBlZGl0b3IucmVwbGFjZVJhbmdlKG5ld1N0cmluZywgc2VsZWN0ZWRUZXh0LnN0YXJ0LCBzZWxlY3RlZFRleHQuZW5kKTtcclxuXHJcbiAgICAvLyBLZWVwIGN1cnNvciBpbiB0aGUgc2FtZSBwbGFjZVxyXG4gICAgaWYgKHNlbGVjdGlvbikge1xyXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0aW9uKHNlbGVjdGVkVGV4dC5zdGFydCwge1xyXG4gICAgICAgIGxpbmU6IHNlbGVjdGVkVGV4dC5lbmQubGluZSxcclxuICAgICAgICBjaDogZWRpdG9yLmdldExpbmUoc2VsZWN0ZWRUZXh0LmVuZC5saW5lKS5sZW5ndGgsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlVG9kb3MoKSB7XHJcbiAgICBjb25zdCByZSA9XHJcbiAgICAgIC8oXlxccyp8XlxcdCopKC1cXHNcXFsgXFxdXFxzfC1cXHNcXFt4XFxdXFxzfFxcKlxcc3wtXFxzfFxcZCpcXC5cXHN8XFwqXFxzfFxcYnxeKShbXlxcblxccl0qKS9naW07XHJcbiAgICByZXR1cm4gdGhpcy50b2dnbGVFbGVtZW50KHJlLCB0aGlzLnJlcGxhY2VUb2RvRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVMaXN0cygpIHtcclxuICAgIGNvbnN0IHJlID1cclxuICAgICAgLyheXFxzKnxeXFx0KikoLVxcc1xcWyBcXF1cXHN8LVxcc1xcW3hcXF1cXHN8XFwqXFxzfC1cXHN8XFxkKlxcLlxcc3xcXCpcXHN8XFxifF4pKFteXFxuXFxyXSopL2dpbTtcclxuICAgIHJldHVybiB0aGlzLnRvZ2dsZUVsZW1lbnQocmUsIHRoaXMucmVwbGFjZUxpc3RFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUJsb2NrUXVvdGUoKSB7XHJcbiAgICBjb25zdCByZSA9IC8+XFxzfF4vZ2ltO1xyXG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlRWxlbWVudChyZSwgdGhpcy5yZXBsYWNlQmxvY2tRdW90ZSk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVFbWJlZCgpIHtcclxuICAgIGNvbnN0IHJlID0gL1xcUypcXFtcXFsvZ2ltO1xyXG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlRWxlbWVudChyZSwgdGhpcy5yZXBsYWNlRW1iZWQpO1xyXG4gIH1cclxuXHJcbiAgcmVwbGFjZUxpc3RFbGVtZW50KFxyXG4gICAgbWF0Y2g6IHN0cmluZyxcclxuICAgIHNwYWNlczogc3RyaW5nLFxyXG4gICAgc3RhcnRUZXh0OiBzdHJpbmcsXHJcbiAgICBzZW50ZW5jZTogc3RyaW5nLFxyXG4gICkge1xyXG4gICAgaWYgKHN0YXJ0VGV4dCA9PT0gJy0gJykge1xyXG4gICAgICByZXR1cm4gc3BhY2VzICsgJzEuICcgKyBzZW50ZW5jZTtcclxuICAgIH0gZWxzZSBpZiAoc3RhcnRUZXh0ID09PSAnJykge1xyXG4gICAgICByZXR1cm4gc3BhY2VzICsgJy0gJyArIHNlbnRlbmNlO1xyXG4gICAgfSBlbHNlIGlmIChzdGFydFRleHQgPT09ICcxLiAnKSB7XHJcbiAgICAgIHJldHVybiBzcGFjZXMgKyAnJyArIHNlbnRlbmNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHNwYWNlcyArICctICcgKyBzZW50ZW5jZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlcGxhY2VCbG9ja1F1b3RlKHN0YXJ0VGV4dDogc3RyaW5nKSB7XHJcbiAgICBpZiAoc3RhcnRUZXh0ID09PSAnPiAnKSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH0gZWxzZSBpZiAoc3RhcnRUZXh0ID09PSAnJykge1xyXG4gICAgICByZXR1cm4gJz4gJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnPiAnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVwbGFjZUVtYmVkKHN0YXJ0VGV4dDogc3RyaW5nKSB7XHJcbiAgICBpZiAoc3RhcnRUZXh0ID09PSAnIVtbJykge1xyXG4gICAgICByZXR1cm4gJ1tbJztcclxuICAgIH0gZWxzZSBpZiAoc3RhcnRUZXh0ID09PSAnW1snKSB7XHJcbiAgICAgIHJldHVybiAnIVtbJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlcGxhY2VUb2RvRWxlbWVudChcclxuICAgIG1hdGNoOiBzdHJpbmcsXHJcbiAgICBzcGFjZXM6IHN0cmluZyxcclxuICAgIHN0YXJ0VGV4dDogc3RyaW5nLFxyXG4gICAgc2VudGVuY2U6IHN0cmluZyxcclxuICApIHtcclxuICAgIGlmIChzdGFydFRleHQgPT09ICctIFsgXSAnKSB7XHJcbiAgICAgIHJldHVybiBzcGFjZXMgKyAnLSBbeF0gJyArIHNlbnRlbmNlO1xyXG4gICAgfSBlbHNlIGlmIChzdGFydFRleHQgPT09ICctIFt4XSAnKSB7XHJcbiAgICAgIHJldHVybiBzcGFjZXMgKyAnLSAnICsgc2VudGVuY2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gc3BhY2VzICsgJy0gWyBdICcgKyBzZW50ZW5jZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk1hcmtkb3duVmlldyIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEtBQUssSUFBSTtBQUM3QyxRQUFRLE1BQU0sSUFBSSxTQUFTLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLCtCQUErQixDQUFDLENBQUM7QUFDbEcsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6Rjs7O0lDaEJ5QywrQkFBTTtJQUEvQzs7S0E0VEM7SUEzVEMsNEJBQU0sR0FBTjtRQUFBLGlCQStGQztRQTlGQyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNkLEVBQUUsRUFBRSxvQkFBb0I7WUFDeEIsSUFBSSxFQUFFLG9CQUFvQjtZQUMxQixRQUFRLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLEVBQUUsR0FBQTtZQUNsQyxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNsQixHQUFHLEVBQUUsR0FBRztpQkFDVDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNkLEVBQUUsRUFBRSxzQkFBc0I7WUFDMUIsSUFBSSxFQUFFLDJDQUEyQztZQUNqRCxRQUFRLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLEVBQUUsR0FBQTtZQUNsQyxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztvQkFDM0IsR0FBRyxFQUFFLEdBQUc7aUJBQ1Q7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLENBQUM7WUFDZCxFQUFFLEVBQUUsb0JBQW9CO1lBQ3hCLElBQUksRUFBRSw0QkFBNEI7WUFDbEMsUUFBUSxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBQTtZQUN2QyxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNsQixHQUFHLEVBQUUsR0FBRztpQkFDVDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNkLEVBQUUsRUFBRSxjQUFjO1lBQ2xCLElBQUksRUFBRSxxQ0FBcUM7WUFDM0MsUUFBUSxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsV0FBVyxFQUFFLEdBQUE7WUFDbEMsT0FBTyxFQUFFO2dCQUNQO29CQUNFLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7b0JBQzNCLEdBQUcsRUFBRSxHQUFHO2lCQUNUO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ2QsRUFBRSxFQUFFLHNCQUFzQjtZQUMxQixJQUFJLEVBQUUsbUJBQW1CO1lBQ3pCLFFBQVEsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBQTtTQUM1QyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ2QsRUFBRSxFQUFFLG9CQUFvQjtZQUN4QixJQUFJLEVBQUUsaUJBQWlCO1lBQ3ZCLFFBQVEsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBQTtTQUMxQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ2QsRUFBRSxFQUFFLGdCQUFnQjtZQUNwQixJQUFJLEVBQUUsc0RBQXNEO1lBQzVELFFBQVEsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLGFBQWEsRUFBRSxHQUFBO1NBQ3JDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLENBQUM7WUFDZCxFQUFFLEVBQUUsbUJBQW1CO1lBQ3ZCLElBQUksRUFBRSxnQ0FBZ0M7WUFDdEMsUUFBUSxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFBO1NBQ3pDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxVQUFVLENBQUM7WUFDZCxFQUFFLEVBQUUsbUJBQW1CO1lBQ3ZCLElBQUksRUFBRSxnQ0FBZ0M7WUFDdEMsUUFBUSxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFBO1NBQ3pDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLENBQUM7WUFDZCxFQUFFLEVBQUUsb0JBQW9CO1lBQ3hCLElBQUksRUFBRSxvQkFBb0I7WUFDMUIsUUFBUSxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBQTtTQUN4QyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ2QsRUFBRSxFQUFFLHdCQUF3QjtZQUM1QixJQUFJLEVBQUUsNkJBQTZCO1lBQ25DLFFBQVEsRUFBRTtnQkFDUixPQUFBLEtBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FDdEIsb0JBQW9CLEVBQ3BCLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQ2hEO2FBQUE7U0FDSixDQUFDLENBQUM7S0FDSjtJQUVELHNDQUFnQixHQUFoQjtRQUNFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDQSxxQkFBWSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPO1FBRWxCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQztRQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNoQztJQUVELGdDQUFVLEdBQVYsVUFBVyxJQUF1QjtRQUNoQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQ0EscUJBQVksQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTztRQUVsQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDM0MsSUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNDLFdBQVcsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQy9FO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQixJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFO2dCQUMxRCxJQUFJLFVBQVUsU0FBUSxDQUFDO2dCQUN2QixJQUFJLElBQUksSUFBSSxPQUFPO29CQUFFLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7b0JBQ2hDLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLFdBQVc7b0JBQ1QsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQzFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxRQUFRLEVBQUU7d0JBQzNCLElBQUksQ0FBQzthQUNSO1NBQ0Y7UUFDRCxJQUFJLElBQUksSUFBSSxPQUFPLEVBQUU7WUFDbkIsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDbkU7YUFBTTtZQUNMLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLFdBQVcsRUFBRTtnQkFDdEMsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLEVBQUUsRUFBRSxlQUFlLENBQUMsTUFBTTthQUMzQixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZFO0tBQ0Y7SUFFRCxvQ0FBYyxHQUFkLFVBQWUsSUFBbUI7UUFDaEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUNBLHFCQUFZLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFbEIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRTVDLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUNuQixNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4RTthQUFNO1lBQ0wsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7O2dCQUUvQyxJQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUVwRSxJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU1QyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFFOUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUM7YUFDbEM7WUFFRCxJQUFNLGFBQWEsR0FBRztnQkFDcEIsSUFBSSxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUM7Z0JBQy9CLEVBQUUsRUFBRSxDQUFDO2FBQ04sQ0FBQztZQUNGLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUM5RDtLQUNGO0lBRUQsbUNBQWEsR0FBYjtRQUNFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDQSxxQkFBWSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPO1FBRWxCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzRSxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdEU7SUFFRCw4QkFBUSxHQUFSO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0tBQzNDO0lBRUQscUNBQWUsR0FBZixVQUFnQixNQUFjO1FBQzVCLElBQUksTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7O1lBRTlCLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUM3QixFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFDakMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQ3BFLENBQUM7WUFFRixPQUFPO2dCQUNMLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ3hDLEdBQUcsRUFBRTtvQkFDSCxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7b0JBQ3BCLEVBQUUsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO2lCQUMxQztnQkFDRCxPQUFPLEVBQUUsT0FBTzthQUNqQixDQUFDO1NBQ0g7YUFBTTs7WUFFTCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ3ZDLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakQsSUFBTSxXQUFXLEdBQUc7Z0JBQ2xCLElBQUksRUFBRSxNQUFNO2dCQUNaLEVBQUUsRUFBRSxDQUFDO2FBQ04sQ0FBQztZQUNGLElBQU0sU0FBUyxHQUFHO2dCQUNoQixJQUFJLEVBQUUsTUFBTTtnQkFDWixFQUFFLEVBQUUsUUFBUSxDQUFDLE1BQU07YUFDcEIsQ0FBQztZQUNGLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO1NBQ2pFO0tBQ0Y7SUFFRCxtQ0FBYSxHQUFiLFVBQWMsRUFBVSxFQUFFLEtBQVU7UUFDbEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUNBLHFCQUFZLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFbEIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUM3QyxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxELElBQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFHckUsSUFBSSxTQUFTLEVBQUU7WUFDYixNQUFNLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3RDLElBQUksRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUk7Z0JBQzNCLEVBQUUsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTTthQUNqRCxDQUFDLENBQUM7U0FDSjtLQUNGO0lBRUQsaUNBQVcsR0FBWDtRQUNFLElBQU0sRUFBRSxHQUNOLDRFQUE0RSxDQUFDO1FBQy9FLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDeEQ7SUFFRCxpQ0FBVyxHQUFYO1FBQ0UsSUFBTSxFQUFFLEdBQ04sNEVBQTRFLENBQUM7UUFDL0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUN4RDtJQUVELHNDQUFnQixHQUFoQjtRQUNFLElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQztRQUN0QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQsaUNBQVcsR0FBWDtRQUNFLElBQU0sRUFBRSxHQUFHLFlBQVksQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNsRDtJQUVELHdDQUFrQixHQUFsQixVQUNFLEtBQWEsRUFDYixNQUFjLEVBQ2QsU0FBaUIsRUFDakIsUUFBZ0I7UUFFaEIsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO1lBQ3RCLE9BQU8sTUFBTSxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7U0FDbEM7YUFBTSxJQUFJLFNBQVMsS0FBSyxFQUFFLEVBQUU7WUFDM0IsT0FBTyxNQUFNLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQztTQUNqQzthQUFNLElBQUksU0FBUyxLQUFLLEtBQUssRUFBRTtZQUM5QixPQUFPLE1BQU0sR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDO1NBQy9CO2FBQU07WUFDTCxPQUFPLE1BQU0sR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDO1NBQ2pDO0tBQ0Y7SUFFRCx1Q0FBaUIsR0FBakIsVUFBa0IsU0FBaUI7UUFDakMsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7YUFBTSxJQUFJLFNBQVMsS0FBSyxFQUFFLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUM7U0FDYjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUM7U0FDYjtLQUNGO0lBRUQsa0NBQVksR0FBWixVQUFhLFNBQWlCO1FBQzVCLElBQUksU0FBUyxLQUFLLEtBQUssRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQztTQUNiO2FBQU0sSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO1lBQzdCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7YUFBTTtZQUNMLE9BQU8sRUFBRSxDQUFDO1NBQ1g7S0FDRjtJQUVELHdDQUFrQixHQUFsQixVQUNFLEtBQWEsRUFDYixNQUFjLEVBQ2QsU0FBaUIsRUFDakIsUUFBZ0I7UUFFaEIsSUFBSSxTQUFTLEtBQUssUUFBUSxFQUFFO1lBQzFCLE9BQU8sTUFBTSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDckM7YUFBTSxJQUFJLFNBQVMsS0FBSyxRQUFRLEVBQUU7WUFDakMsT0FBTyxNQUFNLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQztTQUNqQzthQUFNO1lBQ0wsT0FBTyxNQUFNLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUNyQztLQUNGO0lBQ0gsa0JBQUM7QUFBRCxDQTVUQSxDQUF5Q0MsZUFBTTs7OzsifQ==
