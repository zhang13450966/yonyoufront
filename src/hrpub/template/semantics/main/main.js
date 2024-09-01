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
            originData: [],
            height: '500px',
            language: {}
        };

        this.getData = this.getData.bind(this);
        this.rowClickHandle = this.rowClickHandle.bind(this);
        this.submitSemantic = this.submitSemantic.bind(this);
        this.searchData = this.searchData.bind(this);
        this.showLanguage = this.showLanguage.bind(this);
    }

    showLanguage(code, defaultLabel) {
        return this.state.language[code] || defaultLabel
    }

    componentDidMount() {
        
        let modal = this.tableRef.parentNode;
        
        let height = window.getComputedStyle(modal).height;
        
        console.log(height);
        
        InitMultiLang('semantic', (res) => {
            if(res) {
                this.setState({
                    language: res
                });
            }
            this.getData();
        });
    }

    getData() {
        proFetch({
            url: '/nccloud/hrwa/waproviderdesigner/QueryWaReportAction.do'
        })
            .then((res) => {
                if(res.success) {
                    let list = [];

                    Object.values(res.data).forEach((item) => {
                        list.push({
                            name: item.ProviderName,
                            code: item.ProviderCode,
                            key: item.ProviderCode
                        });                        
                    });

                    this.setState({
                        data: list,
                        originData: [...list]
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
        if(this.state.activeRow.code) {
            let postData = {
                providerCode: this.state.activeRow.code
            };
    
            proFetch({
                url: '/nccloud/hrwa/waproviderdesigner/ProviderDesignerAction.do',
                body: postData
            })
                .then((res) => {
                    this.props.beSureBtnClick(res.data);
                });
        }
    }

    searchData(v) {
        let {originData} = this.state;

        let filterData = originData.filter((row) => {
            if(row.name.includes(v)) {
                return true;
            }
            return false;
        });

        this.setState({
            data: filterData
        });
    }

    render() {
        const {data, height} = this.state;

        return (
            <div
                ref={ref => this.tableRef = ref}
                style={{
                    minHeight: height
                }}
            >
                <div
                    style={{
                        width: '200px', 
                        padding: '0 0 12px 0'
                    }}
                >
                    <NCInput 
                        type="search"
                        onChange={this.searchData}
                    />
                </div>
                <div 
                    style={{
                        paddingBottom: '46px'
                    }}
                >
                    <NCTable
                        columns={[{
                            title: this.showLanguage('se-001', '语义提供者名称'),
                            dataIndex: 'name'
                        }, {
                            title: this.showLanguage('se-002', '语义提供者编码'),
                            dataIndex: 'code'
                        }]}
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
                        disabled={!this.state.activeRow.code}
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
