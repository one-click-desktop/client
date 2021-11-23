import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { Session } from '@one-click-desktop/api-module';
import { ElectronService } from '@services/electron/electron.service';
import { LoggedInService } from '@services/loggedin/loggedin.service';

@Injectable({
  providedIn: 'root',
})
export class RdpService {
  private process: any;

  constructor(
    private electronService: ElectronService,
    private loggedInService: LoggedInService
  ) {}

  createRdpConnection(session: Session): Observable<void> {
    // we use child_process module which doesn't work for web environment
    if (!this.electronService.isElectronApp) {
      return throwError('Not an Electron app');
    }
    if (this.process) {
      return throwError('Process already exists');
    }

    return new Observable((subscriber) => {
      this.process = this.electronService.isWindows
        ? this.spawnWindowsRdpProcess(session)
        : this.spawnLinuxRdpProcess(session);

      if (!this.process) {
        subscriber.error('Failed to create process');
        return;
      }

      this.process.on('spawn', () => {
        console.log('spawn');
        subscriber.next();
      });
      this.process.on('error', (err) => {
        console.log(err);

        subscriber.error(err);
      });
      this.process.on('close', () => {
        subscriber.complete();
        this.process = null;
      });
    });
  }

  private spawnWindowsRdpProcess(session: Session): any {
    const address = `${session.address.address}:${session.address.port}`;
    const login = this.loggedInService.getLogin();

    this.electronService.exec(
      `cmdkey /generic:${address} /user:${login.login} /pass:${login.password}`
    );

    const cmd = 'mstsc.exe';
    const args = [`-v:${address}`];
    return this.electronService.spawnChild(cmd, args);
  }

  private removeCredentials(session: Session) {
    const address = `${session.address.address}:${session.address.port}`;
    this.electronService.exec(`cmdkey /delete:${address}`);
  }

  private spawnLinuxRdpProcess(_session: Session): any {
    //TODO
    return this.electronService.spawnChild('mstsc.exe');
  }

  endRdpConnection(): void {
    // sending sigint to kill unconditionally
    this.process?.kill('SIGINT');
    this.process = null;
  }
}
