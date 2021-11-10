import { Injectable } from '@angular/core';

import { APP_CONFIG } from '@environments/environment';
import { Configuration } from '@one-click-desktop/api-module';
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
      withCredentials: true,
      basePath: ConfigurationService.basePath,
      credentials: { bearerAuth: ConfigurationService.getToken },
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
