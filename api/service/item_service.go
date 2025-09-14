package service

import (
	"encoding/json"
	"errors"
	"net/http"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/model"
)

type ItemService struct {
	audit *a.Audit
}

type ItemData struct {
	Data map[string]model.Item `json:"data"`
}

func NewItemService() *ItemService {
	return &ItemService{}
}

func (_itemService ItemService) GetItems() (*[]model.Item, error) {
	version, err := http.Get("https://ddragon.leagueoflegends.com/api/versions.json")
	if err != nil || version.StatusCode != http.StatusOK {
		_itemService.audit.Warn("Couldn't fetch latest version from ddragon - %v", err)
		return nil, err
	}
	defer version.Body.Close()

	var versions []string
	if err := json.NewDecoder(version.Body).Decode(&versions); err != nil {
		_itemService.audit.Warn("Couldn't decode versions from ddragon - %v", err)
		return nil, err
	}

	if len(versions) < 1 {
		_itemService.audit.Warn("No CDN versions found.")
		return nil, errors.New("no CDN versions found")
	}

	latestVersion := versions[0]
	_itemService.audit.Info("Got latest version from ddragon - %s", latestVersion)

	_itemService.audit.Info("Requesting Items from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + latestVersion + "/data/en_US/item.json")
	if err != nil {
		_itemService.audit.Warn("Error fetching item data - %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	var itemData ItemData
	if err := json.NewDecoder(resp.Body).Decode(&itemData); err != nil {
		_itemService.audit.Warn("Error deserializing item data - %v", err)
		return nil, err
	}

	var items []model.Item
	for key, item := range itemData.Data {
		item.ID = key
		items = append(items, item)
	}
	return &items, nil
}

func (_itemService ItemService) GetItemById(id string) (*model.Item, error) {
	version, err := http.Get("https://ddragon.leagueoflegends.com/api/versions.json")
	if err != nil || version.StatusCode != http.StatusOK {
		_itemService.audit.Warn("Couldn't fetch latest version from ddragon - %v", err)
		return nil, err
	}
	defer version.Body.Close()

	var versions []string
	if err := json.NewDecoder(version.Body).Decode(&versions); err != nil {
		_itemService.audit.Warn("Couldn't decode versions from ddragon - %v", err)
		return nil, err
	}

	if len(versions) < 1 {
		_itemService.audit.Warn("No CDN versions found.")
		return nil, errors.New("no CDN versions found")
	}

	latestVersion := versions[0]

	_itemService.audit.Info("Requesting Items from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + latestVersion + "/data/en_US/item.json")
	if err != nil {
		_itemService.audit.Warn("Error fetching item data - %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	var itemData ItemData
	if err := json.NewDecoder(resp.Body).Decode(&itemData); err != nil {
		_itemService.audit.Warn("Error deserializing item data - %v", err)
		return nil, err
	}

	var item model.Item

	item, ok := itemData.Data[id]
	if !ok {
		_itemService.audit.Warn("No item with id %s", id)
		return nil, errors.New("no item with id " + id)
	}

	return &item, nil
}
