import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';

import { QuestionnaireResponseFormProps } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseFormProps } from '../BaseQuestionnaireResponseForm';

export interface QuestionnairesWizardProps
    extends Omit<BaseQuestionnaireResponseFormProps, 'formData'>,
        Omit<QuestionnaireResponseFormProps, 'questionnaireLoader'> {
    onSuccess?: (resource: any) => void;
    onFailure?: (error: any) => void;

    questionnaires: Questionnaire[];
    questionnaireResponses: QuestionnaireResponse[];
    initialQuestionnaireId?: string;
    onQuestionnaireChange?: (q: Questionnaire, index: number) => void;
}

export function useQuestionnairesWizard(props: QuestionnairesWizardProps) {
    const {
        questionnaires,
        questionnaireResponses: initialQuestionnaireResponses,
        initialQuestionnaireId,
        onQuestionnaireChange,
    } = props;
    const [questionnaireResponses, setQuestionnaireResponses] = useState(initialQuestionnaireResponses);
    const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(
        initialQuestionnaireId ? questionnaires.findIndex((q) => q.id === initialQuestionnaireId) : 0,
    );
    const currentQuestionnaire = questionnaires[currentQuestionnaireIndex];
    const currentQuestionnaireResponse = questionnaireResponses.find(
        (qr) => qr.questionnaire === currentQuestionnaire?.id,
    );
    const canGoBack = currentQuestionnaireIndex > 0;
    const canGoForward = currentQuestionnaireIndex + 1 < questionnaires.length;

    useEffect(() => {
        onQuestionnaireChange?.(questionnaires[currentQuestionnaireIndex]!, currentQuestionnaireIndex);
    }, [currentQuestionnaireIndex]);

    return {
        currentQuestionnaire,
        currentQuestionnaireIndex,
        setCurrentQuestionnaireIndex,
        currentQuestionnaireResponse,
        setQuestionnaireResponses,
        canGoBack,
        canGoForward,
    };
}
