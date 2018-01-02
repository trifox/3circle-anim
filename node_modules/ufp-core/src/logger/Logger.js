const factorLogger = (name) => {
    return {
        log: (message, ...params) => {
            console.log(name + ' ' + message, ...params)
        }
    }
}

export default{
    factorLogger

}
