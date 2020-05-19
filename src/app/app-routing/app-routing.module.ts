import { FeaturesSheetComponent } from './../ui/features-sheet/features-sheet.component';
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
      path: 'features-sheet',
      component: FeaturesSheetComponent,
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
