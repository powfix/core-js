"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
class Validator {
    static validate(value, options) {
        value = value || '';
        const validations = [];
        const errors = [];
        const { length } = value;
        const spaceCount = (value.match(/\s/g) || []).length;
        const numberCount = (value.match(/\d/g) || []).length;
        const alphabetCount = (value.match(/[A-Za-z]/g) || []).length;
        const alphabetLowerCaseCount = (value.match(/[a-z]/g) || []).length;
        const alphabetUpperCaseCount = (value.match(/[A-Z]/g) || []).length;
        const specialCount = (value.match(/[~`!@#$%^&*()\-+={[}\]|\\:;"'<,>.?/]/g) || []).length;
        const startsWithNumber = /^\d/.test(value);
        const startsWithAlphabet = /^[A-Za-z]/.test(value);
        const startsWithSpecialCharacter = /^[~`!@#$%^&*()\-+={[}\]|\\:;"'<,>.?/]/.test(value);
        // 최소 길이
        if (options.minLength !== undefined && options.minLength > -1) {
            validations.push(Validator.VALIDATION.MIN_LENGTH);
            if (length < options.minLength) {
                errors.push(Validator.VALIDATION.MIN_LENGTH);
            }
        }
        // 최대 길이
        if (options.maxLength !== undefined && options.maxLength > -1) {
            validations.push(Validator.VALIDATION.MAX_LENGTH);
            if (length > options.maxLength) {
                errors.push(Validator.VALIDATION.MAX_LENGTH);
            }
        }
        const validateMin = (option, value, validation) => {
            if (option !== undefined && option > -1) {
                validations.push(validation);
                if (value < option) {
                    errors.push(validation);
                }
            }
        };
        const validateMax = (option, value, validation) => {
            if (option !== undefined && option > -1) {
                validations.push(validation);
                if (value > option) {
                    errors.push(validation);
                }
            }
        };
        // 공백 개수
        validateMin(options.spaceMinCount, spaceCount, Validator.VALIDATION.SPACE_MIN_COUNT);
        validateMax(options.spaceMaxCount, spaceCount, Validator.VALIDATION.SPACE_MAX_COUNT);
        // 숫자 개수
        validateMin(options.numberMinCount, numberCount, Validator.VALIDATION.NUMBER_MIN_COUNT);
        validateMax(options.numberMaxCount, numberCount, Validator.VALIDATION.NUMBER_MAX_COUNT);
        // 알파벳 개수
        validateMin(options.alphabetMinCount, alphabetCount, Validator.VALIDATION.ALPHABET_MIN_COUNT);
        validateMax(options.alphabetMaxCount, alphabetCount, Validator.VALIDATION.ALPHABET_MAX_COUNT);
        // 알파벳(소문자) 개수
        validateMin(options.alphabetLowerCaseMinCount, alphabetLowerCaseCount, Validator.VALIDATION.ALPHABET_LOWER_CASE_MIN_COUNT);
        validateMax(options.alphabetLowerCaseMaxCount, alphabetLowerCaseCount, Validator.VALIDATION.ALPHABET_LOWER_CASE_MAX_COUNT);
        // 알파벳(대문자) 개수
        validateMin(options.alphabetUpperCaseMinCount, alphabetUpperCaseCount, Validator.VALIDATION.ALPHABET_UPPER_CASE_MIN_COUNT);
        validateMax(options.alphabetUpperCaseMaxCount, alphabetUpperCaseCount, Validator.VALIDATION.ALPHABET_UPPER_CASE_MAX_COUNT);
        // 특수문자 개수
        validateMin(options.specialCharacterMinCount, specialCount, Validator.VALIDATION.SPECIAL_CHARACTER_MIN_COUNT);
        validateMax(options.specialCharacterMaxCount, specialCount, Validator.VALIDATION.SPECIAL_CHARACTER_MAX_COUNT);
        // 숫자로 시작
        if (options.startsWithNumber) {
            validations.push(Validator.VALIDATION.STARTS_WITH_NUMBER);
            if (!startsWithNumber) {
                errors.push(Validator.VALIDATION.STARTS_WITH_NUMBER);
            }
        }
        // 영문으로 시작
        if (options.startsWithAlphabet) {
            validations.push(Validator.VALIDATION.STARTS_WITH_ALPHABET);
            if (!startsWithAlphabet) {
                errors.push(Validator.VALIDATION.STARTS_WITH_ALPHABET);
            }
        }
        // 특수문자로 시작
        if (options.startsWithSpecialCharacter) {
            validations.push(Validator.VALIDATION.STARTS_WITH_SPECIAL_CHARACTER);
            if (!startsWithSpecialCharacter) {
                errors.push(Validator.VALIDATION.STARTS_WITH_SPECIAL_CHARACTER);
            }
        }
        return {
            result: errors.length === 0,
            validations,
            passes: validations.filter(e => !errors.includes(e)),
            errors,
        };
    }
}
exports.Validator = Validator;
(function (Validator) {
    let VALIDATION;
    (function (VALIDATION) {
        VALIDATION["MIN_LENGTH"] = "MIN_LENGTH";
        VALIDATION["MAX_LENGTH"] = "MAX_LENGTH";
        VALIDATION["SPACE_MIN_COUNT"] = "SPACE_MIN_COUNT";
        VALIDATION["SPACE_MAX_COUNT"] = "SPACE_MAX_COUNT";
        VALIDATION["NUMBER_MIN_COUNT"] = "NUMBER_MIN_COUNT";
        VALIDATION["NUMBER_MAX_COUNT"] = "NUMBER_MAX_COUNT";
        VALIDATION["ALPHABET_MIN_COUNT"] = "ALPHABET_MIN_COUNT";
        VALIDATION["ALPHABET_MAX_COUNT"] = "ALPHABET_MAX_COUNT";
        VALIDATION["ALPHABET_LOWER_CASE_MIN_COUNT"] = "ALPHABET_LOWER_CASE_MIN_COUNT";
        VALIDATION["ALPHABET_LOWER_CASE_MAX_COUNT"] = "ALPHABET_LOWER_CASE_MAX_COUNT";
        VALIDATION["ALPHABET_UPPER_CASE_MIN_COUNT"] = "ALPHABET_UPPER_CASE_MIN_COUNT";
        VALIDATION["ALPHABET_UPPER_CASE_MAX_COUNT"] = "ALPHABET_UPPER_CASE_MAX_COUNT";
        VALIDATION["SPECIAL_CHARACTER_MIN_COUNT"] = "SPECIAL_CHARACTER_MIN_COUNT";
        VALIDATION["SPECIAL_CHARACTER_MAX_COUNT"] = "SPECIAL_CHARACTER_MAX_COUNT";
        VALIDATION["STARTS_WITH_ALPHABET"] = "STARTS_WITH_ALPHABET";
        VALIDATION["STARTS_WITH_NUMBER"] = "STARTS_WITH_NUMBER";
        VALIDATION["STARTS_WITH_SPECIAL_CHARACTER"] = "STARTS_WITH_SPECIAL_CHARACTER";
    })(VALIDATION = Validator.VALIDATION || (Validator.VALIDATION = {}));
})(Validator || (exports.Validator = Validator = {}));
