package model

type Item struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Stats       ItemStats `json:"stats"`
	Tags        []string  `json:"tags"`
}

type ItemStats struct {
	FlatArmorMod          int
	FlatSpellBlockMod     int
	FlatMagicDamageMod    int
	FlatPhysicalDamageMod int
	FlatCritChanceMod     float32
	PercentAttackSpeedMod float32

	// These stats are not directly populated from the API call
	PercentCritDamage       float64
	PercentArmorPenetration float64
	PercentMagicPenetration float64
}
