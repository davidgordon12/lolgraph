package service

import (
	"net/http"
	"net/url"
	"os"
	"testing"

	a "github.com/davidgordon12/audit"
)

// rewriteRoundTripper rewrites outgoing requests to point at the test server URL.
type rewriteRoundTripper struct {
	target   *url.URL
	original http.RoundTripper
}

func (r *rewriteRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	// copy request so we don't mutate the original
	req2 := new(http.Request)
	*req2 = *req
	u := *req.URL
	u.Scheme = r.target.Scheme
	u.Host = r.target.Host
	req2.URL = &u
	req2.Host = r.target.Host
	return r.original.RoundTrip(req2)
}

func newTestAudit(t *testing.T) *a.Audit {
	aud, err := a.NewAudit(a.AuditConfig{Level: a.INFO})
	if err != nil {
		t.Fatalf("failed to create audit: %v", err)
	}
	t.Cleanup(func() {
		aud.Close()
		os.Remove("logs")
	})
	return aud
}
