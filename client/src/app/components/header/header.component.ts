import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WalletService } from '@app/services/wallet/wallet.service';
import { Web3ModalService } from '@mindsorg/web3modal-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() typePage: string = '';
  @Output() typePageChange = new EventEmitter<string>();
  account: string = '';
  connected: boolean = false;
  constructor(private web3Modal: Web3ModalService, private wallet: WalletService) {
    wallet.$account.subscribe((account: string) => this.account = account);
    wallet.$connected.subscribe(() => this.connected = !this.connected);
  }

  ngOnInit(): void {
  }

  openModal(){
    this.web3Modal.open().then((provider: any) => this.wallet.$provider.next(provider));
  }
}
