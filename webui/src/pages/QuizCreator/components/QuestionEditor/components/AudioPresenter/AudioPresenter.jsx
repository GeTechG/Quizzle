import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMusic, faTrash, faUpload} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {imageCache} from "@/common/utils/ImageCacheUtil.js";

export const AudioPresenter = ({question, onChange}) => {
    const {t} = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [audioDataUrl, setAudioDataUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadAudio = async () => {
            if (question.audioId) {
                setIsLoading(true);
                try {
                    const dataUrl = await imageCache.getImage(question.audioId);
                    setAudioDataUrl(dataUrl);
                } catch (error) {
                    console.error("Error loading audio from cache:", error);
                    onChange({...question, audioId: undefined});
                } finally {
                    setIsLoading(false);
                }
            } else {
                setAudioDataUrl(null);
                setIsLoading(false);
            }
        };

        loadAudio();
    }, [question.audioId, question.uuid]);

    const storeAudioFile = async (file) => {
        if (!file || !file.type.startsWith('audio/')) {
            console.error("Invalid file type");
            return;
        }

        setIsLoading(true);
        try {
            if (question.audioId) {
                await imageCache.deleteImage(question.audioId);
            }

            const audioId = await imageCache.storeImage(question.uuid, file, 'audio');
            onChange({...question, audioId: audioId});
        } catch (error) {
            console.error("Error storing audio:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) storeAudioFile(file);
    };

    const removeAudio = async () => {
        if (question.audioId) {
            try {
                await imageCache.deleteImage(question.audioId);
            } catch (error) {
                console.error("Error deleting audio from cache:", error);
            }
        }
        onChange({...question, audioId: undefined});
        setAudioDataUrl(null);
    };

    const hasAudio = audioDataUrl;

    return (
        <div className="audio-presenter-edit">
            {hasAudio && !isLoading ? (
                <div className="audio-loaded">
                    <FontAwesomeIcon icon={faMusic} className="audio-icon"/>
                    <audio controls src={audioDataUrl} className="audio-player"/>
                    <button type="button" className="audio-remove" onClick={removeAudio} aria-label={t("quizCreator.audio.remove")}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>
                </div>
            ) : (
                <div
                    className={`audio-dropzone ${isDragging ? 'dragging' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    style={{opacity: isLoading ? 0.7 : 1}}
                >
                    <FontAwesomeIcon icon={isDragging ? faUpload : faMusic}/>
                    <span>{t("quizCreator.audio.add")}</span>
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) storeAudioFile(file);
                    e.target.value = "";
                }}
                hidden
            />
        </div>
    );
};
