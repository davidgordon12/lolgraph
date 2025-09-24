package service

import (
	"encoding/json"
	"errors"
	"net/http"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/model"
)

type ChampionService struct {
	version string
	audit   *a.Audit
}

type ChampionData struct {
	Data map[string]model.Champion `json:"data"`
}

func NewChampionService(a *a.Audit) *ChampionService {
	version := GetAPIVersion()
	return &ChampionService{version: version, audit: a}
}

func (championService ChampionService) GetChampions() (*[]model.Champion, error) {
	championService.audit.Info("Requesting Champions from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + championService.version + "/data/en_US/champion.json")
	if err != nil {
		championService.audit.Warn("Error fetching champion data - %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	var championData ChampionData
	if err := json.NewDecoder(resp.Body).Decode(&championData); err != nil {
		championService.audit.Warn("Error deserializing champion data - %v", err)
		return nil, err
	}

	var champions []model.Champion
	for key, champion := range championData.Data {
		champion.ID = key
		champions = append(champions, champion)
	}
	return &champions, nil
}

func (championService ChampionService) GetChampionById(id string) (*model.Champion, error) {
	championService.audit.Info("Requesting Champions from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + championService.version + "/data/en_US/champion.json")
	if err != nil {
		championService.audit.Warn("Error fetching champion data - %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	var championData ChampionData
	if err := json.NewDecoder(resp.Body).Decode(&championData); err != nil {
		championService.audit.Warn("Error deserializing champion data - %v", err)
		return nil, err
	}

	var champion model.Champion

	champion, ok := championData.Data[id]
	if !ok {
		championService.audit.Warn("No champion with id %s", id)
		return nil, errors.New("no champion with id " + id)
	}

	return &champion, nil
}
