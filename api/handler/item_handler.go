package handler

import (
	"net/http"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/service"
	"github.com/gin-gonic/gin"
)

type ItemHandler struct {
	audit       *a.Audit
	itemService *service.ItemService
}

func NewItemHandler(a *a.Audit) *ItemHandler {
	return &ItemHandler{audit: a, itemService: service.NewItemService(a)}
}

func (h *ItemHandler) Get(c *gin.Context) {
	itemData, err := h.itemService.GetItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	c.JSON(http.StatusOK, itemData)
}

func (h *ItemHandler) GetById(c *gin.Context) {
	id := c.Param("id")
	h.audit.Debug("Got item request for id of %s", id)

	itemData, err := h.itemService.GetItemById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	c.JSON(http.StatusOK, itemData)
}
