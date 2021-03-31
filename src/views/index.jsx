var React = require('react')
var DefaultLayout = require('./default')

const ExecutionStepStatus = {
  SUCCESS: 'SUCCESS',
  IN_PROCESS: 'IN_PROCESS',
  FAILED: 'FAILED',
}

const ExecutionStepType = {
  NODE_SYNC: 'node_sync',
  VALIDATOR_CREATE: 'validator_create',
  WAITING_TOKENS_TO_ARRIVE: 'waiting_tokens_to_arrive',
  VALIDATOR_TRANSACTION_SUBMIT: 'validator_transaction_submit',
}

const ExecutionStepToName = {
  [ExecutionStepType.NODE_SYNC]: 'Node Sync',
  [ExecutionStepType.VALIDATOR_CREATE]: 'Creating Validator',
  [ExecutionStepType.WAITING_TOKENS_TO_ARRIVE]: 'Waiting Tokens To Arrive',
  [ExecutionStepType.VALIDATOR_TRANSACTION_SUBMIT]: 'Validator Transaction Submit',
}

const STEPS = [
  ExecutionStepType.NODE_SYNC,
  ExecutionStepType.VALIDATOR_CREATE,
  ExecutionStepType.WAITING_TOKENS_TO_ARRIVE,
  ExecutionStepType.VALIDATOR_TRANSACTION_SUBMIT,
]

function HelloMessage({ currentStep, credentials }) {
  const currentStepIndex = STEPS.findIndex((step) => currentStep.type === step)
  return (
    <DefaultLayout>
      <h2 style={{ marginTop: 24, marginBottom: 24 }}>Agoric Node Installer Status</h2>
      <ol className="list-group list-group-numbered">
        {STEPS.map((type, index) => {
          const isCurrent = currentStep.type === type
          return (
            <li
              className="list-group-item d-flex justify-content-between align-items-start"
              key={type}
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{ExecutionStepToName[type]}</div>
                {isCurrent ? currentStep.message : ''}
              </div>
              <span className="badge bg-primary rounded-pill">
                {isCurrent
                  ? currentStep.status
                  : currentStepIndex > index
                  ? ExecutionStepStatus.SUCCESS
                  : 'Not Started'}
              </span>
            </li>
          )
        })}
      </ol>
      <h2 style={{ marginTop: 24, marginBottom: 24 }}>Credentials</h2>
      <div>
        {!credentials ? (
          'Credentials not loaded'
        ) : (
          <div>
            <div>Address: {credentials.address}</div>
            <div>Pubkey: {credentials.pubkey}</div>
            <div>Moniker: {process.env.MONIKER_NAME}</div>
              <div>
                  Mnemonic (downloads only once): <a href="/mnemonic">Download</a>
              </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  )
}

module.exports = HelloMessage
