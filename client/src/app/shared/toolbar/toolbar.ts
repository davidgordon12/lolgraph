import { Component, inject, Input, input, signal } from '@angular/core';
import { Model } from '../../model/model';
import { CommunicationService } from '../../core/communication.service';
import { ItemViewmodel } from '../item/item';
import { SidebarSource, ToolbarEvent, ToolbarSource } from '../types';
import { filter } from 'rxjs';

@Component({
    selector: 'app-toolbar',
    imports: [ItemViewmodel],
    templateUrl: './toolbar.html',
    styleUrl: './toolbar.css'
})
export class Toolbar {
    @Input() items!: Model[]
    @Input() toolbarSource!: ToolbarSource
    @Input() sidebarSource!: SidebarSource
    private communicationService = inject(CommunicationService)

    allyChampionToolbar: HTMLElement | null = null;
    enemyChampionToolbar: HTMLElement | null = null;
    allyItemToolbar: HTMLElement | null = null;
    enemyItemToolbar: HTMLElement | null = null;

    ngAfterViewInit(): void {
        this.allyChampionToolbar = document.getElementById('ally-champion-toolbar');
        this.enemyChampionToolbar = document.getElementById('enemy-champion-toolbar');
        this.allyItemToolbar = document.getElementById('ally-item-toolbar');
        this.enemyItemToolbar = document.getElementById('enemy-item-toolbar');
    }

    ngOnInit(): void {

        this.communicationService.sidebarClicked$
            .pipe(filter(data => data.source == this.sidebarSource))
            .subscribe((data) => {
                switch (data.element) {
                    case 'Champions':
                        if (this.sidebarSource == 'AllySidebar') {
                            this.allyItemToolbar!.style.display = 'none'
                            this.allyChampionToolbar!.style.display = 'block'
                        }
                        if (this.sidebarSource == 'EnemySidebar') {
                            this.enemyItemToolbar!.style.display = 'none'
                            this.enemyChampionToolbar!.style.display = 'block'
                        }
                        break
                    case 'Items':
                        if (this.sidebarSource == 'AllySidebar') {
                            this.allyItemToolbar!.style.display = 'block'
                            this.allyChampionToolbar!.style.display = 'none'
                        }
                        if (this.sidebarSource == 'EnemySidebar') {
                            this.enemyItemToolbar!.style.display = 'block'
                            this.enemyChampionToolbar!.style.display = 'none'
                        }
                        break
                    case 'Selected':
                        break

                }
            })
    }

    toolbarItemClicked(item: Model): void {
        const data: ToolbarEvent = {
            source: this.toolbarSource,
            item: item,
        }
        this.communicationService.notifyToolbarClick(data);
    }

    closeToolbar(event: any): void {
        switch (event.target.getAttribute("id")) {
            case "ally-closeToolbar":
                this.allyItemToolbar!.style.display = 'none'
                this.allyChampionToolbar!.style.display = 'none'
                break
            case "enemy-closeToolbar":
                this.enemyItemToolbar!.style.display = 'none'
                this.enemyChampionToolbar!.style.display = 'none'
                break
        }
    }
}
