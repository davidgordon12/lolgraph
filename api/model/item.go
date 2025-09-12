package model

type Item struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Stats       ItemStats `json:"stats"`
	Tags        []string  `json:"tags"`
}

type ItemStats struct {
	FlatMagicDamageMod         int
	FlatPhysicalDamageMod      int
	FlatMagicPenetration       int
	FlatPhysicalPenetration    int
	PercentMagicPenetration    int
	PercentPhysicalPenetration int
}
