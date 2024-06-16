import {
  NotifierPlugin,
  NotifyParams,
  PluginCreateOptions,
  Logger,
  ComparisonResult,
} from 'reg-suit-interface';

import {
  AbstractPrCommentManager,
  PrCommentManagerByOctokit,
} from './PrCommentManager';

/**
 * レポートの内容を生成する
 */
const generateReportMessage = ({
  section,
  comparisonResult,
  reportUrl,
}: {
  section?: string;
  comparisonResult: ComparisonResult;
  reportUrl?: string;
}) => {
  const { newItems, diffItems, deletedItems, passedItems } = comparisonResult;

  const vrtLabel = section ? `${section}のVRT` : 'VRT';

  if (
    newItems.length === 0 &&
    diffItems.length === 0 &&
    deletedItems.length === 0
  ) {
    return `${vrtLabel}に差分はありません :sparkles:`;
  }

  const messages = [`${vrtLabel}に差分があります。`];
  messages.push(
    '| :red_circle: Changed | :white_circle: New | :black_circle: Deleted | :large_blue_circle: Passing |',
    '| --- | --- | --- | --- |',
    `| ${diffItems.length} | ${newItems.length} | ${deletedItems.length} | ${passedItems.length} |`,
  );

  if (reportUrl) {
    messages.push(
      '',
      `[レポート](${reportUrl})を確認してください。`,
      '- [ ] 差分に問題ないことを確認しました',
    );
  }
  return messages.join('\n');
};

export interface GitHubPluginOption {
  /** PRにコメントするためのGitHub Token */
  GITHUB_TOKEN: string;
  /** リポジトリのオーナー */
  GITHUB_REPO_OWNER: string;
  /** リポジトリ名 */
  GITHUB_REPO_NAME: string;
  /** コメント対象のPR番号 */
  GITHUB_PR_NUMBER: string;
  /** 区分（複数のVRTを実行する際に識別するための文字） */
  section?: string;
}

export class GitHubNotifierPlugin
  implements NotifierPlugin<GitHubPluginOption>
{
  private _logger!: Logger;
  private _GITHUB_TOKEN!: string;
  private _GITHUB_REPO_OWNER!: string;
  private _GITHUB_REPO_NAME!: string;
  private _GITHUB_PR_NUMBER!: number;
  private _section?: string;

  init(config: PluginCreateOptions<GitHubPluginOption>) {
    const { logger, options } = config;
    this._logger = logger;
    this._GITHUB_TOKEN = options.GITHUB_TOKEN;
    this._GITHUB_REPO_OWNER = options.GITHUB_REPO_OWNER;
    this._GITHUB_REPO_NAME = options.GITHUB_REPO_NAME;
    this._GITHUB_PR_NUMBER = parseInt(options.GITHUB_PR_NUMBER, 10);
    this._section = options.section;
  }

  async notify(params: NotifyParams): Promise<any> {
    const { comparisonResult, reportUrl } = params;

    const prManager: AbstractPrCommentManager = new PrCommentManagerByOctokit({
      GITHUB_TOKEN: this._GITHUB_TOKEN,
      GITHUB_REPO_NAME: this._GITHUB_REPO_NAME,
      GITHUB_REPO_OWNER: this._GITHUB_REPO_OWNER,
    });

    const { data: comments } = await prManager.fetchComments(
      this._GITHUB_PR_NUMBER,
    );

    /** 既にコメントしているかを判別するためのメッセージ */
    const identifierMessage = `<!-- REG SUIT COMMENT GENERATED BY REG NOTIFY GITHUB PLUGIN${this._section ? ` - Section: ${this._section}` : ''} -->`;

    const existingComment = comments.find((comment) => {
      return comment.body?.includes(identifierMessage);
    });

    const reportMessage = generateReportMessage({
      section: this._section,
      comparisonResult,
      reportUrl,
    });
    const message = `${identifierMessage}\n${reportMessage}`;

    if (existingComment) {
      const result = await prManager.updateComment(existingComment.id, message);
      this._logger.info('Updated report comment at ' + result.data.html_url);
    } else {
      const result = await prManager.createComment(
        this._GITHUB_PR_NUMBER,
        message,
      );
      this._logger.info('Created report comment at ' + result.data.html_url);
    }
  }
}
