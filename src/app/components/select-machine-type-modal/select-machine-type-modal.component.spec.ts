import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MachineType } from '@one-click-desktop/api-module';

import { SelectMachineTypeModalComponent } from './select-machine-type-modal.component';

describe('ConnectModalComponent', () => {
  let component: SelectMachineTypeModalComponent;
  let fixture: ComponentFixture<SelectMachineTypeModalComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SelectMachineTypeModalComponent],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMachineTypeModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('isDisabled should return true if type is not in availableTypes list', () => {
    component.availableTypes = ['cpu'];

    const disabled = component.isDisabled('gpu');

    expect(disabled).toBeTruthy();
  });

  test('isDisabled should return false if type is in availableTypes list', () => {
    component.availableTypes = ['gpu'];

    const disabled = component.isDisabled('gpu');

    expect(disabled).toBeFalsy();
  });

  test('isDisabled should return true if availableTypes is null', () => {
    component.availableTypes = null;

    const disabled = component.isDisabled('gpu');

    expect(disabled).toBeTruthy();
  });

  test('should set machineTypes to key value list from MachineType', () => {
    const keys = component.machineTypes.map((type) => type.key);
    const values = component.machineTypes.map((type) => type.value);

    expect(keys).toEqual(Object.keys(MachineType));
    expect(values).toEqual(Object.values(MachineType));
  });

  test('should call close when clicking on "x"', () => {
    const spy = jest.spyOn(component, 'close');

    debugElement.query(By.css('.close')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith('Cross click');
  });

  test('should show all machineTypes as radio buttons', () => {
    component.machineTypes = [
      { key: '', value: 'cpu' },
      { key: '', value: 'gpu' },
    ];

    fixture.detectChanges();

    const radios = debugElement.queryAll(By.css('input[type=radio]'));

    expect(radios.length).toBe(component.machineTypes.length);
  });

  test('onSubmit should call typeSelected emit with selected type', () => {
    const spy = jest.spyOn(component.typeSelected, 'emit');
    const type = MachineType.Cpu;
    component.type = type;

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(type);
  });

  test('typeSelected should emit type', (done) => {
    const type = MachineType.Cpu;

    component.typeSelected.subscribe((t) => {
      expect(t).toBe(type);
      done();
    });

    component.typeSelected.emit(type);
  });
});
