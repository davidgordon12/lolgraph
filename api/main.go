package main

import (
	"github.com/davidgordon12/lolgraph/handler"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	handler.RegisterRoutes(router)
	router.Run(":8080") // Starts the server on port 8080
}
