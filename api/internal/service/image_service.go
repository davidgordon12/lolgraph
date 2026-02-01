package service

import (
	"io"
	"net/http"
	"strings"
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
	imageService.audit.Debug("Requesting %s from ddragon portal", name)
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + imageService.version + "/img/" + resource + "/" + name)
	if err != nil {
		imageService.audit.Warn("Error fetching item image - %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		imageService.audit.Info("Image not found - %s - %s (Status: %d %s)", resource, name, resp.StatusCode, resp.Status)
		w.WriteHeader(resp.StatusCode)
		p := []byte{}
		_, _ = resp.Body.Read(p)
		return
	}

	contentType := r.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "image/png"
	}

	// Add caching headers to the response.
	w.Header().Set("Cache-Control", "public, max-age=2592000") // Cache for 30 days
	w.Header().Set("Expires", time.Now().Add(30*24*time.Hour).Format(http.TimeFormat))
	w.Header().Set("Content-Type", contentType)

	// Stream the image data to the client.
	_, err = io.Copy(w, resp.Body)
	if err != nil {

		errString := err.Error()

		isClientDisconnectError := strings.Contains(errString, "connection was aborted") ||
			strings.Contains(errString, "client disconnected") ||
			strings.Contains(errString, "broken pipe")

		if isClientDisconnectError {
			return
		}

		imageService.audit.Warn("Error copying data - %v", err)
	}
}
