import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Kitty } from '@app/interface/kitty';
import { KittyHatComponent } from '@app/components/kitty-hat/kitty-hat.component';
import { CommunicationService } from '@app/services/communication/communication.service';
import { KittiesManagerService } from '@app/services/kitties-manager/kitties-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from '@app/services/wallet/wallet.service';
@Component({
  selector: 'app-kitties',
  templateUrl: './kitties.component.html',
  styleUrls: ['./kitties.component.scss'],
})
export class KittiesComponent {
  kitties: Kitty[] = [];
  type = 'all';
  constructor(
    private dialog: MatDialog,
    public kittiesManager: KittiesManagerService,
    ) {
    this.kitties = [];
    this.kittiesManager.$kitty.subscribe((kitty: Kitty) => {
      this.kitties.push(kitty);
    });
    this.kittiesManager.getAllHatsKitties();
  }

  nextPage() {
    this.kitties = [];
    this.kittiesManager.next();
  }

  previousPage() {
    this.kitties = [];
    this.kittiesManager.previous();
  }

  openDetails(kitty: string) {
    this.dialog.open(KittyHatComponent, { data: { address: kitty } });
  }

  changeTypePage(type: string) {
    this.kitties = [];
    if (type === 'all') {
      this.kittiesManager.getAllHatsKitties();
    } else {
      this.kittiesManager.getWalletKitties();
    }
  }

}
