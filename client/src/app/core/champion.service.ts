import { Injectable } from "@angular/core";
import { Champion } from "../model/champion.model";

@Injectable({
    providedIn: 'root'
})

export class ChampionService {
    public async fetchChampions(): Promise<Champion[]> {
        let response: Champion[] = await fetch(`http://localhost:8080/champions`, {
            method: "GET",
            mode: "cors",
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json(), rej => { return [] })
            .then((champions: Champion[]) => {
                champions.forEach((champ) => champ.resource = "champion")
                return champions
            })

        return response
    }
}