FROM ubuntu:20.04
COPY ./scripts ./scripts
USER root
RUN apt-get update
RUN apt-get -y install sudo
RUN apt-get -y install curl
RUN apt-get -y install yarn
RUN apt-get -y install git

CMD /bin/bash

# installing nodejs and go
RUN sh ./scripts/installing-nodejs-and-go.sh
RUN /bin/bash -c "source $HOME/.profile"
ENV GOROOT=/usr/local/go
ENV GOPATH=$HOME/go
ENV GO111MODULE=on
ENV PATH=$PATH:/usr/local/go/bin:$HOME/go/bin
RUN node -v
RUN go version

# installing agoric sdk
ARG branch
RUN sh ./scripts/installing-agoric-sdk.sh $branch && ag-chain-cosmos version --long

# configure node env
ARG moniker
ENV MONIKER_NAME=$moniker
RUN sh ./scripts/configure-node.sh $moniker

WORKDIR ./status-app
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./agoric-config.json ./agoric-config.json
COPY ./yarn.lock ./yarn.lock
RUN yarn install
RUN yarn build

RUN apt-get update && apt-get install -y supervisor
RUN mkdir -p /var/log/supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]

EXPOSE 5124
