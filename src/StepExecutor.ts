import { StateHolderInstance } from './StateHolder'
import {
  createValidator,
  checkIsTokensArrived,
  isNodeSynced,
  submitValidatorTransaction,
} from './AgoricHelper'
import { StateKeys } from './StateKeys'
import { ExecutionStep } from './ExecutionStep'
import { ExecutionStepStatus } from './ExecutionStepStatus'
import { ExecutionStepType } from './ExecutionStepType'
import { ValidatorCredentials } from './ValidatorCredentials'

export class StepExecutor {
  async executeNextStep(): Promise<ExecutionStep> {
    const currentStep: ExecutionStep = await StateHolderInstance.get(StateKeys.CURRENT_STEP)
    switch (currentStep.status) {
      case ExecutionStepStatus.FAILED:
        console.log('Current step is failed, please check it.')
        return
      case ExecutionStepStatus.IN_PROCESS:
        console.log('Current step is in process, please wait until its done.')
        this.executeStep(currentStep.type)
        return
      case ExecutionStepStatus.SUCCESS:
        console.log('Current step passed succesfully, going to the next step.')
        const allStepTypes = Object.values(ExecutionStepType)
        for (let i = 0; i < allStepTypes.length; i++) {
          if (allStepTypes[i] == currentStep.type) {
            if (i == allStepTypes.length - 1) {
              console.log('This was the last step, node is up, validator transaction submitted.')
            } else {
              const nextStepType = allStepTypes[i + 1]
              console.log(`Executing next step ${nextStepType}.`)
              this.executeStep(nextStepType)
              return
            }
          }
        }
        return
    }
  }

  private async executeStep(stepType: ExecutionStepType): Promise<ExecutionStep> {
    const step = new ExecutionStep()
    step.type = stepType
    let agoricCredentials: ValidatorCredentials
    switch (stepType) {
      case ExecutionStepType.NODE_SYNC:
        const isSynced = await isNodeSynced()
        if (isSynced) {
          step.message = 'Node synced succesfully.'
          step.status = ExecutionStepStatus.SUCCESS
        } else {
          step.message = 'Node is syncing, please wait.'
          step.status = ExecutionStepStatus.IN_PROCESS
        }
        break;
      case ExecutionStepType.VALIDATOR_CREATE:
        const validatorCredentials = await createValidator()
        if (validatorCredentials.isValid()) {
          await StateHolderInstance.set(StateKeys.VALIDATOR_CREDENTIALS, validatorCredentials)
          step.message = 'Validator created succesfully.'
          step.status = ExecutionStepStatus.SUCCESS
        } else {
          step.errorMessage = 'Validator failed to create.'
          step.status = ExecutionStepStatus.FAILED
        }
        break;
      case ExecutionStepType.WAITING_TOKENS_TO_ARRIVE:
        agoricCredentials = await StateHolderInstance.get(StateKeys.VALIDATOR_CREDENTIALS)
        const isTokensArrived = await checkIsTokensArrived(agoricCredentials.address)
        if (isTokensArrived) {
          step.message = 'Tokens arrived.'
          step.status = ExecutionStepStatus.SUCCESS
        } else {
          step.message =
            'Waiting for tokens to arrive... Did you request them from the faucet? ' +
            `Your address for request is ${agoricCredentials.address}`
          step.status = ExecutionStepStatus.IN_PROCESS
        }
        break;
      case ExecutionStepType.VALIDATOR_TRANSACTION_SUBMIT:
        agoricCredentials = await StateHolderInstance.get(StateKeys.VALIDATOR_CREDENTIALS)
        await submitValidatorTransaction(agoricCredentials.operatorKeyName)
        step.message = 'Validator transaction submitted successfully!'
        step.status = ExecutionStepStatus.SUCCESS
        break;
    }
    await StateHolderInstance.set(StateKeys.CURRENT_STEP, step)
    return step
  }

  async getCurrentStep(): Promise<ExecutionStep> {
    const currentStep: ExecutionStep = await StateHolderInstance.get('currentStep')
    return currentStep
  }
}
