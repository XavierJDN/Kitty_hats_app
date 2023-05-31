import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Web3ModalModule } from '@mindsorg/web3modal-angular';

import { TokensComponent } from './components/tokens/tokens.component';
import { TokenComponent } from '@app/components/token/token.component';
import { KittyComponent } from './components/kitty/kitty.component';
import { KittiesComponent } from './components/kitties/kitties.component';
import { KittyHatComponent } from './components/kitty-hat/kitty-hat.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    TokensComponent,
    SearchBarComponent,
    KittyComponent,
    KittiesComponent,
    KittyHatComponent,
    HeaderComponent
  ],
  imports: [
    Web3ModalModule,
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
