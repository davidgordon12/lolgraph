import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { SidebarEvent, ToolbarEvent } from "../shared/types";

@Injectable({
    providedIn: "root"
})

export class CommunicationService {
    private toolbarClickSource = new Subject<ToolbarEvent>()
    private sidebarClickSource = new Subject<SidebarEvent>()

    toolbarClicked$: Observable<ToolbarEvent> = this.toolbarClickSource.asObservable()
    sidebarClicked$: Observable<SidebarEvent> = this.sidebarClickSource.asObservable()

    notifyToolbarClick(data: ToolbarEvent): void {
        this.toolbarClickSource.next(data)
    }

    notifySidebarClick(data: SidebarEvent): void {
        this.sidebarClickSource.next(data)
    }
}