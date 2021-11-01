import { Component, Input, OnInit } from '@angular/core';
import { MachineType, Session } from '@api-module/model/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './connect-modal.component.html',
  styleUrls: ['./connect-modal.component.scss'],
})
export class ConnectModalComponent {
  @Input()
  availableTypes: MachineType[];

  step: number = 0;
  selectedType: MachineType;
  session: Session;

  constructor(private activeModal: NgbActiveModal) {}

  close(message: string): void {
    this.activeModal.close(message);
  }

  typeSelected(type: MachineType): void {
    this.selectedType = type;
    this.step = 1;
  }

  sessionCreated(session: Session): void {
    this.session = session;
    this.step = 2;
  }

  // Development helper function
  progress(): void {
    this.step++;
  }
}
