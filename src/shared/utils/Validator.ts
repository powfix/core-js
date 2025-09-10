export class Validator {
  public static validate(value: string | null | undefined, options: Validator.Options): {result: boolean, validations: Validator.VALIDATION[], passes: Validator.VALIDATION[], errors: Validator.VALIDATION[]} {
    value = value || '';

    const validations: Validator.VALIDATION[] = [];
    const errors: Validator.VALIDATION[] = [];

    const {length} = value;
    const spaceCount = (value.match(/\s/g) || []).length;
    const numberCount = (value.match(/\d/g) || []).length;
    const alphabetCount = (value.match(/[A-Za-z]/g) || []).length;
    const alphabetLowerCaseCount = (value.match(/[a-z]/g) || []).length;
    const alphabetUpperCaseCount = (value.match(/[A-Z]/g) || []).length;
    const specialCount = (value.match(/[~`!@#$%^&*()\-+={[}\]|\\:;"'<,>.?/]/g) || []).length;
    const startsWithNumber = /^\d/.test(value);
    const startsWithAlphabet = /^[A-Za-z]/.test(value);
    const startsWithSpecialCharacter =  /^[~`!@#$%^&*()\-+={[}\]|\\:;"'<,>.?/]/.test(value);

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

    const validateMin = (option: number | undefined, value: number, validation: Validator.VALIDATION) => {
      if (option !== undefined && option > -1) {
        validations.push(validation);
        if (value < option) {
          errors.push(validation);
        }
      }
    };

    const validateMax = (option: number | undefined, value: number, validation: Validator.VALIDATION) => {
      if (option !== undefined && option > -1) {
        validations.push(validation);
        if (value > option) {
          errors.push(validation);
        }
      }
    }

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

export namespace Validator {
  export enum VALIDATION {
    MIN_LENGTH = 'MIN_LENGTH',
    MAX_LENGTH = 'MAX_LENGTH',

    SPACE_MIN_COUNT = 'SPACE_MIN_COUNT',
    SPACE_MAX_COUNT = 'SPACE_MAX_COUNT',

    NUMBER_MIN_COUNT = 'NUMBER_MIN_COUNT',
    NUMBER_MAX_COUNT = 'NUMBER_MAX_COUNT',

    ALPHABET_MIN_COUNT = 'ALPHABET_MIN_COUNT',
    ALPHABET_MAX_COUNT = 'ALPHABET_MAX_COUNT',

    ALPHABET_LOWER_CASE_MIN_COUNT = 'ALPHABET_LOWER_CASE_MIN_COUNT',
    ALPHABET_LOWER_CASE_MAX_COUNT = 'ALPHABET_LOWER_CASE_MAX_COUNT',

    ALPHABET_UPPER_CASE_MIN_COUNT = 'ALPHABET_UPPER_CASE_MIN_COUNT',
    ALPHABET_UPPER_CASE_MAX_COUNT = 'ALPHABET_UPPER_CASE_MAX_COUNT',

    SPECIAL_CHARACTER_MIN_COUNT = 'SPECIAL_CHARACTER_MIN_COUNT',
    SPECIAL_CHARACTER_MAX_COUNT = 'SPECIAL_CHARACTER_MAX_COUNT',

    STARTS_WITH_ALPHABET = 'STARTS_WITH_ALPHABET',
    STARTS_WITH_NUMBER = 'STARTS_WITH_NUMBER',
    STARTS_WITH_SPECIAL_CHARACTER = 'STARTS_WITH_SPECIAL_CHARACTER',
  }

  export interface Options {
    minLength?: number;                           // 최소 길이
    maxLength?: number;                           // 최대 길이

    spaceMinCount?: number;                  // 공백 최소 개수
    spaceMaxCount?: number;                  // 공백 최대 개수

    numberMinCount?: number;                      // 숫자 최소 개수
    numberMaxCount?: number;                      // 숫자 최대 개수

    alphabetMinCount?: number;                    // 알파벳 최소 개수
    alphabetMaxCount?: number;                    // 알파벳 최대 개수

    alphabetLowerCaseMinCount?: number;           // 알파벳(소문자) 최소 개수
    alphabetLowerCaseMaxCount?: number;           // 알페벳(소문자) 최대 개수

    alphabetUpperCaseMinCount?: number;           // 알파벳(대문자) 최소 개수
    alphabetUpperCaseMaxCount?: number;           // 알파벳(대문자) 최대 개수

    specialCharacterMinCount?: number;            // 특수문자 최소 개수
    specialCharacterMaxCount?: number;            // 특수문자 최대 개수

    startsWithNumber?: boolean;                   // 숫자로 시작해야하는가
    startsWithAlphabet?: boolean;                 // 알파벳으로 시작해야하는가
    startsWithSpecialCharacter?: boolean;         // 툭수문자로 시작해야하는가
  }
}
