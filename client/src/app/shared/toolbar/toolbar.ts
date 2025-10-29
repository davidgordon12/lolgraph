import { Component, inject, Input, input, signal } from '@angular/core';
import { Model } from '../../model/model';
import { CommunicationService } from '../../core/communication.service';
import { ItemViewmodel } from '../item/item';
import { ToolbarEvent, ToolbarSource } from '../types';

@Component({
  selector: 'app-toolbar',
  imports: [ItemViewmodel],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {
  @Input() items!: Model[]
  @Input() source!: ToolbarSource

  private communicationService = inject(CommunicationService)

  toolbarItemClicked(item: Model): void {
    const data: ToolbarEvent = {
      source: this.source,
      item: item,
    }
    this.communicationService.notifyToolbarClick(data);
  }
}
