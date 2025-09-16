package handler

import (
	"net/http"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/service"
	"github.com/gin-gonic/gin"
)

type ChampionHandler struct {
	audit           *a.Audit
	championService *service.ChampionService
}

func NewChampionHandler(a *a.Audit) *ChampionHandler {
	return &ChampionHandler{audit: a, championService: service.NewChampionService(a)}
}

func (h *ChampionHandler) Get(c *gin.Context) {
	itemData, err := h.championService.GetChampions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	c.JSON(http.StatusOK, itemData)
}

func (h *ChampionHandler) GetById(c *gin.Context) {
	id := c.Param("id")
	h.audit.Debug("Got champion request for id of %s", id)
	itemData, err := h.championService.GetChampionById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	c.JSON(http.StatusOK, itemData)
}
