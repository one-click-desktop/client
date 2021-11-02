import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MachineType } from '@api-module/model/models';
import { Chance } from 'chance';

import { RdpConnectionModalComponent } from './rdp-connection-modal.component';

const chance = new Chance();

describe('RdpConnectionModalComponent', () => {
  let component: RdpConnectionModalComponent;
  let fixture: ComponentFixture<RdpConnectionModalComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RdpConnectionModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdpConnectionModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('endSession should call sessionEnded emit', () => {
    const spy = jest.spyOn(component.sessionEnded, 'emit');

    component.endSession();

    expect(spy).toHaveBeenCalled();
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
});
