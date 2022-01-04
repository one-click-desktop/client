import { Injectable } from '@angular/core';

import { APP_CONFIG } from '@environments/environment';
import { Config, Convert } from '@models/config';
import { Configuration } from '@one-click-desktop/api-module';
import { ElectronService } from '@services/electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private static config: Config;
  private static token: string;

  constructor(private electronService: ElectronService) {}

  static getConfiguration(): Configuration {
    return new Configuration({
      withCredentials: true,
      basePath: ConfigurationService.config.basePath,
      credentials: { bearerAuth: ConfigurationService.getToken },
    });
  }

  static getToken(): string {
    return ConfigurationService.token;
  }

  loadConfiguration(): void {
    const file = this.electronService.readFile(APP_CONFIG.configPath, 'utf-8');

    // web debug
    if (!this.electronService.isElectronApp) {
      ConfigurationService.config = {
        basePath: APP_CONFIG.basePath,
        rabbitPath: '',
      };
    }

    if (!file) {
      this.electronService.showDialog(
        'Invalid configuration',
        'Cannot load configuration file'
      );
      this.electronService.close();
      return;
    }

    let conf: Config;
    try {
      conf = Convert.toConfig(file);
    } catch {
      this.configError();
      return;
    }

    if (conf.basePath && conf.rabbitPath) {
      ConfigurationService.config = conf;
    } else {
      this.configError();
    }
  }

  private configError() {
    this.electronService.showDialog(
      'Invalid configuration',
      'Configuration is invalid'
    );
    this.electronService.close();
  }

  set token(token: string) {
    ConfigurationService.token = token;
  }

  get config(): Config {
    return ConfigurationService.config;
  }

  set config(config: Config) {
    const data = Convert.configToJson(config);
    if (this.electronService.writeFile(APP_CONFIG.configPath, data, 'utf-8')) {
      ConfigurationService.config = config;
    } else {
      this.electronService.showDialog(
        'Configuration save error',
        'Could not save configuration into file'
      );
    }
  }
}
