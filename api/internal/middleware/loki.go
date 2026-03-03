package middleware

import (
	"fmt"
	"time"

	a "github.com/davidgordon12/audit"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// LokiMiddleware logs HTTP request/response data through the audit logger
// in a format suitable for Loki
func LokiMiddleware(audit *a.Audit) gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method
		clientIP := c.ClientIP()

		c.Next()

		duration := time.Since(startTime)
		statusCode := c.Writer.Status()
		responseSize := c.Writer.Size()

		// Log in a format suitable for parsing by Promtail
		logEntry := fmt.Sprintf(
			"ts=%s level=%s requestId=%s method=%s path=%s status=%d duration_ms=%d client_ip=%s response_size=%d",
			startTime,
			"INFO",
			uuid.New(),
			method,
			path,
			statusCode,
			duration.Milliseconds(),
			clientIP,
			responseSize,
		)

		audit.Info("%s", logEntry)
	}
}
