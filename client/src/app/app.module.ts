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
import { Web3ModalModule, Web3ModalService } from '@mindsorg/web3modal-angular';

import { TokensComponent } from './components/tokens/tokens.component';
import { TokenComponent } from '@app/components/token/token.component';
import { KittyComponent } from './components/kitty/kitty.component';
import { KittiesComponent } from './components/kitties/kitties.component';
import { KittyHatComponent } from './components/kitty-hat/kitty-hat.component';
import { HeaderComponent } from './components/header/header.component';
import { IProviderInfo } from '@mindsorg/web3modal-angular/lib/web3modal-ts/src';
import { CommonModule } from '@angular/common';
import { KittyDetailsComponent } from './components/kitty-details/kitty-details.component';


export const METAMASK: IProviderInfo = {
  id: 'injected',
  name: 'MetaMask',
  logo: '',
  type: 'injected',
  check: 'isMetaMask',
};

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    TokensComponent,
    SearchBarComponent,
    KittyComponent,
    KittiesComponent,
    KittyHatComponent,
    HeaderComponent,
    KittyDetailsComponent
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
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [{provide: Web3ModalService, useFactory: () => {
    return new Web3ModalService();
  }}],
  bootstrap: [AppComponent]
})
export class AppModule { }
