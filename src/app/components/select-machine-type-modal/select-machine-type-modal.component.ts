import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ModalBaseComponent } from '@components/modal-base/modal-base.component';
import { MachineType } from '@one-click-desktop/api-module';

@Component({
  selector: 'app-select-machine-type-modal',
  templateUrl: './select-machine-type-modal.component.html',
  styleUrls: ['./select-machine-type-modal.component.scss'],
})
export class SelectMachineTypeModalComponent extends ModalBaseComponent {
  @Input()
  availableTypes: MachineType[];

  @Output()
  typeSelected: EventEmitter<MachineType> = new EventEmitter();

  machineTypes: { key: string; value: MachineType }[];
  type: MachineType;

  constructor() {
    super();
    this.machineTypes = Object.keys(MachineType).map((type) => {
      return { key: type, value: MachineType[type] };
    });
  }

  isDisabled(type: MachineType): boolean {
    return !this.availableTypes?.includes(type);
  }

  onSubmit(): void {
    this.typeSelected.emit(this.type);
  }
}
