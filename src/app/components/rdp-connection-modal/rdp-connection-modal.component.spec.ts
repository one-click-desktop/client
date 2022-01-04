import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Chance } from 'chance';
import { Observable, of, Subscription } from 'rxjs';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { Config } from '@models/config';
import { ConfigurationService } from '@services/configuration/configuration.service';
import { RabbitMQService } from '@services/rabbitmq/rabbitmq.service';
import { RdpService } from '@services/rdp/rdp.service';
import { getSessionFixture } from '@testing/fixtures';

import { RdpConnectionModalComponent } from './rdp-connection-modal.component';

const chance = new Chance();

jest.mock('@services/rdp/rdp.service');
jest.mock('@services/rabbitmq/rabbitmq.service');
jest.mock('@services/configuration/configuration.service');

describe('RdpConnectionModalComponent', () => {
  let component: RdpConnectionModalComponent;
  let fixture: ComponentFixture<RdpConnectionModalComponent>;
  let debugElement: DebugElement;
  let rdpService: MockedObject<RdpService>;
  let rabbitService: MockedObject<RabbitMQService>;
  let configService: MockedObject<ConfigurationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RdpConnectionModalComponent],
      providers: [RdpService, RabbitMQService, ConfigurationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdpConnectionModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    rdpService = mocked(TestBed.inject(RdpService));
    rdpService.createRdpConnection.mockImplementation(() => of());
    rdpService.endRdpConnection.mockImplementation();

    rabbitService = mocked(TestBed.inject(RabbitMQService));
    rabbitService.connect.mockImplementation(() => {});
    rabbitService.disconnect.mockImplementation(() => {});

    configService = mocked(TestBed.inject(ConfigurationService));
    Object.defineProperty(configService, 'config', {
      get: jest.fn(),
    });
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('endSession should call sessionEnded emit and endRdpConnection and unsubscribe', () => {
    const spy = jest.spyOn(component.sessionEnded, 'emit');
    component.rdpSessionSub = new Subscription();
    const spySub = jest.spyOn(component.rdpSessionSub, 'unsubscribe');

    component.endSession();

    expect(spy).toHaveBeenCalled();
    expect(rdpService.endRdpConnection).toHaveBeenCalled();
    expect(spySub).toHaveBeenCalled();
  });

  test('should call close when clicking on "x"', () => {
    const spy = jest.spyOn(component, 'close');

    debugElement.query(By.css('.close')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith('Cross click');
  });

  test('should call endSession when clicking "End session" button', () => {
    const spy = jest.spyOn(component, 'endSession');

    debugElement.query(By.css('.modal-footer > .btn')).nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });

  test('should show connected when isConnected is true', () => {
    component.isConnected = true;

    fixture.detectChanges();

    const connected = debugElement.query(By.css('.connected'));
    const connecting = debugElement.query(By.css('.connecting'));
    const error = debugElement.query(By.css('.error'));
    expect(connected).toBeTruthy();
    expect(connecting).toBeFalsy();
    expect(error).toBeFalsy();
  });

  test('should show connecting when isConnected and isError is false', () => {
    component.isConnected = false;
    component.isError = false;

    fixture.detectChanges();

    const connected = debugElement.query(By.css('.connected'));
    const connecting = debugElement.query(By.css('.connecting'));
    const error = debugElement.query(By.css('.error'));
    expect(connected).toBeFalsy();
    expect(connecting).toBeTruthy();
    expect(error).toBeFalsy();
  });

  test('should show error when isConnected is false and isError is true', () => {
    component.isConnected = false;
    component.isError = true;

    fixture.detectChanges();

    const connected = debugElement.query(By.css('.connected'));
    const connecting = debugElement.query(By.css('.connecting'));
    const error = debugElement.query(By.css('.error'));
    expect(connected).toBeFalsy();
    expect(connecting).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test('should call startRdpSession and rabbit connect on init', () => {
    const session = getSessionFixture();
    component.session = session;
    const rdpSpy = jest.spyOn(component, 'startRdpSession');
    const rabbitPath = chance.string();
    jest
      .spyOn(configService, 'config', 'get')
      .mockReturnValue({ rabbitPath } as Config);

    fixture.detectChanges();

    expect(rdpSpy).toHaveBeenCalled();
    expect(rabbitService.connect).toHaveBeenCalledWith(session.id, rabbitPath);
  });

  test('startRdpSession should call createRdpConnection with session', () => {
    const session = getSessionFixture();
    component.session = session;

    component.startRdpSession();

    expect(rdpService.createRdpConnection).toHaveBeenCalledWith(
      session.address
    );
  });

  test('startRdpSession should set isConnected to true when value is emitted', () => {
    component.session = getSessionFixture();
    component.isConnected = null;
    rdpService.createRdpConnection.mockReturnValueOnce(
      new Observable((sub) => sub.next())
    );

    component.startRdpSession();

    expect(component.isConnected).toBeTruthy();
  });

  test('startRdpSession should set isError to true when error emitted', () => {
    component.session = getSessionFixture();
    component.isError = null;
    rdpService.createRdpConnection.mockReturnValueOnce(
      new Observable((sub) => sub.error())
    );

    component.startRdpSession();

    expect(component.isError).toBeTruthy();
  });

  test('startRdpSession should call endSession when complete emitted', () => {
    component.session = getSessionFixture();
    rdpService.createRdpConnection.mockReturnValueOnce(
      new Observable((sub) => sub.complete())
    );
    const spy = jest.spyOn(component, 'endSession');

    component.startRdpSession();

    expect(spy).toHaveBeenCalled();
  });
});
