import { Injectable } from '@angular/core';
import { Session } from '@api-module/model/models';
import { Observable, throwError } from 'rxjs';
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
      this.process = this.electronService.isWindows
        ? this.spawnWindowsRdpProcess(session)
        : this.spawnLinuxRdpProcess(session);

      this.process.on('error', (err) => subscriber.error(err));
      this.process.on('close', () => {
        subscriber.complete();
        this.process = null;
      });
    });
  }

  private spawnWindowsRdpProcess(session: Session): any {
    return this.electronService.childProcess.spawn('mstsc.exe');
  }

  private spawnLinuxRdpProcess(session: Session): any {
    //TODO
  }

  endRdpConnection(): void {
    // sending sigint to kill unconditionally
    this.process?.kill('SIGINT');
    this.process = null;
  }
}
