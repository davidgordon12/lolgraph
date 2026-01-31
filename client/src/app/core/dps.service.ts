import { Item } from "../model/item.model";
import { Champion } from "../model/champion.model";


export class DPSService {
    public async calculateDPS(allyLevel: number, enemyLevel: number, allyChampion: Champion, enemyChampion: Champion, allyItems: Item[], enemyItems: Item[]): Promise<number> {
        let allyStats = allyChampion.stats
        let enemyStats = enemyChampion.stats

        allyStats.attackdamage += (allyStats.attackdamageperlevel * allyLevel)
        allyStats.attackspeed += (allyStats.attackspeedperlevel * allyLevel)

        let armorPenetration: number = 0
        let hasCollector: boolean = false
        for(let item of allyItems) {
            let allyItemStats = item.stats
            allyStats.attackdamage += allyItemStats.flatphysicaldamagemod
            allyStats.attackspeed += (allyStats.attackspeed * allyItemStats.percentattackspeedmod)
            armorPenetration += allyItemStats.percentarmorpenetration
            if(item.id === '6676' /* The Collector */) {
                hasCollector = true
            }
        }

        enemyStats.armor += (enemyStats.armorperlevel * enemyLevel)

        for(let item of enemyItems) {
            let enemyItemStats = item.stats
            enemyStats.armor += enemyItemStats.flatarmormod
        }

        enemyStats.armor -= (enemyStats.armor * armorPenetration)

        if(hasCollector) {
            enemyStats.armor -= 10
        }

        return 0
    }
}