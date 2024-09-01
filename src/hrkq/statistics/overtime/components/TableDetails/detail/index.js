import React, { Component } from 'react';
import { ajax, toast } from 'nc-lightapp-front';

import { base } from 'nc-lightapp-front';
import { formatDate } from 'src/hrpub/common/utils/utils.js';
import config from '../../../config/index';
// css
import './index.less';
// components

let { NCTable, NCCheckbox, NCButton, NCLoading } = base;

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.onCloseDetail = this.onCloseDetail.bind(this)
    }

    componentDidMount(){
        window.addEventListener('click', this.onCloseDetail)
    }

    onCloseDetail (e) {
        const {
            props: {
                onClose
            },
        } = this;
        if (!this.state.loading&&!e.target.closest('.overtime-detail-wrap')){
            onClose && onClose();
        }
    }

    componentWillUnmount () {
        window.removeEventListener('click', this.onCloseDetail)
    }

    render(){
        const {
            state: {
                loading,
                active
            },
            props,
            props: {
                lang,
                data = {},
                height
            },
        } = this;


        if (data !== active){
            this.setState({
                active: data,
                loading: true
            });

            setTimeout(() => {
                this.setState({
                    loading: false
                });
            }, 500);
        }

        return (<div class="overtime-detail-wrap" style={{height: height + 'px'}}>
            <div class="header">
                <span>{lang['hrkq-0000079'] }</span>
            </div>

            <ul class="list">
                {[{
                    key: 'staffname',
                    i18n: 'hrkq-0000014', //姓名
                }, {
                    key: 'overtimelen',
                    i18n: 'hrkq-0000073', // 申请时长
                    render(text, row, index) {
                        if(text){
                            return `${text} ${lang['hrkq-0000064']}`;
                        }
                    }
                }, {
                    key: 'actuallen',
                    i18n: 'hrkq-0000046', // 实际时长
                    render(text, row, index) {
                        if(text){
                            return `${text} ${lang['hrkq-0000064']}`;
                        }
                    }
                }, {
                    key: 'otsignrange',
                    i18n: 'hrkq-0000036', // 签到时间
                    render(text, row, index){
                        if (row['otsignbegintime'] &&
                            row['otsignendtime']) {
                            return `${formatDate(row['otsignbegintime'], '', 'Y-M-d h-m-s')} - ${formatDate(row['otsignendtime'], '', 'Y-M-d h-m-s')}`
                        }
                    }
                }, {
                    key: 'deductotstr',
                    i18n: 'hrkq-0000074', // 扣除时段
                    render(text, row, index) {
                        return text || '';
                    }
                }, {
                    key: 'applydate',
                    i18n: 'hrkq-0000037', // 申请日期
                    render(text, row, index) {
                        return text && formatDate(text) || '';
                    }
                }, {
                    key: 'remark',
                    i18n: 'hrkq-0000075', // 加班原因
                }].map((row, index) => {
                    let content = data[row['key']] || '';
                    if(typeof row.render == 'function'){
                        content = row.render(data[row['key']], data, index);
                    }
                    return (<li>
                        <span class="label">{row.title || lang[row.i18n] || ''}:</span>
                        <span class="content">{ content }</span>
                    </li>);
                })}
            </ul>

            {/* loading */}
            <NCLoading
                container={this}
                show={loading} >
            </NCLoading>
        </div>);
    }
}