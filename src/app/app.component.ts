import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'one-click-desktop-client';

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
    this.title = this.electronService.isElectronApp ? 'Electron Application' : "Standard Angular Web Application";
  }
}
