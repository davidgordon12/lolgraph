// main.go
package main

import (
	"fmt"
	"os"
	"time"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/handler"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	audit, err := a.NewAudit(a.AuditConfig{Level: a.DEBUG, FilePath: "logs/log.txt"})
	if err != nil {
		fmt.Fprintf(os.Stderr, "Couldn't initialize logging. Exiting - %v\n", err)
		os.Exit(1)
	}
	defer audit.Close()

	router := gin.New()
	router.Use(gin.Recovery())

	// Configure CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:4200"} // Specify allowed origins
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true
	config.MaxAge = 12 * time.Hour // Cache preflight requests for 12 hours

	router.Use(cors.New(config))

	championHandler := handler.NewChampionHandler(audit)
	itemHandler := handler.NewItemHandler(audit)
	imageHandler := handler.NewImageHandler(audit)

	handler.RegisterRoutes(router, championHandler, itemHandler, imageHandler)

	audit.Info("Starting server on port :8080")
	router.Run(":8080")
}
