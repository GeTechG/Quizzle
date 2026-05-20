import {useState, useCallback} from 'react';
import i18n from '@/common/i18n';

export const useInputValidation = (initialValue = '', validationRules = {}) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');
    const [touched, setTouched] = useState(false);

    const validateInput = useCallback((inputValue) => {
        const {
            required = false,
            minLength = 0,
            maxLength = Infinity,
            pattern = null,
            customValidator = null,
            allowedChars = null
        } = validationRules;

        if (required && (!inputValue || inputValue.trim().length === 0)) {
            return i18n.t('validation.required');
        }

        if (!inputValue || inputValue.trim().length === 0) {
            return '';
        }

        const trimmedValue = inputValue.trim();
        if (trimmedValue.length < minLength) {
            return i18n.t('validation.minLength', {count: minLength});
        }
        if (trimmedValue.length > maxLength) {
            return i18n.t('validation.maxLength', {count: maxLength});
        }
        if (pattern && !pattern.test(inputValue)) {
            return i18n.t('validation.invalidFormat');
        }

        if (allowedChars && !allowedChars.test(inputValue)) {
            return i18n.t('validation.invalidChars');
        }

        if (customValidator) {
            const customError = customValidator(inputValue);
            if (customError) return customError;
        }

        return '';
    }, [validationRules]);

    const handleChange = useCallback((newValue) => {
        setValue(newValue);

        if (touched) {
            const errorMessage = validateInput(newValue);
            setError(errorMessage);

            if (!errorMessage && validationRules.maxLength) {
                const progress = newValue.length / validationRules.maxLength;
                if (progress > 0.8 && progress < 1) {
                    setWarning(i18n.t('validation.charsLeft', {count: validationRules.maxLength - newValue.length}));
                } else {
                    setWarning('');
                }
            }
        }
    }, [touched, validateInput, validationRules.maxLength]);

    const handleBlur = useCallback(() => {
        setTouched(true);
        const errorMessage = validateInput(value);
        setError(errorMessage);
    }, [value, validateInput]);

    const validate = useCallback(() => {
        setTouched(true);
        const errorMessage = validateInput(value);
        setError(errorMessage);
        return !errorMessage;
    }, [value, validateInput]);

    const reset = useCallback(() => {
        setValue(initialValue);
        setError('');
        setWarning('');
        setTouched(false);
    }, [initialValue]);

    return {
        value,
        error,
        warning,
        touched,
        isValid: !error && touched,
        setValue: handleChange,
        onBlur: handleBlur,
        validate,
        reset
    };
};

export const validationRules = {
    playerName: {
        required: true,
        minLength: 2,
        maxLength: 20,
        allowedChars: /^[a-zA-Z0-9\s\-_]*$/,
        customValidator: (value) => {
            const trimmed = value.trim();
            if (trimmed !== value) {
                return i18n.t('validation.playerNoLeadingTrailingSpaces');
            }
            if (/\s{2,}/.test(value)) {
                return i18n.t('validation.playerNoMultipleSpaces');
            }
            return null;
        }
    },
    quizTitle: {
        required: true,
        minLength: 1,
        maxLength: 100,
        customValidator: (value) => {
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return i18n.t('validation.titleEmpty');
            }
            return null;
        }
    },
    questionTitle: {
        required: true,
        minLength: 1,
        maxLength: 200,
        customValidator: (value) => {
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return i18n.t('validation.questionEmpty');
            }
            return null;
        }
    },
    answerText: {
        required: true,
        minLength: 1,
        maxLength: 150,
        customValidator: (value) => {
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return i18n.t('validation.answerEmpty');
            }
            return null;
        }
    }
};
