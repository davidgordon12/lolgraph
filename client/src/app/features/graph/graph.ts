import { Component, Input, WritableSignal, signal } from '@angular/core';
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

    allyChampion: WritableSignal<Champion> = signal(undefined as any)
    allyItems: WritableSignal<Map<string, Item>> = signal(new Map())

    enemyChampion: WritableSignal<Champion> = signal(undefined as any)
    enemyItems: WritableSignal<Map<string, Item>> = signal(new Map())

    focusGraph(): void {
        document.getElementById('ally-champion-toolbar')!.style.display = 'none'
        document.getElementById('enemy-champion-toolbar')!.style.display = 'none'
        document.getElementById('ally-item-toolbar')!.style.display = 'none'
        document.getElementById('enemy-item-toolbar')!.style.display = 'none'
    }
}
