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
    }).then(async (res) => {
      console.log(res);
      if (!res.ok) {
        throw new Error('Failed to fetch comments:' + res.statusText);
      }
      const data: Endpoints[`${typeof methodType} ${typeof templateUrl}`]['response']['data'] =
        await res.json();
      return {
        data,
        url: fullPath,
        // とりあえず型が合うようにキャスト
        status: 200 as const,
        headers: res.headers as any,
      };
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
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error('Failed to create comment:' + res.statusText);
      }
      const data: Endpoints[`${typeof methodType} ${typeof templateUrl}`]['response']['data'] =
        await res.json();
      return {
        data,
        url: fullPath,
        // とりあえず型が合うようにキャスト
        status: 201 as const,
        headers: res.headers as any,
      };
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
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error('Failed to update comment:' + res.statusText);
      }
      const data: Endpoints[`${typeof methodType} ${typeof templateUrl}`]['response']['data'] =
        await res.json();
      return {
        data,
        url: fullPath,
        // とりあえず型が合うようにキャスト
        status: 200 as const,
        headers: res.headers as any,
      };
    });

    return response;
  }
}
