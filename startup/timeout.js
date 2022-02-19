

async function clearTimeouts(timeout) {
  console.log('timeout========>', timeout);
  let dif = (new Date().getTime() - timeout.startTime);
  dif = Math.round((dif/1000)/60);
  console.log('dif====>', dif);
  if (dif <= 2) {
    clearTimeout(timeout.timeoutId);
  }
  return
}

module.exports = {
  clearTimeouts
}