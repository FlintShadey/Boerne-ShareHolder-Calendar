import { dateRange } from '../../config.js'

/**
 * PureDate Utility - Timezone-safe date handling
 * Ensures dates are treated as pure calendar dates without timezone conversion
 */
export class PureDate {
  /**
   * Create a PureDate from a date string (YYYY-MM-DD)
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {Date} JavaScript Date object
   */
  static fromString(dateString) {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  /**
   * Convert a Date object to YYYY-MM-DD string
   * Handles timezone issues by checking the hour component
   * @param {Date} date - JavaScript Date object
   * @returns {string} Date string in YYYY-MM-DD format
   */
  static toString(date) {
    // Check if the date has been shifted by timezone
    const hour = date.getHours()
    
    // If hour is very early or very late, the date might have been shifted
    // Use local methods to get the intended date
    if (hour < 12) {
      // Use local date methods
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } else {
      // Use UTC methods
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  }

  /**
   * Get today's date as YYYY-MM-DD string
   * @returns {string} Today's date
   */
  static today() {
    const now = new Date()
    return this.toString(now)
  }

  /**
   * Compare two date strings
   * @param {string} date1 - First date (YYYY-MM-DD)
   * @param {string} date2 - Second date (YYYY-MM-DD)
   * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
   */
  static compare(date1, date2) {
    if (date1 < date2) return -1
    if (date1 > date2) return 1
    return 0
  }

  /**
   * Check if a date is within the configured range
   * @param {string} dateString - Date to check (YYYY-MM-DD)
   * @returns {boolean} True if date is within range
   */
  static isInRange(dateString) {
    const date = this.fromString(dateString)
    const startDate = dateRange.getStartDate()
    const endDate = dateRange.getEndDate()
    
    return date >= startDate && date <= endDate
  }

  /**
   * Get all months in the configured date range
   * @returns {Array<{year: number, month: number}>} Array of month objects
   */
  static getMonthsInRange() {
    const months = []
    let year = dateRange.startYear
    let month = dateRange.startMonth

    while (
      year < dateRange.endYear ||
      (year === dateRange.endYear && month <= dateRange.endMonth)
    ) {
      months.push({ year, month })
      
      month++
      if (month > 12) {
        month = 1
        year++
      }
    }

    return months
  }

  /**
   * Format a date string for display
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @param {string} format - Format style ('short', 'medium', 'long')
   * @returns {string} Formatted date string
   */
  static format(dateString, format = 'medium') {
    const date = this.fromString(dateString)
    
    const options = {
      short: { month: 'short', day: 'numeric' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    }

    return date.toLocaleDateString('en-US', options[format] || options.medium)
  }

  /**
   * Get the month name
   * @param {number} month - Month number (1-12)
   * @returns {string} Month name
   */
  static getMonthName(month) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[month - 1] || ''
  }

  /**
   * Get the short month name
   * @param {number} month - Month number (1-12)
   * @returns {string} Short month name
   */
  static getShortMonthName(month) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    return months[month - 1] || ''
  }
}

/**
 * Composable for date utilities
 */
export function useDates() {
  /**
   * Convert Date object to YYYY-MM-DD string
   * @param {Date} date - JavaScript Date object
   * @returns {string} Date string
   */
  const dateToString = (date) => {
    return PureDate.toString(date)
  }

  /**
   * Convert YYYY-MM-DD string to Date object
   * @param {string} dateString - Date string
   * @returns {Date} JavaScript Date object
   */
  const stringToDate = (dateString) => {
    return PureDate.fromString(dateString)
  }

  /**
   * Get today's date string
   * @returns {string} Today's date
   */
  const getToday = () => {
    return PureDate.today()
  }

  /**
   * Check if date is in configured range
   * @param {string} dateString - Date to check
   * @returns {boolean} True if in range
   */
  const isDateInRange = (dateString) => {
    return PureDate.isInRange(dateString)
  }

  /**
   * Get all months in range
   * @returns {Array} Array of month objects
   */
  const getMonthsInRange = () => {
    return PureDate.getMonthsInRange()
  }

  /**
   * Format date for display
   * @param {string} dateString - Date to format
   * @param {string} format - Format style
   * @returns {string} Formatted date
   */
  const formatDate = (dateString, format = 'medium') => {
    return PureDate.format(dateString, format)
  }

  /**
   * Get month name
   * @param {number} month - Month number (1-12)
   * @returns {string} Month name
   */
  const getMonthName = (month) => {
    return PureDate.getMonthName(month)
  }

  /**
   * Get short month name
   * @param {number} month - Month number (1-12)
   * @returns {string} Short month name
   */
  const getShortMonthName = (month) => {
    return PureDate.getShortMonthName(month)
  }

  return {
    PureDate,
    dateToString,
    stringToDate,
    getToday,
    isDateInRange,
    getMonthsInRange,
    formatDate,
    getMonthName,
    getShortMonthName
  }
}
