import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

export const TrueFalseClient = ({onSubmit}) => {
    const {t} = useTranslation();
    return (
        <div className="true-false-client" role="group" aria-label={t('trueFalse.ariaGroup')}>
            <button className="true-false-option true-option" onClick={() => onSubmit([0])} type="button">
                <FontAwesomeIcon icon={faCheck} className="tf-icon"/>
                <span>{t('common.true')}</span>
            </button>
            <button className="true-false-option false-option" onClick={() => onSubmit([1])} type="button">
                <FontAwesomeIcon icon={faXmark} className="tf-icon"/>
                <span>{t('common.false')}</span>
            </button>
        </div>
    );
};
