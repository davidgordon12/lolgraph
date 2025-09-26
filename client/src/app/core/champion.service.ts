import { Champion } from "../model/champion.model";

export async function fetchChampions(): Promise<Champion[]> {
    let result: Champion[] = []
    let response: void | Response = await fetch(`http://localhost:8080/champions`, {
        method: "GET",
        mode: "cors",
        cache: "force-cache",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
    .then((champions: Champion[]) => {
        for(const champion of champions) {
            result.push(champion)
        }
    });

    return result
}