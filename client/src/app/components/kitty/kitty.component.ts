import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KittyDetailsComponent } from '../kitty-details/kitty-details.component';

@Component({
  selector: 'app-kitty',
  templateUrl: './kitty.component.html',
  styleUrls: ['./kitty.component.scss']
})
export class KittyComponent {
  constructor(private dialog: MatDialog) { }
  @Input() kitty = {
    address: '',
    name: '',
    img: '',
    owner: '',
  };
  @Input() isOwned = false;

  openDetails() {
    this.dialog.open(KittyDetailsComponent, { 
      data: this.kitty
    });
  }

}
