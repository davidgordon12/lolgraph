PORT := 8080
BUILD_NAME := lolgraph
VERSION := latest

run:
	docker run --name $(BUILD_NAME) -p $(PORT):$(PORT) --rm -d $(BUILD_NAME):$(VERSION)

build:
	docker build -t $(BUILD_NAME) .

all: build run
