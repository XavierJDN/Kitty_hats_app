import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AvailableFilterService } from '@app/services/avalaible-filter/available-filter.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Output() author = new EventEmitter<string>();
  @Output() owner = new EventEmitter<string>();

  authors: string[] = [];
  owners: string[] = [];
  filter = { owner: '', author: '' };

  form: FormGroup = new FormGroup({
    author: new FormControl('', Validators.required),
    owner: new FormControl('', Validators.required),
  });

  constructor(private availableFilter: AvailableFilterService) {
    this.availableFilter.authors.subscribe((authors: string[]) => {
      this.authors = authors;
    });
    this.availableFilter.owners.subscribe((owners: string[]) => {
      this.owners = owners;
    });
  }

  isFormChanged() {
    return (
      this.filter.author !== this.form.get('author')?.value ||
      this.filter.owner !== this.form.get('owner')?.value ||
      this.filter.author !== '' ||
      this.filter.owner !== ''
    );
  }

  updateView() {
    if (this.isFormChanged()) {
      return;
    }
    this.author.emit(this.form.get('author')?.value);
    this.owner.emit(this.form.get('owner')?.value);
  }
}
