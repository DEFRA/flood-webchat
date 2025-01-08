const { stripPageTitle } = require('../../server/lib/utils')

export const historyPushState = () => {
  const url = window.location.href.split('#')[0]
  document.title = stripPageTitle(document.title)
  window.history.pushState({ history: true }, null, `${url}#webchat`)
}

export const historyReplaceState = () => {
  if (window.history.state?.history) {
    return window.history.back()
  }

  document.title = stripPageTitle(document.title)
  const url = window.location.href.split('#')[0]
  return window.history.replaceState(null, null, url)
}
