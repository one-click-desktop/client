import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { PathConstants } from '@constants/path-constants';
import { Config } from '@models/config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '@services/configuration/configuration.service';
import { getConfigFixture } from '@testing/fixtures';

import { SettingsComponent } from './settings.component';

jest.mock('@services/configuration/configuration.service');
jest.mock('@ng-bootstrap/ng-bootstrap');
jest.mock('@angular/router');

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let configService: MockedObject<ConfigurationService>;
  let modalService: MockedObject<NgbModal>;
  let router: MockedObject<Router>;

  let config: Config;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SettingsComponent],
      providers: [Router, NgbModal, ConfigurationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    modalService = mocked(TestBed.inject(NgbModal));
    router = mocked(TestBed.inject(Router));
    configService = mocked(TestBed.inject(ConfigurationService));
    Object.defineProperty(configService, 'config', {
      get: jest.fn(),
      set: jest.fn(),
    });

    config = getConfigFixture();
    jest.spyOn(configService, 'config', 'get').mockReturnValueOnce(config);
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('should load config on init', () => {
    fixture.detectChanges();

    expect(component.config).toBe(config);
  });

  test('onSubmit should save config and navigate if restart not needed', () => {
    const spy = jest.spyOn(configService, 'config', 'set');
    component.config = config;
    const modal = { componentInstance: { config: null } };
    modalService.open.mockReturnValue(modal as any);

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(config);
    expect(router.navigate).toHaveBeenCalledWith([PathConstants.HOME]);
  });

  test('onSubmit should call modalService if restart needed', () => {
    component.config = getConfigFixture();
    modalService.open.mockReturnValue(null);

    component.onSubmit();

    expect(modalService.open).toHaveBeenCalled();
  });

  test('onSubmit should set modal config if created', () => {
    config = getConfigFixture();
    component.config = config;
    const modal = { componentInstance: { config: null } };
    modalService.open.mockReturnValue(modal as any);

    component.onSubmit();

    expect(modalService.open).toHaveBeenCalled();
    expect(modal.componentInstance.config).toBe(config);
  });
});
