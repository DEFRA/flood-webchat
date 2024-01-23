export const historyPushState = () => {
  const url = window.location.href.split('#')[0]
  window.history.pushState({ history: true }, null, `${url}#webchat`)
}

export const historyReplaceState = () => {
  if (window.history.state?.history) {
    return window.history.back()
  }

  const url = window.location.href.split('#')[0]
  window.history.replaceState(null, null, url)
}
