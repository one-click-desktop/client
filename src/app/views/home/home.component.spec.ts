import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Chance } from 'chance';
import { of, throwError } from 'rxjs';
import { MockedObject } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MachinesService } from '@one-click-desktop/api-module';
import { getMachineFixture } from '@testing/fixtures';

import { HomeComponent } from './home.component';

const chance = new Chance();

jest.mock('@one-click-desktop/api-module');
jest.mock('@ng-bootstrap/ng-bootstrap');

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let machinesService: MockedObject<MachinesService>;
  let modalService: MockedObject<NgbModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [MachinesService, NgbModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    machinesService = mocked(TestBed.inject(MachinesService), false);
    machinesService.getMachines.mockImplementation(() => of(null));

    modalService = mocked(TestBed.inject(NgbModal), false);
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('DOM tests', () => {
    test('should show amount of available machines', () => {
      fixture.detectChanges();

      const value = chance.natural({ min: 1 });
      component.machines = [getMachineFixture({ amount: value })];

      fixture.detectChanges();

      const displayedValue = getValueNativeElement().textContent;
      expect(+displayedValue).toBe(value);
    });

    test('should give entry-value class zero if value is falsy', () => {
      fixture.detectChanges();

      component.machines = [getMachineFixture({ amount: 0 })];

      fixture.detectChanges();

      expect(getValueNativeElement().classList).toContain(
        'machines-entry-value-zero'
      );
    });

    function getValueNativeElement(): any {
      return debugElement.query(
        By.css('.machines-entry > .machines-entry-value')
      ).nativeElement;
    }

    test('should call refresh when clicking refresh button', () => {
      const spy = jest.spyOn(component, 'refresh');

      debugElement.query(By.css('.home-refresh')).nativeElement.click();

      expect(spy).toHaveBeenCalled();
    });

    test('should call connect when clicking connect button', () => {
      const spy = jest.spyOn(component, 'connect');

      debugElement.query(By.css('.home-connect')).nativeElement.click();

      expect(spy).toHaveBeenCalled();
    });

    test('refresh should be disabled if canRefresh is false', () => {
      component.canRefresh = false;

      fixture.detectChanges();
      const button = debugElement.query(By.css('.home-refresh')).nativeElement;

      expect(button.disabled).toBeTruthy();
    });

    test('connect should be disabled if canConnect is false', () => {
      component.canConnect = false;

      fixture.detectChanges();
      const button = debugElement.query(By.css('.home-connect')).nativeElement;

      expect(button.disabled).toBeTruthy();
    });

    test('should show noMachines when no machines returned', () => {
      machinesService.getMachines.mockReturnValueOnce(of(null));

      fixture.detectChanges();

      const elem = debugElement.query(By.css('.no-machines'));
      expect(elem).toBeTruthy();
    });

    test('should not show noMachines when machines returned', () => {
      const ret = [{ type: 'cpu', amount: 0 }];
      machinesService.getMachines.mockReturnValueOnce(of(ret as any));

      fixture.detectChanges();

      const elem = debugElement.query(By.css('.no-machines'));
      expect(elem).toBeFalsy();
    });
  });

  describe('Code tests', () => {
    test('should call getAvailableMachines on init', () => {
      const spy = jest.spyOn(component, 'getAvailableMachines');

      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });

    test('getAvailableMachines should call machines service and save response', () => {
      fixture.detectChanges();

      const value = chance.natural({ min: 1 });
      const ret = [{ type: 'cpu', amount: value }];

      machinesService.getMachines.mockReturnValueOnce(of(ret as any));
      component.getAvailableMachines();

      fixture.detectChanges();

      expect(machinesService.getMachines).toHaveBeenCalled();
      expect(component.machines).toBe(ret);
    });

    test('refresh should set canRefresh to false', () => {
      component.canRefresh = true;

      component.refresh();

      expect(component.canRefresh).toBeFalsy();
    });

    test('connect should call ngbModal open', () => {
      modalService.open.mockReturnValueOnce({
        componentInstance: { availableTypes: null },
      } as any);

      component.connect();

      expect(modalService.open).toHaveBeenCalled();
    });

    test('connect should set available modal availableTypes to machineTypes with amount geater than 0', () => {
      const modal = {
        componentInstance: { availableTypes: null },
      };
      modalService.open.mockReturnValueOnce(modal as any);
      const value = chance.natural({ min: 1 });
      component.machines = [
        getMachineFixture({ amount: value }),
        getMachineFixture({ amount: 0 }),
      ];

      component.connect();

      expect(modal.componentInstance.availableTypes.length).toBe(1);
    });

    test('should set machines to empty array if subscribe error', () => {
      machinesService.getMachines.mockReturnValueOnce(throwError(''));

      component.getAvailableMachines();

      expect(component.machines.length).toBe(0);
    });

    test('should set canConnect to true if any machine available', () => {
      const value = chance.natural({ min: 1 });
      const ret = [{ type: 'cpu', amount: value }];
      machinesService.getMachines.mockReturnValueOnce(of(ret as any));
      component.canConnect = false;

      component.getAvailableMachines();

      expect(component.canConnect).toBeTruthy();
    });

    test('should set canConnect to false if no machine available', () => {
      const ret = [{ type: 'cpu', amount: 0 }];
      machinesService.getMachines.mockReturnValueOnce(of(ret as any));
      component.canConnect = true;

      component.getAvailableMachines();

      expect(component.canConnect).toBeFalsy();
    });

    test('should set canConnect to false if array empty', () => {
      const ret = [];
      machinesService.getMachines.mockReturnValueOnce(of(ret as any));
      component.canConnect = true;

      component.getAvailableMachines();

      expect(component.canConnect).toBeFalsy();
    });

    test('should set canRefresh to true after REFRESH_COUNTDOWN and not after another', () => {
      jest.useFakeTimers();
      component.canRefresh = false;

      component.getAvailableMachines();
      jest.advanceTimersToNextTimer();

      expect(component.canRefresh).toBeTruthy();

      component.canRefresh = false;
      jest.advanceTimersToNextTimer();

      expect(component.canRefresh).toBeFalsy();
      jest.useRealTimers();
    });
  });
});
