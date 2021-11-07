import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Subscription, timer } from 'rxjs';

import { SessionService } from '@api-module/api/api';
import { MachineType, Session, SessionStatus } from '@api-module/model/models';
import { ModalBaseComponent } from '@components/modal-base/modal-base.component';
import { TimeConstants } from '@constants/time-constants';

@Component({
  selector: 'app-creating-session-modal',
  templateUrl: './creating-session-modal.component.html',
  styleUrls: ['./creating-session-modal.component.scss'],
})
export class CreatingSessionModalComponent
  extends ModalBaseComponent
  implements OnInit
{
  @Input()
  machineType: MachineType;

  @Output()
  sessionReady: EventEmitter<Session> = new EventEmitter();

  session: Session;
  waitingForSession: boolean;
  sessionStatusSub: Subscription;

  constructor(private sessionService: SessionService) {
    super();
  }

  ngOnInit(): void {
    this.createSession();
  }

  createSession(): void {
    this.waitingForSession = true;
    this.sessionService.getSession(this.machineType).subscribe(
      (session) => {
        this.session = session;

        switch (session.status) {
          case SessionStatus.Ready:
            this.onSessionReady();
            break;
          case SessionStatus.Pending:
            this.onSessionPending();
            break;
          default:
            this.onError();
        }
      },
      (error) => {
        this.onError(error);
      }
    );
  }

  getSessionStatus(): void {
    this.sessionService.getSessionStatus(this.session.id).subscribe(
      (session) => {
        this.session = session;

        switch (session.status) {
          case SessionStatus.Ready:
            this.onSessionReady();
            break;
          case SessionStatus.Pending:
            break;
          default:
            this.onError();
        }
      },
      (error) => {
        this.onError(error);
      }
    );
  }

  onSessionReady(): void {
    this.sessionStatusSub?.unsubscribe();
    this.sessionReady.emit(this.session);
  }

  onSessionPending(): void {
    this.sessionStatusSub = timer(
      TimeConstants.SESSION_STATUS_WAIT_TIME,
      TimeConstants.SESSION_STATUS_WAIT_TIME
    ).subscribe(() => this.getSessionStatus());
  }

  onError(error?: any): void {
    this.waitingForSession = false;
  }

  cancelSession(): void {
    this.sessionService.deleteSession(this.session.id).subscribe();
    this.sessionStatusSub?.unsubscribe();
    this.close('Cancel');
  }
}
