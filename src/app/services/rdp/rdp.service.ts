import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { RegexpConstants } from '@constants/regexp-constants';
import { IpAddress, Login } from '@one-click-desktop/api-module';
import { ConfigurationService } from '@services/configuration/configuration.service';
import { ElectronService } from '@services/electron/electron.service';
import { LoggedInService } from '@services/loggedin/loggedin.service';

@Injectable({
  providedIn: 'root',
})
export class RdpService {
  private process: any;

  constructor(
    private electronService: ElectronService,
    private loggedInService: LoggedInService,
    private configService: ConfigurationService
  ) {}

  createRdpConnection(address: IpAddress): Observable<void> {
    // we use child_process module which doesn't work for web environment
    if (!this.electronService.isElectronApp) {
      return throwError('Not an Electron app');
    }
    if (this.process) {
      return throwError('Process already exists');
    }

    return new Observable((subscriber) => {
      this.process = this.spawnRdpProcess(
        address,
        this.loggedInService.getLogin()
      );
      if (!this.process) {
        subscriber.error('Failed to create process');
        return;
      }

      this.process.on('spawn', () => {
        subscriber.next();
      });
      this.process.on('error', (err) => {
        subscriber.error(err);
      });
      this.process.on('close', () => {
        subscriber.complete();
        this.process = null;
      });

      this.process.stderr?.on('data', (data) => {
        if (RegexpConstants.CONNECTION_ERROR.test(data)) {
          subscriber.error('Connection error');
        }
      });
    });
  }

  private spawnRdpProcess(address: IpAddress, login: Login): any {
    const machineAddress = `${address.address}:${address.port}`;

    let cmd: string, args: string[];
    if (this.electronService.isWindows) {
      cmd = 'mstsc.exe';
      args = [`-v:${machineAddress}`];
    } else if (this.electronService.isLinux) {
      cmd = 'xfreerdp';
      args = [`/v:${machineAddress}`, '/cert:tofu'];
      if (this.configService.config?.useRdpCredentials) {
        args.push(`/u:${login.login}`, `/p:${login.password}`);
      }
    } else {
      return null;
    }

    return this.electronService.spawnChild(cmd, args);
  }

  endRdpConnection(): void {
    // sending sigint to kill unconditionally
    this.process?.kill('SIGINT');
    this.process = null;
  }
}
