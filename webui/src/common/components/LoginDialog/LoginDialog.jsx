import {useState, useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRightToBracket} from '@fortawesome/free-solid-svg-icons';
import Dialog from '@/common/components/Dialog';
import Input from '@/common/components/Input';
import {AuthContext} from '@/common/contexts/Auth';
import toast from 'react-hot-toast';
import {useTranslation, Trans} from 'react-i18next';
import './styles.sass';

export const LoginDialog = ({isOpen, onClose, onSuccess}) => {
    const {t} = useTranslation();
    const {login} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!username.trim()) {
            setError(t('login.usernameRequired'));
            return;
        }
        if (!password) {
            setError(t('login.passwordRequired'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login(username.trim(), password);
            toast.success(t('login.success'));
            setUsername('');
            setPassword('');
            setError('');
            onSuccess?.();
        } catch (err) {
            setError(err.message || t('login.failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setUsername('');
        setPassword('');
        setError('');
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            onCancel={handleClose}
            title={
                <div className="login-dialog-title">
                    <FontAwesomeIcon icon={faRightToBracket} className="login-dialog-title-icon"/>
                    {t('login.title')}
                </div>
            }
            confirmText={loading ? "..." : t('login.confirm')}
            cancelText={t('common.cancel')}
            className="login-dialog"
        >
            <div className="login-dialog-content">
                <p className="login-dialog-text">
                    <Trans i18nKey="login.text" components={{strong: <strong/>}}/>
                </p>
                <div className="login-input-wrapper">
                    <Input
                        placeholder={t('login.usernamePlaceholder')}
                        value={username}
                        onChange={(e) => {setUsername(e.target.value); setError('');}}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    />
                    <Input
                        type="password"
                        placeholder={t('login.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); setError('');}}
                        error={error}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    />
                </div>
            </div>
        </Dialog>
    );
};
