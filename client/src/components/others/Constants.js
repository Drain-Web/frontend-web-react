
module.exports = class Constants {
  static get lang () {
    return 'en'
  }

  static get overviewId () {
    return 'overview'
  }

  static get overviewTitle () {
    return {
      en: 'Overview'
    }[Constants.lang]
  }
}
