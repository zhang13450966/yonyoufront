import React, {Component} from 'react';

import {base} from 'nc-lightapp-front';

import proFetch from '../../../common/utils/project-fetch';
import InitMultiLang from './language';


const {NCTable, NCButton, NCInput} = base;


export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            activeRow: {},
            language: {}
        };

        this.getData = this.getData.bind(this);
        this.rowClickHandle = this.rowClickHandle.bind(this);
        this.submitSemantic = this.submitSemantic.bind(this);
        this.addInput = this.addInput.bind(this);
        this.changeFieldName = this.changeFieldName.bind(this);
        this.showLanguage = this.showLanguage.bind(this);
    }
    
    showLanguage(code, defaultLabel) {
        return this.state.language[code] || defaultLabel
    }

    // 报表类型表
    typeMap = {
        'salary': 1,
        'social': 2,
        'manage': 3
    }

    // 提交路径对照表
    urlMap = {
        'salary': '/nccloud/hr/rpt/WadataProviderDesignerAction.do',
        'social': '/nccloud/hr/rpt/BmdataProviderDesignerAction.do',
        'manage': '/nccloud/hr/rpt/ManageDeptDataProviderDesignerAction.do'
    }

    componentDidMount() {
        InitMultiLang('semantic', (res) => {
            if(res) {
                this.setState({
                    language: res
                });
            }
            this.getData();
        });
    }

    // 数据类型表
    getDataTypeMap() {
        return {
            16: this.showLanguage('se-003', '字符串'),
            4: this.showLanguage('se-004', '整型'),
            10: this.showLanguage('se-005', '数值型'),
            3: this.showLanguage('se-006', '短整型')
        }
    }

    getData() {
        let dataTypeMap = this.getDataTypeMap();
        proFetch({
            url: '/nccloud/hr/rpt/QueryProviderDesignAction.do'
        })
            .then((res) => {
                if(res.success) {
                    let list = [];
                    let data = res.data[this.typeMap[this.props.type]];

                    Object.values(data).forEach((item) => {
                        item.DataType = dataTypeMap[item.DataType];
                        list.push(item);                
                    });

                    this.setState({
                        data: list
                    });
                }
            });
    }

    rowClickHandle(record, rowIndex, e) {
        let rows = document.querySelector('.tableDom').querySelector('tbody').querySelectorAll('tr');

        Array.from(rows).forEach((row, index) => {
            if(index === rowIndex) {
                row.style.background = '#f3f3f3';
            }
            else {
                row.style.background = '';
            }
        });

        this.setState({
            activeRow: record
        });
    }

    submitSemantic() {
        let url = this.urlMap[this.props.type];
        let data = this.state.data;
        let postData = {};

        data.forEach((row, index) => {
            postData[index] = row;
        }); 

        proFetch({
            url: url,
            body: postData
        })
            .then((res) => {
                this.props.beSureBtnClick(res.data);
            });
    }

    // 给字段名称列添加输入框
    addInput(columns) {
        columns.forEach((col) => {
            if(col.dataIndex === 'Name') {
                col.render = (text, record, index) => {
                    return (
                        <NCInput
                            value={text}
                            onChange={this.changeFieldName(index)}
                        />
                    );
                }
            }
        });

        return columns
    }

    // 修改字段名称
    changeFieldName(index) {
        return (v) => {
            let {data} = this.state;

            data[index]['Name'] = v;

            this.setState({
                data: data
            });
        }
    }

    render() {
        const {data} = this.state;

        return (
            <div>
                <div
                    style={{
                        paddingBottom: '46px'
                    }}
                >
                    <NCTable
                        columns={this.addInput(this.props.columns)}
                        data={data}
                        onRowClick={this.rowClickHandle}
                        className="tableDom"
                    />
                </div>
                <div
                    style={{
                        textAlign: 'right',
                        marginTop: '8px',
                        position: 'fixed',
                        bottom: '0',
                        right: '0',
                        background: '#fff',
                        width: '100%',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        paddingRight: '8px'
                    }}
                >
                    <NCButton
                        colors="primary"
                        onClick={this.submitSemantic}
                    >
                        {this.showLanguage('se-007', '确定')}
                    </NCButton>
                    <NCButton
                        onClick={this.props.closeModal}
                    >
                        {this.showLanguage('se-008', '取消')}
                    </NCButton>
                </div>
            </div>
        )
    }
}
