package handler

import (
	"net/http"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/model"
	"github.com/gin-gonic/gin"
	// Add this import
)

type Handler struct {
	Audit   *a.Audit
	Version string
	CDN     string
	URI     string
}

type ChampionData struct {
	Data map[string]model.Champion `json:"data"`
}

func NewHandler(audit *a.Audit) *Handler {
	return &Handler{
		Audit: audit,
		CDN:   "https://ddragon.leagueoflegends.com/cdn/15.18.1/data/en_US/",
		URI:   "api/v1/",
	}
}

func (h *Handler) RegisterRoutes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to lolgraph!",
		})
	})

	router.GET("/champions", h.GetChampions)
	router.GET("/items", h.GetChampions)
	router.GET("/runes", h.GetChampions)
}
