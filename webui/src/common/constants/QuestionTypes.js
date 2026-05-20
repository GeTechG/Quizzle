import {faListUl, faToggleOn, faKeyboard, faSort, faSliders} from "@fortawesome/free-solid-svg-icons";
import i18n from "@/common/i18n";

export const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 'multiple-choice',
    TRUE_FALSE: 'true-false',
    TEXT: 'text',
    SEQUENCE: 'sequence',
    SLIDER: 'slider'
};

export const DEFAULT_QUESTION_TYPE = QUESTION_TYPES.MULTIPLE_CHOICE;

const QUESTION_TYPE_KEYS = {
    [QUESTION_TYPES.MULTIPLE_CHOICE]: 'multipleChoice',
    [QUESTION_TYPES.TRUE_FALSE]: 'trueFalse',
    [QUESTION_TYPES.TEXT]: 'text',
    [QUESTION_TYPES.SEQUENCE]: 'sequence',
    [QUESTION_TYPES.SLIDER]: 'slider'
};

const QUESTION_TYPE_ICONS = {
    [QUESTION_TYPES.MULTIPLE_CHOICE]: faListUl,
    [QUESTION_TYPES.TRUE_FALSE]: faToggleOn,
    [QUESTION_TYPES.TEXT]: faKeyboard,
    [QUESTION_TYPES.SEQUENCE]: faSort,
    [QUESTION_TYPES.SLIDER]: faSliders
};

const localizedName = (type) => i18n.t(`questionTypes.${QUESTION_TYPE_KEYS[type] || 'multipleChoice'}.name`);
const localizedDescription = (type) => i18n.t(`questionTypes.${QUESTION_TYPE_KEYS[type] || 'multipleChoice'}.description`);

export const QUESTION_TYPE_CONFIG = [
    {type: QUESTION_TYPES.MULTIPLE_CHOICE, icon: faListUl, get name() { return localizedName(QUESTION_TYPES.MULTIPLE_CHOICE); }, get description() { return localizedDescription(QUESTION_TYPES.MULTIPLE_CHOICE); }},
    {type: QUESTION_TYPES.TRUE_FALSE, icon: faToggleOn, get name() { return localizedName(QUESTION_TYPES.TRUE_FALSE); }, get description() { return localizedDescription(QUESTION_TYPES.TRUE_FALSE); }},
    {type: QUESTION_TYPES.TEXT, icon: faKeyboard, get name() { return localizedName(QUESTION_TYPES.TEXT); }, get description() { return localizedDescription(QUESTION_TYPES.TEXT); }},
    {type: QUESTION_TYPES.SEQUENCE, icon: faSort, get name() { return localizedName(QUESTION_TYPES.SEQUENCE); }, get description() { return localizedDescription(QUESTION_TYPES.SEQUENCE); }},
    {type: QUESTION_TYPES.SLIDER, icon: faSliders, get name() { return localizedName(QUESTION_TYPES.SLIDER); }, get description() { return localizedDescription(QUESTION_TYPES.SLIDER); }}
];

export const getQuestionTypeIcon = (type) => QUESTION_TYPE_ICONS[type] || QUESTION_TYPE_ICONS[DEFAULT_QUESTION_TYPE];
export const getQuestionTypeName = (type) => localizedName(type);

export const getDefaultAnswersForType = (type) => {
    switch (type) {
        case QUESTION_TYPES.TRUE_FALSE: return [{type: QUESTION_TYPES.TEXT, content: i18n.t('quizCreator.trueFalse.true'), is_correct: false}, {type: QUESTION_TYPES.TEXT, content: i18n.t('quizCreator.trueFalse.false'), is_correct: false}];
        case QUESTION_TYPES.TEXT: return [{content: ''}];
        case QUESTION_TYPES.SEQUENCE: return [];
        case QUESTION_TYPES.SLIDER: return [{correctValue: 50, min: 0, max: 100, step: 1, answerMargin: 'medium'}];
        case QUESTION_TYPES.MULTIPLE_CHOICE:
        default: return [];
    }
};

export const ANSWER_LIMITS = {
    [QUESTION_TYPES.MULTIPLE_CHOICE]: 6,
    [QUESTION_TYPES.TRUE_FALSE]: 2,
    [QUESTION_TYPES.TEXT]: 10,
    [QUESTION_TYPES.SEQUENCE]: 8,
    [QUESTION_TYPES.SLIDER]: 1
};

export const MINIMUM_ANSWERS = {
    [QUESTION_TYPES.MULTIPLE_CHOICE]: 2,
    [QUESTION_TYPES.TRUE_FALSE]: 2,
    [QUESTION_TYPES.TEXT]: 1,
    [QUESTION_TYPES.SEQUENCE]: 2,
    [QUESTION_TYPES.SLIDER]: 1
};

const SLIDER_MARGIN_KEYS = ['none', 'low', 'medium', 'high', 'maximum'];
const SLIDER_MARGIN_FACTORS = {none: 0, low: 0.05, medium: 0.1, high: 0.2, maximum: 0.4};

export const SLIDER_MARGIN_CONFIG = SLIDER_MARGIN_KEYS.reduce((acc, key) => {
    acc[key] = {
        factor: SLIDER_MARGIN_FACTORS[key],
        get label() { return i18n.t(`sliderMargin.${key}.label`); },
        get description() { return i18n.t(`sliderMargin.${key}.description`); }
    };
    return acc;
}, {});
