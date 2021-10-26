import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MachinesService } from '@services/machines.service';
import { Chance } from 'chance';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';

const chance = new Chance();

jest.useFakeTimers();

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let machinesService: any;

  beforeEach(async () => {
    machinesService = {
      getAvailableMachines: jest.fn((x) => of()),
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: MachinesService, useValue: machinesService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('should show amount of available cpu machines', () => {
    fixture.detectChanges();

    const value = chance.natural({ min: 1 });
    component.availableCpu = value;

    fixture.detectChanges();

    const displayedValue = getValueNativeElement('cpu').textContent;
    expect(+displayedValue).toBe(value);
  });

  test('should show amount of available gpu machines', () => {
    fixture.detectChanges();

    const value = chance.natural({ min: 1 });
    component.availableGpu = value;

    fixture.detectChanges();

    const displayedValue = getValueNativeElement('gpu').textContent;
    expect(+displayedValue).toBe(value);
  });

  test('should give cpu entry-value class zero if value is falsy', () => {
    fixture.detectChanges();

    component.availableCpu = 0;

    fixture.detectChanges();

    expect(getValueNativeElement('cpu').classList).toContain(
      'machines-entry-value-zero'
    );
  });

  test('should give gpu entry-value class zero if value is falsy', () => {
    fixture.detectChanges();

    component.availableGpu = 0;

    fixture.detectChanges();

    expect(getValueNativeElement('gpu').classList).toContain(
      'machines-entry-value-zero'
    );
  });

  function getValueNativeElement(name: string): any {
    return debugElement.query(
      By.css(`.machines-entry-${name} > .machines-entry-value`)
    ).nativeElement;
  }

  test('should call machines service on init and save response', () => {
    const cpuValue = chance.natural({ min: 1 });
    const gpuValue = chance.natural({ min: 1 });
    machinesService.getAvailableMachines.mockReturnValueOnce(
      of({ cpu: cpuValue, gpu: gpuValue })
    );

    fixture.detectChanges();

    expect(machinesService.getAvailableMachines).toHaveBeenCalled();
    expect(component.availableCpu).toBe(cpuValue);
    expect(component.availableGpu).toBe(gpuValue);
  });

  test('getAvailableMachines should call machines service and save response', () => {
    fixture.detectChanges();

    expect(component.availableCpu).toBe(0);
    expect(component.availableGpu).toBe(0);

    const cpuValue = chance.natural({ min: 1 });
    const gpuValue = chance.natural({ min: 1 });
    machinesService.getAvailableMachines.mockReturnValueOnce(
      of({ cpu: cpuValue, gpu: gpuValue })
    );
    component.getAvailableMachines();

    fixture.detectChanges();

    expect(machinesService.getAvailableMachines).toHaveBeenCalled();
    expect(component.availableCpu).toBe(cpuValue);
    expect(component.availableGpu).toBe(gpuValue);
  });

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

  test('refresh should set canRefresh to false', () => {
    component.canRefresh = true;

    expect(component.canRefresh).toBeTruthy();
    debugElement.query(By.css('.home-refresh')).nativeElement.click();

    expect(component.canRefresh).toBeFalsy();
  });

  test('should set both values to 0 if subscribe error', () => {
    component.availableCpu = chance.natural({ min: 1 });
    component.availableGpu = chance.natural({ min: 1 });

    expect(component.availableCpu === 0).toBeFalsy();
    expect(component.availableGpu === 0).toBeFalsy();

    machinesService.getAvailableMachines.mockReturnValueOnce(throwError(''));

    component.getAvailableMachines();

    expect(component.availableCpu).toBe(0);
    expect(component.availableGpu).toBe(0);
  });

  test('should set canConnect to true if any machine available', () => {
    const cpuValue = chance.natural({ min: 1 });
    const gpuValue = chance.natural({ min: 1 });
    machinesService.getAvailableMachines.mockReturnValueOnce(
      of({ cpu: cpuValue, gpu: gpuValue })
    );
    component.canConnect = false;
    component.getAvailableMachines();

    expect(component.canConnect).toBeTruthy();
  });

  test('should set canConnect to false if no machine available', () => {
    machinesService.getAvailableMachines.mockReturnValueOnce(
      of({ cpu: 0, gpu: 0 })
    );
    component.canConnect = true;
    component.getAvailableMachines();

    expect(component.canConnect).toBeFalsy();
  });
});
