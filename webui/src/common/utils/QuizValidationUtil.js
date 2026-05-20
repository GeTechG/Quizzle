import {QUESTION_TYPES, ANSWER_LIMITS, MINIMUM_ANSWERS} from '../constants/QuestionTypes.js';
import i18n from '../i18n';

export class QuizValidationUtil {
    static LIMITS = {MAX_QUESTIONS: 50, MIN_QUESTIONS: 1, MAX_QUESTION_LENGTH: 200, MAX_ANSWER_LENGTH: 150};

    static validateQuiz(questions, title) {
        if (!title || title.trim() === "") return { isValid: false, error: i18n.t('quizValidation.titleEmpty') };
        if (questions.length === 0) return { isValid: false, error: i18n.t('quizValidation.minQuestions') };
        if (questions.length > this.LIMITS.MAX_QUESTIONS) return { isValid: false, error: i18n.t('quizValidation.maxQuestions', {count: this.LIMITS.MAX_QUESTIONS}) };

        for (const question of questions) {
            const questionValidation = this.validateQuestion(question);
            if (!questionValidation.isValid) return questionValidation;
        }
        return { isValid: true };
    }

    static validateQuestion(question) {
        if (!question.title || question.title.trim() === "") return { isValid: false, error: i18n.t('quizValidation.questionEmpty') };
        if (question.title.trim().length > this.LIMITS.MAX_QUESTION_LENGTH) return { isValid: false, error: i18n.t('quizValidation.questionTooLong', {count: this.LIMITS.MAX_QUESTION_LENGTH}) };
        const questionType = question.type || QUESTION_TYPES.MULTIPLE_CHOICE;
        return this.validateAnswers(question.answers || [], questionType);
    }

    static validateAnswers(answers, questionType) {
        const minAnswers = MINIMUM_ANSWERS[questionType] || 1;
        const maxAnswers = ANSWER_LIMITS[questionType] || 6;

        if (answers.length < minAnswers) return { isValid: false, error: this.getMinAnswersErrorMessage(questionType, minAnswers) };
        if (answers.length > maxAnswers) return { isValid: false, error: this.getMaxAnswersErrorMessage(questionType, maxAnswers) };

        switch (questionType) {
            case QUESTION_TYPES.TEXT: return this.validateTextAnswers(answers);
            case QUESTION_TYPES.TRUE_FALSE: return this.validateTrueFalseAnswers(answers);
            case QUESTION_TYPES.SEQUENCE: return this.validateSequenceAnswers(answers);
            case QUESTION_TYPES.SLIDER: return this.validateSliderAnswers(answers);
            case QUESTION_TYPES.MULTIPLE_CHOICE:
            default: return this.validateMultipleChoiceAnswers(answers);
        }
    }

    static validateTextAnswers(answers) {
        if (answers.some(a => !a.content || a.content.trim() === "")) return { isValid: false, error: i18n.t('quizValidation.textAnswerEmpty') };
        return { isValid: true };
    }

    static validateTrueFalseAnswers(answers) {
        if (answers.length !== 2) return { isValid: false, error: i18n.t('quizValidation.trueFalseTwo') };
        if (!answers.some(a => a.is_correct)) return { isValid: false, error: i18n.t('quizValidation.trueFalseOneCorrect') };
        return { isValid: true };
    }

    static validateMultipleChoiceAnswers(answers) {
        if (answers.filter(a => a.is_correct).length === 0) return { isValid: false, error: i18n.t('quizValidation.mcOneCorrect') };
        if (answers.some(a => (!a.content || a.content.trim() === "") && a.imageId === undefined)) return { isValid: false, error: i18n.t('quizValidation.mcEmpty') };
        if (answers.some(a => a.content?.trim().length > this.LIMITS.MAX_ANSWER_LENGTH && a.type === QUESTION_TYPES.TEXT)) return { isValid: false, error: i18n.t('quizValidation.mcTooLong', {count: this.LIMITS.MAX_ANSWER_LENGTH}) };
        return { isValid: true };
    }

    static validateSequenceAnswers(answers) {
        if (answers.some(a => !a.content || a.content.trim() === "")) return { isValid: false, error: i18n.t('quizValidation.sequenceEmpty') };
        if (answers.some(a => a.content?.trim().length > this.LIMITS.MAX_ANSWER_LENGTH)) return { isValid: false, error: i18n.t('quizValidation.sequenceTooLong', {count: this.LIMITS.MAX_ANSWER_LENGTH}) };
        return { isValid: true };
    }

    static validateSliderAnswers(answers) {
        if (!answers || answers.length !== 1) return { isValid: false, error: i18n.t('quizValidation.sliderOneConfig') };
        const config = answers[0];
        if (config.correctValue === undefined || config.correctValue === null) return { isValid: false, error: i18n.t('quizValidation.sliderCorrectValue') };
        if (config.min === undefined || config.max === undefined) return { isValid: false, error: i18n.t('quizValidation.sliderMinMax') };
        if (config.min >= config.max) return { isValid: false, error: i18n.t('quizValidation.sliderMinLess') };
        if (config.correctValue < config.min || config.correctValue > config.max) return { isValid: false, error: i18n.t('quizValidation.sliderInRange') };
        if (config.step !== undefined && config.step <= 0) return { isValid: false, error: i18n.t('quizValidation.sliderStepPositive') };
        return { isValid: true };
    }

    static getMinAnswersErrorMessage(questionType, minAnswers) {
        switch (questionType) {
            case QUESTION_TYPES.TEXT: return i18n.t('quizValidation.minTextAnswers');
            case QUESTION_TYPES.TRUE_FALSE: return i18n.t('quizValidation.trueFalseTwo');
            case QUESTION_TYPES.SEQUENCE: return i18n.t('quizValidation.minSequenceAnswers');
            case QUESTION_TYPES.SLIDER: return i18n.t('quizValidation.minSliderConfig');
            case QUESTION_TYPES.MULTIPLE_CHOICE:
            default: return i18n.t('quizValidation.minMCAnswers');
        }
    }

    static getMaxAnswersErrorMessage(questionType, maxAnswers) {
        switch (questionType) {
            case QUESTION_TYPES.TEXT: return i18n.t('quizValidation.maxTextAnswers', {count: maxAnswers});
            case QUESTION_TYPES.TRUE_FALSE: return i18n.t('quizValidation.trueFalseTwo');
            case QUESTION_TYPES.SEQUENCE: return i18n.t('quizValidation.maxSequenceAnswers', {count: maxAnswers});
            case QUESTION_TYPES.SLIDER: return i18n.t('quizValidation.maxSliderConfig');
            case QUESTION_TYPES.MULTIPLE_CHOICE:
            default: return i18n.t('quizValidation.maxMCAnswers', {count: maxAnswers});
        }
    }

    static validateQuizForContext(json) {
        if (json.__type !== "QUIZZLE2") return false;
        const {title, questions} = json;
        if (!title || title.length > 100) return false;
        if (!questions || questions.length === 0) return false;
        if (questions.some(q => !q.title || q.title === "" || q.title.length > 200)) return false;

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (!question.type) return false;
            const questionType = question.type;

            if (questionType === QUESTION_TYPES.TEXT) {
                if (!question.answers || question.answers.length === 0 || question.answers.length > 10) return false;
                if (question.answers.some(a => !a.content || a.content.trim() === "")) return false;
            } else if (questionType === QUESTION_TYPES.TRUE_FALSE) {
                if (!question.answers || question.answers.length !== 2) return false;
                if (question.answers.some(a => typeof a.is_correct !== 'boolean')) return false;
                if (!question.answers.some(a => a.is_correct) || question.answers.filter(a => a.is_correct).length !== 1) return false;
            } else if (questionType === QUESTION_TYPES.MULTIPLE_CHOICE) {
                if (!question.answers || question.answers.length < 2 || question.answers.length > 6) return false;
                if (question.answers.some(a => typeof a.is_correct !== 'boolean')) return false;
                if (question.answers.filter(a => a.is_correct).length === 0) return false;
                if (question.answers.some(a => !a.content || a.content.trim() === "")) return false;
            } else if (questionType === QUESTION_TYPES.SEQUENCE) {
                if (!question.answers || question.answers.length < 2 || question.answers.length > 8) return false;
                if (question.answers.some(a => !a.content || a.content.trim() === "")) return false;
            } else if (questionType === QUESTION_TYPES.SLIDER) {
                if (!question.answers || question.answers.length !== 1) return false;
                const cfg = question.answers[0];
                if (cfg.correctValue == null || cfg.min == null || cfg.max == null) return false;
                if (cfg.min >= cfg.max || cfg.correctValue < cfg.min || cfg.correctValue > cfg.max) return false;
            } else {
                return false;
            }
        }
        return true;
    }
}
