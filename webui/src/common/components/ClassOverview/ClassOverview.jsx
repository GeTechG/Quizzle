import React from 'react';
import {useTranslation} from 'react-i18next';
import './styles.sass';

const ClassOverview = ({analyticsData, isLiveQuiz}) => {
    const {t} = useTranslation();
    const {classAnalytics, questionAnalytics} = analyticsData;

    const difficulty = questionAnalytics.reduce((acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
        return acc;
    }, {});
    const easy = difficulty.easy || 0;
    const medium = difficulty.medium || 0;
    const hard = difficulty.hard || 0;

    const stats = [
        {label: t('analytics.classOverview.participants'), value: classAnalytics.totalStudents},
        {label: t('analytics.classOverview.questions'), value: classAnalytics.totalQuestions},
        {label: t('analytics.classOverview.accuracy'), value: `${classAnalytics.averageAccuracy}%`, accent: classAnalytics.averageAccuracy >= 80 ? 'green' : classAnalytics.averageAccuracy >= 60 ? 'orange' : 'red'},
        ...(isLiveQuiz ? [{label: t('analytics.classOverview.points'), value: classAnalytics.averageScore}] : [])
    ];

    return (
        <div className="class-overview">
            <div className="overview-stats">
                {stats.map((s) => (
                    <div key={s.label} className={`overview-stat ${s.accent || ''}`}>
                        <div className="overview-stat-value">{s.value}</div>
                        <div className="overview-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="overview-card">
                <h3>{t('analytics.classOverview.difficultyDist')}</h3>
                <div className="difficulty-bar">
                    {easy > 0 && <div className="difficulty-seg easy" style={{flex: easy}} title={t('analytics.classOverview.easyTitle', {count: easy})}/>}
                    {medium > 0 && <div className="difficulty-seg medium" style={{flex: medium}} title={t('analytics.classOverview.mediumTitle', {count: medium})}/>}
                    {hard > 0 && <div className="difficulty-seg hard" style={{flex: hard}} title={t('analytics.classOverview.hardTitle', {count: hard})}/>}
                </div>
                <div className="difficulty-legend">
                    <span><span className="dot easy"/>{t('analytics.classOverview.easy')} · {easy}</span>
                    <span><span className="dot medium"/>{t('analytics.classOverview.medium')} · {medium}</span>
                    <span><span className="dot hard"/>{t('analytics.classOverview.hard')} · {hard}</span>
                </div>
            </div>
        </div>
    );
};

export default ClassOverview;
