import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { Login, Session } from '@one-click-desktop/api-module';
import { ElectronService } from '@services/electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class RdpService {
  private process: any;

  constructor(private electronService: ElectronService) {}

  createRdpConnection(session: Session): Observable<void> {
    // we use child_process module which doesn't work for web environment
    if (!this.electronService.isElectronApp) {
      return throwError('Not an Electron app');
    }
    if (this.process) {
      return throwError('Process already exists');
    }

    return new Observable((subscriber) => {
      this.process = spawnRdpProcess(session);
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

  private spawnRdpProcess(session: Session, login: Login): any {
    let cmd, args;
    if (this.electronService.isWindows) {
      cmd = 'mstsc.exe';
      args = [`-v:${session.address.address}:${session.address.port}`];
    } else if (this.electronService.isLinux) {
      cmd = 'xfreerdp';
      args = [`/v:${session.address.address}:${session.address.port}`];
    } else {
      return null;
    }
  }

  private spawnWindowsRdpProcess(session: Session): any {
    const cmd = 'mstsc.exe';
    const args = [`-v:${session.address.address}:${session.address.port}`];
    console.log(cmd, args);
    return this.electronService.spawnChild(cmd, args);
  }

  private spawnLinuxRdpProcess(session: Session): any {
    this.electronService.exec(
      `remmina --set-option server=${session.address.address}:${session.address.address} --update-profile tmp.remmina`
    );

    return this.electronService.spawnChild('remmina -c tmp.remmina');
  }

  endRdpConnection(): void {
    // sending sigint to kill unconditionally
    this.process?.kill('SIGINT');
    this.process = null;
  }
}
