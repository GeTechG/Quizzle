import "./styles.sass";
import {useState, useEffect, useRef} from "react";
import {useSoundManager} from "@/common/utils/SoundManager.js";
import {motion, AnimatePresence} from "framer-motion";

const computePhase = (timeLeft) => {
    if (timeLeft <= 10 && timeLeft > 0) return 'critical';
    if (timeLeft <= 30) return 'warning';
    return 'normal';
};

export const CountdownTimer = ({duration, onTimeUp, isActive = true, compact = false, startedAt = null}) => {
    const startRef = useRef(startedAt ?? Date.now());

    const remaining = () => Math.max(0, duration - Math.floor((Date.now() - startRef.current) / 1000));

    const [timeLeft, setTimeLeft] = useState(remaining);
    const [phase, setPhase] = useState(() => computePhase(remaining()));
    const [isVisible, setIsVisible] = useState(false);
    const intervalRef = useRef(null);
    const firstTickRef = useRef(null);
    const soundManager = useSoundManager();
    const lastTickRef = useRef(null);

    useEffect(() => {
        startRef.current = startedAt ?? Date.now();
        const initial = remaining();
        setTimeLeft(initial);
        setPhase(computePhase(initial));
        setIsVisible(true);
    }, [duration, startedAt]);

    useEffect(() => {
        if (!isActive || duration <= 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (firstTickRef.current) {
                clearTimeout(firstTickRef.current);
                firstTickRef.current = null;
            }
            setIsVisible(false);
            return;
        }

        const tick = () => {
            const newTime = remaining();

            if (newTime <= 10 && newTime > 0 && newTime !== lastTickRef.current) {
                soundManager.playFeedback('TIMER_TICK');
                lastTickRef.current = newTime;
            }

            setPhase(computePhase(newTime));

            if (newTime <= 0) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                soundManager.playFeedback('ANSWER_REVEALED');
                setIsVisible(false);
                if (typeof onTimeUp === 'function') onTimeUp();
                setTimeLeft(0);
                return;
            }

            setTimeLeft(newTime);
        };

        const elapsedMs = Math.max(0, Date.now() - startRef.current);
        const msUntilNextSecond = 1000 - (elapsedMs % 1000);

        firstTickRef.current = setTimeout(() => {
            firstTickRef.current = null;
            tick();
            intervalRef.current = setInterval(tick, 1000);
        }, msUntilNextSecond);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (firstTickRef.current) {
                clearTimeout(firstTickRef.current);
                firstTickRef.current = null;
            }
        };
    }, [isActive, duration, onTimeUp, soundManager, startedAt]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        return secs.toString();
    };

    const percentage = duration > 0 ? (timeLeft / duration) * 100 : 0;

    if (duration <= 0 || !isVisible) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                className={`countdown-bar ${phase}${compact ? ' compact' : ''}`}
                initial={{opacity: 0, y: -8}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -8}}
                transition={{duration: 0.3, ease: "easeOut"}}
            >
                <div className="bar-track">
                    <motion.div
                        className="bar-fill"
                        animate={{width: `${percentage}%`}}
                        transition={{duration: 1, ease: "linear"}}
                    />
                </div>
                <div className="bar-time">
                    <span className="bar-number">{formatTime(timeLeft)}</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
