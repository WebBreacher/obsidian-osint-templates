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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var MyPlugin = /** @class */ (function (_super) {
    __extends(MyPlugin, _super);
    function MyPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var compare;
            var _this = this;
            return __generator(this, function (_a) {
                console.log('loading ' + this.manifest.name);
                compare = new Intl.Collator(navigator.language, {
                    usage: 'sort',
                    sensitivity: 'base',
                    numeric: true,
                    ignorePunctuation: true,
                }).compare;
                this.compare = compare;
                this.addCommand({
                    id: 'sort-alphabetically-with-checkboxes',
                    name: 'Sort alphabetically with checkboxes',
                    callback: (function () { return _this.sortAlphabetically(false, false); }),
                });
                this.addCommand({
                    id: 'sort-list-alphabetically-with-checkboxes',
                    name: 'Sort current list alphabetically with checkboxes',
                    callback: (function () { return _this.sortAlphabetically(true, false); }),
                });
                this.addCommand({
                    id: 'sort-alphabetically',
                    name: 'Sort alphabetically',
                    callback: (function () { return _this.sortAlphabetically(false, true); }),
                });
                this.addCommand({
                    id: 'sort-list-alphabetically',
                    name: 'Sort current list alphabetically',
                    callback: (function () { return _this.sortAlphabetically(true, true); }),
                });
                this.addCommand({
                    id: 'sort-length',
                    name: 'Sort by length of line',
                    callback: (function () { return _this.sortLengthOfLine(); }),
                });
                this.addCommand({
                    id: 'sort-headings',
                    name: 'Sort headings',
                    callback: (function () { return _this.sortHeadings(); }),
                });
                this.addCommand({
                    id: 'permute-reverse',
                    name: 'Reverse lines',
                    callback: (function () { return _this.permuteReverse(); }),
                });
                this.addCommand({
                    id: 'permute-shuffle',
                    name: 'Shuffle lines',
                    callback: (function () { return _this.permuteShuffle(); }),
                });
                return [2 /*return*/];
            });
        });
    };
    MyPlugin.prototype.onunload = function () {
        console.log('unloading ' + this.manifest.name);
    };
    MyPlugin.prototype.sortAlphabetically = function (fromCurrentList, ignoreCheckboxes) {
        var _this = this;
        if (fromCurrentList === void 0) { fromCurrentList = false; }
        if (ignoreCheckboxes === void 0) { ignoreCheckboxes = true; }
        var lines = this.getLines(fromCurrentList, ignoreCheckboxes);
        if (lines.length === 0)
            return;
        var sortFunc = function (a, b) { return _this.compare(a.formatted.trim(), b.formatted.trim()); };
        lines.sort(sortFunc);
        this.setLines(lines, fromCurrentList);
    };
    MyPlugin.prototype.sortHeadings = function () {
        var lines = this.getLines();
        var res = this.getSortedHeadings(lines, 0, { headingLevel: 0, formatted: "", source: "", lineNumber: -1 });
        this.setLines(this.headingsToString(res).slice(1));
    };
    MyPlugin.prototype.headingsToString = function (heading) {
        var _this = this;
        var list = __spreadArrays([
            heading.title
        ], heading.lines);
        heading.headings.forEach(function (e) { return list.push.apply(list, _this.headingsToString(e)); });
        return list;
    };
    MyPlugin.prototype.getSortedHeadings = function (lines, from, heading) {
        var _this = this;
        var headings = [];
        var contentLines = [];
        var currentIndex = from;
        while (currentIndex < lines.length) {
            var current = lines[currentIndex];
            if (current.headingLevel <= heading.headingLevel) {
                break;
            }
            if (current.headingLevel) {
                headings.push(this.getSortedHeadings(lines, currentIndex + 1, current));
                currentIndex = headings.last().to;
            }
            else {
                contentLines.push(current);
            }
            currentIndex++;
        }
        return {
            lines: contentLines,
            to: headings.length > 0 ? headings.last().to : (currentIndex - 1),
            headings: headings.sort(function (a, b) {
                //First sort by heading level then alphabetically
                var res = a.title.headingLevel - b.title.headingLevel;
                if (res == 0) {
                    return _this.compare(a.title.formatted.trim(), b.title.formatted.trim());
                }
                else {
                    return res;
                }
            }),
            title: heading,
        };
    };
    MyPlugin.prototype.sortLengthOfLine = function () {
        var lines = this.getLines();
        if (lines.length === 0)
            return;
        lines.sort(function (a, b) { return a.formatted.length - b.formatted.length; });
        this.setLines(lines);
    };
    MyPlugin.prototype.permuteReverse = function () {
        var lines = this.getLines();
        if (lines.length === 0)
            return;
        lines.reverse();
        this.setLines(lines);
    };
    MyPlugin.prototype.permuteShuffle = function () {
        var lines = this.getLines();
        if (lines.length === 0)
            return;
        lines.shuffle();
        this.setLines(lines);
    };
    MyPlugin.prototype.getLines = function (fromCurrentList, ignoreCheckboxes) {
        var _a, _b;
        if (fromCurrentList === void 0) { fromCurrentList = false; }
        if (ignoreCheckboxes === void 0) { ignoreCheckboxes = true; }
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view)
            return;
        var editor = view.editor;
        var file = view.file;
        var lines = editor.getValue().split("\n");
        var cache = this.app.metadataCache.getFileCache(file);
        var _c = this.getPosition(view, fromCurrentList), start = _c.start, end = _c.end;
        var headings = cache.headings;
        var links = __spreadArrays((_a = cache === null || cache === void 0 ? void 0 : cache.links) !== null && _a !== void 0 ? _a : [], (_b = cache === null || cache === void 0 ? void 0 : cache.embeds) !== null && _b !== void 0 ? _b : []);
        var myLines = lines.map(function (line, index) {
            var myLine = { source: line, formatted: line, headingLevel: undefined, lineNumber: index };
            links.forEach(function (e) {
                if (e.position.start.line != index)
                    return;
                var start = e.position.start;
                var end = e.position.end;
                myLine.formatted = myLine.formatted.replace(line.substring(start.col, end.col), e.displayText);
            });
            if (ignoreCheckboxes) {
                if (myLine.formatted.startsWith("- [x]")) {
                    myLine.formatted = myLine.formatted.substring(6);
                }
            }
            else {
                // Just a little bit dirty...
                myLine.formatted = myLine.formatted.replace("- [x]", "ZZZZZZZZZZZZZZZZZZZZZZZZZ");
            }
            return myLine;
        });
        headings === null || headings === void 0 ? void 0 : headings.map(function (heading) { return myLines[heading.position.start.line].headingLevel = heading.level; });
        if (start != end) {
            return myLines.slice(start, end + 1);
        }
        else {
            return myLines;
        }
    };
    MyPlugin.prototype.setLines = function (lines, fromCurrentList) {
        if (fromCurrentList === void 0) { fromCurrentList = false; }
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        var res = this.getPosition(view, fromCurrentList);
        var editor = view.editor;
        if (res.start != res.end) {
            editor.replaceRange(lines.map(function (e) { return e.source; }).join("\n"), { line: res.start, ch: 0 }, { line: res.end, ch: res.endLineLength });
        }
        else {
            editor.setValue(lines.map(function (e) { return e.source; }).join("\n"));
        }
    };
    MyPlugin.prototype.getPosition = function (view, fromCurrentList) {
        var _a, _b, _c;
        if (fromCurrentList === void 0) { fromCurrentList = false; }
        var cache = this.app.metadataCache.getFileCache(view.file);
        var editor = view.editor;
        var cursorStart = editor.getCursor("from").line;
        var cursorEnd = editor.getCursor("to").line;
        if (fromCurrentList) {
            var list = cache.sections.find(function (e) {
                return e.position.start.line <= cursorStart && e.position.end.line >= cursorEnd;
            });
            if (list) {
                cursorStart = list.position.start.line;
                cursorEnd = list.position.end.line;
            }
        }
        var curserEndLineLength = editor.getLine(cursorEnd).length;
        var frontStart = ((_c = (_b = (_a = cache.frontmatter) === null || _a === void 0 ? void 0 : _a.position) === null || _b === void 0 ? void 0 : _b.end) === null || _c === void 0 ? void 0 : _c.line) + 1;
        if (isNaN(frontStart)) {
            frontStart = 0;
        }
        var frontEnd = editor.lastLine();
        var frontEndLineLength = editor.getLine(frontEnd).length;
        if (cursorStart != cursorEnd) {
            return {
                start: cursorStart,
                end: cursorEnd,
                endLineLength: curserEndLineLength,
            };
        }
        else {
            return {
                start: frontStart,
                end: frontEnd,
                endLineLength: frontEndLineLength,
            };
        }
    };
    return MyPlugin;
}(obsidian.Plugin));

module.exports = MyPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyBNYXJrZG93blZpZXcsIFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcblxuaW50ZXJmYWNlIHNvcnRNZXRob2Qge1xuXHQoeDogc3RyaW5nLCB5OiBzdHJpbmcpOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBNeUxpbmUge1xuXHRzb3VyY2U6IHN0cmluZztcblx0Zm9ybWF0dGVkOiBzdHJpbmc7XG5cdGhlYWRpbmdMZXZlbDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXHRsaW5lTnVtYmVyOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBIZWFkaW5nUGFydCB7XG5cdHRvOiBudW1iZXI7XG5cdHRpdGxlOiBNeUxpbmU7XG5cdGxpbmVzOiBNeUxpbmVbXTtcblx0aGVhZGluZ3M6IEhlYWRpbmdQYXJ0W107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE15UGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcblx0Y29tcGFyZTogc29ydE1ldGhvZDtcblx0YXN5bmMgb25sb2FkKCkge1xuXHRcdGNvbnNvbGUubG9nKCdsb2FkaW5nICcgKyB0aGlzLm1hbmlmZXN0Lm5hbWUpO1xuXG5cdFx0Y29uc3QgeyBjb21wYXJlIH0gPSBuZXcgSW50bC5Db2xsYXRvcihuYXZpZ2F0b3IubGFuZ3VhZ2UsIHtcblx0XHRcdHVzYWdlOiAnc29ydCcsXG5cdFx0XHRzZW5zaXRpdml0eTogJ2Jhc2UnLFxuXHRcdFx0bnVtZXJpYzogdHJ1ZSxcblx0XHRcdGlnbm9yZVB1bmN0dWF0aW9uOiB0cnVlLFxuXHRcdH0pO1xuXHRcdHRoaXMuY29tcGFyZSA9IGNvbXBhcmU7XG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcblx0XHRcdGlkOiAnc29ydC1hbHBoYWJldGljYWxseS13aXRoLWNoZWNrYm94ZXMnLFxuXHRcdFx0bmFtZTogJ1NvcnQgYWxwaGFiZXRpY2FsbHkgd2l0aCBjaGVja2JveGVzJyxcblx0XHRcdGNhbGxiYWNrOiAoKCkgPT4gdGhpcy5zb3J0QWxwaGFiZXRpY2FsbHkoZmFsc2UsIGZhbHNlKSksXG5cdFx0fSk7XG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcblx0XHRcdGlkOiAnc29ydC1saXN0LWFscGhhYmV0aWNhbGx5LXdpdGgtY2hlY2tib3hlcycsXG5cdFx0XHRuYW1lOiAnU29ydCBjdXJyZW50IGxpc3QgYWxwaGFiZXRpY2FsbHkgd2l0aCBjaGVja2JveGVzJyxcblx0XHRcdGNhbGxiYWNrOiAoKCkgPT4gdGhpcy5zb3J0QWxwaGFiZXRpY2FsbHkodHJ1ZSwgZmFsc2UpKSxcblx0XHR9KTtcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6ICdzb3J0LWFscGhhYmV0aWNhbGx5Jyxcblx0XHRcdG5hbWU6ICdTb3J0IGFscGhhYmV0aWNhbGx5Jyxcblx0XHRcdGNhbGxiYWNrOiAoKCkgPT4gdGhpcy5zb3J0QWxwaGFiZXRpY2FsbHkoZmFsc2UsIHRydWUpKSxcblx0XHR9KTtcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6ICdzb3J0LWxpc3QtYWxwaGFiZXRpY2FsbHknLFxuXHRcdFx0bmFtZTogJ1NvcnQgY3VycmVudCBsaXN0IGFscGhhYmV0aWNhbGx5Jyxcblx0XHRcdGNhbGxiYWNrOiAoKCkgPT4gdGhpcy5zb3J0QWxwaGFiZXRpY2FsbHkodHJ1ZSwgdHJ1ZSkpLFxuXHRcdH0pO1xuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XG5cdFx0XHRpZDogJ3NvcnQtbGVuZ3RoJyxcblx0XHRcdG5hbWU6ICdTb3J0IGJ5IGxlbmd0aCBvZiBsaW5lJyxcblx0XHRcdGNhbGxiYWNrOiAoKCkgPT4gdGhpcy5zb3J0TGVuZ3RoT2ZMaW5lKCkpLFxuXHRcdH0pO1xuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XG5cdFx0XHRpZDogJ3NvcnQtaGVhZGluZ3MnLFxuXHRcdFx0bmFtZTogJ1NvcnQgaGVhZGluZ3MnLFxuXHRcdFx0Y2FsbGJhY2s6ICgoKSA9PiB0aGlzLnNvcnRIZWFkaW5ncygpKSxcblx0XHR9KTtcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6ICdwZXJtdXRlLXJldmVyc2UnLFxuXHRcdFx0bmFtZTogJ1JldmVyc2UgbGluZXMnLFxuXHRcdFx0Y2FsbGJhY2s6ICgoKSA9PiB0aGlzLnBlcm11dGVSZXZlcnNlKCkpLFxuXHRcdH0pO1xuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XG5cdFx0XHRpZDogJ3Blcm11dGUtc2h1ZmZsZScsXG5cdFx0XHRuYW1lOiAnU2h1ZmZsZSBsaW5lcycsXG5cdFx0XHRjYWxsYmFjazogKCgpID0+IHRoaXMucGVybXV0ZVNodWZmbGUoKSksXG5cdFx0fSk7XG5cblx0fVxuXG5cdG9udW5sb2FkKCkge1xuXHRcdGNvbnNvbGUubG9nKCd1bmxvYWRpbmcgJyArIHRoaXMubWFuaWZlc3QubmFtZSk7XG5cdH1cblxuXG5cdHNvcnRBbHBoYWJldGljYWxseShmcm9tQ3VycmVudExpc3QgPSBmYWxzZSwgaWdub3JlQ2hlY2tib3hlcyA9IHRydWUpIHtcblx0XHRjb25zdCBsaW5lcyA9IHRoaXMuZ2V0TGluZXMoZnJvbUN1cnJlbnRMaXN0LCBpZ25vcmVDaGVja2JveGVzKTtcblx0XHRpZiAobGluZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdFx0bGV0IHNvcnRGdW5jID0gKGE6IE15TGluZSwgYjogTXlMaW5lKSA9PiB0aGlzLmNvbXBhcmUoYS5mb3JtYXR0ZWQudHJpbSgpLCBiLmZvcm1hdHRlZC50cmltKCkpO1xuXG5cdFx0bGluZXMuc29ydChzb3J0RnVuYyk7XG5cdFx0dGhpcy5zZXRMaW5lcyhsaW5lcywgZnJvbUN1cnJlbnRMaXN0KTtcblx0fVxuXG5cdHNvcnRIZWFkaW5ncygpIHtcblx0XHRjb25zdCBsaW5lcyA9IHRoaXMuZ2V0TGluZXMoKTtcblx0XHRjb25zdCByZXMgPSB0aGlzLmdldFNvcnRlZEhlYWRpbmdzKGxpbmVzLCAwLCB7IGhlYWRpbmdMZXZlbDogMCwgZm9ybWF0dGVkOiBcIlwiLCBzb3VyY2U6IFwiXCIsIGxpbmVOdW1iZXI6IC0xIH0pO1xuXHRcdHRoaXMuc2V0TGluZXModGhpcy5oZWFkaW5nc1RvU3RyaW5nKHJlcykuc2xpY2UoMSkpO1xuXHR9XG5cblx0aGVhZGluZ3NUb1N0cmluZyhoZWFkaW5nOiBIZWFkaW5nUGFydCk6IE15TGluZVtdIHtcblx0XHRjb25zdCBsaXN0ID0gW1xuXHRcdFx0aGVhZGluZy50aXRsZSxcblx0XHRcdC4uLmhlYWRpbmcubGluZXNcblx0XHRdO1xuXHRcdGhlYWRpbmcuaGVhZGluZ3MuZm9yRWFjaCgoZSkgPT4gbGlzdC5wdXNoKC4uLnRoaXMuaGVhZGluZ3NUb1N0cmluZyhlKSkpO1xuXHRcdHJldHVybiBsaXN0O1xuXHR9XG5cblx0Z2V0U29ydGVkSGVhZGluZ3MobGluZXM6IE15TGluZVtdLCBmcm9tOiBudW1iZXIsIGhlYWRpbmc6IE15TGluZSk6IEhlYWRpbmdQYXJ0IHtcblx0XHRsZXQgaGVhZGluZ3M6IEhlYWRpbmdQYXJ0W10gPSBbXTtcblx0XHRsZXQgY29udGVudExpbmVzOiBNeUxpbmVbXSA9IFtdO1xuXHRcdGxldCBjdXJyZW50SW5kZXggPSBmcm9tO1xuXHRcdHdoaWxlIChjdXJyZW50SW5kZXggPCBsaW5lcy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnQgPSBsaW5lc1tjdXJyZW50SW5kZXhdO1xuXHRcdFx0aWYgKGN1cnJlbnQuaGVhZGluZ0xldmVsIDw9IGhlYWRpbmcuaGVhZGluZ0xldmVsKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY3VycmVudC5oZWFkaW5nTGV2ZWwpIHtcblxuXG5cdFx0XHRcdGhlYWRpbmdzLnB1c2godGhpcy5nZXRTb3J0ZWRIZWFkaW5ncyhsaW5lcywgY3VycmVudEluZGV4ICsgMSwgY3VycmVudCkpO1xuXHRcdFx0XHRjdXJyZW50SW5kZXggPSBoZWFkaW5ncy5sYXN0KCkudG87XG5cblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29udGVudExpbmVzLnB1c2goY3VycmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGN1cnJlbnRJbmRleCsrO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRsaW5lczogY29udGVudExpbmVzLFxuXHRcdFx0dG86IGhlYWRpbmdzLmxlbmd0aCA+IDAgPyBoZWFkaW5ncy5sYXN0KCkudG8gOiAoY3VycmVudEluZGV4IC0gMSksXG5cdFx0XHRoZWFkaW5nczogaGVhZGluZ3Muc29ydCgoYSwgYikgPT4ge1xuXHRcdFx0XHQvL0ZpcnN0IHNvcnQgYnkgaGVhZGluZyBsZXZlbCB0aGVuIGFscGhhYmV0aWNhbGx5XG5cdFx0XHRcdGNvbnN0IHJlcyA9IGEudGl0bGUuaGVhZGluZ0xldmVsIC0gYi50aXRsZS5oZWFkaW5nTGV2ZWw7XG5cdFx0XHRcdGlmIChyZXMgPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbXBhcmUoYS50aXRsZS5mb3JtYXR0ZWQudHJpbSgpLCBiLnRpdGxlLmZvcm1hdHRlZC50cmltKCkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiByZXM7XG5cdFx0XHRcdH1cblx0XHRcdH0pLFxuXHRcdFx0dGl0bGU6IGhlYWRpbmcsXG5cdFx0fTtcblx0fVxuXG5cblx0c29ydExlbmd0aE9mTGluZSgpIHtcblx0XHRjb25zdCBsaW5lcyA9IHRoaXMuZ2V0TGluZXMoKTtcblx0XHRpZiAobGluZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdFx0bGluZXMuc29ydCgoYSwgYikgPT4gYS5mb3JtYXR0ZWQubGVuZ3RoIC0gYi5mb3JtYXR0ZWQubGVuZ3RoKTtcblxuXHRcdHRoaXMuc2V0TGluZXMobGluZXMpO1xuXHR9XG5cblx0cGVybXV0ZVJldmVyc2UoKSB7XG5cdFx0Y29uc3QgbGluZXMgPSB0aGlzLmdldExpbmVzKCk7XG5cdFx0aWYgKGxpbmVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRcdGxpbmVzLnJldmVyc2UoKTtcblx0XHR0aGlzLnNldExpbmVzKGxpbmVzKTtcblx0fVxuXG5cdHBlcm11dGVTaHVmZmxlKCkge1xuXHRcdGNvbnN0IGxpbmVzID0gdGhpcy5nZXRMaW5lcygpO1xuXHRcdGlmIChsaW5lcy5sZW5ndGggPT09IDApIHJldHVybjtcblx0XHRsaW5lcy5zaHVmZmxlKCk7XG5cdFx0dGhpcy5zZXRMaW5lcyhsaW5lcyk7XG5cdH1cblxuXHRnZXRMaW5lcyhmcm9tQ3VycmVudExpc3QgPSBmYWxzZSwgaWdub3JlQ2hlY2tib3hlcyA9IHRydWUpOiBNeUxpbmVbXSB7XG5cdFx0Y29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cdFx0aWYgKCF2aWV3KVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IGVkaXRvciA9IHZpZXcuZWRpdG9yO1xuXHRcdGNvbnN0IGZpbGUgPSB2aWV3LmZpbGU7XG5cdFx0bGV0IGxpbmVzID0gZWRpdG9yLmdldFZhbHVlKCkuc3BsaXQoXCJcXG5cIik7XG5cdFx0Y29uc3QgY2FjaGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcblx0XHRjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IHRoaXMuZ2V0UG9zaXRpb24odmlldywgZnJvbUN1cnJlbnRMaXN0KTtcblxuXHRcdGNvbnN0IGhlYWRpbmdzID0gY2FjaGUuaGVhZGluZ3M7XG5cdFx0Y29uc3QgbGlua3MgPSBbLi4uY2FjaGU/LmxpbmtzID8/IFtdLCAuLi5jYWNoZT8uZW1iZWRzID8/IFtdXTtcblx0XHRjb25zdCBteUxpbmVzID0gbGluZXMubWFwKChsaW5lLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3QgbXlMaW5lOiBNeUxpbmUgPSB7IHNvdXJjZTogbGluZSwgZm9ybWF0dGVkOiBsaW5lLCBoZWFkaW5nTGV2ZWw6IHVuZGVmaW5lZCwgbGluZU51bWJlcjogaW5kZXggfTtcblx0XHRcdGxpbmtzLmZvckVhY2goZSA9PiB7XG5cdFx0XHRcdGlmIChlLnBvc2l0aW9uLnN0YXJ0LmxpbmUgIT0gaW5kZXgpIHJldHVybjtcblx0XHRcdFx0Y29uc3Qgc3RhcnQgPSBlLnBvc2l0aW9uLnN0YXJ0O1xuXHRcdFx0XHRjb25zdCBlbmQgPSBlLnBvc2l0aW9uLmVuZDtcblx0XHRcdFx0bXlMaW5lLmZvcm1hdHRlZCA9IG15TGluZS5mb3JtYXR0ZWQucmVwbGFjZShsaW5lLnN1YnN0cmluZyhzdGFydC5jb2wsIGVuZC5jb2wpLCBlLmRpc3BsYXlUZXh0KTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGlnbm9yZUNoZWNrYm94ZXMpIHtcblx0XHRcdFx0aWYgKG15TGluZS5mb3JtYXR0ZWQuc3RhcnRzV2l0aChcIi0gW3hdXCIpKSB7XG5cdFx0XHRcdFx0bXlMaW5lLmZvcm1hdHRlZCA9IG15TGluZS5mb3JtYXR0ZWQuc3Vic3RyaW5nKDYpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBKdXN0IGEgbGl0dGxlIGJpdCBkaXJ0eS4uLlxuXHRcdFx0XHRteUxpbmUuZm9ybWF0dGVkID0gbXlMaW5lLmZvcm1hdHRlZC5yZXBsYWNlKFwiLSBbeF1cIiwgXCJaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbXlMaW5lO1xuXHRcdH0pO1xuXG5cdFx0aGVhZGluZ3M/Lm1hcCgoaGVhZGluZykgPT4gbXlMaW5lc1toZWFkaW5nLnBvc2l0aW9uLnN0YXJ0LmxpbmVdLmhlYWRpbmdMZXZlbCA9IGhlYWRpbmcubGV2ZWwpO1xuXG5cdFx0aWYgKHN0YXJ0ICE9IGVuZCkge1xuXHRcdFx0cmV0dXJuIG15TGluZXMuc2xpY2Uoc3RhcnQsIGVuZCArIDEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbXlMaW5lcztcblx0XHR9XG5cdH1cblxuXHRzZXRMaW5lcyhsaW5lczogTXlMaW5lW10sIGZyb21DdXJyZW50TGlzdDogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cdFx0Y29uc3QgcmVzID0gdGhpcy5nZXRQb3NpdGlvbih2aWV3LCBmcm9tQ3VycmVudExpc3QpO1xuXG5cdFx0Y29uc3QgZWRpdG9yID0gdmlldy5lZGl0b3I7XG5cdFx0aWYgKHJlcy5zdGFydCAhPSByZXMuZW5kKSB7XG5cdFx0XHRlZGl0b3IucmVwbGFjZVJhbmdlKGxpbmVzLm1hcChlID0+IGUuc291cmNlKS5qb2luKFwiXFxuXCIpLCB7IGxpbmU6IHJlcy5zdGFydCwgY2g6IDAgfSwgeyBsaW5lOiByZXMuZW5kLCBjaDogcmVzLmVuZExpbmVMZW5ndGggfSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVkaXRvci5zZXRWYWx1ZShsaW5lcy5tYXAoZSA9PiBlLnNvdXJjZSkuam9pbihcIlxcblwiKSk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0UG9zaXRpb24odmlldzogTWFya2Rvd25WaWV3LCBmcm9tQ3VycmVudExpc3Q6IGJvb2xlYW4gPSBmYWxzZSk6IHsgc3RhcnQ6IG51bWJlcjsgZW5kOiBudW1iZXI7IGVuZExpbmVMZW5ndGg6IG51bWJlcjsgfSB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgY2FjaGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZSh2aWV3LmZpbGUpO1xuXHRcdGNvbnN0IGVkaXRvciA9IHZpZXcuZWRpdG9yO1xuXG5cdFx0bGV0IGN1cnNvclN0YXJ0ID0gZWRpdG9yLmdldEN1cnNvcihcImZyb21cIikubGluZTtcblx0XHRsZXQgY3Vyc29yRW5kID0gZWRpdG9yLmdldEN1cnNvcihcInRvXCIpLmxpbmU7XG5cdFx0aWYgKGZyb21DdXJyZW50TGlzdCkge1xuXHRcdFx0Y29uc3QgbGlzdCA9IGNhY2hlLnNlY3Rpb25zLmZpbmQoKGUpID0+IHtcblx0XHRcdFx0cmV0dXJuIGUucG9zaXRpb24uc3RhcnQubGluZSA8PSBjdXJzb3JTdGFydCAmJiBlLnBvc2l0aW9uLmVuZC5saW5lID49IGN1cnNvckVuZDtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGxpc3QpIHtcblx0XHRcdFx0Y3Vyc29yU3RhcnQgPSBsaXN0LnBvc2l0aW9uLnN0YXJ0LmxpbmU7XG5cdFx0XHRcdGN1cnNvckVuZCA9IGxpc3QucG9zaXRpb24uZW5kLmxpbmU7XG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0Y29uc3QgY3Vyc2VyRW5kTGluZUxlbmd0aCA9IGVkaXRvci5nZXRMaW5lKGN1cnNvckVuZCkubGVuZ3RoO1xuXHRcdGxldCBmcm9udFN0YXJ0ID0gY2FjaGUuZnJvbnRtYXR0ZXI/LnBvc2l0aW9uPy5lbmQ/LmxpbmUgKyAxO1xuXHRcdGlmIChpc05hTihmcm9udFN0YXJ0KSkge1xuXHRcdFx0ZnJvbnRTdGFydCA9IDA7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZnJvbnRFbmQgPSBlZGl0b3IubGFzdExpbmUoKTtcblx0XHRjb25zdCBmcm9udEVuZExpbmVMZW5ndGggPSBlZGl0b3IuZ2V0TGluZShmcm9udEVuZCkubGVuZ3RoO1xuXG5cdFx0aWYgKGN1cnNvclN0YXJ0ICE9IGN1cnNvckVuZCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3RhcnQ6IGN1cnNvclN0YXJ0LFxuXHRcdFx0XHRlbmQ6IGN1cnNvckVuZCxcblx0XHRcdFx0ZW5kTGluZUxlbmd0aDogY3Vyc2VyRW5kTGluZUxlbmd0aCxcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN0YXJ0OiBmcm9udFN0YXJ0LFxuXHRcdFx0XHRlbmQ6IGZyb250RW5kLFxuXHRcdFx0XHRlbmRMaW5lTGVuZ3RoOiBmcm9udEVuZExpbmVMZW5ndGgsXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufSJdLCJuYW1lcyI6WyJNYXJrZG93blZpZXciLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxLQUFLLElBQUk7QUFDN0MsUUFBUSxNQUFNLElBQUksU0FBUyxDQUFDLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2xHLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQXVDRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FB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
