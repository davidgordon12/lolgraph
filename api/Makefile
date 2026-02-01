PORT := 8080
BUILD_NAME := lolgraph
VERSION := latest

# Show help by default when running 'make' with no target
.DEFAULT_GOAL := help

# Detect Windows (Windows sets OS=Windows_NT)
IS_WINDOWS := $(findstring Windows_NT,$(OS))

# Allow skipping tests in two ways:
#  - pass SKIP_TESTS=1:    make build SKIP_TESTS=1
#  - pass -skipTests flag: make -skipTests build
ifneq (,$(filter -skipTests,$(MAKEFLAGS)))
SKIP_TESTS=1
endif

# Binary name on Windows
BIN := $(BUILD_NAME)
ifeq ($(IS_WINDOWS),Windows_NT)
	BIN := $(BUILD_NAME).exe
endif

# Integration test command differs on Windows vs Unix-like shells
ifeq ($(IS_WINDOWS),Windows_NT)
	TEST_CMD = set INTEGRATION=1 && go test ./service -v
else
	TEST_CMD = INTEGRATION=1 go test ./service -v
endif

run:
	docker run --name $(BUILD_NAME) -p $(PORT):$(PORT) --rm -d $(BUILD_NAME):$(VERSION)

# 'build' will run tests first (unless SKIP_TESTS is set), then create the docker image
build:
ifeq ($(SKIP_TESTS),1)
	@echo "Skipping tests (SKIP_TESTS=$(SKIP_TESTS))"
else
	@echo "Running tests before build..."
	@go test ./...
	@if [ $$? -ne 0 ]; then echo "Tests failed, aborting build"; exit 1; fi
endif
	@docker build -t $(BUILD_NAME) .

# Local go build that also respects SKIP_TESTS
go-build:
ifeq ($(SKIP_TESTS),1)
	@echo "Skipping tests (SKIP_TESTS=$(SKIP_TESTS))"
else
	@echo "Running tests before go build..."
	@go test ./...
	@if [ $$? -ne 0 ]; then echo "Tests failed, aborting go build"; exit 1; fi
endif
	@go build -o $(BIN)

# Run integration tests separately
test:
	@echo "Running integration tests (set INTEGRATION=1 to enable)"
	@$(TEST_CMD)

.PHONY: help run build go-build test all

help:
	@echo "Available targets:"
	@echo "  help        Show this help message"
	@echo "  test        Run integration tests (INTEGRATION=1) against ddragon"
	@echo "  build       Build docker image (runs tests first unless SKIP_TESTS=1)"
	@echo "  go-build    Build local binary (runs tests first unless SKIP_TESTS=1)"
	@echo "  run         Run docker container (docker run -p)"
	@echo ""
	@echo "Skip tests options:"
	@echo "  SKIP_TESTS=1            Use as: make build SKIP_TESTS=1"
	@echo "  -skipTests flag        Use as: make -skipTests build (convenience for CI)"
	@echo ""
	@echo "Examples:"
	@echo "  make build               # run tests then docker build"
	@echo "  make build SKIP_TESTS=1  # skip tests, docker build"
	@echo "  make -skipTests build    # skip tests via flag"
	@echo "  make go-build            # run tests then local go build"
	@echo "  make go-build SKIP_TESTS=1 # skip tests and build local binary"
	@echo ""
all: help
