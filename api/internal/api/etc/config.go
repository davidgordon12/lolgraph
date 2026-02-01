package etc

import (
	"time"

	a "github.com/davidgordon12/audit"
	"github.com/gin-gonic/gin"
)

func AuditLogger(audit *a.Audit) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)
		status := c.Writer.Status()
		method := c.Request.Method
		path := c.Request.URL.Path
		clientIP := c.ClientIP()

		audit.Info(
			"%s %s - status=%d - ip=%s - latency=%s",
			method, path, status, clientIP, latency,
		)
	}
}
