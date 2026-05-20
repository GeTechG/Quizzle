import React from 'react';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faExclamationTriangle,
    faCheckCircle,
    faUsers,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import './styles.sass';

const RecommendationsTab = ({analyticsData}) => {
    const {t} = useTranslation();
    const {classAnalytics, questionAnalytics, studentAnalytics} = analyticsData;

    const recommendations = [];

    const strugglingStudents = studentAnalytics.filter(s => s.needsAttention);
    const hardQuestions = questionAnalytics.filter(q => q.needsReview);

    if (strugglingStudents.length > 0) {
        recommendations.push({
            type: 'urgent',
            icon: faExclamationTriangle,
            title: t('analytics.recommendations.studentsNeedHelp', {count: strugglingStudents.length}),
            students: strugglingStudents.map(s => `${s.name} (${s.accuracy}%)`)
        });
    }

    if (hardQuestions.length > 0) {
        recommendations.push({
            type: 'warning',
            icon: faQuestionCircle,
            title: t('analytics.recommendations.hardQuestions', {count: hardQuestions.length}),
            questions: hardQuestions.map(q => t('analytics.recommendations.questionN', {n: q.questionIndex + 1, percent: q.correctPercentage}))
        });
    }

    if (classAnalytics.averageAccuracy < 60) {
        recommendations.push({
            type: 'urgent',
            icon: faUsers,
            title: t('analytics.recommendations.lowPerformance', {percent: classAnalytics.averageAccuracy}),
            action: t('analytics.recommendations.reviewRecommended')
        });
    } else if (classAnalytics.averageAccuracy >= 80) {
        recommendations.push({
            type: 'success',
            icon: faCheckCircle,
            title: t('analytics.recommendations.goodPerformance', {percent: classAnalytics.averageAccuracy}),
            action: t('analytics.recommendations.readyForNewTopics')
        });
    }

    return (
        <div className="recommendations-tab">
            {recommendations.length > 0 ? (
                <div className="recommendations-list">
                    {recommendations.map((rec, index) => (
                        <div key={index} className={`recommendation-card ${rec.type}`}>
                            <div className="recommendation-header">
                                <FontAwesomeIcon
                                    icon={rec.icon}
                                    className={`recommendation-icon ${rec.type}`}
                                />
                                <h3>{rec.title}</h3>
                            </div>

                            <div className="recommendation-content">
                                {rec.action && (
                                    <p className="recommendation-action">{rec.action}</p>
                                )}

                                {rec.students && (
                                    <div className="recommendation-details">
                                        <h4>{t('analytics.recommendations.studentsHeader')}</h4>
                                        <ul>
                                            {rec.students.map((student, i) => (
                                                <li key={i}>{student}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {rec.questions && (
                                    <div className="recommendation-details">
                                        <h4>{t('analytics.recommendations.questionsHeader')}</h4>
                                        <ul>
                                            {rec.questions.map((question, i) => (
                                                <li key={i}>{question}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-recommendations">
                    <FontAwesomeIcon icon={faCheckCircle}/>
                    <h3>{t('analytics.recommendations.noIssues')}</h3>
                    <p>{t('analytics.recommendations.classDoingWell')}</p>
                </div>
            )}
        </div>
    );
};

export default RecommendationsTab;
