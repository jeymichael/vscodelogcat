"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
var logType;
(function (logType) {
    logType[logType["V"] = 0] = "V";
    logType[logType["D"] = 1] = "D";
    logType[logType["I"] = 2] = "I";
    logType[logType["W"] = 3] = "W";
    logType[logType["E"] = 4] = "E";
    logType[logType["F"] = 5] = "F";
})(logType || (logType = {}));
const logSignatures = [
    /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+V\s+.*/,
    /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+D\s+.*/,
    /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+I\s+.*/,
    /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+W\s+.*/,
    /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+E\s+.*/,
    /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+F\s+.*/
];
function wrapCmd(context, commandId, run) {
    context.subscriptions.push(vscode.commands.registerCommand(commandId, run));
}
function countLines() {
    let lines = [0, 0, 0, 0, 0, 0];
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor)
        return lines;
    let logIndex = 0;
    for (let i = 0; i < activeTextEditor.document.lineCount; ++i) {
        const line = activeTextEditor.document.lineAt(i);
        for (let j = 0; j < 6; j++) {
            if (logSignatures[(logIndex + j) % 6].test(line.text)) {
                lines[(logIndex + j) % 6]++;
                logIndex = (logIndex + j) % 6;
                break;
            }
        }
    }
    return lines;
}
function linesOfType(regExp) {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor)
        return;
    let lines = [];
    var inside = 0;
    for (let i = 0; i < activeTextEditor.document.lineCount; ++i) {
        const line = activeTextEditor.document.lineAt(i);
        if (regExp.test(line.text)) {
            if (!inside) {
                inside = 1;
            }
            lines.push(i);
        }
        else {
            if (inside)
                inside = 0;
        }
    }
    return lines;
}
function registerFoldUnfoldCommands(context) {
    let disposable = null;
    disposable = vscode.commands.registerCommand('logcatplusplus.FoldVerbose', () => {
        vscode.commands.executeCommand('editor.fold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.V]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.UnfoldVerbose', () => {
        vscode.commands.executeCommand('editor.unfold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.V]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.FoldDebug', () => {
        vscode.commands.executeCommand('editor.fold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.D]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.UnfoldDebug', () => {
        vscode.commands.executeCommand('editor.unfold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.D]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.FoldInfo', () => {
        vscode.commands.executeCommand('editor.fold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.I]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.UnfoldInfo', () => {
        vscode.commands.executeCommand('editor.unfold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.I]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.FoldWarning', () => {
        vscode.commands.executeCommand('editor.fold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.W]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.UnfoldWarning', () => {
        vscode.commands.executeCommand('editor.unfold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.W]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.FoldError', () => {
        vscode.commands.executeCommand('editor.fold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.E]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.UnfoldError', () => {
        vscode.commands.executeCommand('editor.unfold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.E]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.FoldFatal', () => {
        vscode.commands.executeCommand('editor.fold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.F]) });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('logcatplusplus.UnfoldFatal', () => {
        vscode.commands.executeCommand('editor.unfold', { levels: 1,
            selectionLines: linesOfType(logSignatures[logType.F]) });
    });
    context.subscriptions.push(disposable);
}
function registerDiagnoseCommand(context) {
    let disposable = vscode.commands.registerCommand('logcatplusplus.DiagnoseLogcat', () => {
        vscode.window.showInformationMessage('Diagnosing logcat file...');
        let lines = countLines();
        vscode.window.showInformationMessage('Found '
            + lines[logType.V] + ' Verbose messages, '
            + lines[logType.D] + ' Debug messages, '
            + lines[logType.I] + ' Info messages, '
            + lines[logType.W] + ' Warning messages, '
            + lines[logType.E] + ' Error messages & '
            + lines[logType.F] + ' Fatal messages');
    });
    context.subscriptions.push(disposable);
}
function registerHighlightsCommand(context) {
    const commandRegistration = vscode.commands.registerTextEditorCommand('logcatplusplus.Highlights', editor => {
        const locations = [];
        const config = vscode.workspace.getConfiguration('references');
        const existingSetting = config.inspect('preferredLocation');
        config.update('preferredLocation', 'view');
        const regexList = [
            /^([\S]+\s+){5}Watchdog: \*\*\* WATCHDOG KILLING SYSTEM PROCESS/,
            /^([\S]+\s+){4}F DEBUG   : signal /,
            /^([\S]+\s+){4}E .*Exception:/
        ];
        let matches;
        for (let i = 0; i < editor.document.lineCount; ++i) {
            var line = editor.document.lineAt(i).text;
            if (regexList.some(rx => rx.test(line))) {
                locations.push(new vscode.Location(editor.document.uri, new vscode.Position(i, 0)));
            }
        }
        vscode.commands.executeCommand('editor.action.showReferences', editor.document.uri, new vscode.Position(0, 0), locations);
        config.update('preferredLocation', existingSetting);
    });
}
function linesOfComponent(document, component) {
    const markdown = new vscode.MarkdownString('\n\n\n');
    markdown.appendMarkdown('<span style=color:#f00;> **[' + component + ']** </span>');
    markdown.appendText("\n\n");
    //markdown.appendMarkdown('<hr>'); // Does not work.  Skips first match!  TODO Fix
    for (let i = 0; i < document.lineCount; ++i) {
        var line = document.lineAt(i).text;
        if (componentName(line) === component) {
            var dateTime = componentDateTime(line);
            line = line.replace(component, '<span style=color:#f00;> **' + component + '** </span>');
            const args = [{ lineNumber: i, at: 'center' }];
            const commandUri = vscode.Uri.parse(`command:revealLine?${encodeURIComponent(JSON.stringify(args))}`);
            line = line.replace(dateTime, '[' + dateTime + '](' + commandUri + ')');
            markdown.appendMarkdown(line);
            markdown.appendText("\n\n");
        }
    }
    markdown.isTrusted = true;
    return markdown;
}
function componentName(line) {
    let re = /^([\S]+\s+){6}/;
    var res = re.exec(line);
    if (res) {
        var token = res[1];
        while (token.endsWith(' '))
            token = token.slice(0, -1);
        if (token.endsWith(':')) {
            return token.slice(0, -1);
        }
        else {
            return token;
        }
    }
    return "";
}
function componentDateTime(line) {
    let re = /^([\S]+\s+){2}/;
    var res = re.exec(line);
    if (res) {
        var token = res[1];
        while (token.endsWith(' '))
            token = token.slice(0, -1);
        if (token.endsWith(':')) {
            return token.slice(0, -1);
        }
        else {
            return token;
        }
    }
    return "";
}
function hoverToken(document, position) {
    var line = document.lineAt(position.line).text;
    var begin = position.character, end = position.character;
    while (line[end] != ' ' && line[end] != ':') {
        if (end >= line.length)
            break;
        end++;
    }
    while (line[begin] != ' ' && line[begin] != ':') {
        if (begin < 1)
            break;
        begin--;
    }
    begin++;
    if (begin >= 0 && end >= 0)
        return line.substring(begin, end);
    return "";
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Extension "logcat++" is now active!');
    vscode.window.showInformationMessage('Extension "logcat++" is now active!');
    registerDiagnoseCommand(context);
    registerFoldUnfoldCommands(context);
    wrapCmd(context, 'type', (args) => {
        // Do not let edits.  TODO: Should also stop Ctrl-V, Backspace delete
        let readOnly = vscode.workspace.getConfiguration('logcatplusplus');
        if (!readOnly) {
            vscode.commands.executeCommand('default:type', { text: args.text });
        }
    });
    vscode.languages.registerFoldingRangeProvider('logcat', new MyFoldingRangeProvider());
    vscode.languages.registerHoverProvider('logcat', {
        provideHover(document, position, token) {
            // Get the 6th token (COMP name) without trailing ':'
            // Filter for lines with this COMP 
            //	TODO: Gather stats 
            //   #errors, #warnings etc
            //   #proc (Proc ids), #threads (threadIds) etc
            //   #start time, #last time etc
            let compName = componentName(document.lineAt(position.line).text);
            if (hoverToken(document, position) === compName)
                return {
                    contents: [linesOfComponent(document, compName)]
                };
        }
    });
    registerHighlightsCommand(context);
}
exports.activate = activate;
class MyFoldingRangeProvider {
    provideFoldingRanges(document, context, token) {
        // console.log('Computing Folding Ranges');
        let FR = [], start = -1, current = 0;
        let reV = /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+V\s+.*/;
        let reD = /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+D\s+.*/;
        let reI = /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+I\s+.*/;
        let reW = /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+W\s+.*/;
        let reE = /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+E\s+.*/;
        let reF = /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+F\s+.*/;
        let reS = /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+S\s+.*/;
        let reAll = [/[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+V\s+.*/,
            /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+D\s+.*/,
            /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+I\s+.*/,
            /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+W\s+.*/,
            /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+E\s+.*/,
            /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+F\s+.*/,
            /[\S]+\s+[\S]+\s+[\S]+\s+[\S]+\s+S\s+.*/
        ];
        function matchRE(i, line) {
            if (current == -1) {
                current = 0;
                if (reAll[current].test(line))
                    return true;
            }
            if (reAll[current].test(line))
                return true;
            // Find the RE match for this line, and put it in current
            let j = 0;
            for (j = 0; j < 7; j++) {
                current = (current + 1) % 7;
                if (reAll[current].test(line)) {
                    break;
                }
            }
            if (j == 7)
                current = -1;
            return false;
        }
        for (let i = 0; i < document.lineCount; i++) {
            //console.log('line : ' + document.lineAt(i).text);
            //if (reI.test(document.lineAt(i).text)) {
            if (matchRE(i, document.lineAt(i).text)) {
                //console.log(i, ' line is IIII start:', start);
                if (start == -1) {
                    start = i - 1; // i can never be 0 here
                }
                else {
                    //FR.push(new vscode.FoldingRange(sectionStart, i - 1, vscode.FoldingRangeKind.Region));
                }
            }
            else {
                //console.log(i, ' line is NO MATCH start:', start);
                if (start != -1) {
                    FR.push(new vscode.FoldingRange(start, i - 1, vscode.FoldingRangeKind.Region));
                    start = -1;
                }
            }
            if (i == document.lineCount - 1) {
                if (start != -1) {
                    FR.push(new vscode.FoldingRange(start, i, vscode.FoldingRangeKind.Region));
                    start = -1;
                }
            }
        }
        return FR;
    }
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map