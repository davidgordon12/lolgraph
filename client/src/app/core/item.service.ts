import { Injectable } from "@angular/core";
import { Item } from "../model/item.model";

@Injectable({
    providedIn: 'root'
})

export class ItemService {
    public async fetchItems(): Promise<Item[]> {
        let response: Item[] = await fetch(`http://localhost:8080/items`, {
            method: "GET",
            mode: "cors",
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json(), rej => { return [] })
            .then((items: Item[]) => {
                items.forEach((item) => item.resource = "item")
                return items
            });

        return response
    }
}