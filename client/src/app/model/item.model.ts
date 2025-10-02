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
		percentcritdamage:       number
		percentarmorpenetration: number
		percentmagicpenetration: number
	}
	tags:        string[]
}