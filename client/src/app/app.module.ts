import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { TokenComponent } from '@app/components/token/token.component';
import { AppMaterialModule } from './modules/material.module';
import { TokensComponent } from './components/tokens/tokens.component';

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    TokensComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
