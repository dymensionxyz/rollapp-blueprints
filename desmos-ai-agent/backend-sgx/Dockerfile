ARG egover=1.4.1

# Use this to build an executable for Ubuntu 22.04
FROM ghcr.io/edgelesssys/ego/build-base:v${egover} AS build

ARG egover

# Install required packages
# These are cached in the build-base image. Don't run `apt-get update` or
# you may get other package versions and the build won't be reproducible.
RUN apt-get install -y --no-install-recommends \
  build-essential \
  ca-certificates \
  git \
  wget

# Download and install EGo
# Use --force-depends to ignore SGX dependencies, which aren't required for building
RUN egodeb=ego_${egover}_amd64_ubuntu-$(grep -oP 'VERSION_ID="\K[^"]+' /etc/os-release).deb \
  && wget https://github.com/edgelesssys/ego/releases/download/v${egover}/${egodeb} \
  && dpkg -i --force-depends ${egodeb}

# Build the app
WORKDIR /app

COPY . ./
RUN go mod download
RUN ego-go build -trimpath

RUN --mount=type=secret,id=signingkey,dst=private.pem,required=true ego sign oracle
RUN ego bundle oracle

FROM ghcr.io/edgelesssys/ego-deploy:v${egover} AS deploy
EXPOSE 8080
COPY --from=build /app/oracle /
ENTRYPOINT ["ego", "run", "oracle"]
