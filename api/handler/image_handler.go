package handler

import (
	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/service"
	"github.com/gin-gonic/gin"
)

type ImageHandler struct {
	audit        *a.Audit
	imageService *service.ImageService
}

func NewImageHandler(a *a.Audit) *ImageHandler {
	return &ImageHandler{audit: a, imageService: service.NewImageService(a)}
}

func (h *ImageHandler) Get(c *gin.Context) {
	resource := c.Param("resource")
	name := c.Param("name")
	h.imageService.GetImage(c.Writer, c.Request, resource, name)
}
