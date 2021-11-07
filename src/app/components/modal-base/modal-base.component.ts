import { Component, EventEmitter, Output } from '@angular/core';

@Component({ template: '' })
export class ModalBaseComponent {
  @Output()
  closeModal: EventEmitter<string> = new EventEmitter();

  constructor() {}

  close(message: string): void {
    this.closeModal.emit(message);
  }
}
