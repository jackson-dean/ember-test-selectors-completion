'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
const provider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'javascript' },
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                // bail early if in not in a test file
                if (!/-test.(:?js|ts)/.test(document.fileName)) {
                    return;
                }

                let linePrefix = document.lineAt(position).text.substr(0, position.character);
                let completionTrigger = linePrefix.match(/\[data-t.*/);

				if (completionTrigger === null) {
					return;
                }

                let testSelectors: string[] = [];

                vscode.workspace.textDocuments.forEach(currentDocument => {
                    if (!(currentDocument.fileName.endsWith('.hbs') || currentDocument.fileName.endsWith('-test.js'))) {
                        return;
                    }
                    let matches = currentDocument.getText().match(/\[?data-test-[a-zA-z-]+\]?/g);
                    if (matches) {
                        testSelectors = testSelectors.concat(matches);
                    }
                });

                if (!testSelectors.length) {
                    return;
                }

                return [...new Set(testSelectors)].map(testSelector => {
                    let normalizedCompletionItem = testSelector;

                    if (normalizedCompletionItem.charAt(0) !== '[') {
                        normalizedCompletionItem = `[${normalizedCompletionItem}`;
                    }

                    if (normalizedCompletionItem.charAt(normalizedCompletionItem.length - 1) !== ']') {
                        normalizedCompletionItem = `${normalizedCompletionItem}]`;
                    }

                    let completionItem = new vscode.CompletionItem(normalizedCompletionItem, vscode.CompletionItemKind.Text);
                    let triggerText = (completionTrigger && completionTrigger[0]) || '';

                    completionItem.insertText =
                        completionItem.label.replace(triggerText, triggerText.charAt(triggerText.length - 1));

                    return completionItem;
                });
			}
		},
	);

	context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}