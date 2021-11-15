import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getMachineTypeFixture } from '@testing/fixtures';

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

  test('should call close when clicking on "x"', () => {
    const spy = jest.spyOn(component, 'close');

    debugElement.query(By.css('.close')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith('Cross click');
  });

  test('should show all machineTypes as radio buttons', () => {
    component.availableTypes = [
      getMachineTypeFixture(),
      getMachineTypeFixture(),
    ];

    fixture.detectChanges();

    const radios = debugElement.queryAll(By.css('input[type=radio]'));

    expect(radios.length).toBe(component.availableTypes.length);
  });

  test('onSubmit should call typeSelected emit with selected type', () => {
    const spy = jest.spyOn(component.typeSelected, 'emit');
    const type = getMachineTypeFixture();
    component.type = type;

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(type);
  });

  test('typeSelected should emit type', (done) => {
    const type = getMachineTypeFixture();

    component.typeSelected.subscribe((t) => {
      expect(t).toBe(type);
      done();
    });

    component.typeSelected.emit(type);
  });
});
