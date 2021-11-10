import { Component } from '@angular/core';

import { PathConstants } from '@constants/path-constants';
import { LoggedInService } from '@services/loggedin/loggedin.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  paths = PathConstants;

  constructor(private loggedInService: LoggedInService) {}

  logout(): void {
    this.loggedInService.logout();
  }
}
