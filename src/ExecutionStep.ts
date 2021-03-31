import { ExecutionStepType } from './ExecutionStepType'
import { ExecutionStepStatus } from './ExecutionStepStatus'

export class ExecutionStep {
  type: ExecutionStepType
  status: ExecutionStepStatus
  message: string
  errorMessage: string
}
