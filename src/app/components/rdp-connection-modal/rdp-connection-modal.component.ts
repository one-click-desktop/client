import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from '@api-module/model/models';
import { ModalBaseComponent } from '@components/modal-base/modal-base.component';

@Component({
  selector: 'app-rdp-connection-modal',
  templateUrl: './rdp-connection-modal.component.html',
  styleUrls: ['./rdp-connection-modal.component.scss'],
})
export class RdpConnectionModalComponent
  extends ModalBaseComponent
  implements OnInit
{
  @Input()
  session: Session;

  @Output()
  sessionEnded: EventEmitter<void> = new EventEmitter();

  isConnected: boolean;
  isError: boolean;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  endSession(): void {
    this.sessionEnded.emit();
  }
}
