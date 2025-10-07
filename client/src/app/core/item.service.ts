import { Item } from "../model/item.model";

export async function fetchItems(): Promise<Item[]> {
    let response: Item[] = await fetch(`http://localhost:8080/items`, {
        method: "GET",
        mode: "cors",
        cache: "force-cache",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json(), rej => {return []})
    .then((items: Item[]) => {
        return items
    });

    return response
}