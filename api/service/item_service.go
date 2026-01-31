package service

import (
	"encoding/json"
	"errors"
	"net/http"
	"regexp"
	"slices"
	"strconv"

	a "github.com/davidgordon12/audit"
	"github.com/davidgordon12/lolgraph/model"
)

type ItemService struct {
	version string
	audit   *a.Audit
}

type ItemData struct {
	Data map[string]model.Item `json:"data"`
}

func NewItemService(a *a.Audit) *ItemService {
	version := GetAPIVersion()
	return &ItemService{version: version, audit: a}
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

		res, _ := strconv.ParseFloat(armorPenetration, 64)
		item.Stats.PercentArmorPenetration = res

		lethalityRegex := regexp.MustCompile(`<attention>(\d+)<\/attention>\sLethality`)
		lethalityString := lethalityRegex.FindString(item.Description)
		lethality := percentRegex.FindString(lethalityString)

		res2, _ := strconv.ParseInt(lethality, 10, 32)
		item.Stats.FlatArmorPenetration = int(res2)
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
	itemService.audit.Info("Requesting Items from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + itemService.version + "/data/en_US/item.json")
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
		if slices.Contains(item.Tags, "Damage") || slices.Contains(item.Tags, "SpellDamage") {
			itemService.parseItemDescription(&item)
			items = append(items, item)
		}
	}
	return &items, nil
}

func (itemService ItemService) GetItemById(id string) (*model.Item, error) {
	itemService.audit.Info("Requesting Items from ddragon portal")
	resp, err := http.Get("https://ddragon.leagueoflegends.com/cdn/" + itemService.version + "/data/en_US/item.json")
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
