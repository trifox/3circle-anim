const IntlConfig = {

    locales: [],
    languages: [],
    getLocales: () => {
        return IntlConfig.locales
    },
    getLanguages: () => {
        if (IntlConfig.languages.length === 0) {
            return ['en']
        } else {
            return IntlConfig.languages
        }
    }

}

export default IntlConfig
