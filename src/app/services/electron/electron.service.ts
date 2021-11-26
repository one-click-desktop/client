import { Injectable } from '@angular/core';

import * as ChildProcess from 'child_process';
import * as Fs from 'fs';

import * as Remote from '@electron/remote';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  childProcess: typeof ChildProcess;
  remote: typeof Remote;
  fs: typeof Fs;

  constructor() {
    if (this.isElectronApp) {
      this.childProcess = window.require('child_process');
      this.remote = window.require('@electron/remote');
      this.fs = window.require('fs');
    }
  }

  readFile(path: string, encoding: BufferEncoding): string {
    return this.fs?.readFileSync(path, encoding) ?? null;
  }

  showDialog(title: string, message: string): void {
    this.remote?.dialog.showErrorBox(title, message);
  }

  spawnChild(cmd: string, args?: string[]): ChildProcess.ChildProcess {
    return args
      ? this.childProcess?.spawn(cmd, args)
      : this.childProcess?.spawn(cmd);
  }

  exec(cmd: string): ChildProcess.ChildProcess {
    return this.childProcess?.exec(cmd);
  }

  get isElectronApp(): boolean {
    return !!(window && window.process && window.process.type);
  }

  get isWindows(): boolean {
    return this.isElectronApp && window.process.platform === 'win32';
  }

  get isLinux(): boolean {
    return this.isElectronApp && window.process.platform === 'linux';
  }
}
