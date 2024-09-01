/**
 * Created by wanghongxiang on 2019/2/21.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {base, ajax, toast, getMultiLang} from 'nc-lightapp-front';
let {NCModal, NCRow, NCCol, NCButton} = base;
const {Header, Title, Body, Footer} = NCModal
import SortBtns from '../components/btns'
import SortTable from '../components/table'
import SortSelect from '../components/select'
import {sortBtns, metaChange, sortTypeChange, formatSelectData, rowClick,rowDoubleClick, confirmBtn, saveBtn} from '../events'
import './index.less'


class HRSort extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            meta: null,
            sortType: true,
            index: 0, // 当前选中行
            sortTableData:[], // 排序表格
            metaSource:[], // 下拉 select
            sortList: [],
            selectedRow: [true]
        }


        this.cancel = this.cancel.bind(this)
        this.sortBtns = this.sortBtns.bind(this)
        this.propsToState = this.propsToState.bind(this)
        this.sortTypeChange = this.sortTypeChange.bind(this)
        this.metaChange = this.metaChange.bind(this)
        this.rowClick = this.rowClick.bind(this)
        this.rowDoubleClick = this.rowDoubleClick.bind(this)
        this.confirmBtn = this.confirmBtn.bind(this)
        this.saveBtn = this.saveBtn.bind(this)
    }
    componentDidMount() {
        let props = this.props
        let callback = (json, status, inlt) => {
            if (status) {
                this.lang = json
                this.setState({json, inlt}, () => {
                    {
                        this.columns = [
                            {title: json['hrpub-000079'], dataIndex: "name", key: "name", width: 100},/* 国际化处理： 字段名称*/
                            {title: json['hrpub-000080'], dataIndex: "sort", key: "sort", width: 100}/* 国际化处理： 升降*/
                        ]
                        this.order = [
                            {key: true, value: json['hrpub-000081']},/* 国际化处理： 升序*/
                            {key: false, value: json['hrpub-000082']}/* 国际化处理： 降序*/
                        ]
                    };
                })//存json和inlt到页面state中并刷新页面
            }
        }
        getMultiLang({moduleId: 'hrpub', domainName: 'hrpub', callback})
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data != this.props.data) {
            let {selectedItem, savedItem} = nextProps.data
            let metaSource = formatSelectData(selectedItem),
                sortTableData = formatSelectData(savedItem, {
                    field_code: 'key', field_name: 'name', ascend_flag: 'sort'
                },true,this.state.json)
            this.propsToState({metaSource, sortTableData})
        }
    }
    propsToState(state, func=()=>{}) {
        this.setState({...state}, ()=> {
            func()
        })
    }
    cancel() {
        this.setState({
           show: false
        })
    }
    show(){
        this.setState({
            meta: null,
            show:true,
            sortType: true,
            index: 0, // 当前选中行
            selectedRow: [true]

        })
    }
    sortBtns(type) {
        this.propsToState(sortBtns(type, this.state))
    }
    metaChange(key, value, item) {
        this.propsToState(metaChange(item && item.key))
    }
    rowClick(record, index, indent) {
        this.propsToState(rowClick(record, index, indent, this.state))
    }
    rowDoubleClick(record, index, indent) {
        this.propsToState(rowDoubleClick(record, index, indent, this.state, this.lang))
    }
    sortTypeChange(key, value, item) {
        this.propsToState(sortTypeChange(item && item.key))
    }
    confirmBtn() {
        let result = confirmBtn(this.state)
        this.setState({
            show: false
        },() => {
            this.props.confirmCallBack(result)
        })
    }
    saveBtn() {
        let result = saveBtn(this.state)
        this.propsToState({sortList: result}, ()=>{
            this.props.saveCallBack(result)
        })
    }
    render() {
        let {order, columns} = this
        let {metaSource, sortTableData, selectedRow} = this.state
        let modal =  this.state.json ?
                <NCModal visible={this.state.show} onCancel={this.cancel.bind(this)} className ="modal">
                    <Header closeButton={true}>
                        <Title>{this.state.json['hrpub-000083']}</Title>{/* 国际化处理： 新增*/}
                    </Header>
                    <Body>
                    <NCRow>
                        <NCCol md={20}>
                            <NCRow className="SortSelect">
                                <SortSelect
                                    metaSource={metaSource}
                                    order={order}
                                    metaChange={this.metaChange}
                                    sortTypeChange={this.sortTypeChange}
                                />
                            </NCRow>
                            <NCRow className="modal_table margin0">
                                <SortTable
                                    columns={columns}
                                    rowClick={this.rowClick}
                                    rowDoubleClick={this.rowDoubleClick}
                                    selectedRow={selectedRow}
                                    sortTableData={sortTableData}
                                />
                            </NCRow>
                        </NCCol>
                        <NCCol md={4} className="modal_btn">
                            <SortBtns evts={this.sortBtns.bind(this)} json={this.state.json}/>
                        </NCCol>
                    </NCRow>
                    </Body>
                    <Footer>
                        <NCButton colors="danger" shape="border" onClick={this.confirmBtn}>{this.state.json['hrpub-000055']}</NCButton>
                        <NCButton colors="danger" shape="border" onClick={this.saveBtn}>{this.state.json['hrpub-000046']}</NCButton>
                        <NCButton shape="border" onClick={this.cancel}>{this.state.json['hrpub-000047']}</NCButton>
                    </Footer>
                </NCModal> : ''
        return (
            <React.Fragment>
                {modal}
            </React.Fragment>
        )
    }
}
HRSort.propTypes = {
    data: PropTypes.array.isRequired,
    confirmCallBack: PropTypes.func.isRequired,
    saveCallBack: PropTypes.func.isRequired,
}
export default HRSort