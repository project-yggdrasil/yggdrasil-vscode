import * as vscode from 'vscode'
import * as child_process from 'child_process'
import {
    LanguageClient,
    LanguageClientOptions,
    Executable,
} from 'vscode-languageclient/node'


export let client: LanguageClient

export function start_client() {
    let serverOptions: Executable = {
        command: 'ygg-lsp',
    }

    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'ygg' }],
    }

    client = new LanguageClient(
        'yggLanguageServer',
        'Ygg Server',
        serverOptions,
        clientOptions,
    )

    client.start()
}

export async function is_installed(cmd: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        const checkCommand = process.platform === 'win32' ? 'where' : 'command -v'
        const proc = child_process.exec(`${checkCommand} ${cmd}`)
        proc.on('exit', (code) => { resolve(code === 0) })
    })
}

async function installServerBinary(): Promise<boolean> {
    await is_installed('cargo')
    // cargo install
    // download from github
    const task = new vscode.Task(
        { type: 'cargo', task: 'install' },
        vscode.workspace.workspaceFolders![0],
        'Installing lsp server',
        'ygg-lsp',
        new vscode.ShellExecution('cargo install ygg-lsp'),
    )
    const promise = new Promise<boolean>((resolve) => {
        vscode.tasks.onDidEndTask((e) => {
            if (e.execution.task === task) {
                e.execution.terminate()
            }
        })
        vscode.tasks.onDidEndTaskProcess((e) => {
            resolve(e.exitCode === 0)
        })
    })
    vscode.tasks.executeTask(task)

    return promise
}

export async function tryToInstallLanguageServer(configuration: vscode.WorkspaceConfiguration) {
    const selected = await vscode.window.showInformationMessage(
        'Install ygg-lsp-server (Rust toolchain required) ?',
        'Install',
        'Never',
    )
    if (selected === 'Install') {
        const installed = await installServerBinary()
        if (installed) {
            start_client()
        }
    }
    else if (selected === 'Never') {
        configuration.update('useLanguageServer', false)
    }
}

