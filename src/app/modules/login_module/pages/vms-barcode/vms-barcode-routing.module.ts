import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VmsBarcodePage } from './vms-barcode.page';

const routes: Routes = [
  {
    path: '',
    component: VmsBarcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VmsBarcodePageRoutingModule {}
