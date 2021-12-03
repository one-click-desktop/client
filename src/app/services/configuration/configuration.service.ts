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
  private static rabbitPath: string;

  constructor(private electronService: ElectronService) {}

  static getConfiguration(): Configuration {
    return new Configuration({
      withCredentials: true,
      basePath: ConfigurationService.basePath,
      credentials: { bearerAuth: ConfigurationService.getToken },
    });
  }

  static getToken(): string {
    return ConfigurationService.token;
  }

  static getRabbitPath(): string {
    return ConfigurationService.rabbitPath;
  }

  loadConfiguration(): void {
    const file = this.electronService.readFile(APP_CONFIG.configPath, 'utf-8');
    this.basePath = APP_CONFIG.basePath;

    if (!file) {
      this.electronService.showDialog(
        'Invalid configuration',
        'Cannot load configuration file'
      );
      return;
    }

    const conf = JSON.parse(file);
    if ('basePath' in conf && 'rabbitPath' in conf) {
      this.basePath = conf.basePath;
      this.rabbitPath = conf.rabbitPath;
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

  set rabbitPath(rabbitPath: string) {
    ConfigurationService.rabbitPath = rabbitPath;
  }
}
