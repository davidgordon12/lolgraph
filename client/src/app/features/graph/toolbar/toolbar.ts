import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {
  title = input.required<string>();
  items = signal([
    {id: 1, name: 'Champions'},
    {id: 2, name: 'Items'},
    {id: 3, name: 'Runes'},
  ]);
}
