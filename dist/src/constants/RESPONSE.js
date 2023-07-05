"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE = void 0;
exports.RESPONSE = {
    v1: {
        me: {
            password: {
                PATCH: {
                    PASSWORD_CHANGED: {
                        code: 'PASSWORD_CHANGED',
                        message: '비밀번호가 변경되었습니다'
                    },
                    PASSWORD_TOO_SHORT: {
                        code: 'PASSWORD_TOO_SHORT',
                        message: '비밀번호가 너무 짧습니다'
                    },
                    PASSWORD_MISMATCH: {
                        code: 'PASSWORD_MISMATCH',
                        message: '비밀번호가 일치하지 않습니다'
                    },
                    USER_NOT_EXISTS: {
                        code: 'USER_NOT_EXISTS',
                        message: '사용자 정보가 존재하지 않습니다'
                    },
                    NOT_ALLOWED_USER_TYPE: {
                        code: 'NOT_ALLOWED_USER_TYPE',
                        message: '비밀번호를 변경할 수 없는 사용자입니다'
                    },
                },
            }
        }
    },
    RESOURCE: {
        CREATED: {
            code: 'CREATED',
            message: '생성되었습니다',
        },
        UPDATED: {
            code: 'CREATED',
            message: '수정되었습니다',
        },
        DELETED: {
            code: 'DELETED',
            message: '삭제되었습니다',
        },
        NOT_FOUND: {
            code: 'RESOURCE_NOT_FOUND',
        },
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
    },
    PRECONDITION_FAILED: {
        code: 'PRECONDITION_FAILED',
    },
    INTERNAL_ERROR: {
        code: "INTERNAL_ERROR",
        message: '알 수 없는 오류가 발생했습니다'
    },
    CLIENT_ERROR: {
        code: "CLIENT_ERROR",
    },
    DUPLICATE_ERROR: {
        code: "DUPLICATE",
        message: "중복되었습니다"
    },
};
