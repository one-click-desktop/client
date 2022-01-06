import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PathConstants } from '@constants/path-constants';
import { HomeComponent } from '@views/home/home.component';
import { LoginComponent } from '@views/login/login.component';
import { MainComponent } from '@views/main/main.component';
import { SettingsComponent } from '@views/settings/settings.component';

const routes: Routes = [
  {
    component: MainComponent,
    path: '',
    children: [
      {
        path: PathConstants.HOME,
        component: HomeComponent,
      },
      {
        path: PathConstants.SETTINGS,
        component: SettingsComponent,
      },
      { path: '', pathMatch: 'full', redirectTo: `/${PathConstants.LOGIN}` },
    ],
  },
  {
    component: LoginComponent,
    path: PathConstants.LOGIN,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `/${PathConstants.LOGIN}`,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
