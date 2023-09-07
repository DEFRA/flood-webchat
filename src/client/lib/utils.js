import Config from './config.js'
import nunjucks from './nunjucks.js'

const env = nunjucks

class Utils {
  static addOrUpdateParameter (uri, key, value) {
    // Temporariliy remove fragment
    const i = uri.indexOf('#')
    const hash = i === -1 ? '' : uri.substr(i)
    uri = i === -1 ? uri : uri.substr(0, i)
    const re = new RegExp('([?&])' + key + '=[^&#]*', 'i')
    // Delete parameter and value
    if (!value || value === '') {
      uri = uri.replace(re, '')
    } else if (re.test(uri)) {
      // Replace parameter value
      uri = uri.replace(re, '$1' + key + '=' + value)
      // Add parameter and value
    } else {
      const separator = /\?/.test(uri) ? '&' : '?'
      uri = uri + separator + key + '=' + value
    }
    return uri + hash
  }

  static getParameterByName (name) {
    const v = window.location.search.match(new RegExp('(?:[?&]' + name + '=)([^&]+)'))
    return v ? v[1] : null
  }

  static listenForDevice (device, callback) {
    const mQ = window.matchMedia(`(max-width: ${Config.getBreakpoint(device)})`)
    if (window.matchMedia.addEventListener) {
      mQ.addEventListener('change', e => { callback(e.matches) })
    } else {
      mQ.addListener(e => { callback(e.matches) })
    }
    callback(mQ.matches)
  }

  static formatDate (value) {
    const now = new Date().getTime()
    const startOfDay = now - (now % 86400000)
    const isToday = value.getTime() >= startOfDay
    let hours = value.getHours()
    let minutes = value.getMinutes()
    minutes = `${minutes < 10 ? '0' : ''}${minutes}`
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours %= 12
    hours = hours || 12
    const time = `${hours}:${minutes}${ampm}`
    const date = value.toLocaleString('en-GB', { day: 'numeric', month: 'short' })
    return isToday ? time : `${time}, ${date}`
  }

  static parseMessage (input) {
    let text = input

    // Convert line breaks
    text = text.trim().replace(/(\r\n|\r|\n){2,}/g, '$1\n').replace(/\r\n|\r|\n/g, '<br>')

    // Convert links
    const linksFound = text.match(/(?:www|https?)[^\s]+/g)
    const aLink = []
    if (linksFound != null) {
      for (let i = 0; i < linksFound.length; i++) {
        const href = linksFound[i]
        const anchor = linksFound[i].replace(/#webchat|https?:\/\//gi, '')
        aLink.push(`<a href="${href}">${anchor}</a>`)
        text = text.split(linksFound[i]).join(aLink[i])
      }
    }

    return text
  }

  static sortMessages (messages) {
    return messages.sort((a, b) => {
      return a.createdAt - b.createdAt
    })
  }

  static addMessagesHtml (messages) {
    const m = messages
    for (let i = 0; i < m.length; i++) {
      const isGroupStart = i === 0 || (i > 0 && m[i].direction !== m[i - 1].direction)
      const isGroupEnd = (i === m.length - 1) || (i < (m.length - 1) && m[i].direction !== m[i + 1].direction)
      m[i].isGroupStart = isGroupStart
      m[i].isGroupEnd = isGroupEnd
      const html = env.render('message.html', { model: m[i] })
      m[i].html = html
    }
    return m
  }

  static setCountdown (element, callback) {
    let second = Config.countdown
    const interval = setInterval(() => {
      second--
      if (element) {
        element.innerHTML = `${second} seconds`
      }
      if (second <= 0) {
        clearInterval(interval)
        callback()
      }
    }, 1000)
    return interval
  }

  static toggleLabel (label, key, textbox) {
    const chars = /^[a-zA-Z0-9- !'^+%&/()=?_\-~`;#$½{[\]}\\|<>@,]+$/i // /^[a-z\d -]+$/i
    const hasValue = textbox.value.length > 0
    const isValidChar = key && key.length === 1 && chars.test(key)
    const isHidden = hasValue || (!hasValue && isValidChar)
    label.classList.toggle('wc-message__label--hidden', isHidden)
  }

  static submit (e, textbox) {
    const form = textbox.closest('form')
    const isEnterSubmit = textbox.hasAttribute('data-wc-enter-submit')
    if (e.key !== 'Enter' || !isEnterSubmit || e.altKey || e.shiftKey) {
      return
    }
    form.dispatchEvent(new Event('submit'))
  }

  static suppressEnter (e, textbox) {
    const isEnterSubmit = textbox.hasAttribute('data-wc-enter-submit')
    const hasValue = textbox.value.length > 0
    if (e.key === 'Enter' && (!hasValue || (isEnterSubmit && !e.altKey && !e.shiftKey))) {
      e.preventDefault()
    }
  }

  static autosize (textbox) {
    const offset = textbox.offsetHeight - textbox.clientHeight
    textbox.addEventListener('input', e => {
      e.target.style.height = 'auto'
      e.target.style.height = e.target.scrollHeight + offset + 'px'
    })
  }

  static async poll ({ fn, validate, interval, maxAttempts }) {
    let attempts = 0

    const executePoll = async (resolve, reject) => {
      const result = await fn()
      attempts++

      if (interval <= 0) {
        return
      }

      if (validate && validate(result)) {
        return resolve(result)
      } else if (maxAttempts && attempts === maxAttempts) {
        return reject(new Error('Exceeded max attempts'))
      } else {
        setTimeout(executePoll, interval, resolve, reject)
      }
    }

    return new Promise(executePoll)
  }

  static async getAvailability (endpoint) {
    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      return data.availability
    } catch (err) {
      console.log('getAvailability', err)
      return 'UNAVAILABLE'
    }
  }

  static getDuration (seconds) {
    let duration = seconds
    if (seconds <= 60) {
      duration = `${seconds} seconds`
    } else {
      duration = `${Math.floor(seconds / 60)} minutes`
    }
    return duration
  }
}

export default Utils