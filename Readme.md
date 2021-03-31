# Agoric Node Installer helper

This is the helper repository for https://validate.agoric.com/ TestNet. It contains:

- Docker image to run testnet inside docker container;
- Helper application to view current status of validator;

## Install

### Docker
Install Docker from https://docs.docker.com/engine/install/

## Configure
Put your `Operator key name` and `Keyring password` parameters in `agoric-config.json` file
## Run

### Build Docker Container
Run command: `docker build --tag agoric-validator-app --build-arg branch=$branch --build-arg moniker=$moniker .`
where `$branch` - current branch for testnet, `$moniker` - your moniker name.
### Run Docker Container

Run command: `docker run -p 5124:5124 -d agoric-validator-app`

### Application

Helper application will be available on 127.0.0.1:5124

![Screenshot](https://i.imgur.com/wx5RfAI.png)

Helper run all steps automatically, except 3 step (Waiting tokens to arrive).
You will need to request tokens from the faucet to continue helper execution.
Validator credentials will be shown in helper too, mnemonic will be available for download only 1 time.

This tool is experimental, please don't use it for prod purposes.
