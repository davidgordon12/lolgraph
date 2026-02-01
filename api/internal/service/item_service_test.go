package service

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

func TestGetItems_Success(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"data":{
			"1001":{"name":"DamageItem","description":"<mainText><stats><attention>35</attention> Attack Damage<br><attention>35%</attention> Armor Penetration<br><attention>25%</attention> Critical Strike Chance</stats><br><br><passive>Grievous Wounds</passive><br>Dealing physical damage applies <keyword>40% Wounds</keyword> to enemy champions for 3 seconds.</mainText>","tags":["Damage","ArmorPenetration"],"stats":{}},
			"2001":{"name":"Consumable","description":"","tags":["Consumable"],"stats":{}},
			"3001":{"name":"MagicItem","description":"<attention>12%</attention> Magic Penetration","tags":["SpellDamage","MagicPenetration"],"stats":{}}
		}}`))
	}))
	defer srv.Close()

	orig := http.DefaultTransport
	target, _ := url.Parse(srv.URL)
	http.DefaultTransport = &rewriteRoundTripper{target: target, original: orig}
	defer func() { http.DefaultTransport = orig }()

	audit := newTestAudit(t)
	service := ItemService{version: "v1.0.0", audit: audit}

	items, err := service.GetItems()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if items == nil {
		t.Fatalf("expected items, got nil")
	}
	if len(*items) != 2 {
		t.Fatalf("expected 2 items (only Damage/SpellDamage), got %d", len(*items))
	}
	// check IDs and parsed stats
	found := map[string]bool{}
	for _, it := range *items {
		found[it.ID] = true
		if it.ID == "1001" {
			if it.Stats.PercentArmorPenetration != 35 {
				t.Fatalf("expected PercentArmorPenetration 35 for 1001, got %v", it.Stats.PercentArmorPenetration)
			}
		}
		if it.ID == "3001" {
			if it.Stats.PercentMagicPenetration != 12 {
				t.Fatalf("expected PercentMagicPenetration 12 for 3001, got %v", it.Stats.PercentMagicPenetration)
			}
		}
	}
	if !found["1001"] || !found["3001"] {
		t.Fatalf("expected items 1001 and 3001, got %+v", *items)
	}
}

func TestGetItemById_Success(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"data":{"5001":{"name":"ArmorPenItem","description":"<attention>40%</attention> Armor Penetration <attention>20</attention> Lethality","tags":["ArmorPenetration","Damage"],"stats":{}}}}`))
	}))
	defer srv.Close()

	orig := http.DefaultTransport
	target, _ := url.Parse(srv.URL)
	http.DefaultTransport = &rewriteRoundTripper{target: target, original: orig}
	defer func() { http.DefaultTransport = orig }()

	audit := newTestAudit(t)
	service := ItemService{version: "v1.0.0", audit: audit}

	item, err := service.GetItemById("5001")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if item == nil {
		t.Fatalf("expected item, got nil")
	}
	if item.Stats.PercentArmorPenetration != 40 {
		t.Fatalf("expected PercentArmorPenetration 40, got %v", item.Stats.PercentArmorPenetration)
	}
	if item.Stats.FlatArmorPenetration != 20 {
		t.Fatalf("expected FlatArmorPenetration 20, got %v", item.Stats.FlatArmorPenetration)
	}
}

func TestGetItemById_NotFound(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"data":{"5001":{"name":"ArmorPenItem","description":"<attention>40%</attention> Armor Penetration <attention>20</attention> Lethality","tags":["ArmorPenetration","Damage"],"stats":{}}}}`))
	}))
	defer srv.Close()

	orig := http.DefaultTransport
	target, _ := url.Parse(srv.URL)
	http.DefaultTransport = &rewriteRoundTripper{target: target, original: orig}
	defer func() { http.DefaultTransport = orig }()

	audit := newTestAudit(t)
	defer audit.Close()

	service := ItemService{version: "v1.0.0", audit: audit}

	it, err := service.GetItemById("9999")
	if err == nil {
		t.Fatalf("expected error for missing item ID, got nil (item: %+v)", it)
	}
}
