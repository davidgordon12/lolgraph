import { Component, inject, Input, signal } from '@angular/core';
import { Graph } from './features/graph/graph';
import { Champion } from './model/champion.model';
import { Item } from './model/item.model';
import { ChampionService, ItemService } from './core';

@Component({
  selector: 'app-root',
  imports: [Graph],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private championService = inject(ChampionService)
  private itemService = inject(ItemService)

  champions: Champion[] = []
  items: Item[] = []

  async ngOnInit(): Promise<void> {
    const [champs, items] = await Promise.all([
      this.championService.fetchChampions(),
      this.itemService.fetchItems(),
    ])

    this.champions = champs
    this.items = items
  }
}
