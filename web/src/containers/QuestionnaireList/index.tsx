import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Col, Empty, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { ColumnsType } from 'antd/lib/table';
import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { Questionnaire } from 'fhir/r4b';
import { Link } from 'react-router-dom';

import config from 'shared/src/config';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { processLaunchContextToFce } from 'shared/src/utils/converter';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';

import { useQuestionnaireList } from './hooks';

const columns: ColumnsType<Questionnaire> = [
    {
        title: <Trans id="msg.QuestionnaireName">Name</Trans>,
        dataIndex: 'name',
        key: 'name',
        render: (_text, resource) => resource.title || resource.id,
    },

    {
        title: <Trans>Actions</Trans>,
        width: 500,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, resource) => {
            return (
                <>
                    <ModalTrigger
                        trigger={
                            <Button type="link">
                                <Trans>Open</Trans>
                            </Button>
                        }
                        title={resource.name || resource.id!}
                    >
                        {({ closeModal }) => (
                            <QuestionnaireResponseForm
                                questionnaireLoader={questionnaireIdLoader(resource.id!)}
                                launchContextParameters={processLaunchContextToFce(resource)?.map((lc) => ({
                                    name: lc.name!,
                                    value: { string: 'undefined' },
                                }))}
                                onCancel={closeModal}
                            />
                        )}
                    </ModalTrigger>{' '}
                    <Link to={`/questionnaires/${resource.id}/edit`}>
                        <Button type="link">
                            <Trans>Edit in builder</Trans>
                        </Button>
                    </Link>
                    <a
                        href={`${config.sdcIdeUrl}/${resource.id}?client=sdc-ide`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Trans>Edit in SDC IDE</Trans>
                    </a>
                </>
            );
        },
    },
];

export function QuestionnaireList() {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: [
            {
                id: 'questionnaire',
                type: 'string',
                placeholder: t`Find questionnaire`,
            },
        ],
    });

    const { pagination, questionnaireListRD, handleTableChange } = useQuestionnaireList(
        columnsFilterValues as StringTypeColumnFilterValue[],
    );

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Questionnaires</Trans>
                        </Title>
                    </Col>
                    <Col>
                        <Link to="/questionnaires/builder">
                            <Button icon={<PlusOutlined />} type="primary">
                                <span>
                                    <Trans>Add questionnaire</Trans>
                                </span>
                            </Button>
                        </Link>
                    </Col>
                </Row>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <Table<Questionnaire>
                    pagination={pagination}
                    onChange={handleTableChange}
                    locale={{
                        emptyText: (
                            <>
                                <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </>
                        ),
                    }}
                    rowKey={(p) => p.id!}
                    dataSource={isSuccess(questionnaireListRD) ? questionnaireListRD.data : []}
                    columns={columns}
                    loading={isLoading(questionnaireListRD) && { indicator: SpinIndicator }}
                />
            </BasePageContent>
        </>
    );
}
