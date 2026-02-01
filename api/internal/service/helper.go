package service

import (
	"encoding/json"
	"net/http"
)

func GetAPIVersion() string {
	fallbackVersion := "15.18.1"
	version, err := http.Get("https://ddragon.leagueoflegends.com/api/versions.json")
	if err != nil || version.StatusCode != http.StatusOK {
		return fallbackVersion
	}
	defer version.Body.Close()

	var versions []string
	if err := json.NewDecoder(version.Body).Decode(&versions); err != nil {
		return fallbackVersion
	}

	if len(versions) < 1 {
		return fallbackVersion
	}

	latestVersion := versions[0]

	return latestVersion
}
