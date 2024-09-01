import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-lightapp-front';

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    disposeSearch(meta, props) {
        let items = meta['light_report'].items;
        items.forEach(item => {
            if (item.attrcode == 'pk_storereq_b.pk_reqstordoc') {
                // 需要进行过滤的参照
                item.queryCondition = () => {
                    // 添加过滤方法
                    let data = props.search.getSearchValByField('light_report', 'pk_org'); // 获取过滤源选择的参数
                    data = (data && data.value && data.value.firstvalue) || ''; // 选择的参数
                    return { pk_org: data }; // 根据库存组织过滤仓库
                };
            } else if (item.attrcode == 'ctrantypeid') {
                item.queryCondition = () => {
                    // 添加过滤方法
                    // let data = '422X'; // 选择的参数
                    return { vbilltype: '422X' }; // 根据单据类型过滤交易类型
                };
            } else if (item.attrcode == 'pk_storereq_b.pk_srcmaterial.code') {
                let data = props.search.getSearchValByField('light_report', 'pk_org');
                data = (data && data.value && data.value.firstvalue) || '';
                return { pk_org: data };
            } else if (item.attrcode == 'pk_storereq_b.pk_material.pk_marbasclass.code') {
                let data = props.search.getSearchValByField('light_report', 'pk_org');
                data = (data && data.value && data.value.firstvalue) || '';
                return { pk_org: data };
            } else if (item.attrcode == 'pk_storereq_b.cprojectid') {
                let data = props.search.getSearchValByField('light_report', 'pk_org');
                data = (data && data.value && data.value.firstvalue) || '';
                return { pk_org: data };
            }
        });
        return meta; // 处理后的过滤参照返回给查询区模板,需不需要处理过滤参照都return meta
    }

    render() {
        return (
            <div className="table">
                <SimpleReport disposeSearch={this.disposeSearch.bind(this)} />
            </div>
        );
    }
}
ReactDOM.render(<Test />, document.querySelector('#app'));
