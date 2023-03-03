import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokensComponent } from '@app/components/tokens/tokens.component';
import { KittiesComponent } from '@app/components/kitties/kitties.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: TokensComponent},
  { path: 'kitties', component: KittiesComponent },
  { path: '**', redirectTo: '/home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
