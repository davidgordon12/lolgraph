package service

import (
	"io"
	"net/http"
	"time"

	a "github.com/davidgordon12/audit"
)

type ImageService struct {
	version string
	audit   *a.Audit
}

func NewImageService(a *a.Audit) *ImageService {
	version := GetAPIVersion()
	return &ImageService{version: version, audit: a}
}

func (imageService ImageService) GetImage(w http.ResponseWriter, r *http.Request, resource string, name string) {
	// resource/name MUST contain the object-type and the image name. i.e. "item/1001.png" or "champion/Ahri.png"
	imageService.audit.Info("Requesting Items from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + imageService.version + "/img/" + resource + "/" + name)
	if err != nil {
		imageService.audit.Warn("Error fetching item image - %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		imageService.audit.Info("Image not found - %s", resource)
		return
	}

	// Add caching headers to the response.
	w.Header().Set("Cache-Control", "public, max-age=2592000") // Cache for 30 days
	w.Header().Set("Expires", time.Now().Add(30*24*time.Hour).Format(http.TimeFormat))
	w.Header().Set("Content-Type", "image/png")

	// Stream the image data to the client.
	_, err = io.Copy(w, resp.Body)
	if err != nil {
		imageService.audit.Warn("Error copying data - %v", err)
	}
}
