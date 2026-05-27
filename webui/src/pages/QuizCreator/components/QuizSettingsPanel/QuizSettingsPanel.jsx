import "./styles.sass";
import SelectBox from "@/common/components/SelectBox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClock,
    faShuffle,
    faCoins,
    faAlignLeft,
    faSignal,
    faBolt,
} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import {DEFAULT_QUIZ_SETTINGS} from "@/common/constants/QuizSettings.js";

export const QuizSettingsPanel = ({settings, onChange}) => {
    const {t} = useTranslation();
    const s = {...DEFAULT_QUIZ_SETTINGS, ...settings};

    const update = (key, value) => {
        onChange({...s, [key]: value});
    };

    const difficultyOptions = [
        {value: "none", label: t("quizSettings.difficulties.none"), description: t("quizSettings.difficulties.noneDesc"), icon: faSignal},
        {value: "easy", label: t("quizSettings.difficulties.easy"), description: t("quizSettings.difficulties.easyDesc"), icon: faSignal},
        {value: "medium", label: t("quizSettings.difficulties.medium"), description: t("quizSettings.difficulties.mediumDesc"), icon: faSignal},
        {value: "hard", label: t("quizSettings.difficulties.hard"), description: t("quizSettings.difficulties.hardDesc"), icon: faSignal},
    ];

    const timerOptions = [
        {value: "15", label: t("quizSettings.timers.sec15"), description: t("quizSettings.timers.sec15Desc"), icon: faClock},
        {value: "30", label: t("quizSettings.timers.sec30"), description: t("quizSettings.timers.sec30Desc"), icon: faClock},
        {value: "60", label: t("quizSettings.timers.sec60"), description: t("quizSettings.timers.sec60Desc"), icon: faClock},
        {value: "120", label: t("quizSettings.timers.sec120"), description: t("quizSettings.timers.sec120Desc"), icon: faClock},
        {value: "-1", label: t("quizSettings.timers.unlimited"), description: t("quizSettings.timers.unlimitedDesc"), icon: faClock},
    ];

    const scoringOptions = [
        {value: "time-based", label: t("quizSettings.scoringOptions.timeBased"), description: t("quizSettings.scoringOptions.timeBasedDesc"), icon: faCoins},
        {value: "flat", label: t("quizSettings.scoringOptions.flat"), description: t("quizSettings.scoringOptions.flatDesc"), icon: faCoins},
    ];

    return (
        <motion.div
            className="quiz-settings-panel"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.25, delay: 0.1, ease: "easeOut"}}
        >
            <div className="settings-header">
                <h3>{t("quizSettings.title")}</h3>
            </div>

            <div className="settings-section">
                <div className="section-title">{t("quizSettings.sectionAboutQuiz")}</div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faAlignLeft}/>
                        <span>{t("quizSettings.descriptionLabel")}</span>
                    </div>
                    <textarea
                        className="settings-textarea"
                        placeholder={t("quizSettings.descriptionPlaceholder")}
                        value={s.description}
                        onChange={(e) => update("description", e.target.value)}
                        maxLength={300}
                        rows={3}
                    />
                    <div className="char-count">{s.description.length}/300</div>
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faSignal}/>
                        <span>{t("quizSettings.difficultyLabel")}</span>
                    </div>
                    <SelectBox
                        value={s.difficulty || "none"}
                        onChange={(v) => update("difficulty", v === "none" ? null : v)}
                        options={difficultyOptions}
                        placeholder={t("quizSettings.difficultyPlaceholder")}
                    />
                </div>
            </div>

            <div className="settings-section">
                <div className="section-title">{t("quizSettings.sectionGameplay")}</div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faShuffle}/>
                        <span>{t("quizSettings.shuffleQuestions")}</span>
                    </div>
                    <div className="toggle-row" onClick={() => update("shuffleQuestions", !s.shuffleQuestions)}>
                        <div className={`toggle ${s.shuffleQuestions ? "active" : ""}`}>
                            <div className="toggle-knob"/>
                        </div>
                        <span className="toggle-text">{s.shuffleQuestions ? t("common.on") : t("common.off")}</span>
                    </div>
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faShuffle}/>
                        <span>{t("quizSettings.shuffleAnswers")}</span>
                    </div>
                    <div className="toggle-row" onClick={() => update("shuffleAnswers", !s.shuffleAnswers)}>
                        <div className={`toggle ${s.shuffleAnswers ? "active" : ""}`}>
                            <div className="toggle-knob"/>
                        </div>
                        <span className="toggle-text">{s.shuffleAnswers ? t("common.on") : t("common.off")}</span>
                    </div>
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faClock}/>
                        <span>{t("quizSettings.defaultTimerLabel")}</span>
                    </div>
                    <SelectBox
                        value={String(s.defaultTimer)}
                        onChange={(v) => update("defaultTimer", parseInt(v))}
                        options={timerOptions}
                        placeholder={t("quizSettings.defaultTimerPlaceholder")}
                    />
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faCoins}/>
                        <span>{t("quizSettings.scoringLabel")}</span>
                    </div>
                    <SelectBox
                        value={s.scoringMode}
                        onChange={(v) => update("scoringMode", v)}
                        options={scoringOptions}
                        placeholder={t("quizSettings.scoringPlaceholder")}
                    />
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faBolt}/>
                        <span>{t("quizSettings.instantStartLabel")}</span>
                    </div>
                    <div className="toggle-row" onClick={() => update("instantStart", !s.instantStart)}>
                        <div className={`toggle ${s.instantStart ? "active" : ""}`}>
                            <div className="toggle-knob"/>
                        </div>
                        <span className="toggle-text">{s.instantStart ? t("common.on") : t("common.off")}</span>
                    </div>
                    <div className="setting-hint">{t("quizSettings.instantStartDesc")}</div>
                </div>
            </div>
        </motion.div>
    );
};
