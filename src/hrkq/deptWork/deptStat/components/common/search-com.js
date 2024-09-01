import React, {Component} from 'react';
import {base, high} from 'nc-lightapp-front';

const {NCDatePicker, NCButton, NCSelect, NCInput, NCCheckbox} = base;
import {MyMonthPicker} from "../MyDatePicker"

const NCOption = NCSelect.NCOption;
import moment from 'moment';
import {getCurMonthEnd, getCurMonthStart, getCurMonth} from '../../util/util.js';
import './index.less';
//职务
import Job from 'src/hrjf/refer/jfref/JobTypeJobRef/index';

export default class SearchCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: '',
            beginDate: getCurMonthStart(),
            endDate: getCurMonthEnd(),
            monthDate: moment().format('YYYY-M'),
            jobVal: '',
            isIncludeSub: true
        }
    }

    render() {
        const {
            format = 'YYYY-MM-DD',
            startPlaceholder = '',
            endPlaceholder = '',
            showTime = false,
            type,
            defaultOptionValue,
            deptOptions,
            onDeptChange,
            showExport,
            deptStat
        } = this.props;
        let {searchVal, beginDate, endDate, monthDate, jobVal, isIncludeSub} = this.state
        return (
            <div className="deptStat_search">
                {defaultOptionValue && <NCSelect
                    defaultValue={defaultOptionValue}
                    style={{width: 200, marginRight: 6}}
                    onSelect={onDeptChange}
                >
                    {
                        deptOptions.map(opt => {
                            return (
                                <NCOption value={opt.id}>{opt.name}</NCOption>
                            )
                        })
                    }
                </NCSelect>}
                <NCCheckbox
                    style={{marginRight: '8px'}}
                    defaultChecked={true}
                    onChange={this.checkChanged}
                    checked={isIncludeSub}>
                    {deptStat.lang['hrkq-0000131']}{/* 包含下级 */}
                </NCCheckbox>
                {
                    type === 'range' && <React.Fragment>
                        <NCDatePicker
                            showTime={showTime}
                            format={format}
                            value={beginDate}
                            onChange={this.onBeginDateChange}
                        />
                        <span class="separator"></span>
                        <NCDatePicker
                            showTime={showTime}
                            format={format}
                            value={endDate}
                            onChange={this.onEndDateChange}
                        />
                    </React.Fragment>
                }
                {
                    type === 'one' && <React.Fragment>
                        <MyMonthPicker
                            defaultValue={moment()}
                            format="YYYY-M"
                            onChange={this.onMonthChange}
                        />
                    </React.Fragment>
                }
                <div style={{width: 200, marginLeft: 6}}>
                    <Job
                        value={jobVal}
                        isAlwaysEmitOnChange={true}
                        placeholder={deptStat.lang['hrkq-0000013']}
                        isMultiSelectedEnabled={true}
                        onChange={(refpk = '') => {
                            this.onJobChange(refpk);
                        }}
                    />{/* 职务 */}
                </div>
                <NCInput placeholder={deptStat.lang['hrkq-0000125']}
                         style={{width: 200, marginLeft: 6}}
                         value={searchVal}
                         showClose={true}
                         onChange={this.changeSearch}/>{/* 国际化处理： 姓名/编号*/}
                <div className={'btn-group'}>
                    <NCButton shape="border"
                              colors="primary"
                              onClick={() => this.onSearch(true)}>{deptStat.lang['hrkq-000004']}{/* 国际化处理： 查询*/}</NCButton>
                    {showExport && <NCButton shape="border"
                                             onClick={this.onExport}>{deptStat.lang['hrkq-0000085']}{/* 国际化处理： 导出*/}</NCButton>}
                </div>

            </div>
        );
    }

    changeSearch = (val) => {
        this.setState({searchVal: val})
    }
    onBeginDateChange = (val) => {
        this.setState({beginDate: val})
    }
    onEndDateChange = (val) => {
        this.setState({endDate: val})
    }
    onMonthChange = (val) => {
        this.setState({monthDate: val.format('YYYY-M')})
    }
    onSearch = (isResearch) => {
        const onSearchEmit = this.props.onSearchEmit;
        let {beginDate, endDate, searchVal, monthDate, jobVal, isIncludeSub} = this.state;
        let jobId = ''
        if (typeof (jobVal) === 'object') {
            jobId = jobVal.map(job => {
                return job.refpk
            }).join(',')
        }
        if (this.props.type === 'one') {
            onSearchEmit({search: searchVal, monthDate, jobId, isIncludeSub, isResearch});
        } else {
            onSearchEmit({search: searchVal, beginDate, endDate, jobId, isIncludeSub, isResearch});
        }
    }
    onJobChange = (val) => {
        this.setState({jobVal: val})
    }
    onExport = () => {
        const exportData = this.props.exportData;
        let {beginDate, endDate, searchVal, monthDate, jobVal} = this.state;
        let jobId = ''
        if (typeof (jobVal) === 'object') {
            jobId = jobVal.map(job => {
                return job.refpk
            }).join(',')
        }
        if (this.props.type === 'one') {
            exportData(searchVal, monthDate, jobId);
        } else {
            exportData(searchVal, beginDate, endDate, jobId);
        }
    }
    checkChanged = async () => {
        await this.setState({isIncludeSub: !this.state.isIncludeSub});
        this.onSearch()
    }

    componentDidMount() {
        const {emitter, emitType} = this.props;
        emitter && emitter.addListener('searchData:' + emitType, this.onSearch)
    }

    componentWillUnmount() {
        const {emitter, emitType} = this.props;
        emitter && emitter.removeListener('searchData:' + emitType, this.onSearch)
    }
};
