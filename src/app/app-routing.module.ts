import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./line/line.module').then(m => m.LineModule),
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then(m => m.ViewModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
