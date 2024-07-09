const { strippedPageTitle } = require('../../server/lib/utils')
export const historyPushState = () => {
  const url = window.location.href.split('#')[0]
  document.title = strippedPageTitle(document.title)

  window.history.pushState({ history: true }, null, `${url}#webchat`)
}

export const historyReplaceState = () => {
  if (window.history.state?.history) {
    return window.history.back()
  }
  document.title = strippedPageTitle(document.title)
  const url = window.location.href.split('#')[0]
  return window.history.replaceState(null, null, url)
}
