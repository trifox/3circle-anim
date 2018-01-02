const ActionConstants = {
    'UFP_STARTUP_NEXT_STAGE': 'UFP_STARTUP_NEXT_STAGE',
    'UFP_STARTUP_FINISHED': 'UFP_STARTUP_FINISHED',
    'UFP_STARTUP_NO_STEPS': 'UFP_STARTUP_NO_STEPS'
}

const LoadingStateEnum = {
    'UNINITIALISED': 'notLoaded',
    'SUCCESS': 'success',
    'LOADING': 'loading',
    'FAILURE': 'failure'
}

export default{
    NAME: 'ufp-startup',
    ActionConstants,
    LoadingStateEnum
}
