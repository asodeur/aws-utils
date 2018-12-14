const log = require('logdown')('appsync-emulator:lambdaRunner');

const parseErrorStack = error =>
  error.stack
    .replace(/at /g, '')
    .split('\n    ')
    .slice(1);

const sendOutput = output => {
  console.log(output);
  process.send({ type: 'success', output }, process.exit);
};
const sendErr = err => {
  let error;
  console.log(err);
  if (err instanceof Error) {
    error = {
      stackTrace: parseErrorStack(err),
      errorType: err.constructor.name,
      errorMessage: err.message,
    };
  } else {
    error = err;
  }
  process.send({ type: 'error', error }, process.exit);
};

function installExceptionHandlers() {
  process.on('uncaughtException', err => {
    log.error('uncaughtException in lambda', err);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    log.error('unhandledRejection in lambda', err);
    process.exit(1);
  });
}

module.exports = { log, sendOutput, sendErr, installExceptionHandlers };
