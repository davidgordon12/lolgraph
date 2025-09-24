package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine, championHandler *ChampionHandler, itemHandler *ItemHandler, imageHandler *ImageHandler) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to lolgraph!",
		})
	})

	router.GET("/champions", championHandler.Get)
	router.GET("/champions/:id", championHandler.GetById)

	router.GET("/items", itemHandler.Get)
	router.GET("/items/:id", itemHandler.GetById)

	router.GET("/images/:resource/:name", imageHandler.Get)
}
