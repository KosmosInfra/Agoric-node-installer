import util from 'util'
import { exec as initExec } from 'child_process'
import { NodeSyncResponse } from './NodeSyncResponse'
import { parseValidatorInfo } from './utils/parseUtils'
import { ValidatorCredentials } from './ValidatorCredentials'
const agoricConfig = require('../agoric-config.json')

const exec = util.promisify(initExec)

export async function isNodeSynced(): Promise<boolean> {
  const { stdout, stderr } = await exec('ag-cosmos-helper status 2>&1 | jq .SyncInfo')
  const response: NodeSyncResponse = JSON.parse(stdout)
  return !response.catching_up
}

export async function createValidator(): Promise<ValidatorCredentials> {
  const {
    stdout,
    stderr,
  } = await exec(`ag-cosmos-helper keys add ${agoricConfig['operator-key-name']} <<! \n 
    ${agoricConfig['keyring-passphrase']} \n ${agoricConfig['keyring-passphrase']} \n !`)
  return parseValidatorInfo(stdout, stderr)
}

export async function checkIsTokensArrived(address: string): Promise<boolean> {
  const { stdout, stderr } = await exec(
    `echo ${agoricConfig['keyring-passphrase']} | ag-cosmos-helper query bank balances \`ag-cosmos-helper keys show -a ${address}\``
  )
  return stdout.includes('50000000')
}

export async function submitValidatorTransaction(operatorKeyName: string): Promise<string> {
  const { stdout, stderr } = await exec(`ag-chain-cosmos tendermint show-validator`)
  const validatorPublicKey = stdout.replace(/\n/g, '');
  await exec(`chainName=\`curl https://testnet.agoric.net/network-config | jq -r .chainName`)
  await exec(`echo ${agoricConfig['keyring-passphrase']} | ag-cosmos-helper tx staking create-validator \\
              --amount=50000000uagstake \\
              --broadcast-mode=block \\
              --pubkey=${validatorPublicKey} \\
              --moniker=${process.env.MONIKER_NAME} \\
              --commission-rate="0.10" \\
              --commission-max-rate="0.20" \\
              --commission-max-change-rate="0.01" \\
              --min-self-delegation="1" \\
              --from=${operatorKeyName} \\
              --chain-id=$chainName \\
              --gas=auto \\
              --gas-adjustment=1.4`)
  return stdout
}