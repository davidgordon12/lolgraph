import { Component, Input, input } from '@angular/core';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { Champion } from '../../model/champion.model';
import { Item } from '../../model/item.model';

@Component({
  selector: 'app-graph',
  imports: [Toolbar],
  templateUrl: './graph.html',
  styleUrl: './graph.css'
})

export class Graph {
  @Input() championList!: Champion[]
  @Input() itemList!: Item[]

  ngOnInit() {
    this.championList = []
  }
}