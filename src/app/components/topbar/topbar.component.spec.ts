import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

import { TopbarComponent } from './topbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterLinkWithHref, RouterOutlet } from '@angular/router';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let debugElement: DebugElement;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopbarComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'home',
            component: TopbarComponent,
          },
          {
            path: 'settings',
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
    expect(logo.textContent).toEqual('One Click Desktop');
  });

  test('should show home nav', () => {
    const navLinks = debugElement.queryAll(By.css('.nav-link'));
    expect(navLinks.map((nav) => nav.nativeElement.textContent)).toContain(
      'Home'
    );
  });

  test('should show settings nav', () => {
    const navLinks = debugElement.queryAll(By.css('.nav-link'));
    expect(navLinks.map((nav) => nav.nativeElement.textContent)).toContain(
      'Settings'
    );
  });

  test('should show logout nav', () => {
    const navLinks = debugElement.queryAll(By.css('.nav-link'));
    expect(navLinks.map((nav) => nav.nativeElement.textContent)).toContain(
      'Log out'
    );
  });

  test('home should lead to home page', fakeAsync(() => {
    const routerLinkDebug = debugElement
      .queryAll(By.css('.nav-link'))
      .filter((nav) => nav.nativeElement.textContent === 'Home')[0];
    const routerLink = routerLinkDebug.injector.get(RouterLinkWithHref);
    expect(routerLink['href']).toEqual('/home');

    routerLinkDebug.nativeElement.click();

    tick();

    expect(location.path()).toEqual('/home');
    expect(routerLinkDebug.nativeElement.classList).toContain('disabled');
  }));

  test('settings should lead to settings page', fakeAsync(() => {
    const routerLinkDebug = debugElement
      .queryAll(By.css('.nav-link'))
      .filter((nav) => nav.nativeElement.textContent === 'Settings')[0];
    const routerLink = routerLinkDebug.injector.get(RouterLinkWithHref);
    expect(routerLink['href']).toEqual('/settings');

    routerLinkDebug.nativeElement.click();

    tick();

    expect(location.path()).toEqual('/settings');
    expect(routerLinkDebug.nativeElement.classList).toContain('disabled');
  }));

  test('should call logout service when clicked logout', () => {
    //TODO
  });
});
