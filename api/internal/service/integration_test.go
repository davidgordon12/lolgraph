package service

import (
	"os"
	"testing"
)

// Run this test with INTEGRATION=1 to hit the real ddragon endpoints.
func TestIntegration_ChampionAndItemServices(t *testing.T) {
	if os.Getenv("INTEGRATION") != "1" {
		t.Skip("integration tests disabled; set INTEGRATION=1 to enable")
	}

	audit := newTestAudit(t)

	// Champions
	champSvc := NewChampionService(audit)
	champs, err := champSvc.GetChampions()
	if err != nil {
		t.Fatalf("GetChampions returned error: %v", err)
	}
	if len(*champs) == 0 {
		t.Fatalf("expected at least one champion")
	}

	// verify GetChampionById for the first champion
	firstID := (*champs)[0].ID
	if firstID == "" {
		// try by name if ID empty
		firstID = (*champs)[0].Name
	}
	c, err := champSvc.GetChampionById(firstID)
	if err != nil {
		t.Fatalf("GetChampionById(%s) returned error: %v", firstID, err)
	}
	if c == nil || c.Name == "" {
		t.Fatalf("GetChampionById returned invalid champion: %+v", c)
	}

	// Items
	itemSvc := NewItemService(audit)
	items, err := itemSvc.GetItems()
	if err != nil {
		t.Fatalf("GetItems returned error: %v", err)
	}
	if len(*items) == 0 {
		t.Fatalf("expected at least one item")
	}

	firstItemID := (*items)[0].ID
	if firstItemID == "" {
		firstItemID = (*items)[0].Name
	}
	it, err := itemSvc.GetItemById(firstItemID)
	if err != nil {
		t.Fatalf("GetItemById(%s) returned error: %v", firstItemID, err)
	}
	if it == nil || it.Name == "" {
		t.Fatalf("GetItemById returned invalid item: %+v", it)
	}
}
