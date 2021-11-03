import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@views/home/home.component';
import { LoginComponent } from '@views/login/login.component';
import { MainComponent } from '@views/main/main.component';

const routes: Routes = [
  {
    component: MainComponent,
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'settings',
        component: HomeComponent,
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
    ],
  },
  {
    component: LoginComponent,
    path: 'login',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
