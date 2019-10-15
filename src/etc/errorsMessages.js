module.exports = {
    DevelopperError: {
        dev: 'DevelopperError',
        prod: '',
    },
    NullObject: {
        dev: 'NullObject',
        prod: '',
    },
    AnonymousIsNotAuthorizedError: {
        dev: 'AnonymousIsNotAuthorizedError',
        prod: '',
    },
    TokenError: {
        dev: 'TokenError',
        prod: '',
    },
    AuthenticateError: {
        dev: 'AuthenticateError',
        prod: '',
        UserNotFound: {
            dev: 'UserNotFound',
            prod: '',
        },
    },
    ServiceError: {
        dev: 'ServiceError',
        prod: '',
        withModelName: (modelName) => {
            return {
                dev: `${modelName}_ServiceError`,
                prod: `${modelName}_ServiceError`,
            };
        },
    },
    RouteError: {
        dev: 'RouteError',
        prod: '',
    },
    InputNotConform: {
        dev: 'InputNotConform',
        prod: '',
    },
    DataNotConform: {
        dev: 'DataNotConform',
        prod: '',
        withAttribute: (attribute) => {
            return {
                dev: `DataNotConform.${attribute}`,
                prod: `DataNotConform.${attribute}`,
            };
        },
    },
    EnvironmentError: {
        dev: 'EnvironmentError',
        prod: 'EnvironmentError',
    },
};
