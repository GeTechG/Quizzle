import {useTranslation} from "react-i18next";
import {SUPPORTED_LANGUAGES} from "@/common/i18n";
import {useState, useRef, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faCheck} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";

export const LanguageSwitcher = ({variant = "default"}) => {
    const {i18n} = useTranslation();
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    const current = SUPPORTED_LANGUAGES.find(l => l.code === i18n.resolvedLanguage) || SUPPORTED_LANGUAGES[0];

    useEffect(() => {
        const onClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const choose = (code) => {
        i18n.changeLanguage(code);
        setOpen(false);
    };

    return (
        <div className={`language-switcher language-switcher--${variant}`} ref={wrapRef}>
            <button type="button" className="language-switcher__toggle" onClick={() => setOpen(v => !v)} aria-label="Language">
                <FontAwesomeIcon icon={faGlobe}/>
                <span className="language-switcher__flag">{current.flag}</span>
            </button>
            {open && (
                <ul className="language-switcher__menu" role="listbox">
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <li key={lang.code}>
                            <button
                                type="button"
                                className={`language-switcher__item${lang.code === current.code ? " language-switcher__item--active" : ""}`}
                                onClick={() => choose(lang.code)}
                                role="option"
                                aria-selected={lang.code === current.code}
                            >
                                <span className="language-switcher__flag">{lang.flag}</span>
                                <span>{lang.label}</span>
                                {lang.code === current.code && <FontAwesomeIcon icon={faCheck}/>}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
