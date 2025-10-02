import { Model } from "./model";

export interface Champion extends Model {
    id: string
    key: string
    name: string
    image: { full: string }
    stats: {
        hp: number
        hpperlevel: number
        attackdamage: number
        attackdamageperlevel: number
        armor: number
        armorperlevel: number
        spellblock: number
        spellblockperlevel: number
        attackspeed: number
        attackspeedperlevel: number
    };
}
