import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigRestartModalComponent } from '@components/config-restart-modal/config-restart-modal.component';
import { PathConstants } from '@constants/path-constants';
import { Config } from '@models/config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '@services/configuration/configuration.service';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  config: Config;

  constructor(
    private configService: ConfigurationService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.config = this.configService.config;
  }

  onSubmit(): void {
    if (this.restartNeeded()) {
      const modalRef = this.modalService.open(ConfigRestartModalComponent, {
        backdrop: 'static',
        keyboard: false,
      });
      if (modalRef) {
        modalRef.componentInstance.config = this.config;
      }
    } else {
      this.configService.config = this.config;
      this.router.navigate([PathConstants.HOME]);
    }
  }

  private restartNeeded(): boolean {
    const baseConfig = this.configService.config;

    return baseConfig.basePath !== this.config.basePath;
  }
}
