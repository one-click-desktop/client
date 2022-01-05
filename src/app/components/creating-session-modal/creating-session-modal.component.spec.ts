import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of, Subscription, throwError } from 'rxjs';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { SessionService } from '@one-click-desktop/api-module';
import { SessionStatus } from '@one-click-desktop/api-module';
import { getMachineTypeFixture, getSessionFixture } from '@testing/fixtures';

import { CreatingSessionModalComponent } from './creating-session-modal.component';

jest.mock('@one-click-desktop/api-module');

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
    sessionService.getSession.mockImplementation(() => of(null));
    sessionService.getSessionStatus.mockImplementation(() => of(null));
    sessionService.deleteSession.mockImplementation(() => of(null));
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('onSessionReady should call sessionReady emit with session and unsubscribe sessionStatusSub', () => {
    const spy = jest.spyOn(component.sessionReady, 'emit');
    const session = getSessionFixture();
    component.session = session;
    component.sessionStatusSub = new Subscription();
    const spySub = jest.spyOn(component.sessionStatusSub, 'unsubscribe');

    component.onSessionReady();

    expect(spy).toHaveBeenCalledWith(session);
    expect(spySub).toHaveBeenCalled();
  });

  test('sessionReady should emit session', (done) => {
    const session = getSessionFixture();

    component.sessionReady.subscribe((s) => {
      expect(s).toBe(session);
      done();
    });

    component.sessionReady.emit(session);
  });

  test('onSessionPending should call getSessionStatus after SESSION_STATUS_WAIT_TIME ms and repeat', () => {
    jest.useFakeTimers();
    component.session = getSessionFixture();
    sessionService.getSessionStatus.mockReturnValueOnce(throwError(''));
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

  test('cancelSessionShould call deleteSession, unsubscribe sessionStatusSub and close', () => {
    const spy = jest.spyOn(component, 'close');
    const session = getSessionFixture();
    component.session = session;
    component.waitingForSession = true;
    component.sessionStatusSub = new Subscription();
    const spySub = jest.spyOn(component.sessionStatusSub, 'unsubscribe');

    component.cancelSession();

    expect(sessionService.deleteSession).toHaveBeenCalledWith(session.id);
    expect(spy).toHaveBeenCalled();
    expect(spySub).toHaveBeenCalled();
  });

  test('createSession should set waitingForSession to true and call getSession', () => {
    const type = getMachineTypeFixture();
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
    const session = getSessionFixture({ status });
    const type = getMachineTypeFixture();
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
    const session = getSessionFixture({ status });
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
    component.session = getSessionFixture();
    const button = debugElement.query(
      By.css('.modal-footer > .btn')
    ).nativeElement;
    const spy = jest.spyOn(component, 'cancelSession');

    button.click();

    expect(spy).toHaveBeenCalled();
  });
});
