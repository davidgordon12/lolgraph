import { Champion } from "../model/champion.model";

export async function fetchChampions(): Promise<Champion[]> {
    let response: Champion[] = await fetch(`http://localhost:8080/champions`, {
        method: "GET",
        mode: "cors",
        cache: "force-cache",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json(), rej => {return []})
    .then((champions: Champion[]) => {
        return champions
    });

    return response
}