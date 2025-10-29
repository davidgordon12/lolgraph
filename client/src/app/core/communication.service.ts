import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Model } from "../model/model";
import { ToolbarEvent } from "../shared/types";

@Injectable({
    providedIn: "root"
})

export class CommunicationService {
    private toolbarClickSource = new Subject<ToolbarEvent>()

    toolbarClicked$: Observable<ToolbarEvent> = this.toolbarClickSource.asObservable()

    notifyToolbarClick(data: ToolbarEvent): void {
        this.toolbarClickSource.next(data)
    }
}