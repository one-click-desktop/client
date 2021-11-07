import { Component } from '@angular/core';

import { PathConstants } from '@constants/path-constants';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  paths = PathConstants;

  constructor() {}

  logOut(): void {
    //TODO: add loginService call
  }
}
