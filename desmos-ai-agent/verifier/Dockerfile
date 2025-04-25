# Build stage
FROM golang:1.23.6-alpine AS builder

WORKDIR /app

# Copy files and download dependencies
# Assuming go.mod and go.sum exist in the verifier directory
# Also, sertificates are in the verifier directory
COPY . ./
RUN go mod download

# Build the application binary
# CGO_ENABLED=0 ensures static linking for alpine image
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/workload .

# Final stage
FROM alpine:latest

WORKDIR /test

# Copy the built binary from the builder stage
COPY --from=builder /app/workload /test/workload

# Copy necessary data and configuration files
COPY opa_validation_values.json /test/
COPY confidential_space_root.pem /test/

ENTRYPOINT ["/test/workload"]

LABEL "tee.launch_policy.allow_cmd_override"="true"
LABEL "tee.launch_policy.allow_env_override"="remote_ip_addr"
LABEL "tee.launch_policy.log_redirect"="always"

CMD []
