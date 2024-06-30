import type { Endpoints } from '@octokit/types';

export type FetchCommentsResponse =
  Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}/comments']['response'];

export type CreateCommentResponse =
  Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/comments']['response'];

export type UpdateCommentResponse =
  Endpoints['PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}']['response'];

export type InitialParams = {
  GITHUB_TOKEN: string;
  GITHUB_REPO_OWNER: string;
  GITHUB_REPO_NAME: string;
};

export abstract class AbstractPrCommentManager {
  /** PRにコメントするためのGitHub Token */
  protected _GITHUB_TOKEN: string;
  /** リポジトリのオーナー */
  protected _GITHUB_REPO_OWNER: string;
  /** リポジトリ名 */
  protected _GITHUB_REPO_NAME: string;

  constructor({
    GITHUB_TOKEN,
    GITHUB_REPO_NAME,
    GITHUB_REPO_OWNER,
  }: InitialParams) {
    this._GITHUB_TOKEN = GITHUB_TOKEN;
    this._GITHUB_REPO_NAME = GITHUB_REPO_NAME;
    this._GITHUB_REPO_OWNER = GITHUB_REPO_OWNER;
  }

  /**
   * 該当のPRのコメント一覧を取得する
   * @param prNumber - PR番号
   */
  abstract fetchComments(
    prNumber: number,
  ): Promise<FetchCommentsResponse['data']>;

  /**
   * 該当のPRにコメントを追加する
   * @param prNumber - PR番号
   * @param body - コメント内容
   */
  abstract createComment(
    prNumber: number,
    body: string,
  ): Promise<CreateCommentResponse['data']>;

  /**
   * 該当のコメントを更新する
   * @param commentId - 更新対象のコメントID
   * @param body - コメント内容
   */
  abstract updateComment(
    commentId: number,
    body: string,
  ): Promise<UpdateCommentResponse['data']>;
}
