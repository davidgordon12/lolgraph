import { Component, Input, WritableSignal, inject, signal } from '@angular/core';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Champion } from '../../model/champion.model';
import { Item } from '../../model/item.model';
import { DPSService } from '../../core/dps.service';

@Component({
    selector: 'app-graph',
    imports: [Toolbar, Sidebar],
    templateUrl: './graph.html',
    styleUrl: './graph.css'
})

export class Graph {
    @Input() championList!: Champion[]
    @Input() itemList!: Item[]

    private dpsservice = inject(DPSService)

    allyChampion: WritableSignal<Champion> = signal(undefined as any)
    allyItems: WritableSignal<Map<string, Item>> = signal(new Map())
    allyLevel: number = 1
    enemyLevel: number = 1

    enemyChampion: WritableSignal<Champion> = signal(undefined as any)
    enemyItems: WritableSignal<Map<string, Item>> = signal(new Map())

    focusGraph(): void {
        document.getElementById('ally-champion-toolbar')!.style.display = 'none'
        document.getElementById('enemy-champion-toolbar')!.style.display = 'none'
        document.getElementById('ally-item-toolbar')!.style.display = 'none'
        document.getElementById('enemy-item-toolbar')!.style.display = 'none'
    }

    updateLevel(src: string, level: number): void {
        if(src == "ally")
            this.allyLevel = level
        else
            this.enemyLevel = level
    }

    ngAfterViewInit(): void {
        document.getElementById('graph')!.onclick = async () => {
            alert(await this.dpsservice.calculateAutoAttackDPS(
                this.allyLevel, this.enemyLevel, 
                this.allyChampion(), this.enemyChampion(), 
                [...this.allyItems().values()], [...this.enemyItems().values()]
            ))
        }
    }
}
