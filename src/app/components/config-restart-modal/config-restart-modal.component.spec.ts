import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Chance } from 'chance';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '@services/configuration/configuration.service';
import { ElectronService } from '@services/electron/electron.service';

import { ConfigRestartModalComponent } from './config-restart-modal.component';

jest.mock('@ng-bootstrap/ng-bootstrap');
jest.mock('@services/electron/electron.service');
jest.mock('@services/configuration/configuration.service');

const chance = new Chance();

describe('ConfigRestartModalComponent', () => {
  let component: ConfigRestartModalComponent;
  let fixture: ComponentFixture<ConfigRestartModalComponent>;
  let debugElement: DebugElement;

  let activeModal: MockedObject<NgbActiveModal>;
  let configService: MockedObject<ConfigurationService>;
  let electronService: MockedObject<ElectronService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigRestartModalComponent],
      providers: [NgbActiveModal, ConfigurationService, ElectronService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigRestartModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    activeModal = mocked(TestBed.inject(NgbActiveModal));
    electronService = mocked(TestBed.inject(ElectronService));
    configService = mocked(TestBed.inject(ConfigurationService));
    Object.defineProperty(configService, 'config', {
      set: jest.fn(),
    });
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('close should call activeModal close with message', () => {
    const message = chance.string();

    component.close(message);

    expect(activeModal.close).toHaveBeenCalledWith(message);
  });

  test('should set config and call relaunch on restart', () => {
    const config = { basePath: chance.string(), rabbitPath: chance.string() };
    component.config = config;
    const spy = jest.spyOn(configService, 'config', 'set');

    component.restart();

    expect(electronService.relaunch).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(config);
  });

  test('should call close when clicking on "x"', () => {
    const spy = jest.spyOn(component, 'close');

    debugElement.query(By.css('.close')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith('Cross click');
  });

  test('should call close when clicking cancel button', () => {
    const spy = jest.spyOn(component, 'close');

    debugElement.query(By.css('.cancel')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith('Cancel');
  });

  test('should call restart when clicking restart button', () => {
    const spy = jest.spyOn(component, 'restart');

    debugElement.query(By.css('.restart')).nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });
});
