/**
 * Error class for an UFPAction that does not conform to the UFPAction definition
 *
 * @class InvalidUFPAction
 * @access public
 * @param {array} validationErrors - an array of validation errors
 */
class InvalidUFPAction extends Error {

  constructor(validationErrors) {
    super()
    this.name = 'InvalidUFPAction'
    this.message = 'Invalid UFPAction'
    this.validationErrors = validationErrors
  }

}

/**
 * Error class for an error resolved by action promise when Request cancelled by Prehandler
 *
 * @class UfpMiddlewareRequestCancelledError
 * @access public
 * @param {string} message - the error message
 */
class UfpMiddlewareRequestCancelledError extends Error {

  constructor() {
    super()
    this.name = 'UfpMiddlewareRequestCancelledError'
    this.message = 'UfpMiddlewareRequest Cancelled'
  }

}

/**
 * Error class for an error when max retry reached
 *
 * @class UfpMiddlewareMaxRetryReachedError
 * @access public
 */
class UfpMiddlewareMaxRetryReachedError extends Error {

  constructor() {
    super()
    this.name = 'UfpMiddlewareMaxRetryReachedError'
    this.message = 'UfpMiddleware reached the maxRetryCount'
  }

}

/**
 * Error class for an error when max retry reached
 *
 * @class UfpMiddlewareMaxRetryReachedError
 * @access public
 */
class UfpMiddlewareResulthandlerMoreThenOneSuccessError extends Error {

  constructor() {
    super()
    this.name = 'UfpMiddlewareResulthandlerMoreThenOneSuccessError'
    this.message = 'UfpMiddlewareResulthandlerMoreThenOneSuccessError'
  }

}
/**
 * Error class for a custom `payload` or `meta` function throwing
 *
 * @class InternalError
 * @access public
 * @param {string} message - the error message
 */
class InternalError extends Error {

  constructor(message) {
    super()
    this.name = 'InternalError'
    this.message = message
  }

}

/**
 * Error class for an error raised trying to make an API call
 *
 * @class RequestError
 * @access public
 * @param {string} message - the error message
 */
class RequestError extends Error {

  constructor(message) {
    super()
    this.name = 'RequestError'
    this.message = message
  }

}

/**
 * Error class for an API response outside the 200 range
 *
 * @class ApiError
 * @access public
 * @param {number} status - the status code of the API response
 * @param {string} statusText - the status text of the API response
 * @param {object} response - the parsed JSON response of the API server if the
 *  'Content-Type' header signals a JSON response
 */
class ApiError extends Error {

  constructor(status, statusText, response) {
    super()
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.response = response
    this.message = `${status} - ${statusText}`
  }

}

class ResultParserError extends Error {

  constructor(message) {
    super()
    this.name = 'ResultParserError'
    this.message = message
  }

}

export {
  InvalidUFPAction,
  UfpMiddlewareRequestCancelledError,
  UfpMiddlewareMaxRetryReachedError,
  UfpMiddlewareResulthandlerMoreThenOneSuccessError,
  InternalError,
  RequestError,
  ApiError,
  ResultParserError
}

export default {
  InvalidUFPAction,
  UfpMiddlewareRequestCancelledError,
  UfpMiddlewareMaxRetryReachedError,
  UfpMiddlewareResulthandlerMoreThenOneSuccessError,
  InternalError,
  RequestError,
  ApiError,
  ResultParserError
}
