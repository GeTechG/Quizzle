import React from 'react';
import {useTranslation} from 'react-i18next';
import './styles.sass';

const QuestionAnalytics = ({analyticsData}) => {
    const {t} = useTranslation();
    const {questionAnalytics} = analyticsData;

    return (
        <div className="question-analytics">
            <div className="qa-list">
                {questionAnalytics.map((q, index) => {
                    const total = q.totalResponses || 1;
                    const correctPct = (q.correctCount / total) * 100;
                    const partialPct = ((q.partialCount || 0) / total) * 100;
                    const incorrectPct = (q.incorrectCount / total) * 100;

                    return (
                        <div key={index} className="qa-row">
                            <div className="qa-top">
                                <div className="qa-number">{t('analytics.questionAnalytics.questionN', {n: index + 1})}</div>
                                <div className={`qa-difficulty ${q.difficulty}`}>
                                    {t(`analytics.difficultyLabels.${q.difficulty}`, {defaultValue: t('analytics.difficultyLabels.dash')})}
                                </div>
                                <div className="qa-percentage">{q.correctPercentage}%</div>
                            </div>

                            <div className="qa-title">{q.title}</div>

                            <div className="qa-bar">
                                {correctPct > 0 && <div className="qa-seg correct" style={{width: `${correctPct}%`}}/>}
                                {partialPct > 0 && <div className="qa-seg partial" style={{width: `${partialPct}%`}}/>}
                                {incorrectPct > 0 && <div className="qa-seg incorrect" style={{width: `${incorrectPct}%`}}/>}
                            </div>

                            <div className="qa-counts">
                                <span className="correct">{t('analytics.questionAnalytics.correct', {count: q.correctCount})}</span>
                                {q.partialCount > 0 && <span className="partial">{t('analytics.questionAnalytics.partial', {count: q.partialCount})}</span>}
                                <span className="incorrect">{t('analytics.questionAnalytics.incorrect', {count: q.incorrectCount})}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionAnalytics;
