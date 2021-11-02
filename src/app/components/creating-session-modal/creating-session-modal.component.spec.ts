import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionService } from '@api-module/api/api';
import { MachineType, SessionStatus } from '@api-module/model/models';
import { of, Subscription, throwError } from 'rxjs';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';
import { Chance } from 'chance';

import { CreatingSessionModalComponent } from './creating-session-modal.component';
import { By } from '@angular/platform-browser';

const chance = new Chance();

jest.mock('@api-module/api/api');

describe('CreatingSessionModalComponent', () => {
  let component: CreatingSessionModalComponent;
  let fixture: ComponentFixture<CreatingSessionModalComponent>;
  let debugElement: DebugElement;
  let sessionService: MockedObject<SessionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatingSessionModalComponent],
      providers: [SessionService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatingSessionModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    sessionService = mocked(TestBed.inject(SessionService), false);
    sessionService.getSession.mockReturnValue(of(null));
    sessionService.getSessionStatus.mockReturnValue(of(null));
    sessionService.deleteSession.mockReturnValue(of(null));
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('onSessionReady should call sessionReady emit with session and unsubscribe sessionStatus$', () => {
    const spy = jest.spyOn(component.sessionReady, 'emit');
    const session = { id: chance.guid(), type: MachineType.Cpu };
    component.session = session;
    component.sessionStatus$ = new Subscription();
    const spySub = jest.spyOn(component.sessionStatus$, 'unsubscribe');

    component.onSessionReady();

    expect(spy).toHaveBeenCalledWith(session);
    expect(spySub).toHaveBeenCalled();
  });

  test('sessionReady should emit session', () => {
    const session = { id: chance.guid(), type: MachineType.Cpu };

    component.sessionReady.subscribe((s) => expect(s).toBe(session));

    component.sessionReady.emit(session);
  });

  test('onSessionPending should call getSessionStatus after SESSION_STATUS_WAIT_TIME ms and repeat', () => {
    jest.useFakeTimers();
    component.session = { id: chance.guid(), type: MachineType.Cpu };
    sessionService.getSessionStatus.mockReturnValue(throwError(''));
    const spy = jest.spyOn(component, 'getSessionStatus');

    component.onSessionPending();
    jest.advanceTimersToNextTimer();

    expect(spy).toHaveBeenCalledTimes(1);
    jest.advanceTimersToNextTimer();

    expect(spy).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  test('onError should set waitingForSession to false', () => {
    component.waitingForSession = null;

    component.onError();

    expect(component.waitingForSession).toBeFalsy();
  });

  test('cancelSessionShould call deleteSession and close', () => {
    const spy = jest.spyOn(component, 'close');
    const session = { id: chance.guid(), type: MachineType.Cpu };
    component.session = session;

    component.cancelSession();

    expect(sessionService.deleteSession).toHaveBeenCalledWith(session.id);
    expect(spy).toHaveBeenCalled();
  });

  test('createSession should set waitingForSession to true and call getSession', () => {
    const type = MachineType.Cpu;
    component.machineType = type;
    component.waitingForSession = null;

    component.createSession();

    expect(component.waitingForSession).toBeTruthy();
    expect(sessionService.getSession).toHaveBeenCalledWith(type);
  });

  test('createSession should call onSessionReady if returned session status is ready', () => {
    const spy = jest.spyOn(component, 'onSessionReady');
    prepareComponentForGetSession(component, SessionStatus.Ready);

    component.createSession();

    expect(spy).toHaveBeenCalled();
  });

  test('createSession should call onSessionPending if returned session status is pending', () => {
    const spy = jest.spyOn(component, 'onSessionPending');
    prepareComponentForGetSession(component, SessionStatus.Pending);

    component.createSession();

    expect(spy).toHaveBeenCalled();
  });

  test('createSession should call onError if returned session status is neither pending nor ready', () => {
    const spy = jest.spyOn(component, 'onError');
    prepareComponentForGetSession(component, SessionStatus.Cancelled);

    component.createSession();

    expect(spy).toHaveBeenCalled();
  });

  test('createSession should call onError if error occurs', () => {
    const spy = jest.spyOn(component, 'onError');
    prepareComponentForGetSession(component, SessionStatus.Ready, true);

    component.createSession();

    expect(spy).toHaveBeenCalled();
  });

  function prepareComponentForGetSession(
    component: CreatingSessionModalComponent,
    status: SessionStatus,
    error: boolean = false
  ): void {
    const session = { id: chance.guid(), type: MachineType.Cpu, status };
    const type = MachineType.Cpu;
    component.machineType = type;
    if (error) {
      sessionService.getSession.mockReturnValueOnce(throwError(''));
    } else {
      sessionService.getSession.mockReturnValueOnce(of(session) as any);
    }
  }

  test('getSessionStatus should call onSessionReady if returned session status is ready', () => {
    const spy = jest.spyOn(component, 'onSessionReady');
    prepareComponentForGetSessionStatus(component, SessionStatus.Ready);

    component.getSessionStatus();

    expect(spy).toHaveBeenCalled();
  });

  test('getSessionStatus should call onError if returned session status is neither pending nor ready', () => {
    const spy = jest.spyOn(component, 'onError');
    prepareComponentForGetSessionStatus(component, SessionStatus.Cancelled);

    component.getSessionStatus();

    expect(spy).toHaveBeenCalled();
  });

  test('getSessionStatus should call onError if error occurs', () => {
    const spy = jest.spyOn(component, 'onError');
    prepareComponentForGetSessionStatus(component, SessionStatus.Ready, true);

    component.getSessionStatus();

    expect(spy).toHaveBeenCalled();
  });

  function prepareComponentForGetSessionStatus(
    component: CreatingSessionModalComponent,
    status: SessionStatus,
    error: boolean = false
  ): void {
    const session = { id: chance.guid(), type: MachineType.Cpu, status };
    component.session = session;
    if (error) {
      sessionService.getSessionStatus.mockReturnValueOnce(throwError(''));
    } else {
      sessionService.getSessionStatus.mockReturnValueOnce(of(session) as any);
    }
  }

  test('should call close when clicking on "x"', () => {
    const spy = jest.spyOn(component, 'close');

    debugElement.query(By.css('.close')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith('Cross click');
  });

  test('should show spinner if waitingForSession is true', () => {
    component.waitingForSession = true;

    fixture.detectChanges();

    const spinner = debugElement.query(By.css('.spinner'));
    const error = debugElement.query(By.css('.error'));
    expect(spinner).toBeTruthy();
    expect(error).toBeFalsy();
  });

  test('should show error if waitingForSession is false', () => {
    fixture.detectChanges();
    component.waitingForSession = false;

    fixture.detectChanges();

    const spinner = debugElement.query(By.css('.spinner'));
    const error = debugElement.query(By.css('.error'));
    expect(error).toBeTruthy();
    expect(spinner).toBeFalsy();
  });

  test('should call cancelSession when clicking cancel button', () => {
    component.session = { id: chance.guid(), type: MachineType.Cpu };
    const button = debugElement.query(
      By.css('.modal-footer > .btn')
    ).nativeElement;
    const spy = jest.spyOn(component, 'cancelSession');

    button.click();

    expect(spy).toHaveBeenCalled();
  });
});
