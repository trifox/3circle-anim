export default class ResultHandlerResult {

    constructor(success = false, handled = false, retry = false) {
        this.success = success
        this.handled = handled
        this.retry = retry
    }

    addPayload = (data) => {
        this.additionalPayload = data
        return this
    }

}
