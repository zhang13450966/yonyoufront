

export default {
    treeData: [{
        children: [{
            code: 'aaa',
            name: 'aaa',
            refname: 'aaa',
            refpk: 'jjj',
            pid: 'root',
            key: 'aaa'
        }, {
            code: 'bbb',
            name: 'bbb',
            refname: 'bbb',
            refpk: 'bbb',
            pid: 'root',
            key: 'bbb'
        }],
        code: 'root',
        name: '报表目录',
        refname: '报表目录',
        refpk: 'root',
        key: 'root'
    }, {
        code: 'ccc',
        name: 'ccc',
        refname: 'ccc',
        refpk: 'ccc',
        pid: 'ccc',
        key: 'ccc'
    }],
    tableData: {
        rows: [{
            checked: true,
            values: {
                ref_code: {
                    value: '1',
                    display: '1'
                },
                ref_name: {
                    value: 'ahaha',
                    display: 'ahaha'
                },
                auth: {
                    value: '0',
                    display: '未分配'
                },
                pk_org: {
                    value: '999',
                    display: '999'
                },
                refpk: {
                    value: '222',
                    display: '222'
                }
            }
        }, {
            checked: false,
            values: {
                ref_code: {
                    value: '1',
                    display: '1'
                },
                ref_name: {
                    value: 'ahaha',
                    display: 'ahaha'
                },
                auth: {
                    value: '0',
                    display: '未分配'
                },
                pk_org: {
                    value: '999',
                    display: '999'
                },
                refpk: {
                    value: '222',
                    display: '222'
                }
            }
        }]
    }
};