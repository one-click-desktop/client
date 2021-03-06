import { Injectable } from '@angular/core';

import * as ChildProcess from 'child_process';
import * as Fs from 'fs';
import * as Path from 'path';

import * as Remote from '@electron/remote';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  rabbit: any;

  private childProcess: typeof ChildProcess;
  private remote: typeof Remote;
  private fs: typeof Fs;
  private path: typeof Path;

  constructor() {
    if (this.isElectronApp) {
      this.childProcess = window.require('child_process');
      this.remote = window.require('@electron/remote');
      this.fs = window.require('fs');
      this.path = window.require('path');
      this.rabbit = window.require('amqplib/callback_api');
    }
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

  readFile(path: string, encoding: BufferEncoding): string {
    try {
      const p = this.path?.join(
        this.remote?.process.env.PORTABLE_EXECUTABLE_DIR ?? '',
        path
      );
      return this.fs?.readFileSync(p, encoding) ?? null;
    } catch {
      return null;
    }
  }

  writeFile(path: string, data: string, encoding: BufferEncoding): boolean {
    try {
      const p = this.path?.join(
        this.remote?.process.env.PORTABLE_EXECUTABLE_DIR ?? '',
        path
      );
      this.fs?.writeFileSync(p, data, { encoding: encoding, flag: 'w' });
      return true;
    } catch {
      return false;
    }
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

  close(): void {
    this.remote?.app?.quit();
  }

  relaunch(): void {
    this.remote?.app?.relaunch();
    this.remote?.app?.quit();
  }
}
