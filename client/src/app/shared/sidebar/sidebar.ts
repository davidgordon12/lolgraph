import { Component, inject, Input } from '@angular/core';
import { Toolbar } from '../toolbar/toolbar';
import { CommunicationService } from '../../core';
import { Model } from '../../model/model';
import { ItemViewmodel } from '../item/item';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [ItemViewmodel],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private communicationService = inject(CommunicationService);

  /*
  selectedChampion?: Champion
  selectedItems?: Map<string, Item>
  */
  selected: Map<string, Model> = new Map()
  @Input() source!: string

  ngOnInit(): void {
    this.communicationService.toolbarClicked$
      .pipe(filter(data => data.source == this.source))
      .subscribe((data) => {
        // TODO: Only allow one champion to be selected at a time
        this.selected.set(data.item.id, data.item)
      })
  }

  removeSelectedItem(id: string): void {
    this.selected.delete(id)
  }
}
