import {
  ApplyWorkspaceEditResponse,
  CodeAction,
  CodeActionParams,
  ExecuteCommandParams,
  IConnection,
} from "vscode-languageserver";
import { URI } from "vscode-uri";
import {
  ELM_ANALYSE_MATCHER,
  ElmAnalyseDiagnostics,
} from "./diagnostics/elmAnalyseDiagnostics";
import { ElmMakeDiagnostics } from "./diagnostics/elmMakeDiagnostics";
import { ElmTestDiagnostics } from "./diagnostics/elmTestDiagnostics";
export const COMMAND_RUN_TESTS_CURRENT_FILE = `elmLS.runTestsCurrentFile`;
export const COMMAND_RUN_TESTS = `elmLS.runTests`;

export class CodeActionProvider {
  constructor(
    private connection: IConnection,
    private elmAnalyse: ElmAnalyseDiagnostics,
    private elmMake: ElmMakeDiagnostics,
    private elmTest: ElmTestDiagnostics,
  ) {
    this.onCodeAction = this.onCodeAction.bind(this);
    this.onExecuteCommand = this.onExecuteCommand.bind(this);
    this.connection.onCodeAction(this.onCodeAction);
    this.connection.onExecuteCommand(this.onExecuteCommand);
  }

  private onCodeAction(params: CodeActionParams): CodeAction[] {
    this.connection.console.info("A code action was requested");
    return this.elmAnalyse
      .onCodeAction(params)
      .concat(this.elmMake.onCodeAction(params));
  }

  private async onExecuteCommand(params: ExecuteCommandParams) {
    this.connection.console.info("A command execution was requested");

    if (params.command.startsWith(ELM_ANALYSE_MATCHER)) {
      return this.elmAnalyse.onExecuteCommand(params);
    } else {
      return this.onExecuteTestCommand(params);
    }
  }

  private async onExecuteTestCommand(
    params: ExecuteCommandParams,
  ): Promise<ApplyWorkspaceEditResponse | undefined> {
    switch (params.command) {
      case COMMAND_RUN_TESTS:
        return;
      case COMMAND_RUN_TESTS_CURRENT_FILE:
        return;
    }
  }
}
