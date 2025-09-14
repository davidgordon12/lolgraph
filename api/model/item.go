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
	PercentAttackSpeedMod float64
}
