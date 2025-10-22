import { Component, Input} from '@angular/core';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Champion } from '../../model/champion.model';
import { Item } from '../../model/item.model';

@Component({
  selector: 'app-graph',
  imports: [Toolbar, Sidebar],
  templateUrl: './graph.html',
  styleUrl: './graph.css'
})

export class Graph {
  @Input() championList!: Champion[]
  @Input() itemList!: Item[]
}
