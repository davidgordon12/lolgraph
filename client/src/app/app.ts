import { Component, signal, WritableSignal } from '@angular/core';
import { Graph } from './features/graph/graph';
import { fetchChampions } from './core/champion.service';
import { Champion } from './model/champion.model';

@Component({
  selector: 'app-root',
  imports: [Graph],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
  champions: WritableSignal<Champion[] | null> = signal(null);
  
  async ngOnInit(): Promise<void> {
    try {
      const championList = await fetchChampions()
      this.champions.set(championList)
    } catch (error) {
      console.log('Error fetching champions', error)
    }
  }
}
