# Base image
FROM golang:1.25.1-trixie

# Contains the source code
WORKDIR /app

# Copy everything from root into /app
COPY . .

# Installs go dependencies
RUN go mod download

# Builds the app
RUN go build -o lolgraph

# Runs the executable
CMD [ "./lolgraph" ]