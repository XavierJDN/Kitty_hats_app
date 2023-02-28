import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() author: string = "";
  @Output() owner: string  = "";
  authors: string[] = []
  owners: string[] = []

  form: FormGroup = new FormGroup({
    author: new FormControl("", Validators.required),
    owner: new FormControl("", Validators.required),
  })

  isFormChanged() {
    return this.owner === this.form.get('author')?.value || this.owner === this.form.get('owner')?.value;
  }

  updateView(){
    if(this.isFormChanged()){
      return;
    } 
    this.author = this.form.get('author')?.value;
    this.owner = this.form.get('owner')?.value;
  }
}