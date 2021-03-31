export class ValidatorCredentials {
  address: string
  pubkey: string
  mnemonic: string
  operatorKeyName: string

  public isValid(): boolean {
    return (
      this.address.trim().length != 0 &&
      this.pubkey.trim().length != 0 &&
      this.mnemonic.trim().length != 0
    )
  }
}
