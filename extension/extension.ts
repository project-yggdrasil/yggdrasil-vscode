import * as vscode from 'vscode'
import { is_installed, start_client, client } from './lsp'
// import { injectPaste } from './commands'


export async function activate(context: vscode.ExtensionContext) {
    const configuration = vscode.workspace.getConfiguration('ygg')
    const useLanguageServer = configuration.get<boolean>('useLanguageServer')
    const shouldStartClient = useLanguageServer && (await is_installed('ygg-lsp'))
    if (shouldStartClient) {
        start_client()
    } else if (useLanguageServer) {
        // tryToInstallLanguageServer(configuration)
    }
    // context.subscriptions.concat([
    //     vscode.commands.registerCommand('notedown.injectPaste', injectPaste),
    // ])
}


export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined
    }
    return client.stop()
}

