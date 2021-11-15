import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Chance } from 'chance';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getMachineTypeFixture, getSessionFixture } from '@testing/fixtures';

import { ConnectModalComponent } from './connect-modal.component';

jest.mock('@ng-bootstrap/ng-bootstrap');

const chance = new Chance();

describe('ConnectModalComponent', () => {
  let component: ConnectModalComponent;
  let fixture: ComponentFixture<ConnectModalComponent>;
  let debugElement: DebugElement;
  let activeModal: MockedObject<NgbActiveModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectModalComponent],
      providers: [NgbActiveModal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    activeModal = mocked(TestBed.inject(NgbActiveModal), false);
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

  describe('Select machine type step', () => {
    test('typeSelected should set selectedType and set step to one', () => {
      const type = getMachineTypeFixture();
      component.selectedType = null;
      component.step = null;

      component.typeSelected(type);

      expect(component.selectedType).toBe(type);
      expect(component.step).toBe(1);
    });

    test('should show selectMachineTypeModal when step is zero', () => {
      component.step = 0;

      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-select-machine-type-modal'));
      expect(elem).toBeTruthy();
    });

    test('should not show selectMachineTypeModal when step is not zero', () => {
      component.step = chance.natural({ exclude: [0] });

      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-select-machine-type-modal'));
      expect(elem).toBeFalsy();
    });

    test('should call close with message when closeModal event raised', () => {
      const message = chance.string();
      const spy = jest.spyOn(component, 'close');
      component.step = 0;
      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-select-machine-type-modal'));
      elem.triggerEventHandler('closeModal', message);

      expect(spy).toHaveBeenCalledWith(message);
    });

    test('should call typeSelected with type when typeSelected event raised', () => {
      const type = getMachineTypeFixture();
      const spy = jest.spyOn(component, 'typeSelected');
      component.step = 0;
      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-select-machine-type-modal'));
      elem.triggerEventHandler('typeSelected', type);

      expect(spy).toHaveBeenCalledWith(type);
    });
  });

  describe('Creating session step', () => {
    test('sessionCreated should set session and set step to two', () => {
      const session = getSessionFixture();
      component.session = null;
      component.step = null;

      component.sessionCreated(session);

      expect(component.session).toBe(session);
      expect(component.step).toBe(2);
    });

    test('should show creatingSessionModal when step is one', () => {
      component.step = 1;

      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-creating-session-modal'));
      expect(elem).toBeTruthy();
    });

    test('should not show creatingSessionModal when step is not one', () => {
      component.step = chance.natural({ exclude: [1] });

      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-creating-session-modal'));
      expect(elem).toBeFalsy();
    });

    test('should call close with message when closeModal event raised', () => {
      const message = chance.string();
      const spy = jest.spyOn(component, 'close');
      component.step = 1;
      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-creating-session-modal'));
      elem.triggerEventHandler('closeModal', message);

      expect(spy).toHaveBeenCalledWith(message);
    });

    test('should call typeSelected with type when typeSelected event raised', () => {
      const session = getSessionFixture();
      const spy = jest.spyOn(component, 'sessionCreated');
      component.step = 1;
      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-creating-session-modal'));
      elem.triggerEventHandler('sessionReady', session);

      expect(spy).toHaveBeenCalledWith(session);
    });
  });

  describe('RDP connection step', () => {
    test('sessionEnded should call close', () => {
      const spy = jest.spyOn(component, 'close');
      component.sessionEnded();

      expect(spy).toHaveBeenCalled();
    });

    test('should show rdpConnectionModal when step is two', () => {
      component.step = 2;

      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-rdp-connection-modal'));
      expect(elem).toBeTruthy();
    });

    test('should not show rdpConnectionModal when step is not one', () => {
      component.step = chance.natural({ exclude: [2] });

      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-rdp-connection-modal'));
      expect(elem).toBeFalsy();
    });

    test('should call close with message when closeModal event raised', () => {
      const message = chance.string();
      const spy = jest.spyOn(component, 'close');
      component.step = 2;
      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-rdp-connection-modal'));
      elem.triggerEventHandler('closeModal', message);

      expect(spy).toHaveBeenCalledWith(message);
    });

    test('should call sessionEnded when sessionEnded event raised', () => {
      const spy = jest.spyOn(component, 'sessionEnded');
      component.step = 2;
      fixture.detectChanges();

      const elem = debugElement.query(By.css('app-rdp-connection-modal'));
      elem.triggerEventHandler('sessionEnded', {});

      expect(spy).toHaveBeenCalled();
    });
  });
});
