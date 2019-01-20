"use strict";
import * as vscode from "vscode";
import {
  isTestFile,
  matchCompletionTrigger,
  shouldParseTestSelectors,
  getParsingFunction
} from "./utils";

export function activate(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider(
    { scheme: "file", language: "javascript" },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        if (!isTestFile(document.fileName)) {
          return;
        }

        let completionTrigger = matchCompletionTrigger(
          document.lineAt(position).text.substr(0, position.character)
        );

        if (!completionTrigger) {
          return;
        }

        // create the text range to replace text when committing the completion
        let startPosition = new vscode.Position(
          position.line,
          position.character - completionTrigger[0].length
        );
        let endPosition = new vscode.Position(
          position.line,
          position.character
        );
        let textEditRange = new vscode.Range(startPosition, endPosition);

        let aggregateTestSelectors: string[] = [];

        vscode.workspace.textDocuments.forEach(currentDocument => {
          if (shouldParseTestSelectors(currentDocument.fileName)) {
            let parsingFunction = getParsingFunction(currentDocument.fileName);
            let testSelectors = parsingFunction(currentDocument.getText());
            aggregateTestSelectors = aggregateTestSelectors.concat(
              testSelectors
            );
          }
        });

        if (!aggregateTestSelectors.length) {
          return;
        }

        let dedupedTestSelectors = [...new Set(aggregateTestSelectors)];

        return dedupedTestSelectors.map(testSelector => {
          let completionItem = new vscode.CompletionItem(
            `[${testSelector}]`,
            vscode.CompletionItemKind.Text
          );

          completionItem.range = textEditRange;

          return completionItem;
        });
      }
    }
  );

  context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() {}
