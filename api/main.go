package main

import (
	"fmt"
	"os"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/handler"
	"github.com/gin-gonic/gin"
)

var audit *a.Audit

func main() {
	var err error
	audit, err = a.NewAudit(a.AuditConfig{})
	if err != nil {
		fmt.Fprintf(os.Stderr, "Couldn't initialize logging. No fallback. Exiting - %v\n", err)
		os.Exit(1)
	}
	defer audit.Close()

	audit.Info("Starting server on port :8080")
	router := gin.Default()
	handler.RegisterRoutes(router)
	router.Run(":8080") // Starts the server on port 8080
}
