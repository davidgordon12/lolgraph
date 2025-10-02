import { Item } from "../model/item.model";

export async function fetchItems(): Promise<Item[]> {
    let result: Item[] = []
    let response: void | Response = await fetch(`http://localhost:8080/items`, {
        method: "GET",
        mode: "cors",
        cache: "force-cache",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
    .then((items: Item[]) => {
        for(const item of items) {
            result.push(item)
        }
    });

    return result
}