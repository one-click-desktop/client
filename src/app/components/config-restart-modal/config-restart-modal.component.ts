import { Component, Input } from '@angular/core';

import { Config } from '@models/config';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '@services/configuration/configuration.service';
import { ElectronService } from '@services/electron/electron.service';

@Component({
  selector: 'app-config-restart-modal',
  templateUrl: './config-restart-modal.component.html',
  styleUrls: ['./config-restart-modal.component.scss'],
})
export class ConfigRestartModalComponent {
  @Input()
  config: Config;

  constructor(
    private activeModal: NgbActiveModal,
    private configService: ConfigurationService,
    private electronService: ElectronService
  ) {}

  close(message: string): void {
    this.activeModal.close(message);
  }

  restart(): void {
    this.configService.config = this.config;
    this.electronService.relaunch();
  }
}
