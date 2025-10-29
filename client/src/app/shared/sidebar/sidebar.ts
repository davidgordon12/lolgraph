import { Component, inject, Input } from '@angular/core';
import { Toolbar } from '../toolbar/toolbar';
import { CommunicationService } from '../../core';
import { Model } from '../../model/model';
import { ItemViewmodel } from '../item/item';
import { filter } from 'rxjs';
import { Item } from '../../model/item.model';
import { Champion } from '../../model/champion.model';

@Component({
  selector: 'app-sidebar',
  imports: [ItemViewmodel],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private communicationService = inject(CommunicationService);

  selectedChampion?: Champion
  selectedItems: Map<string, Item> = new Map()
  @Input() source!: string

  ngOnInit(): void {
    this.communicationService.toolbarClicked$
      .pipe(filter(data => data.source == this.source))
      .subscribe((data) => {
        // TODO: Only allow one champion to be selected at a time
        let item: Model = data.item
        if(item.resource == "champion") {
          this.selectedChampion = item as Champion
        } else {
          if(this.selectedItems.size >= 6) {
            alert('Max 6 items.')
            return
          }
          this.selectedItems.set(item.id, item as Item)
        }
      })
  }

  removeSelectedItem(id: string): void {
    this.selectedItems.delete(id)
  }
}
