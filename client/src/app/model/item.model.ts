import { Model } from "./model"

export interface Item extends Model {
	id:          string 
	name:        string 
	description: string  
	image:       { full: string }
	stats:       {
		flatarmormod:          number
		flatspellblockmod:     number
		flatmagicdamagemod:    number
		flatphysicaldamagemod: number
		flatcritchancemod:     number
		percentattackspeedmod: number

		// These stats are not directly populated from the API call
		flatarmorpenetration:     number // Lethality
	    flatmagicpenetration:     number // Magic Pen
		percentcritdamage:       number
		percentarmorpenetration: number
		percentmagicpenetration: number
	}
	tags:        string[]
}

export const mapItem = (apiItem: any): Item => ({
    id:          apiItem.id,
    resource:    "item",
    name:        apiItem.name,
    description: apiItem.description,
    image:       apiItem.image,
    tags:        apiItem.tags,
    stats: {
        flatarmormod:            apiItem.stats.flatarmormod            ?? apiItem.stats.FlatArmorMod            ?? 0,
        flatspellblockmod:       apiItem.stats.flatspellblockmod       ?? apiItem.stats.FlatSpellBlockMod       ?? 0,
        flatmagicdamagemod:      apiItem.stats.flatmagicdamagemod      ?? apiItem.stats.FlatMagicDamageMod      ?? 0,
        flatphysicaldamagemod:   apiItem.stats.flatphysicaldamagemod   ?? apiItem.stats.FlatPhysicalDamageMod   ?? 0,
        flatcritchancemod:       apiItem.stats.flatcritchancemod       ?? apiItem.stats.FlatCritChanceMod       ?? 0,
        percentattackspeedmod:   apiItem.stats.percentattackspeedmod   ?? apiItem.stats.PercentAttackSpeedMod   ?? 0,
        flatarmorpenetration:    apiItem.stats.flatarmorpenetration    ?? apiItem.stats.FlatArmorPenetration    ?? 0,
        flatmagicpenetration:    apiItem.stats.flatmagicpenetration    ?? apiItem.stats.FlatMagicPenetration    ?? 0,
        percentcritdamage:       apiItem.stats.percentcritdamage       ?? apiItem.stats.PercentCritDamageMod    ?? 0,
        percentarmorpenetration: apiItem.stats.percentarmorpenetration ?? apiItem.stats.PercentArmorPenetration ?? 0,
        percentmagicpenetration: apiItem.stats.percentmagicpenetration ?? apiItem.stats.PercentMagicPenetration ?? 0,
    }
})
