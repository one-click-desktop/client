import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PathConstants } from '@constants/path-constants';

import { TopbarComponent } from './topbar.component';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let debugElement: DebugElement;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopbarComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: PathConstants.HOME,
            component: TopbarComponent,
          },
          {
            path: PathConstants.SETTINGS,
            component: TopbarComponent,
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();

    location = TestBed.inject(Location);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should show logo', () => {
    const logo = debugElement.query(By.css('.topbar-logo')).nativeElement;
    expect(logo.textContent).toBe('One Click Desktop');
  });

  test('should show home nav', () => {
    checkIfNavExists('Home');
  });

  test('should show settings nav', () => {
    checkIfNavExists('Settings');
  });

  test('should show logout nav', () => {
    checkIfNavExists('Log out');
  });

  function checkIfNavExists(name: string) {
    const navLinks = debugElement.queryAll(By.css('.nav-link'));
    expect(navLinks.map((nav) => nav.nativeElement.textContent)).toContain(
      name
    );
  }

  test('home should lead to home page', fakeAsync(() => {
    routerLinkTest('Settings', PathConstants.SETTINGS);
  }));

  test('settings should lead to settings page', fakeAsync(() => {
    routerLinkTest('Home', PathConstants.HOME);
  }));

  function routerLinkTest(name: string, path: string) {
    const routerLinkDebug = debugElement
      .queryAll(By.css('.nav-link'))
      .filter((nav) => nav.nativeElement.textContent === name)[0];
    const routerLink = routerLinkDebug.injector.get(RouterLinkWithHref);
    expect(routerLink['href']).toBe(`/${path}`);

    routerLinkDebug.nativeElement.click();

    tick();

    expect(location.path()).toBe(`/${path}`);
    expect(routerLinkDebug.nativeElement.classList).toContain('disabled');
  }

  test('should call logout service when clicked logout', () => {
    //TODO: add test after
  });
});
