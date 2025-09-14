package handler

import (
	"net/http"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/service"
	"github.com/gin-gonic/gin"
)

func GetItems(c *gin.Context) {
	_itemService := service.NewItemService()
	itemData, err := _itemService.GetItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	c.JSON(http.StatusOK, itemData)
}

func GetItemById(c *gin.Context, audit *a.Audit) {
	id := c.Param("id")
	_itemService := service.NewItemService()
	itemData, err := _itemService.GetItemById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	c.JSON(http.StatusOK, itemData)
}
