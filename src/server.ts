import express from 'express'
import { StateHolderInstance } from './StateHolder'
import { StateKeys } from './StateKeys'
import { StepExecutor } from './StepExecutor'
import { ExecutionStep } from './ExecutionStep'
import { ExecutionStepType } from './ExecutionStepType'
import { ExecutionStepStatus } from './ExecutionStepStatus'
import * as reactEngine from 'express-react-views'
import { ValidatorCredentials } from './ValidatorCredentials'

const PORT = 5124

const app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'jsx')
app.engine('jsx', reactEngine.createEngine({ beautify: true }))

app.get('/', async (req, res) => {
  const currentStep = await StateHolderInstance.get(StateKeys.CURRENT_STEP)
  const credentials = await StateHolderInstance.get(StateKeys.VALIDATOR_CREDENTIALS)
  return res.render('index', { currentStep, credentials })
})

app.get('/mnemonic', async (req, res) => {
  const credentials = await StateHolderInstance.get<ValidatorCredentials>(
    StateKeys.VALIDATOR_CREDENTIALS
  )
  if (!credentials || !credentials.mnemonic) {
    return res.sendStatus(404)
  }
  const isMnemonicDownloaded = await StateHolderInstance.get<boolean>(
      StateKeys.MNEMONIC_DOWNLOADED
  )
  if (isMnemonicDownloaded) {
    return res.sendStatus(404)
  } else {
    await StateHolderInstance.set(StateKeys.MNEMONIC_DOWNLOADED, true)
  }
  res.set({ 'Content-Disposition': 'attachment; filename="mnemonic.txt"' })
  res.send(credentials.mnemonic)
})

app.get('/currentStep', async (req, res) => {
  const currentStep = await StateHolderInstance.get(StateKeys.CURRENT_STEP)
  res.send(currentStep)
})

app.listen(PORT, async () => {
  await StateHolderInstance.init()
  console.log(`Server started on port ${PORT}`)
})


StateHolderInstance.get<ExecutionStep>(StateKeys.CURRENT_STEP).then(currentStep => {
  if (currentStep == null) {
    const executionStep = new ExecutionStep()
    executionStep.message = 'Node is syncing, please wait.'
    executionStep.type = ExecutionStepType.NODE_SYNC
    executionStep.status = ExecutionStepStatus.IN_PROCESS
    StateHolderInstance.set(StateKeys.CURRENT_STEP, executionStep)
  }
})

const stepExecutor = new StepExecutor()
setInterval(function () {
  stepExecutor.executeNextStep()
}, 20000)

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p)
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown')
    process.exit(1)
  })
