import { Injectable } from '@angular/core';
import { Web3ModalService } from '@mindsorg/web3modal-angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  provider: any;
  $account: Subject<string> = new Subject<string>();
  $provider: Subject<any> = new Subject<any>();
  $connected: Subject<void> = new Subject<void>();

  constructor() {
    this.$provider.subscribe((provider: any) => {
      this.provider = provider;
      this.providerEventsListerner(provider);
      this.$account.next(provider.selectedAddress);
      this.$connected.next();
    }
    );
  }
  
  providerEventsListerner(provider: any) {
    provider.on('connect', () => {
      this.$connected.next();
      this.$account.next(provider.selectedAddress);
    });
    provider.on('disconnect', () => {
      this.$account.next('');
      this.$connected.next();
    });
  }

  get address(): string {
    return this.provider?.selectedAddress;
  }

  get connected(): boolean {
    return this.provider?.isConnected() && this.provider !== undefined;
  }
}
