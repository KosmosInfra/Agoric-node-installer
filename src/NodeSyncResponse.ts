export interface NodeSyncResponse {
  latest_block_hash: string
  latest_app_hash: string
  latest_block_height: string
  latest_block_time: string
  earliest_block_hash: string
  earliest_app_hash: string
  earliest_block_height: string
  earliest_block_time: string
  catching_up: boolean
}
