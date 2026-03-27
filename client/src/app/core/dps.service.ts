import { Item, mapItem } from "../model/item.model";
import { Champion } from "../model/champion.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class DPSService {
    public async calculateAutoAttackDPS(allyLevel: number, enemyLevel: number, allyChampion: Champion, enemyChampion: Champion, allyItems: Item[], enemyItems: Item[]): Promise<number> {
        let allyStats = allyChampion.stats
        let enemyStats = enemyChampion.stats

        // Gather user's attack stats
        allyStats.attackdamage += (allyStats.attackdamageperlevel * (allyLevel - 1))
        allyStats.attackspeed += (allyStats.attackspeedperlevel * (allyLevel - 1))

        // Will be multiplied against enemy armor as a percentage to apply armor pen, 
        // 1 is a sensible default in the case we do not have any armor penetration items.
        let percentArmorPenetration: number = 1 
        let flatArmorPenetration: number = 0
        let critChance: number = 0
        let critDamage: number = 175
        let infinityEdge: boolean = false

        for (let item of allyItems) {
            item = mapItem(item)
            allyStats.attackdamage += item.stats.flatphysicaldamagemod ?? 0
            console.log(item.stats.flatphysicaldamagemod)
            allyStats.attackspeed += (allyStats.attackspeed * (item.stats.percentattackspeedmod ?? 0))
            flatArmorPenetration += item.stats.flatarmorpenetration
            critChance += item.stats.flatcritchancemod
            if (item.name == "Infinity Edge") {
                critDamage = 215
            }
            if (item.stats.percentarmorpenetration != 0) {
                percentArmorPenetration = item.stats.percentarmorpenetration / 100
            }
            console.log(allyStats.attackdamage)
            console.log(allyStats.attackspeed)
        }

        // Gather enemy targets defense stats
        enemyStats.armor += (enemyStats.armorperlevel * enemyLevel)

        for(let item of enemyItems) {
            enemyStats.armor += item.stats.flatarmormod
        }

        // Apply final modifiers
        enemyStats.armor = (enemyStats.armor * (percentArmorPenetration)) - flatArmorPenetration
        let rawDPS = allyStats.attackspeed * allyStats.attackdamage * (1 + (critChance * (critDamage - 100)) / 10000)
        return rawDPS * (100 / (100 + enemyStats.armor))
    }
}