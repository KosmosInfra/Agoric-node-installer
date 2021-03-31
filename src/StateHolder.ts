import { readFile as readFileNode, writeFile as writeFileNode } from 'fs'
import { promisify } from 'util'
import { get, set } from 'lodash'

const readFile = promisify(readFileNode)
const writeFile = promisify(writeFileNode)

const STATE_FILE_NAME = 'state.json'

export type State = {
  someKey?: number
}

export interface IStateHolder {
  getState: () => Promise<State>
  setState: (state: State) => Promise<State>
  set: <T>(key: string, value: T) => Promise<State>
  get: <T>(key: string) => Promise<T>
}

class StateHolder implements IStateHolder {
  private state: State = {}

  constructor() {}

  async init() {
    console.log(`Restoring current state from ${STATE_FILE_NAME}`)
    try {
      const stateContent = await readFile(STATE_FILE_NAME)
      this.state = JSON.parse(stateContent.toString())
      console.log('Restored state', this.state)
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('State file not found, creating a new one')
        await this.writeStateToFile()
      } else {
        console.log(`Failed to restore state from file ${err.message}`)
        throw err
      }
    }
  }

  async get<T>(key: string): Promise<T> {
    return get(this.state, key)
  }

  async getState(): Promise<State> {
    return this.state
  }

  async set<T>(key: string, value: T): Promise<State> {
    return this.updateStateAndSync((state) => {
      const stateCopy = { ...state }
      set(stateCopy, key, value)
      return stateCopy
    })
  }

  async setState(state: State): Promise<State> {
    return this.updateStateAndSync(() => state)
  }

  private async updateStateAndSync(updateFn: (state: State) => State): Promise<State> {
    this.state = updateFn(this.state)
    await this.writeStateToFile()
    return this.state
  }

  private async writeStateToFile() {
    await writeFile(STATE_FILE_NAME, JSON.stringify(this.state))
  }
}

export const StateHolderInstance = new StateHolder()
