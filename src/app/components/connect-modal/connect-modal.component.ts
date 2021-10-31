import { Component, Input } from '@angular/core';
import { MachineType } from '@api-module/model/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-connect-modal',
  templateUrl: './connect-modal.component.html',
  styleUrls: ['./connect-modal.component.scss'],
})
export class ConnectModalComponent {
  @Input()
  availableTypes: MachineType[];

  machineTypes: { key: string; value: MachineType }[];
  type: MachineType;

  constructor(
    private activeModal: NgbActiveModal
  ) {
    this.machineTypes = Object.keys(MachineType).map((type) => {
      return { key: type, value: MachineType[type] };
    });
  }

  close(message?: string): void {
    this.activeModal.close(message);
  }

  isDisabled(type: MachineType): boolean {
    const ret = !this.availableTypes?.includes(type);
    console.log({ av: this.availableTypes, type, ret });
    return ret;
  }

  onSubmit(): void {
    //TODO: add implementation
  }
}
