import nunjucks from './nunjucks.js'

class Skiplink {
  constructor () {
    this.target = document.querySelector('a[data-module="govuk-skip-link"]')
    this.skiplink = null
  }

  toggle (hasSkip) {
    const target = this.target
    const skiplink = this.skiplink
    if (!target) {
      return
    }

    if (hasSkip && !skiplink) {
      // Add skiplink
      target.insertAdjacentHTML('afterend', nunjucks.render('skiplink.html'))
      this.skiplink = target.nextElementSibling
    } else if (skiplink && !hasSkip) {
      // Remove skiplink
      this.skiplink.remove()
    }
  }
}

export default Skiplink
