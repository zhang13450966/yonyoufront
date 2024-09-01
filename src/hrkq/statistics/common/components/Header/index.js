import React, { Component } from 'react';
// from nc
import { base, high } from 'nc-lightapp-front';
// css
import './index.less';
// components
import DateRange from 'src/hrkq/statistics/common/components/DateRange';

import { getCurMonthEndTs, getCurMonthStartTs } from 'src/hrkq/statistics/common/utils';

let { NCDatePicker, NCButton, NCModal, NCRow, NCCol } = base;
let { Refer } = high;

export default class extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            cols: 3, // 高级下拉列表n列布局
            dateRanger: {},
            queryParams: {},
            showSenior: false,
            searchers: {}
        };

        ['onSearch', 'onChange', 'onClear'].forEach(fun => {
            if (typeof this[fun] == 'function'){
                this[fun] = this[fun].bind(this);
            }
        })
    }

    onSearch(queryId){
        const { queryOid: oid } = this.props;
        if (queryId) {
            const { onSearch, search: { getQueryInfo, clearSearchArea } } = this.props,
                queryInfo = getQueryInfo(queryId);

            //高级查询
            // if (queryInfo &&
            //     queryInfo.querycondition &&
            //     queryInfo.querycondition.conditions[0] &&
            //     queryInfo.querycondition.conditions[0].conditions) {
            //     queryInfo.querycondition.conditions = queryInfo.querycondition.conditions[0].conditions;
            // }

            onSearch && onSearch({
                queryParams: {
                    oid,
                    ...queryInfo
                }
            });
        } else {
            let {
                state,
                props: {
                    queryParams = state['queryParams'],
                    dateRanger = state['dateRanger'],
                    onSearch
                },
            } = this,
                tmp;

            /**
             * 开启field 字段验证 须过滤
             */
            if (this.fields &&
                this.fields.length){
                if (queryParams){
                    for (let x in queryParams){
                        if (queryParams.hasOwnProperty(x)){
                            let item = queryParams[x];
                            if (this.fields.includes(x)){
                                tmp = tmp || {};
                                tmp[x] = item;
                            }
                        }
                    }
                }
            }
            onSearch && onSearch({
                dateRanger,
                queryParams: {
                    oid,
                    ...(tmp || queryParams)
                },
            });
        }
    }

    onClear(){
        const { onClear } = this.props;

        this.setState({
            dateRanger: {
                beginValue: getCurMonthStartTs(),
                endValue: getCurMonthEndTs()
            },
            queryParams: {}
        });

        onClear && onClear();
    }

    onChange(key, value){
        if(typeof key == 'string' && key){
            switch(key){
                case 'dateRanger':
                    this.setState((state, props)=>{
                        return {
                            dateRanger: Object.assign({}, state.dateRanger, value)
                        };
                    });
                break;
                default:
                    this.setState((state, props)=>{
                        let parameter = {
                            queryParams: Object.assign({}, state.queryParams, {
                                [key]: value
                            })
                        };
                        /**
                         * @desc: 选项为全部时 接口中取消传值 ' '
                         */
                        if (value === ' ') delete parameter.queryParams[key]
                        return parameter;
                    });
            }
            const { onChange } = this.props;
            onChange && onChange(key, value);
        }
    }

    render(){
        const {
            state,
            state: {
                cols,
                dateRanger,
                searchers
            },
            props,
            props: {
                queryId,
                queryOid,
                lang,
                onHeightChange,
                search: {
                    NCCreateSearch,
                    openAdvSearch
                },
                children, //基础组件
                base = [], //基础组件
                senior = [], //高级下拉组件
                custom,  //基础自定义组件
                dateRanger: {
                    beginValue = dateRanger['beginValue'],
                    endValue = dateRanger['endValue'],
                } = {},
            },
        } = this,
        DateRanger = <DateRange
            {...props}
            format='YYYY-MM-DD'
            showTime={false}
            beginValue={beginValue}
            endValue={endValue}
            onChange={e => {
                this.onChange('dateRanger', e);
            }}
        />;

        if (queryId &&
            queryOid &&
            !searchers[queryId]) {
            this.setState({
                searchers: {
                    [queryId]: NCCreateSearch(queryId, {
                        oid: queryOid, // 查询模板的oid，用于查询查询方案 （必传）
                        clickSearchBtn: () => { this.onSearch(queryId) }, // 查询按钮点击事件回调，只返回公共查询条件，不包含自定义查询条件；如果有自定义查询条件，需要业务组在clickPlanEve方法中接收查询方案信息，并保存到业务组的state中，然后在 clickSearchBtn方法中自行合并公共条件和自定义条件。
                        showClearBtn: false, // 是否显示清空按钮
                        isSynInitAdvSearch: true,
                        showSearchBtn: false, // 是否显示查询按钮 ,默认显示
                        showAdvBtn: true, // 是否显示高级查询按钮和查询方案按钮 ,默认显示
                        onlyShowAdvArea: false, //在查询区只显示 高级查询部分,
                        showAdvSearchPlanBtn: true, // 高级面板中是否显示保存方案按钮
                        hideSearchCondition: false, // 隐藏候选条件
                        hideBtnArea: false, // 隐藏查询按钮区域，默认false
                        onlyShowSuperBtn: true, // 只显示高级按钮
                        replaceSuperBtn: lang['hrkq-000001'], // 替换高级按钮
                    })
                }
            });
        }

        /**
         * 从外部注入组件
         */
        this.fields = [];
        [children, senior, base].forEach((child)=>{
            if (child){
                const recursion = (comp)=>{
                    if (Array.isArray(comp)){
                        comp.forEach((item, index, list)=>{
                            if (item){
                                let component = item && item.component || item,
                                    field = item.field || (component.props && component.props.field);

                                if (typeof field == 'string' ||
                                    Array.isArray(field)) {
                                    this.fields = this.fields.concat(field);
                                }

                                if (component &&
                                    component.props &&
                                    component.props.onChange &&
                                    typeof component.props.onChange == 'function'){
                                    component.props.onChange = component.props.onChange.bind(this);
                                }

                                if (component &&
                                    component.props &&
                                    component.props.children){
                                    recursion(component.props.children);
                                }
                            }
                        });
                    }
                }
                recursion(child);
            }
        });

        let showSenior = !!this.state.showSenior;
        if (!senior.length){
            showSenior = false;
        }

        let main = <div class="main">
            {/* title */}
            {/* <h2 class="title">{this.props.title}</h2> */}

            {/* date range */}
            {!showSenior && DateRanger}
            {/* {DateRanger} */}

            {!queryId &&
                !showSenior &&
                <div class="comp-group">
                    {children}
                    {[...base].map(item => {
                        return item && item.component || item;
                    })}
                </div>
            }

            <div class="btn-group">
                {/* 查询 */}
                {!showSenior &&
                    <NCButton shape="border" onClick={() => this.onSearch()}>{lang['hrkq-000004']}</NCButton>
                }

                {/* {searchers[queryId]} */}

                {/* 展开按钮 */}
                {!queryId &&
                    senior &&
                    !showSenior &&
                    senior.length > 0 &&
                    <NCButton colors="info"
                        onClick={(e) => {
                            let header = e.target.closest('.header-wrap');
                            if (header) {
                                setTimeout(() => {
                                    onHeightChange && onHeightChange(header.clientHeight);
                                    header && (header = null);
                                });
                            }
                            this.setState((state) => {
                                return {
                                    showSenior: !showSenior
                                };
                            });
                        }}>{lang['hrkq-000001']}</NCButton>
                }

                {/* 高级查询 */} 
                {searchers[queryId] }
                {/*{searchers['outside_query'] }
                 休假统计-高级查询
                {searchers['leave_query'] }
                 出差统计-高级查询
                {searchers['trip_query'] }*/}
            </div>

            {/* 自定义区域 */}
            { custom }
        </div>

        // 高级展开区
        if (!queryId &&
            senior &&
            showSenior &&
            senior.length > 0){

            let SeniorList = [{
                name: lang['hrkq-0000041'],
                component: DateRanger
            }, ...base, ...senior],
                Content = [];

            for (let index = 0; index < SeniorList.length; index += cols){
                let Rows = [];
                for(let x = 0; x < cols; x++ ){
                    if (SeniorList.hasOwnProperty(index + x)){
                        let item = SeniorList[index + x];
                        Rows.push(<NCCol md={8}>
                            <div class="comp-item">
                                <span class="name">{item.name}</span>
                                <span class="comp">{item.component}</span>
                                {item.tip && <span class="tip">{item.tip}</span>}
                            </div>
                        </NCCol>)
                    }
                }
                Content.push(<NCRow style={{ width: '100%', marginLeft: 0, marginRight: 0}}>
                    {Rows}
                </NCRow>)
            }

            main = <div class="senior">
                <div class="comp-senior-group">
                    { Content }
                </div>
                <div class="btn-senior-group">
                    <NCButton shape="border" onClick={() => this.onSearch()}>{lang['hrkq-000004']}</NCButton>
                    <NCButton shape="border" onClick={() => this.onClear()}>{lang['hrkq-0000044']}</NCButton>
                    <NCButton shape="border" onClick={(e) => {
                        let header = e.target.closest('.header-wrap');
                        if (header) {
                            setTimeout(() => {
                                onHeightChange && onHeightChange(header.clientHeight);
                                header && (header = null);
                            });
                        }
                        this.setState((state) => {
                            return {
                                showSenior: !showSenior
                            };
                        });
                    }}>{lang['hrkq-0000043']}</NCButton>
                </div>
            </div>
        }

        return (
            <div class="header-wrap">
                { main }
            </div>
        );
    }
}