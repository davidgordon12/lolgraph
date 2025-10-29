import { Component, Input } from '@angular/core';
import { Model } from '../../model/model';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.html',
  styleUrl: './item.css'
})
export class ItemViewmodel {
  @Input() item!: Model
}
