import {useEffect} from "react";
import NoSleep from "nosleep.js";

export const useWakeLock = (active = true) => {
    useEffect(() => {
        if (!active) return;
        if (typeof navigator === "undefined" || typeof document === "undefined") return;

        const hasWakeLockApi = "wakeLock" in navigator && window.isSecureContext;
        let wakeLock = null;
        let noSleep = null;
        let cancelled = false;
        let gestureListeners = null;

        const requestWakeLock = async () => {
            try {
                const lock = await navigator.wakeLock.request("screen");
                if (cancelled) {
                    lock.release().catch(() => {});
                    return;
                }
                wakeLock = lock;
                wakeLock.addEventListener("release", () => {
                    wakeLock = null;
                });
            } catch {
                // permission denied, battery saver, etc. — fall through silently
            }
        };

        const enableNoSleep = async () => {
            if (!noSleep || noSleep.isEnabled || cancelled) return;
            try {
                await noSleep.enable();
                removeGestureListeners();
            } catch {
                // play() rejected — wait for next user gesture
            }
        };

        const attachGestureListeners = () => {
            if (gestureListeners) return;
            const handler = () => enableNoSleep();
            const events = ["pointerdown", "touchstart", "click", "keydown"];
            events.forEach((evt) => document.addEventListener(evt, handler, {once: false, passive: true}));
            gestureListeners = {handler, events};
        };

        const removeGestureListeners = () => {
            if (!gestureListeners) return;
            const {handler, events} = gestureListeners;
            events.forEach((evt) => document.removeEventListener(evt, handler));
            gestureListeners = null;
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState !== "visible") return;
            if (hasWakeLockApi && !wakeLock) {
                requestWakeLock();
            } else if (noSleep && !noSleep.isEnabled) {
                enableNoSleep();
            }
        };

        if (hasWakeLockApi) {
            requestWakeLock();
        } else {
            noSleep = new NoSleep();
            // try right away (works if we're already inside a user-gesture call stack);
            // otherwise schedule for the next gesture
            enableNoSleep().then(() => {
                if (!noSleep.isEnabled && !cancelled) attachGestureListeners();
            });
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            cancelled = true;
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            removeGestureListeners();
            if (wakeLock) {
                wakeLock.release().catch(() => {});
                wakeLock = null;
            }
            if (noSleep) {
                try { noSleep.disable(); } catch { /* noop */ }
                noSleep = null;
            }
        };
    }, [active]);
};
