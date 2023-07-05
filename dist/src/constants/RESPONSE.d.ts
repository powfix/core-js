export declare const RESPONSE: {
    v1: {
        me: {
            password: {
                PATCH: {
                    PASSWORD_CHANGED: {
                        code: string;
                        message: string;
                    };
                    PASSWORD_TOO_SHORT: {
                        code: string;
                        message: string;
                    };
                    PASSWORD_MISMATCH: {
                        code: string;
                        message: string;
                    };
                    USER_NOT_EXISTS: {
                        code: string;
                        message: string;
                    };
                    NOT_ALLOWED_USER_TYPE: {
                        code: string;
                        message: string;
                    };
                };
            };
        };
    };
    RESOURCE: {
        CREATED: {
            code: string;
            message: string;
        };
        UPDATED: {
            code: string;
            message: string;
        };
        DELETED: {
            code: string;
            message: string;
        };
        NOT_FOUND: {
            code: string;
        };
    };
    NOT_FOUND: {
        code: string;
    };
    PRECONDITION_FAILED: {
        code: string;
    };
    INTERNAL_ERROR: {
        code: string;
        message: string;
    };
    CLIENT_ERROR: {
        code: string;
    };
    DUPLICATE_ERROR: {
        code: string;
        message: string;
    };
};
