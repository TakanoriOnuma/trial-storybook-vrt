import {
  AbstractPrCommentManager,
  InitialParams,
} from './AbstractPrCommentManager';
import type { Endpoints } from '@octokit/types';

const GITHUB_API_DOMAIN = 'https://api.github.com';

/** fetch APIを使ってGitHubのPRコメントを管理する */
export class PrCommentManagerByFetchApi extends AbstractPrCommentManager {
  private _requestHeaders: HeadersInit;

  constructor(params: InitialParams) {
    super(params);

    this._requestHeaders = {
      Authorization: `token ${this._GITHUB_TOKEN}`,
    };
  }

  async fetchComments(prNumber: number) {
    console.log('fetch APIでコメントを取得します');
    const methodType = 'GET' as const;
    const templateUrl =
      '/repos/{owner}/{repo}/issues/{issue_number}/comments' as const;
    const fullPath =
      GITHUB_API_DOMAIN +
      templateUrl
        .replace('{owner}', this._GITHUB_REPO_OWNER)
        .replace('{repo}', this._GITHUB_REPO_NAME)
        .replace('{issue_number}', prNumber.toString());

    const response = await fetch(fullPath, {
      method: methodType,
      headers: this._requestHeaders,
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch comments:' + res.statusText);
      }
      return res.json() as Promise<
        Endpoints[`${typeof methodType} ${typeof templateUrl}`]['response']
      >;
    });
    return response;
  }

  async createComment(prNumber: number, body: string) {
    console.log('fetch APIでコメントを作成します');
    const methodType = 'POST' as const;
    const templateUrl =
      '/repos/{owner}/{repo}/issues/{issue_number}/comments' as const;
    const fullPath =
      GITHUB_API_DOMAIN +
      templateUrl
        .replace('{owner}', this._GITHUB_REPO_OWNER)
        .replace('{repo}', this._GITHUB_REPO_NAME)
        .replace('{issue_number}', prNumber.toString());

    const response = await fetch(fullPath, {
      method: methodType,
      body: JSON.stringify({ body }),
      headers: this._requestHeaders,
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to create comment:' + res.statusText);
      }
      return res.json() as Promise<
        Endpoints[`${typeof methodType} ${typeof templateUrl}`]['response']
      >;
    });
    return response;
  }

  async updateComment(commentId: number, body: string) {
    console.log('fetch APIでコメントを更新します');
    const methodType = 'PATCH' as const;
    const templateUrl =
      '/repos/{owner}/{repo}/issues/comments/{comment_id}' as const;
    const fullPath =
      GITHUB_API_DOMAIN +
      templateUrl
        .replace('{owner}', this._GITHUB_REPO_OWNER)
        .replace('{repo}', this._GITHUB_REPO_NAME)
        .replace('{comment_id}', commentId.toString());

    const response = await fetch(fullPath, {
      method: methodType,
      body: JSON.stringify({ body }),
      headers: this._requestHeaders,
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to update comment:' + res.statusText);
      }
      return res.json() as Promise<
        Endpoints[`${typeof methodType} ${typeof templateUrl}`]['response']
      >;
    });
    return response;
  }
}
