package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"slices"
	"strconv"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/model"
)

type ItemService struct {
	audit *a.Audit
}

type ItemData struct {
	Data map[string]model.Item `json:"data"`
}

func NewItemService(a *a.Audit) *ItemService {
	return &ItemService{audit: a}
}

func (itemService ItemService) getVersion() string {
	fallbackVersion := "15.18.1"
	version, err := http.Get("https://ddragon.leagueoflegends.com/api/versions.json")
	if err != nil || version.StatusCode != http.StatusOK {
		itemService.audit.Warn("Couldn't fetch latest version from ddragon - %v", err)
		return fallbackVersion
	}
	defer version.Body.Close()

	var versions []string
	if err := json.NewDecoder(version.Body).Decode(&versions); err != nil {
		itemService.audit.Warn("Couldn't decode versions from ddragon - %v", err)
		return fallbackVersion
	}

	if len(versions) < 1 {
		itemService.audit.Warn("No CDN versions found.")
		return fallbackVersion
	}

	latestVersion := versions[0]
	itemService.audit.Info("Got latest version from ddragon - %s", latestVersion)

	return latestVersion
}

func (itemService ItemService) parseItemDescription(item *model.Item) {
	// Riot does not have a stat field for some modifiers such as magic or physical penetration.
	// These stats are still present but as plain-text in the item's description

	// Helper regex that will pull exact percent value from any modifier
	percentRegex := regexp.MustCompile(`\d+`)

	if slices.Contains(item.Tags, "CriticalStrike") {
		critDamageRegex := regexp.MustCompile(`<attention>(\d+)%<\/attention>\sCritical\sStrike\sDamage`)
		critDamageString := critDamageRegex.FindString(item.Description)
		critDamage := percentRegex.FindString(critDamageString)

		res, _ := strconv.ParseFloat(critDamage, 64)
		item.Stats.PercentCritDamage = res
	}
	if slices.Contains(item.Tags, "ArmorPenetration") {
		armorPenetrationRegex := regexp.MustCompile(`<attention>(\d+)%<\/attention>\sArmor\sPenetration`)
		armorPenetrationString := armorPenetrationRegex.FindString(item.Description)
		armorPenetration := percentRegex.FindString(armorPenetrationString)
		fmt.Fprintf(os.Stdout, "%s", armorPenetration)

		res, _ := strconv.ParseFloat(armorPenetration, 64)
		item.Stats.PercentArmorPenetration = res
	}
	if slices.Contains(item.Tags, "MagicPenetration") {
		magicPenetrationRegex := regexp.MustCompile(`<attention>(\d+)%<\/attention>\sMagic\sPenetration`)
		magicPenetrationString := magicPenetrationRegex.FindString(item.Description)
		magicPenetration := percentRegex.FindString(magicPenetrationString)

		res, _ := strconv.ParseFloat(magicPenetration, 64)
		item.Stats.PercentMagicPenetration = res
	}
}

func (itemService ItemService) GetItems() (*[]model.Item, error) {
	latestVersion := itemService.getVersion()

	itemService.audit.Info("Requesting Items from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + latestVersion + "/data/en_US/item.json")
	if err != nil {
		itemService.audit.Warn("Error fetching item data - %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	var itemData ItemData
	if err := json.NewDecoder(resp.Body).Decode(&itemData); err != nil {
		itemService.audit.Warn("Error deserializing item data - %v", err)
		return nil, err
	}

	var items []model.Item
	for key, item := range itemData.Data {
		item.ID = key
		// TODO: Discard items that do not affect DPS
		items = append(items, item)
	}
	return &items, nil
}

func (itemService ItemService) GetItemById(id string) (*model.Item, error) {
	latestVersion := itemService.getVersion()

	itemService.audit.Info("Requesting Items from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + latestVersion + "/data/en_US/item.json")
	if err != nil {
		itemService.audit.Warn("Error fetching item data - %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	var itemData ItemData
	if err := json.NewDecoder(resp.Body).Decode(&itemData); err != nil {
		itemService.audit.Warn("Error deserializing item data - %v", err)
		return nil, err
	}

	var item model.Item

	item, ok := itemData.Data[id]
	if !ok {
		itemService.audit.Warn("No item with id %s", id)
		return nil, errors.New("no item with id " + id)
	}

	itemService.parseItemDescription(&item)
	return &item, nil
}
