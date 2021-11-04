import { Injectable } from '@angular/core';

import { Configuration } from '@api-module/configuration';
import { APP_CONFIG } from '@environments/environment';
import { ElectronService } from '@services/electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private static basePath: string;
  private static token: string;
  private static login: string;
  private static password: string;

  constructor(private electronService: ElectronService) {}

  static getConfiguration(): Configuration {
    const a = new Configuration({
      accessToken: ConfigurationService.getToken,
      basePath: ConfigurationService.basePath,
    });
    return a;
  }

  static getToken(): string {
    return ConfigurationService.token;
  }

  loadConfiguration(): void {
    const file = this.electronService.readFile(APP_CONFIG.configPath, 'utf-8');
    if (!file) {
      this.electronService.showDialog(
        'Invalid configuration',
        'Cannot load configuration file'
      );
      return;
    }

    const conf = JSON.parse(file);
    if ('basePath' in conf) {
      this.basePath = conf.basePath;
    } else {
      this.electronService.showDialog(
        'Invalid configuration',
        'Cannot load base path from configuration file'
      );
    }
  }

  set token(token: string) {
    ConfigurationService.token = token;
  }

  set basePath(basePath: string) {
    ConfigurationService.basePath = basePath;
  }
}
