// import * as vscode from 'vscode'


// export async function injectPaste() {
//     // get current edit file path
//     let editor = vscode.window.activeTextEditor as vscode.TextEditor
//     if (!editor) return
//     let text = await vscode.commands.executeCommand('notedown.inner.read-clipboard') as string

//     editor.edit(edit => {
//         let current = editor.selection
//         if (current.isEmpty) {
//             edit.insert(current.start, text)
//         }
//         else {
//             // edit.replace(current, text); ×
//             // edit.delete(current); ×
//             // works like normal behaviour!
//             edit.replace(current, '')
//             edit.insert(current.start, text)
//         }
//     })
// }
