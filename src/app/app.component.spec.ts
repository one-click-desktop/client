import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ElectronService } from 'ngx-electron';

let electronService = new ElectronService();

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [{ provide: ElectronService, useValue: electronService }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'one-click-desktop-client'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('one-click-desktop-client');
  });

  it(`should render title 'Electron Application' when isElectronApp is true`, () => {
    const spy = jest
      .spyOn(electronService, 'isElectronApp', 'get')
      .mockReturnValue(true);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(spy).toHaveBeenCalled();
    expect(compiled.querySelector('p')?.textContent).toContain(
      'Electron Application'
    );
  });

  it(`should render title 'Standard Angular Web Application' when isElectronApp is false`, () => {
    const spy = jest
      .spyOn(electronService, 'isElectronApp', 'get')
      .mockReturnValue(false);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(spy).toHaveBeenCalled();
    expect(compiled.querySelector('p')?.textContent).toContain(
      'Standard Angular Web Application'
    );
  });
});
