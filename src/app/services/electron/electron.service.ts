import { Injectable } from '@angular/core';
import * as Remote from '@electron/remote';
import * as ChildProcess from 'child_process';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  childProcess: typeof ChildProcess;
  remote: typeof Remote;

  constructor() {
    if (this.isElectronApp) {
      this.childProcess = window.require('child_process');
      this.remote = window.require('@electron/remote');
    }
  }

  get isElectronApp(): boolean {
    return !!(window && window.process && window.process.type);
  }

  get isWindows(): boolean {
    return this.isElectronApp && window.process.platform === 'win32';
  }
}
