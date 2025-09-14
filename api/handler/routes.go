package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to lolgraph!",
		})
	})

	//router.GET("/champions", GetChampions)
	router.GET("/items", GetItems)
}
