export declare class Validator {
    static validate(value: string | null | undefined, options: Validator.Options): {
        result: boolean;
        validations: Validator.VALIDATION[];
        passes: Validator.VALIDATION[];
        errors: Validator.VALIDATION[];
    };
}
export declare namespace Validator {
    enum VALIDATION {
        MIN_LENGTH = "MIN_LENGTH",
        MAX_LENGTH = "MAX_LENGTH",
        SPACE_MIN_COUNT = "SPACE_MIN_COUNT",
        SPACE_MAX_COUNT = "SPACE_MAX_COUNT",
        NUMBER_MIN_COUNT = "NUMBER_MIN_COUNT",
        NUMBER_MAX_COUNT = "NUMBER_MAX_COUNT",
        ALPHABET_MIN_COUNT = "ALPHABET_MIN_COUNT",
        ALPHABET_MAX_COUNT = "ALPHABET_MAX_COUNT",
        ALPHABET_LOWER_CASE_MIN_COUNT = "ALPHABET_LOWER_CASE_MIN_COUNT",
        ALPHABET_LOWER_CASE_MAX_COUNT = "ALPHABET_LOWER_CASE_MAX_COUNT",
        ALPHABET_UPPER_CASE_MIN_COUNT = "ALPHABET_UPPER_CASE_MIN_COUNT",
        ALPHABET_UPPER_CASE_MAX_COUNT = "ALPHABET_UPPER_CASE_MAX_COUNT",
        SPECIAL_CHARACTER_MIN_COUNT = "SPECIAL_CHARACTER_MIN_COUNT",
        SPECIAL_CHARACTER_MAX_COUNT = "SPECIAL_CHARACTER_MAX_COUNT",
        STARTS_WITH_ALPHABET = "STARTS_WITH_ALPHABET",
        STARTS_WITH_NUMBER = "STARTS_WITH_NUMBER",
        STARTS_WITH_SPECIAL_CHARACTER = "STARTS_WITH_SPECIAL_CHARACTER"
    }
    interface Options {
        minLength?: number;
        maxLength?: number;
        spaceMinCount?: number;
        spaceMaxCount?: number;
        numberMinCount?: number;
        numberMaxCount?: number;
        alphabetMinCount?: number;
        alphabetMaxCount?: number;
        alphabetLowerCaseMinCount?: number;
        alphabetLowerCaseMaxCount?: number;
        alphabetUpperCaseMinCount?: number;
        alphabetUpperCaseMaxCount?: number;
        specialCharacterMinCount?: number;
        specialCharacterMaxCount?: number;
        startsWithNumber?: boolean;
        startsWithAlphabet?: boolean;
        startsWithSpecialCharacter?: boolean;
    }
}
