import { Component, signal, WritableSignal } from '@angular/core';
import { Graph } from './features/graph/graph';
import { fetchChampions } from './core/champion.service';
import { Champion } from './model/champion.model';
import { Item } from './model/item.model';
import { fetchItems } from './core/item.service';

@Component({
  selector: 'app-root',
  imports: [Graph],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('lolgraph');
  champions: Champion[] = []
  items: Item[] = []
  
  async ngOnInit(): Promise<void> {
    try {
      this.champions = await fetchChampions()
      this.items = await fetchItems()
    } catch (error) {
      console.log('Error fetching items and/or champions', error)
    }
  }
}
