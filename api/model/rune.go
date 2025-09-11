package model

type rune struct {
	ID    int                `json:"id"`
	Name  string             `json:"name"`
	Stats map[string]float64 `json:"stats"`
}
