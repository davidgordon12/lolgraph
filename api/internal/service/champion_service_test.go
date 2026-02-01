package service

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

func TestGetChampions_Success(t *testing.T) {
	// prepare test server returning champion JSON
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"data":{"Aatrox":{"key":"266","name":"Aatrox"},"Ahri":{"key":"103","name":"Ahri"}}}`))
	}))
	defer srv.Close()

	// replace transport
	orig := http.DefaultTransport
	target, _ := url.Parse(srv.URL)
	http.DefaultTransport = &rewriteRoundTripper{target: target, original: orig}
	defer func() { http.DefaultTransport = orig }()

	audit := newTestAudit(t)
	service := ChampionService{version: "v1.0.0", audit: audit}

	champs, err := service.GetChampions()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if champs == nil {
		t.Fatalf("expected champions, got nil")
	}
	if len(*champs) != 2 {
		t.Fatalf("expected 2 champions, got %d", len(*champs))
	}
	// ensure IDs were set to the map keys
	found := map[string]bool{}
	for _, c := range *champs {
		found[c.ID] = true
	}
	if !found["Aatrox"] || !found["Ahri"] {
		t.Fatalf("expected champions with IDs Aatrox and Ahri, got %+v", *champs)
	}
}

func TestGetChampionById_Success(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"data":{"Aatrox":{"key":"266","name":"Aatrox"}}}`))
	}))
	defer srv.Close()

	orig := http.DefaultTransport
	target, _ := url.Parse(srv.URL)
	http.DefaultTransport = &rewriteRoundTripper{target: target, original: orig}
	defer func() { http.DefaultTransport = orig }()

	audit := newTestAudit(t)
	service := ChampionService{version: "v1.0.0", audit: audit}

	champ, err := service.GetChampionById("Aatrox")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if champ == nil {
		t.Fatalf("expected champion, got nil")
	}
	if champ.Name != "Aatrox" || champ.Key != "266" {
		t.Fatalf("unexpected champion data: %+v", champ)
	}
}

func TestGetChampionById_NotFound(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"data":{"Aatrox":{"key":"266","name":"Aatrox"}}}`))
	}))
	defer srv.Close()

	orig := http.DefaultTransport
	target, _ := url.Parse(srv.URL)
	http.DefaultTransport = &rewriteRoundTripper{target: target, original: orig}
	defer func() { http.DefaultTransport = orig }()

	audit := newTestAudit(t)
	service := ChampionService{version: "v1.0.0", audit: audit}

	champ, err := service.GetChampionById("Missing")
	if err == nil {
		t.Fatalf("expected error for missing champion ID, got nil (champ: %+v)", champ)
	}
}
