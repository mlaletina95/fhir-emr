import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import type { ColumnsType } from 'antd/es/table/interface';
import { Parameters } from 'fhir/r4b';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';
import { compileAsFirst } from 'src/utils';

import { ResourceListPage, questionnaireAction } from '../ResourceListPage';
import { RecordType, TableManager } from '../ResourceListPage/types';

const getParametersName = compileAsFirst<Parameters, string>('Parameters.id');
const getParametersCount = compileAsFirst<Parameters, number>('Parameters.parameter.count()');

export function ParametersListPage() {
    const getFilters = (): SearchBarColumn[] => [
        {
            id: 'name',
            searchParam: '_id',
            type: SearchBarColumnType.STRING,
            placeholder: t`Search by name`,
            placement: ['search-bar', 'table'],
        },
    ];

    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Parameters>> => [
        {
            title: <Trans>Name</Trans>,
            dataIndex: 'name',
            key: 'name',
            render: (_text, record) => getParametersName(record.resource),
        },
        {
            title: <Trans>Parameters</Trans>,
            dataIndex: 'parametersCount',
            key: 'parametersCount',
            width: '20%',
            render: (_text, record) => getParametersCount(record.resource) ?? 0,
        },
    ];

    const getRecordActions = (_record: RecordType<Parameters>, _manager: TableManager) => [
        questionnaireAction(<Trans>Edit</Trans>, 'parameters-edit'),
    ];

    const getHeaderActions = () => [
        questionnaireAction(<Trans>Create</Trans>, 'parameters-create', { icon: <PlusOutlined /> }),
    ];

    return (
        <ResourceListPage<Parameters>
            headerTitle={t`Parameter sets`}
            resourceType="Parameters"
            searchParams={{
                _sort: '-_lastUpdated,_id',
                _count: 10,
            }}
            getFilters={getFilters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
        />
    );
}
