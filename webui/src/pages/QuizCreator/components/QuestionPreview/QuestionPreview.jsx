import {useTranslation} from "react-i18next";
import "./styles.sass";

export const QuestionPreview = ({question, isActive, onClick}) => {
    const {t} = useTranslation();
    return (
        <div className={`question-preview${isActive ? " preview-active" : ""}`} onClick={onClick}>
            <h3>{question || t("quizCreator.untitledQuestion")}</h3>
        </div>
    )
}
