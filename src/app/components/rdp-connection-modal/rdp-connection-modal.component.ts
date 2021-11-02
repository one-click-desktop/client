import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from '@api-module/model/models';
import { ModalBaseComponent } from '@components/modal-base/modal-base.component';
import { RdpService } from '@services/rdp/rdp.service';
import { Subscription } from 'rxjs';

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

  rdpSessionSub: Subscription;

  constructor(private rdpService: RdpService) {
    super();
  }

  ngOnInit(): void {
    this.startRdpSession();
  }

  startRdpSession(): void {
    this.rdpSessionSub = this.rdpService
      .createRdpConnection(this.session)
      .subscribe(
        () => {
          this.isConnected = true;
        },
        (error) => {
          console.log(error);
          this.isError = true;
        },
        () => {
          this.endSession();
        }
      );
  }

  endSession(): void {
    this.rdpSessionSub?.unsubscribe();
    this.rdpService.endRdpConnection();
    this.sessionEnded.emit();
  }
}
