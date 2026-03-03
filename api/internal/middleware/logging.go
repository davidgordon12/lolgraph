package middleware

import (
	"fmt"
	"time"

	a "github.com/davidgordon12/audit"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func LoggingMiddleware(audit *a.Audit) gin.HandlerFunc {
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
			"level=%s traceId=%s method=%s path=%s status=%d duration_ms=%d client_ip=%s response_size=%d",
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
