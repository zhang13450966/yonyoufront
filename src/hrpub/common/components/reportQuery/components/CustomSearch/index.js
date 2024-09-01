import React, {Component} from 'react';
import './index.less';
import CustomRefer from '../CustomRefer';
import {
    base
} from 'nc-lightapp-front';
import moment from 'moment';
import {getColor} from '../../../../utils/utils';
import _ from 'lodash';

const {
    NCSelect,
    NCInput,
    NCDatePicker
} = base;

const {
    NCOption
} = NCSelect;

let timer = null;

class CustomSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            color: '',
            bgColor: ''
        };

        this.clearReferValue = this.clearReferValue.bind(this);
        this.addParamForSpecialRefer = this.addParamForSpecialRefer.bind(this);
    }

    clearReferValue(item) {
        const {
            customReferValue, 
            customFormValue,
            dispatch
        } = this.props;

        dispatch({
            type: 'reportQuery/update',
            payload: {
                customFormValue: {
                    ...customFormValue,
                    [item]: undefined
                },
                customReferValue: {
                    ...customReferValue,
                    [item]: {}
                }
            }
        });
    }

    componentDidMount() {
        this.hideSaveBtn();

        let referW = document.querySelectorAll('.referWrapper');

        [].map.call(referW, (item) => {
            item.addEventListener('click', (e) => {
                if(e.target.className.includes('icon-qingkong')) {
                    this.clearReferValue(e.currentTarget.dataset.item);
                }
            });
        });
        let c = getColor();

        this.setState({
            color: c.color,
            bgColor: c.bgColor
        });
    }

    hideSaveBtn() {
        let btn = null;
        let modalDom = document.querySelector('.NC_searchAdvModal');
        if(modalDom) {
            let footerDom = modalDom.querySelector('.modalFooter');
            if(footerDom) {
                let planDom = footerDom.querySelector('.saveSearchPlan')
                if(planDom) {
                    btn = planDom
                }
            }
        }
        if(btn) {
            btn.innerHTML = '';
            clearTimeout(timer);
        }
        else {
            timer = setTimeout(() => {
                this.hideSaveBtn();
            }, 500);
        }
    }

    // 处理特殊参照有特殊参数问题
    addParamForSpecialRefer(refPath, refCode) {
        const {
            customReferValue,
            customQueryCondition,
            currentTreeData,
            refQueryConditionMap = {}
        } = this.props;

        let queryCondition = {};

        if(refQueryConditionMap[refCode]) {
            queryCondition = refQueryConditionMap[refCode];
        }

        if(refPath === 'hrp/refer/hrpref/ReportBudgetDimGridRef/index') {
            queryCondition = customQueryCondition;
        }
        
        // 社保福利-组织-变更表，查询弹窗第三个参照添加查询参数
        if(refPath === 'hrbm/refer/basic/BmClassRefModelForRptRef/index') {
            let org = '';
            let period = '';

            _.forIn(customReferValue, (value, key) => {
                if(key.includes('org')) {
                    org = value && value.refpk;
                }
                if(key.includes('period')) {
                    period = value && value.refpk;
                }
            });

            queryCondition = {
                pk_org: org,
                period: period,
                pk_report: currentTreeData
            };  
        }

        return queryCondition;
    }

    render() {
        const {
            language,
            data,
            customFormValue,
            customReferValue
        } = this.props;

        let dark = document.body.className.includes('nc-lightapp-front-black');
        // debugger
        return (
            <table className={`custom-search-area ${dark ? 'dark-table' : ''}`}>
                <tr className="custom-search-row"></tr>
                <tr className="custom-search-head">
                    <td width="300">{language['hrpub-000134']/*显示名*/}</td>
                    <td width="500">{language['hrpub-000135']/*参数值*/}</td>
                </tr>
                {data.map((item) => {
                    let value = customFormValue[item.code];
                    let isShowUnit = item.refPath ? !/HROrgTreeRef|AdminOrgDefaultTreeRef/.test(item.refPath) : true;

                    let queryCondition = this.addParamForSpecialRefer(item.refPath, item.refCode);
                    
                    if(item.refCode === '日历' || item.refCode === '@@@@Z0Z100000000XYHL') {
                        value = value ? moment(value).format('YYYY-MM-DD') : null;
                    }
                    if(item.dataType == 0 || item.dataType == 1){
                        value = value ? value : '';
                    }

                    return (
                        <tr className="custom-search-row">
                            <td width="300">
                                {item.required && <span className="red-star">*</span>}
                                {item.name}
                            </td>
                            <td width="500">
                                <Choose>
                                    <When condition={/[456]/.test(item.dataType)}>
                                        <If condition={item.refCode === '日历' || item.refCode === '@@@@Z0Z100000000XYHL'}>
                                            <NCDatePicker
                                                format="YYYY-MM-DD"
                                                onChange={this.props.onChange('date', item)}
                                                value={value}
                                                // defaultValue={item.display}
                                                className="custom-search-date-picker"
                                            />
                                            <Else/>
                                            <span
                                                className="referWrapper"
                                                data-item={item.code}
                                            >
                                                <CustomRefer
                                                    refcode={item.refPath}
                                                    isMultiSelectedEnabled={item.operator === 'in'}
                                                    onChange={this.props.onChange('refer', item)}
                                                    // value={customReferValue[item.code]}
                                                    value={customReferValue[item.code] || item.refMap || (item.operator === 'in' ? [] : {})}
                                                    ref={ref => this.customRefer = ref}
                                                    isShowUnit={isShowUnit}
                                                    isCacheable={false}
                                                    queryCondition={queryCondition}
                                                />
                                            </span>
                                        </If>
                                    </When>
                                    <When condition={/[23]/.test(item.dataType)}>
                                        <NCSelect
                                            onChange={this.props.onChange('select', item)}
                                            value={value}
                                            multiple={item.operator === 'in'}
                                            // defaultValue = { item.display }
                                        >
                                            {item.options.map((item) => {
                                                return (
                                                    <NCOption
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </NCOption>
                                                );
                                            })}
                                        </NCSelect>
                                    </When>
                                    <When condition={/[01]/.test(item.dataType)}>
                                        <span className="inputmiddle">
                                            <NCInput
                                                onChange={this.props.onChange('input', item)}
                                                value={value}
                                                // defaultValue = { item.display }
                                            />
                                        </span>
                                    </When>
                                </Choose>
                            </td>
                        </tr>
                    )
                })}
                
            </table>
        );
    }
}

export default CustomSearch;