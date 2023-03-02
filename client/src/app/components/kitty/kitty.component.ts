import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kitty',
  templateUrl: './kitty.component.html',
  styleUrls: ['./kitty.component.scss']
})
export class KittyComponent {
  @Input() kitty = {};
}
