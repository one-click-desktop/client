import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MachineType } from '@api-module/model/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';
import { ConnectModalComponent } from './connect-modal.component';

jest.mock('@ng-bootstrap/ng-bootstrap');

describe('ConnectModalComponent', () => {
  let component: ConnectModalComponent;
  let fixture: ComponentFixture<ConnectModalComponent>;
  let debugElement: DebugElement;
  let activeModal: MockedObject<NgbActiveModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ConnectModalComponent],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    activeModal = mocked(TestBed.inject(NgbActiveModal), false);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('close should call activeModal close', () => {
    component.close();

    expect(activeModal.close).toHaveBeenCalled();
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
});
