package handler

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetRunes(c *gin.Context) {
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json")
	if err != nil {
		h.Audit.Info("GET /champions - failed to fetch champions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch champions"})
		return
	}
	defer resp.Body.Close()

	var champData ChampionData
	if err := json.NewDecoder(resp.Body).Decode(&champData); err != nil {
		h.Audit.Info("GET /champions - failed to decode champion data")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode champion data"})
		return
	}

	h.Audit.Info("GET /champions - 200 OK - champion data returned")
	c.JSON(http.StatusOK, champData.Data)
}
