import { Component, inject, Input, model, WritableSignal } from '@angular/core';
import { Toolbar } from '../toolbar/toolbar';
import { CommunicationService } from '../../core';
import { Model } from '../../model/model';
import { ItemViewmodel } from '../item/item';
import { filter } from 'rxjs';
import { Item } from '../../model/item.model';
import { Champion } from '../../model/champion.model';
import { ElementSource, SidebarEvent, SidebarSource, ToolbarSource } from '../types';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-sidebar',
    imports: [ItemViewmodel, FormsModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css'
})
export class Sidebar {
    private communicationService = inject(CommunicationService);

    selectedChampion = model<Champion>({} as Champion)
    selectedItems = model<Map<string, Item>>(new Map())
    
    @Input() toolbarSource!: ToolbarSource
    @Input() sidebarSource!: SidebarSource

    championLevel: number = 1;

    ngOnInit(): void {
        this.communicationService.toolbarClicked$
            .pipe(filter(data => data.source == this.toolbarSource))
            .subscribe((data) => {
                let item: Model = data.item
                if (item.resource == "champion") {
                    this.selectedChampion?.set(item as Champion)
                } else {
                    if (this.selectedItems!().size >= 6) {
                        return
                    }
                    this.selectedItems?.update(x => {
                        console.log(item)
                        const map = new Map(x)
                        map.set(item.id, item as Item)
                        return map
                    })
                }
            })
    }

    removeSelectedItem(id: string): void {
        this.selectedItems?.update(x => {
            const map = new Map(x)
            map.delete(id)
            return map
        })
    }

    onItemClicked(e: ElementSource) {
        const data: SidebarEvent = {
            source: this.sidebarSource,
            element: e,
        }
        this.communicationService.notifySidebarClick(data)
    }
}
