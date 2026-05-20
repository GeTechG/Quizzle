import * as XLSX from 'xlsx';
import i18n from '../i18n';

const autoSizeColumns = (worksheet, data) => {
    const colWidths = [];

    data.forEach(row => {
        row.forEach((cell, colIndex) => {
            const cellValue = String(cell || '');
            const cellWidth = Math.max(cellValue.length + 2, 10);

            if (!colWidths[colIndex] || cellWidth > colWidths[colIndex]) {
                colWidths[colIndex] = Math.min(cellWidth, 50);
            }
        });
    });

    worksheet['!cols'] = colWidths.map(width => ({width}));
};

const localeForDates = () => i18n.language === 'ru' ? 'ru-RU' : i18n.language === 'en' ? 'en-US' : 'de-DE';

const exportAnalyticsToExcel = (analyticsData, quizData = null, isLiveQuiz = false, quizName = 'Quiz') => {
    const t = (key) => i18n.t(`excelExport.${key}`);
    const {classAnalytics, questionAnalytics, studentAnalytics} = analyticsData;

    const workbook = XLSX.utils.book_new();

    const overviewData = [
        [t('title')],
        [''],
        [t('quizInformation')],
        [t('quizType'), isLiveQuiz ? t('liveQuiz') : t('practiceQuiz')],
        [t('quizName'), quizName],
        [t('exportDate'), new Date().toLocaleDateString(localeForDates())],
        [t('exportTime'), new Date().toLocaleTimeString(localeForDates())],
        [''],
        [t('classOverview')],
        [t('totalStudents'), classAnalytics.totalStudents],
        [t('totalQuestions'), classAnalytics.totalQuestions],
        [t('averageScore'), classAnalytics.averageScore],
        [t('averageAccuracy'), classAnalytics.averageAccuracy],
        [t('questionsNeedingReview'), classAnalytics.questionsNeedingReview],
        [t('studentsNeedingAttention'), classAnalytics.studentsNeedingAttention],
        [t('participationRate'), classAnalytics.participationRate || 100]
    ];

    if (isLiveQuiz) {
        overviewData.push([t('totalAttempts'), classAnalytics.totalAttempts || 'N/A']);
    } else {
        overviewData.push([t('totalAttempts'), classAnalytics.totalAttempts]);
    }

    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    autoSizeColumns(overviewSheet, overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, t('overviewSheet'));

    const studentHeaders = [
        t('studentName'),
        t('character'),
        t('totalPoints'),
        t('correctAnswers'),
        t('partialCorrectAnswers'),
        t('incorrectAnswers'),
        t('totalAnswered'),
        t('accuracyPct'),
        t('needsAttention'),
        t('performanceLevel')
    ];

    if (!isLiveQuiz) {
        studentHeaders.splice(8, 0, t('attempts'), t('avgScore'));
    }

    const studentData = [studentHeaders];

    studentAnalytics.forEach(student => {
        const performanceLevel = student.accuracy >= 80 ? t('excellent') :
            student.accuracy >= 60 ? t('good') : t('improvementNeeded');

        const row = [
            student.name,
            student.character,
            student.totalPoints,
            student.correctAnswers,
            student.partialAnswers || 0,
            student.incorrectAnswers,
            student.totalAnswered,
            student.accuracy,
            student.needsAttention ? t('yes') : t('no'),
            performanceLevel
        ];

        if (!isLiveQuiz) {
            row.splice(8, 0, student.attempts || 1, student.avgScore || student.totalPoints);
        }

        studentData.push(row);
    });

    const studentSheet = XLSX.utils.aoa_to_sheet(studentData);
    autoSizeColumns(studentSheet, studentData);
    XLSX.utils.book_append_sheet(workbook, studentSheet, t('studentSheet'));

    const questionHeaders = [
        t('questionNum'),
        t('questionTitle'),
        t('questionType'),
        t('totalResponses'),
        t('correctCount'),
        t('partialCount'),
        t('incorrectCount'),
        t('correctPct'),
        t('difficultyLevel'),
        t('needsReview')
    ];

    const questionData = [questionHeaders];

    questionAnalytics.forEach(question => {
        const difficultyLabel = question.difficulty === 'easy' ? t('easy') :
            question.difficulty === 'medium' ? t('medium') :
                question.difficulty === 'hard' ? t('hard') : t('unknown');

        questionData.push([
            question.questionIndex + 1,
            question.title,
            question.type,
            question.totalResponses,
            question.correctCount,
            question.partialCount || 0,
            question.incorrectCount,
            question.correctPercentage,
            difficultyLabel,
            question.needsReview ? t('yes') : t('no')
        ]);
    });

    const questionSheet = XLSX.utils.aoa_to_sheet(questionData);
    autoSizeColumns(questionSheet, questionData);
    XLSX.utils.book_append_sheet(workbook, questionSheet, t('questionSheet'));

    const summaryData = [
        [t('summary')],
        [''],
        [t('difficultyDistribution')],
        [t('easyQuestions'), questionAnalytics.filter(q => q.difficulty === 'easy').length],
        [t('mediumQuestions'), questionAnalytics.filter(q => q.difficulty === 'medium').length],
        [t('hardQuestions'), questionAnalytics.filter(q => q.difficulty === 'hard').length],
        [''],
        [t('studentPerformanceDist')],
        [t('excellent80'), studentAnalytics.filter(s => s.accuracy >= 80).length],
        [t('good60'), studentAnalytics.filter(s => s.accuracy >= 60 && s.accuracy < 80).length],
        [t('needsImprovement'), studentAnalytics.filter(s => s.accuracy < 60).length],
        [''],
        [t('topFive')],
        [t('rank'), t('name'), t('score'), t('accuracyShort')]
    ];

    const sortedStudents = [...studentAnalytics]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 5);

    sortedStudents.forEach((student, index) => {
        summaryData.push([
            index + 1,
            student.name,
            student.totalPoints,
            student.accuracy
        ]);
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    autoSizeColumns(summarySheet, summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, t('summarySheet'));

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `${quizName}_Analytics_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);

    return filename;
};

export const exportPracticeResultsToExcel = (results, practiceCode) => {
    const analyticsData = results.analytics;
    const quizName = `${i18n.t('excelExport.practicePrefix')}_${practiceCode}`;

    return exportAnalyticsToExcel(analyticsData, results.quiz, false, quizName);
};

export const exportLiveQuizToExcel = (analyticsData, quizName = 'LiveQuiz') => {
    return exportAnalyticsToExcel(analyticsData, null, true, quizName);
};
