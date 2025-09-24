// main.go
package main

import (
	"fmt"
	"os"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/handler"
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

	championHandler := handler.NewChampionHandler(audit)
	itemHandler := handler.NewItemHandler(audit)
	imageHandler := handler.NewImageHandler(audit)

	handler.RegisterRoutes(router, championHandler, itemHandler, imageHandler)

	audit.Info("Starting server on port :8080")
	router.Run(":8080")
}
