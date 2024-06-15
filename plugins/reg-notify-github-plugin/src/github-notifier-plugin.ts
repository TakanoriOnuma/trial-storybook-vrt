import {
  NotifierPlugin,
  NotifyParams,
  PluginCreateOptions,
  Logger,
} from 'reg-suit-interface';

import fetch from 'node-fetch';

export interface GitHubPluginOption {}

export class GitHubNotifierPlugin
  implements NotifierPlugin<GitHubPluginOption>
{
  private _logger!: Logger;

  init(config: PluginCreateOptions<GitHubPluginOption>) {
    const { logger, options } = config;
    this._logger = logger;
    console.log('初期化するぞ！');
    console.log(config);
  }

  async notify(params: NotifyParams): Promise<any> {
    const { comparisonResult, reportUrl } = params;
    console.log('通知しちゃうぞ！');
    console.log(params);
  }
}
