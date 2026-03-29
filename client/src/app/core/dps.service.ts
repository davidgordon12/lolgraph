import { Item, mapItem } from "../model/item.model";
import { Champion } from "../model/champion.model";
import { Injectable } from "@angular/core";

export interface DPSGraphPoint {
    damage: number
    armor: number
}

@Injectable({
    providedIn: 'root'
})

export class DPSService {
    private calculateRiotGrowthStat(base: number, growth: number, level: number): number {
        if (level <= 1) return base

        const levelOffset = level - 1
        const growthMultiplier = 0.7025 + (0.0175 * levelOffset)
        return base + (growth * levelOffset * growthMultiplier)
    }

    private calculateAttackSpeed(base: number, growthPercent: number, level: number): number {
        if (level <= 1) return base

        const levelOffset = level - 1
        const growthMultiplier = 0.7025 + (0.0175 * levelOffset)
        const bonusAttackSpeedPercent = growthPercent * levelOffset * growthMultiplier
        return base * (1 + (bonusAttackSpeedPercent / 100))
    }

    private buildCombatSnapshot(allyLevel: number, enemyLevel: number, allyChampion: Champion, enemyChampion: Champion, allyItems: Item[], enemyItems: Item[]) {
        const allyStats = {
            attackdamage: this.calculateRiotGrowthStat(
                allyChampion.stats.attackdamage,
                allyChampion.stats.attackdamageperlevel,
                allyLevel
            ),
            attackspeed: this.calculateAttackSpeed(
                allyChampion.stats.attackspeed,
                allyChampion.stats.attackspeedperlevel,
                allyLevel
            )
        }

        let percentArmorPenetration = 1
        let flatArmorPenetration = 0
        let critChance = 0
        let critDamage = 175

        for (let item of allyItems) {
            item = mapItem(item)
            allyStats.attackdamage += item.stats.flatphysicaldamagemod ?? 0
            allyStats.attackspeed += allyStats.attackspeed * (item.stats.percentattackspeedmod ?? 0)
            flatArmorPenetration += item.stats.flatarmorpenetration ?? 0
            critChance += item.stats.flatcritchancemod ?? 0

            if (item.name == "Infinity Edge") {
                critDamage = 215
            }

            if ((item.stats.percentarmorpenetration ?? 0) !== 0) {
                percentArmorPenetration = (item.stats.percentarmorpenetration ?? 0) / 100
            }
        }

        let enemyArmor = this.calculateRiotGrowthStat(
            enemyChampion.stats.armor,
            enemyChampion.stats.armorperlevel,
            enemyLevel
        )

        for (let item of enemyItems) {
            item = mapItem(item)
            enemyArmor += item.stats.flatarmormod ?? 0
        }

        const rawDPS = allyStats.attackspeed * allyStats.attackdamage * (1 + (critChance * (critDamage - 100)) / 10000)

        return {
            rawDPS,
            enemyArmor,
            flatArmorPenetration,
            percentArmorPenetration
        }
    }

    private calculateDamageAgainstArmor(rawDPS: number, armor: number, flatArmorPenetration: number, percentArmorPenetration: number): number {
        const mitigatedArmor = (armor * percentArmorPenetration) - flatArmorPenetration
        return rawDPS * (100 / (100 + mitigatedArmor))
    }

    public async calculateAutoAttackDPS(allyLevel: number, enemyLevel: number, allyChampion: Champion, enemyChampion: Champion, allyItems: Item[], enemyItems: Item[]): Promise<number> {
        const snapshot = this.buildCombatSnapshot(allyLevel, enemyLevel, allyChampion, enemyChampion, allyItems, enemyItems)
        return this.calculateDamageAgainstArmor(
            snapshot.rawDPS,
            snapshot.enemyArmor,
            snapshot.flatArmorPenetration,
            snapshot.percentArmorPenetration
        )
    }

    public async calculateAutoAttackDPSGraph(allyLevel: number, enemyLevel: number, allyChampion: Champion, enemyChampion: Champion, allyItems: Item[], enemyItems: Item[]): Promise<DPSGraphPoint[]> {
        const snapshot = this.buildCombatSnapshot(allyLevel, enemyLevel, allyChampion, enemyChampion, allyItems, enemyItems)
        const maxArmor = Math.max(100, Math.ceil(snapshot.enemyArmor / 25) * 25 + 100)
        const points: DPSGraphPoint[] = []

        for (let armor = 0; armor <= maxArmor; armor += 5) {
            points.push({
                armor,
                damage: this.calculateDamageAgainstArmor(
                    snapshot.rawDPS,
                    armor,
                    snapshot.flatArmorPenetration,
                    snapshot.percentArmorPenetration
                )
            })
        }

        return points
    }
}
