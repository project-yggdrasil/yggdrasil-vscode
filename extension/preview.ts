import * as vscode from 'vscode'
import * as path from 'path'

/**
 * Get the top-most visible range of `editor`.
 *
 * Returns a fractional line number based the visible character within the line.
 * Floor to get real line number
 */
export function getTopVisibleLine(editor: vscode.TextEditor): number | undefined {
    if (!editor['visibleRanges'].length) {
        return undefined
    }

    const firstVisiblePosition = editor['visibleRanges'][0].start
    const lineNumber = firstVisiblePosition.line
    const line = editor.document.lineAt(lineNumber)
    const progress = firstVisiblePosition.character / (line.text.length + 2)
    return lineNumber + progress
}

/**
 * Get the bottom-most visible range of `editor`.
 *
 * Returns a fractional line number based the visible character within the line.
 * Floor to get real line number
 */
export function getBottomVisibleLine(editor: vscode.TextEditor): number | undefined {
    if (!editor['visibleRanges'].length) {
        return undefined
    }

    const firstVisiblePosition = editor['visibleRanges'][0].end
    const lineNumber = firstVisiblePosition.line
    let text = ''
    if (lineNumber < editor.document.lineCount) {
        text = editor.document.lineAt(lineNumber).text
    }
    const progress = firstVisiblePosition.character / (text.length + 2)
    return lineNumber + progress
}

export async function openPreview(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'notedown',
        'Notedown Previewing',
        {
            viewColumn: vscode.ViewColumn.Two,
            preserveFocus: true,
        },
        {
            // danger!!!
            enableScripts: true,
            //enableFindWidget: true,
            //enableCommandUris: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                // vscode.Uri.file(path.join(context.extensionPath, 'assets', 'img')),
                // vscode.Uri.file(path.join(context.extensionPath, 'assets', 'css')),
                // vscode.Uri.file(path.join(context.extensionPath, 'assets', 'js')),
            ],
        },
    )
    let text = await vscode.commands.executeCommand('vscode-notedown.inner.get-web-view') as string
    panel.webview.html = text
}
