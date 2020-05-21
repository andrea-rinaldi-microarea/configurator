import { DataSheetComponent } from '../ui/data-sheet/data-sheet.component';
import { IndustryEditComponent } from './../ui/industry-edit/industry-edit.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
      path: '',
      component: IndustryEditComponent,
  },
  {
    path: 'industry-edit',
    component: IndustryEditComponent,
  },
  {
      path: 'data-sheet',
      component: DataSheetComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
      RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
