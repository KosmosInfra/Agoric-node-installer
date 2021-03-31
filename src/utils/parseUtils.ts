import { ValidatorCredentials } from '../ValidatorCredentials'
const agoricConfig = require('../../agoric-config.json')

export function parseValidatorInfo(stdout: string, stderr: string): ValidatorCredentials {
  const credentials = new ValidatorCredentials()
  credentials.address = stdout.split('address: ')[1].split('\n')[0]
  credentials.pubkey = stdout.split('pubkey: ')[1].split('\n')[0]
  credentials.mnemonic = stderr.split('your password.')[1].replace(/\n/g, '')
  credentials.operatorKeyName = agoricConfig['operator-key-name']
  return credentials
}
