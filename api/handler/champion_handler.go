package handler

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetChampions(c *gin.Context) {
	resp, err := http.Get(h.CDN + "champion.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch champions"})
		return
	}
	defer resp.Body.Close()

	var champData ChampionData
	if err := json.NewDecoder(resp.Body).Decode(&champData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode champion data"})
		return
	}

	c.JSON(http.StatusOK, champData.Data)
}
