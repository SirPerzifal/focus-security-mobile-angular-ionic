import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoachesModulePage } from './coaches-module.page';

const routes: Routes = [
  {
    path: '',
    component: CoachesModulePage
  },
  {
    path: 'coaches-form',
    loadChildren: () => import('../coaches-module/coaches-form/coaches-form.module').then( m => m.CoachesFormPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachesModulePageRoutingModule {}
