# Build stage
FROM golang:1.23.6-alpine AS builder

WORKDIR /app

# Copy files and download dependencies
# Also, certificates are in the application directory
COPY . ./
RUN go mod download

# Build the application binary
# CGO_ENABLED=0 ensures static linking for alpine image
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/workload .

# Final stage
FROM alpine:latest
EXPOSE 8081

WORKDIR /test

# Copy the built binary from the builder stage
COPY --from=builder /app/workload /test/workload

# Copy certificates
COPY attestation/server.crt /test/server.crt
COPY attestation/server.key /test/server.key

ENTRYPOINT ["/test/workload"]

LABEL "tee.launch_policy.allow_cmd_override"="true"
LABEL "tee.launch_policy.log_redirect"="always"

CMD []
