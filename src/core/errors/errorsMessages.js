module.exports = {
    TokenError: {
        dev: 'TokenError',
        prod: '',
    },
    AnonymousIsNotAuthorizedError: {
        dev: 'AnonymousIsNotAuthorizedError',
        prod: '',
    },
    NoSanitizer: {
        dev: 'NoSanitizer',
        prod: '',
    },
    ClientIdNotExist: {
        dev: 'ClientIdNotExist',
        prod: '',
    },
    DevelopperError: {
        dev: 'DevelopperError',
        prod: '',
        RigorousRouterMalformed: {
            dev: 'RigorousRouterMalformed',
            prod: '',
        },
    },
    ServiceError: {
        dev: 'ServiceError',
        prod: '',
        withModelName: (modelName) => {
            return {
                dev: `ServiceError.${modelName}`,
                prod: `ServiceError.${modelName}`,
            };
        },
    },
    ValidatorError: {
        dev: 'ValidatorError',
        prod: '',
        PrimaryKeyAlreadyDefined: {
            dev: 'ValidatorError.PrimaryKeyAlreadyDefined',
            prod: 'ValidatorError.PrimaryKeyAlreadyDefined',
            withAttribute: (primaryKeysAttributes) => {
                return {
                    dev: `ValidatorError.PrimaryKeyAlreadyDefined.${primaryKeysAttributes}`,
                    prod: `ValidatorError.PrimaryKeyAlreadyDefined.${primaryKeysAttributes}`,
                };
            },
        },
        AlreadyExist: {
            dev: 'ValidatorError.AlreadyExist',
            prod: 'ValidatorError.AlreadyExist',
            withAttribute: (attribute) => {
                return {
                    dev: `ValidatorError.AlreadyExist.${attribute}`,
                    prod: `ValidatorError.AlreadyExist.${attribute}`,
                };
            },
        },
        IsNotEmail: {
            dev: 'ValidatorError.IsNotEmail',
            prod: 'ValidatorError.IsNotEmail',
            withAttribute: (attribute) => {
                return {
                    dev: `ValidatorError.IsNotEmail.${attribute}`,
                    prod: `ValidatorError.IsNotEmail.${attribute}`,
                };
            },
        },
        IsNull: {
            dev: 'ValidatorError.IsNotNull',
            prod: 'ValidatorError.IsNotNull',
            withAttribute: (attribute) => {
                return {
                    dev: `ValidatorError.IsNotNull.${attribute}`,
                    prod: `ValidatorError.IsNotNull.${attribute}`,
                };
            },
        },
        IsNotFirstLetterCapitalized: {
            dev: 'ValidatorError.IsNotFirstLetterCapitalized',
            prod: 'ValidatorError.IsNotFirstLetterCapitalized',
            withAttribute: (attribute) => {
                return {
                    dev: `ValidatorError.IsNotFirstLetterCapitalized.${attribute}`,
                    prod: `ValidatorError.IsNotFirstLetterCapitalized.${attribute}`,
                };
            },
        },
        IsNotUsername: {
            dev: 'ValidatorError.IsNotUsername',
            prod: 'ValidatorError.IsNotUsername',
            withAttribute: (attribute) => {
                return {
                    dev: `ValidatorError.IsNotUsername.${attribute}`,
                    prod: `ValidatorError.IsNotUsername.${attribute}`,
                };
            },
        },
    },
    DataNotConform: {
        dev: 'DataNotConform',
        prod: 'DataNotConform',
        withAttribute: (attribute) => {
            return {
                dev: `DataNotConform.${attribute}`,
                prod: `DataNotConform.${attribute}`,
            };
        },
    },
    OperationError: {
        dev: 'OperationError',
        prod: '',
        CreateOne: {
            dev: 'OperationError.CreateOne',
            prod: '',
        },
        ReadOne: {
            dev: 'OperationError.ReadOne',
            prod: '',
        },
        ReadMany: {
            dev: 'OperationError.ReadMany',
            prod: '',
        },
        UpdateOne: {
            dev: 'OperationError.UpdateOne',
            prod: '',
        },
        DeleteOne: {
            dev: 'OperationError.DeleteOne',
            prod: '',
        },
        NotUpdatable: {
            dev: 'OperationError.NotUpdatable',
            prod: '',
        },
        ParametersMissing: {
            dev: 'OperationError.ParametersMissing',
            prod: '',
        },
        InvalidEmail: {
            dev: 'OperationError.InvalidEmail',
            prod: '',
        },
        InvalidName: {
            dev: 'OperationError.InvalidName',
            prod: '',
        },
        NullValue: {
            dev: 'OperationError.NullValue',
            prod: '',
        },
    },
    DataNotFoundError: {
        dev: 'DataNotFoundError',
        prod: '',
    },
    NullScrappedObjectError: {
        dev: 'NullScrappedObjectError',
        prod: '',
    },
    AwsDeleteFileError: {
        dev: 'AwsDeleteFileError',
        prod: '',
    },
    AwsUploadFileError: {
        dev: 'AwsUploadFileError',
        prod: '',
    },
    SendNotificationError: {
        dev: 'SendNotificationError',
        prod: '',
    },
    UndefinedParameterInputError: {
        dev: 'UndefinedParameterInputError',
        prod: '',
    },
    ParameterInputError: {
        dev: 'ParameterInputError',
        prod: '',
    },
    InputError: {
        dev: 'InputError',
        prod: '',
        NullValue: {
            dev: 'InputError.NullValue',
            prod: '',
        },
    },
    MissingTimezoneHeaderError: {
        dev: 'MissingTimezoneHeaderError',
        prod: 'MissingTimezoneHeaderError'
    },
    InvalidTimezoneHeaderError: {
        dev: 'InvalidTimezoneHeaderError',
        prod: 'InvalidTimezoneHeaderError'
    },
    InvalidDatasetElementValueError: {
        dev: 'InvalidDatasetElementValueError',
        prod: 'InvalidDatasetElementValueError'
    },
    InexistentWebsiteError: {
        dev: 'InexistentWebsiteError',
        prod: 'InexistentWebsiteError'
    },
    NoArticlesToSellError: {
        dev: 'NoArticlesToSellError',
        prod: 'NoArticlesToSellError'
    },
    NoWebsiteGAViewError: {
        dev: 'NoWebsiteGAViewError',
        prod: 'NoWebsiteGAViewError'
    },
    MongoDBError: {
        dev: 'MongoDBError',
        prod: 'MongoDBError'
    },
    AccessDeclinedError: {
        dev: 'AccessDeclinedError',
        prod: 'AccessDeclinedError'
    },
};
