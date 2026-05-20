import {useState, useContext} from 'react';
import {useTranslation, Trans} from 'react-i18next';
import {motion, AnimatePresence} from 'framer-motion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWandMagicSparkles, faUser, faLock, faCheck, faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {BrandingContext} from '@/common/contexts/Branding';
import {postRequest} from '@/common/utils/RequestUtil.js';
import Button from '@/common/components/Button';
import Input from '@/common/components/Input';
import toast from 'react-hot-toast';
import './styles.sass';

export const SetupWizard = ({onComplete}) => {
    const {t} = useTranslation();
    const {titleImg} = useContext(BrandingContext);
    const [step, setStep] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateUsername = () => {
        if (!username.trim()) {
            setUsernameError(t('setupWizard.errors.usernameRequired'));
            return false;
        }
        if (username.length < 3) {
            setUsernameError(t('setupWizard.errors.minChars3'));
            return false;
        }
        if (username.length > 32) {
            setUsernameError(t('setupWizard.errors.maxChars32'));
            return false;
        }
        if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
            setUsernameError(t('setupWizard.errors.invalidChars'));
            return false;
        }
        setUsernameError('');
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError(t('setupWizard.errors.passwordRequired'));
            return false;
        }
        if (password.length < 6) {
            setPasswordError(t('setupWizard.errors.minChars6'));
            return false;
        }
        setPasswordError('');

        if (confirmPassword && password !== confirmPassword) {
            setConfirmError(t('setupWizard.errors.mismatch'));
            return false;
        }
        setConfirmError('');
        return true;
    };

    const validateConfirm = () => {
        if (!confirmPassword) {
            setConfirmError(t('setupWizard.errors.confirmRequired'));
            return false;
        }
        if (password !== confirmPassword) {
            setConfirmError(t('setupWizard.errors.mismatch'));
            return false;
        }
        setConfirmError('');
        return true;
    };

    const nextStep = () => {
        if (step === 1) {
            if (!validateUsername()) return;
        }
        setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const handleSetup = async () => {
        if (!validatePassword() || !validateConfirm()) return;

        setLoading(true);
        try {
            await postRequest('/auth/setup', {username: username.trim(), password});
            toast.success(t('setupWizard.toasts.completed'));
            onComplete();
        } catch (error) {
            toast.error(error.message || t('setupWizard.toasts.failed'));
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        <motion.div key="welcome" className="setup-step" initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -50}}>
            <div className="setup-icon-container">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="setup-icon"/>
            </div>
            <h2>{t('setupWizard.welcomeTitle')}</h2>
            <p className="setup-description">
                <Trans i18nKey="setupWizard.welcomeDescription" components={{strong: <strong/>}}/>
            </p>
            <div className="setup-actions">
                <Button text={t('setupWizard.startSetup')} icon={faArrowRight} type="primary compact" onClick={nextStep}/>
            </div>
        </motion.div>,

        <motion.div key="username" className="setup-step" initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -50}}>
            <div className="setup-icon-container">
                <FontAwesomeIcon icon={faUser} className="setup-icon"/>
            </div>
            <h2>{t('setupWizard.usernameTitle')}</h2>
            <p className="setup-description">{t('setupWizard.usernameDescription')}</p>
            <div className="setup-input-area">
                <Input
                    placeholder={t('setupWizard.usernamePlaceholder')}
                    value={username}
                    onChange={(e) => {setUsername(e.target.value); setUsernameError('');}}
                    error={usernameError}
                    onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                />
            </div>
            <div className="setup-actions">
                <Button text={t('common.back')} icon={faArrowLeft} type="secondary compact" onClick={prevStep}/>
                <Button text={t('common.next')} icon={faArrowRight} type="primary compact" onClick={nextStep}/>
            </div>
        </motion.div>,

        <motion.div key="password" className="setup-step" initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -50}}>
            <div className="setup-icon-container">
                <FontAwesomeIcon icon={faLock} className="setup-icon"/>
            </div>
            <h2>{t('setupWizard.passwordTitle')}</h2>
            <p className="setup-description">
                <Trans i18nKey="setupWizard.passwordDescription" values={{name: username}} components={{strong: <strong/>}}/>
            </p>
            <div className="setup-input-area">
                <Input
                    type="password"
                    placeholder={t('setupWizard.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setPasswordError('');}}
                    error={passwordError}
                    onKeyDown={(e) => e.key === 'Enter' && document.querySelector('.setup-confirm-input input')?.focus()}
                />
                <Input
                    type="password"
                    placeholder={t('setupWizard.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => {setConfirmPassword(e.target.value); setConfirmError('');}}
                    error={confirmError}
                    onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
                />
            </div>
            <div className="setup-actions">
                <Button text={t('common.back')} icon={faArrowLeft} type="secondary compact" onClick={prevStep}/>
                <Button text={t('setupWizard.finish')} icon={faCheck} type="green compact" onClick={handleSetup} disabled={loading}/>
            </div>
        </motion.div>
    ];

    return (
        <div className="setup-wizard-overlay">
            <motion.div
                className="setup-wizard"
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.3, ease: "easeOut"}}
            >
                <img src={titleImg} alt="Quizzle" className="setup-logo"/>

                <div className="setup-progress">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`progress-dot ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}/>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {steps[step]}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
