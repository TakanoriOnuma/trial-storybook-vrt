import {
  NotifierPlugin,
  NotifyParams,
  PluginCreateOptions,
  Logger,
} from 'reg-suit-interface';

import fetch from 'node-fetch';

export interface GitHubPluginOption {
  /** PRにコメントするためのGitHub Token */
  GITHUB_TOKEN: string;
  /** コメント対象のリポジトリ(owner/repoName) */
  GITHUB_REPOSITORY: string;
  /** コメント対象のPR番号 */
  GITHUB_PR_NUMBER: string;
}

export class GitHubNotifierPlugin
  implements NotifierPlugin<GitHubPluginOption>
{
  private _logger!: Logger;
  private _GITHUB_TOKEN!: string;
  private _GITHUB_REPOSITORY!: string;
  private _GITHUB_PR_NUMBER!: string;

  init(config: PluginCreateOptions<GitHubPluginOption>) {
    const { logger, options } = config;
    this._logger = logger;
    this._GITHUB_TOKEN = options.GITHUB_TOKEN;
    this._GITHUB_REPOSITORY = options.GITHUB_REPOSITORY;
    this._GITHUB_PR_NUMBER = options.GITHUB_PR_NUMBER;
    console.log('初期化するぞ！');
    console.log(config);
  }

  async notify(params: NotifyParams): Promise<any> {
    const { comparisonResult, reportUrl } = params;
    console.log('通知しちゃうぞ！');
    console.log(params);

    const requestHeaders = {
      Authorization: `token ${this._GITHUB_TOKEN}`,
    };

    const comments = await fetch(
      `https://api.github.com/repos/${this._GITHUB_REPOSITORY}/issues/${this._GITHUB_PR_NUMBER}/comments`,
      { headers: requestHeaders },
    ).then((res) => res.json());
    console.log(comments);

    await fetch(
      `https://api.github.com/repos/${this._GITHUB_REPOSITORY}/issues/${this._GITHUB_PR_NUMBER}/comments`,
      {
        method: 'post',
        body: JSON.stringify({ body: reportUrl }),
        headers: requestHeaders,
      },
    );
  }
}
