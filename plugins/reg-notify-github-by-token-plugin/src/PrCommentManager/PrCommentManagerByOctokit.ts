import { Octokit } from '@octokit/rest';
import {
  AbstractPrCommentManager,
  InitialParams,
} from './AbstractPrCommentManager';

/** octokit/restを使ってGitHubのPRコメントを管理する */
export class PrCommentManagerByOctokit extends AbstractPrCommentManager {
  private _octokit: Octokit;

  constructor(params: InitialParams) {
    super(params);
    this._octokit = new Octokit({ auth: this._GITHUB_TOKEN });
  }

  async fetchComments(prNumber: number) {
    const { data } = await this._octokit.issues.listComments({
      owner: this._GITHUB_REPO_OWNER,
      repo: this._GITHUB_REPO_NAME,
      issue_number: prNumber,
    });
    return data;
  }

  async createComment(prNumber: number, body: string) {
    const { data } = await this._octokit.issues.createComment({
      owner: this._GITHUB_REPO_OWNER,
      repo: this._GITHUB_REPO_NAME,
      issue_number: prNumber,
      body,
    });
    return data;
  }

  async updateComment(commentId: number, body: string) {
    const { data } = await this._octokit.issues.updateComment({
      owner: this._GITHUB_REPO_OWNER,
      repo: this._GITHUB_REPO_NAME,
      comment_id: commentId,
      body,
    });
    return data;
  }
}
