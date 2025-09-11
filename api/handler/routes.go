package handler

import (
	"encoding/json"
	"net/http"

	"github.com/davidgordon12/lolgraph/model"
	"github.com/gin-gonic/gin"
	// Add this import
)

type ChampionData struct {
	Data map[string]model.Champion `json:"data"`
}

func RegisterRoutes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to lolgraph!",
		})
	})

	router.GET("/champions", func(c *gin.Context) {
		resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json")
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
	})
}
