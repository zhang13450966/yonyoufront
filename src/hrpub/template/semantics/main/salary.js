import React, {Component} from 'react';
import Base from './base';

export default class extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Base
                    {...this.props}
                    columns={[{
                        title: this.showLanguage('se-009', '字段编码'),
                        dataIndex: 'Code'
                    }, {
                        title: this.showLanguage('se-010', '字段名称'),
                        dataIndex: 'Name'
                    }, {
                        title: this.showLanguage('se-011', '数据类型'),
                        dataIndex: 'DataType'
                    }, {
                        title: this.showLanguage('se-012', '位数'),
                        dataIndex: 'Precision'
                    }, {
                        title: this.showLanguage('se-013', '精度'),
                        dataIndex: 'Scale'
                    }]}
                    type="salary"
                />
            </div>
        )
    }
}
