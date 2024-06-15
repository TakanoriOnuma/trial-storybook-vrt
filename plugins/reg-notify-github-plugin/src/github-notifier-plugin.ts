import {
  NotifierPlugin,
  NotifyParams,
  PluginCreateOptions,
  Logger,
} from 'reg-suit-interface';

import { Octokit } from '@octokit/rest';

export interface GitHubPluginOption {
  /** PRにコメントするためのGitHub Token */
  GITHUB_TOKEN: string;
  /** リポジトリのオーナー */
  GITHUB_REPO_OWNER: string;
  /** リポジトリ名 */
  GITHUB_REPO_NAME: string;
  /** コメント対象のPR番号 */
  GITHUB_PR_NUMBER: string;
}

export class GitHubNotifierPlugin
  implements NotifierPlugin<GitHubPluginOption>
{
  private _logger!: Logger;
  private _GITHUB_TOKEN!: string;
  private _GITHUB_REPO_OWNER!: string;
  private _GITHUB_REPO_NAME!: string;
  private _GITHUB_PR_NUMBER!: number;

  init(config: PluginCreateOptions<GitHubPluginOption>) {
    const { logger, options } = config;
    this._logger = logger;
    this._GITHUB_TOKEN = options.GITHUB_TOKEN;
    this._GITHUB_REPO_OWNER = options.GITHUB_REPO_OWNER;
    this._GITHUB_REPO_NAME = options.GITHUB_REPO_NAME;
    this._GITHUB_PR_NUMBER = parseInt(options.GITHUB_PR_NUMBER, 10);
  }

  async notify(params: NotifyParams): Promise<any> {
    const { comparisonResult, reportUrl } = params;
    console.log('通知しちゃうぞ！');
    console.log(params);

    const octokit = new Octokit({
      auth: this._GITHUB_TOKEN,
    });
    const { data: comments } = await octokit.rest.issues.listComments({
      owner: this._GITHUB_REPO_OWNER,
      repo: this._GITHUB_REPO_NAME,
      issue_number: this._GITHUB_PR_NUMBER,
    });

    console.log(comments);

    console.log('=========');
    const message = reportUrl ?? '';
    const result = await octokit.rest.issues.createComment({
      owner: this._GITHUB_REPO_OWNER,
      repo: this._GITHUB_REPO_NAME,
      issue_number: this._GITHUB_PR_NUMBER,
      body: message,
    });
    console.log(result);
  }
}
