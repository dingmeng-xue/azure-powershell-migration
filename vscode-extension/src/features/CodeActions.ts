/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import vscode = require("vscode");
import Window = vscode.window;
import { ILogger } from "../logging";

export class CodeActionsFeature implements vscode.Disposable {
    private applyEditsCommand: vscode.Disposable;
    private showDocumentationCommand: vscode.Disposable;

    constructor(private log: ILogger) {
        this.applyEditsCommand = vscode.commands.registerCommand("AzurePowerShell.ApplyCodeActionEdits", (edit: any) => {
            Window.activeTextEditor.edit((editBuilder) => {
                editBuilder.replace(
                    new vscode.Range(
                        edit.StartLineNumber - 1,
                        edit.StartColumnNumber - 1,
                        edit.EndLineNumber - 1,
                        edit.EndColumnNumber - 1),
                    edit.Text);
            });
        });
    }

    public dispose() {
        this.applyEditsCommand.dispose();
        this.showDocumentationCommand.dispose();
    }

    public showRuleDocumentation(ruleId: string) {
        const pssaDocBaseURL = "https://github.com/PowerShell/PSScriptAnalyzer/blob/master/RuleDocumentation";

        if (!ruleId) {
            this.log.writeWarning("Cannot show documentation for code action, no ruleName was supplied.");
            return;
        }

        if (ruleId.startsWith("PS")) {
            ruleId = ruleId.substr(2);
        }

        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(pssaDocBaseURL + `/${ruleId}.md`));
    }
}
