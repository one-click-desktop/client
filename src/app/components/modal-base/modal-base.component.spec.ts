import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chance } from 'chance';
import { ModalBaseComponent } from './modal-base.component';

const chance = new Chance();

describe('ModalBaseComponent', () => {
  let component: ModalBaseComponent;
  let fixture: ComponentFixture<ModalBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalBaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('close should call closeModal emit with message', () => {
    const spy = jest.spyOn(component.closeModal, 'emit');
    const message = chance.string();

    component.close(message);

    expect(spy).toHaveBeenCalledWith(message);
  });

  test('closeModal should emit message', () => {
    const message = chance.string();

    component.closeModal.subscribe((str) => expect(str).toBe(message));

    component.closeModal.emit(message);
  });
});
