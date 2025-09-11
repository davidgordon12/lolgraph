package model

type Champion struct {
	ID    string        `json:"id"`
	Key   string        `json:"key"`
	Name  string        `json:"name"`
	Stats ChampionStats `json:"stats"`
}

type ChampionStats struct {
	HP                   float64 `json:"hp"`
	AttackDamage         float64 `json:"attackdamage"`
	AttackDamagePerLevel float64 `json:"attackdamageperlevel"`
	Armor                float64 `json:"armor"`
	ArmorPerLevel        float64 `json:"armorperlevel"`
	SpellBlock           float64 `json:"spellblock"`
	SpellBlockPerLevel   float64 `json:"spellblockperlevel"`
	AttackSpeed          float64 `json:"attackspeed"`
	AttackSpeedPerLevel  float64 `json:"attackspeedperlevel"`
}
