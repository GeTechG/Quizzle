import "./styles.sass";
import SelectBox from "@/common/components/SelectBox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faInfinity, faCoins, faSliders} from "@fortawesome/free-solid-svg-icons";
import {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import {QUESTION_TYPES, SLIDER_MARGIN_CONFIG} from "@/common/constants/QuestionTypes.js";

export const QuestionSettings = ({question, onChange, onCommit, defaultTimer = 60}) => {
    const {t} = useTranslation();

    const [selectedTimer, setSelectedTimer] = useState(() => {
        if (question.timer === undefined || question.timer === null) return "default";
        if (question.timer === -1) return "unlimited";
        if (question.timer === 30) return "30";
        if (question.timer === 120) return "120";
        return "custom";
    });

    const [selectedPointMultiplier, setSelectedPointMultiplier] = useState(() => {
        if (question.pointMultiplier === undefined || question.pointMultiplier === null) return "standard";
        return question.pointMultiplier;
    });

    const defaultTimerLabel = defaultTimer === -1 ? t("questionSettings.timers.unlimited") : `${defaultTimer}s`;

    const timerOptions = [
        {
            value: "default",
            label: t("questionSettings.timers.default", {value: defaultTimerLabel}),
            description: t("questionSettings.timers.defaultDesc"),
            icon: faClock
        },
        {
            value: "30",
            label: t("questionSettings.timers.sec30"),
            description: t("questionSettings.timers.sec30Desc"),
            icon: faClock
        },
        {
            value: "60",
            label: t("questionSettings.timers.sec60"),
            description: t("questionSettings.timers.sec60Desc"),
            icon: faClock
        },
        {
            value: "120",
            label: t("questionSettings.timers.sec120"),
            description: t("questionSettings.timers.sec120Desc"),
            icon: faClock
        },
        {
            value: "unlimited",
            label: t("questionSettings.timers.unlimited"),
            description: t("questionSettings.timers.unlimitedDesc"),
            icon: faInfinity
        }
    ];

    const pointMultiplierOptions = [
        {
            value: "standard",
            label: t("questionSettings.points.standard"),
            description: t("questionSettings.points.standardDesc"),
            icon: faCoins
        },
        {
            value: "none",
            label: t("questionSettings.points.none"),
            description: t("questionSettings.points.noneDesc"),
            icon: faCoins
        },
        {
            value: "double",
            label: t("questionSettings.points.double"),
            description: t("questionSettings.points.doubleDesc"),
            icon: faCoins
        }
    ];

    useEffect(() => {
        if (question.timer === undefined || question.timer === null) {
            setSelectedTimer("default");
        } else if (question.timer === -1) {
            setSelectedTimer("unlimited");
        } else if (question.timer === 30) {
            setSelectedTimer("30");
        } else if (question.timer === 120) {
            setSelectedTimer("120");
        } else {
            setSelectedTimer("custom");
        }

        if (question.pointMultiplier === undefined || question.pointMultiplier === null) {
            setSelectedPointMultiplier("standard");
        } else {
            setSelectedPointMultiplier(question.pointMultiplier);
        }
    }, [question.timer, question.pointMultiplier]);

    const handleTimerChange = (value) => {
        setSelectedTimer(value);
        const commit = onCommit || onChange;

        let timerNum;
        if (value === "default") {
            timerNum = undefined;
        } else if (value === "unlimited") {
            timerNum = -1;
        } else if (value === "30") {
            timerNum = 30;
        } else if (value === "120") {
            timerNum = 120;
        }

        commit({...question, timer: timerNum});
    };

    const handlePointMultiplierChange = (value) => {
        setSelectedPointMultiplier(value);
        const commit = onCommit || onChange;
        const multiplierValue = value === "standard" ? undefined : value;
        commit({...question, pointMultiplier: multiplierValue});
    };

    const handleAnswerMarginChange = (value) => {
        const commit = onCommit || onChange;
        const answers = question.answers || [{correctValue: 50, min: 0, max: 100, step: 1, answerMargin: 'medium'}];
        const updatedAnswers = [{...answers[0], answerMargin: value}];
        commit({...question, answers: updatedAnswers});
    };

    const answerMarginOptions = Object.entries(SLIDER_MARGIN_CONFIG).map(([key, config]) => ({
        value: key,
        label: config.label,
        description: config.description,
        icon: faSliders
    }));

    const isSliderType = question?.type === QUESTION_TYPES.SLIDER;
    const currentAnswerMargin = question?.answers?.[0]?.answerMargin || 'medium';

    if (!question) return null;

    return (
        <motion.div
            className="question-settings"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.25, delay: 0.2, ease: "easeOut"}}
        >
            <div className="settings-header">
                <h3>{t("questionSettings.title")}</h3>
            </div>

            <div className="setting-group">
                <div className="setting-label">
                    <FontAwesomeIcon icon={faClock}/>
                    <span>{t("questionSettings.timerLabel")}</span>
                </div>

                <SelectBox value={selectedTimer} onChange={handleTimerChange} options={timerOptions} placeholder={t("questionSettings.timerPlaceholder")}/>
            </div>

            <div className="setting-group">
                <div className="setting-label">
                    <FontAwesomeIcon icon={faCoins}/>
                    <span>{t("questionSettings.pointsLabel")}</span>
                </div>

                <SelectBox value={selectedPointMultiplier} onChange={handlePointMultiplierChange} options={pointMultiplierOptions} placeholder={t("questionSettings.pointsPlaceholder")}/>
            </div>

            {isSliderType && (
                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faSliders}/>
                        <span>{t("questionSettings.marginLabel")}</span>
                    </div>

                    <SelectBox value={currentAnswerMargin} onChange={handleAnswerMarginChange} options={answerMarginOptions} placeholder={t("questionSettings.marginPlaceholder")}/>
                </div>
            )}
        </motion.div>
    );
};
