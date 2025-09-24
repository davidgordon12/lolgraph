PORT := 8080
BUILD_NAME := lolgraph
VERSION := latest

build:
	docker build -t $(BUILD_NAME) .

run:
	docker run --name $(BUILD_NAME) -p $(PORT):$(PORT) --rm -d $(BUILD_NAME):$(VERSION)

all: run build
