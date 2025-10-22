import { Component, input, signal } from '@angular/core';
import { Model } from '../../model/model';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {
  resource = input.required<string>()
  items = input.required<Model[]>();

  toolbarItemClicked(item: Model): void {
    console.log("Clicked on " + item.name)
  }
}
