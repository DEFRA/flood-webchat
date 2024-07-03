import { PAGE_TITLE } from '../store/constants'

export const historyPushState = () => {
  const url = window.location.href.split('#')[0]
  document.title = PAGE_TITLE
  window.history.pushState({ history: true }, null, `${url}#webchat`)
}

export const historyReplaceState = () => {
  if (window.history.state?.history) {
    return window.history.back()
  }

  const url = window.location.href.split('#')[0]
  document.title = PAGE_TITLE
  return window.history.replaceState(null, null, url)
}
