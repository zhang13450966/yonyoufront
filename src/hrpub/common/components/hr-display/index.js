import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base} from 'nc-lightapp-front'
const {NCRow, NCButton, NCCol, NCModal} = base
import {Maybe} from 'src/hrpub/common/utils/utils'
import './index.less'
class AdjustOrder extends Component {
    static propTypes = {
        ctx: PropTypes.object,
        json: PropTypes.object,
        metaParent: PropTypes.object,  // 依赖的整体meta
        fields: PropTypes.arrayOf(PropTypes.string), // 需要显示的field, 需要包含pk
        data: PropTypes.arrayOf(PropTypes.object),
        confirm: PropTypes.func
    }
    static defaultProps = {
        ctx: {},
        json: {},
        metaParent: {},
        metaName: 'adjust_order_comp'
    }
    constructor (props) {
        super(props)
        this.state = {
            show: false,
            current: 0,
            totalData: [],
            json: {}
        }

        // debugger
        props.use&&props.use.editTable('adjust_order_comp')
        let callback = (json,status,inlt)=>{
            if(status){
                this.setState({
                    json: json
                })
            }
        }
        //获取多语
        props.ctx.MultiInit.getMultiLang({ moduleId: 'hrpub', domainName: 'hrpub', callback })

        this.displayOrderButtonClick = this.displayOrderButtonClick.bind(this)
        this.setAdjustMeta = this.setAdjustMeta.bind(this)
        this.setAdjustData = this.setAdjustData.bind(this)
        this.show = this.show.bind(this)
        this.onRowClick = this.onRowClick.bind(this)
    }
    setAdjustMeta(meta, metaParent, callback, data) {
        let adjust_order_comp = this.handleDisplayField(metaParent, this.props.fields)
        meta.setMeta(Object.assign(meta.getMeta(), {adjust_order_comp}), ()=>{
            callback(data)
        })
    }
    setAdjustData(data) {
        const ctx = this.props.ctx;
        const {editTable} = ctx
        editTable.setTableData('adjust_order_comp', data)
        editTable.setStatus('adjust_order_comp', 'browse')
    }
    handleDisplayField(meta, fields) {
        let items =  meta.items.filter(item => {
            return !!~fields.indexOf(item.attrcode)
        }) 
        meta.items = items
        return meta
    }
    displayOrderButtonClick(type, editTable) {
        const {current, totalData} = this.state
        if (!Maybe.of(totalData).getValue(['rows'])) {
            this.setState({
                show: false
            })
            return
        }
        let rows = totalData.rows
        let length = rows.length
        let currentData = rows.splice(current, 1)[0]
        let index
        switch(type) {
            case 'top':
                if(current === 0) {
                    break;
                }
                index = 0 
                this.handleCurrentRow(currentData, rows, current, index, totalData, editTable)
            break;
            case 'up':
                if(current === 0) {
                    break;
                }
                index = current -1 
                this.handleCurrentRow(currentData, rows, current, index, totalData, editTable)
            break;
            case 'down':
                if (current === length -1 ) {
                    break;
                }
                index = current + 1 
                this.handleCurrentRow(currentData, rows, current, index, totalData, editTable)
            break;
            case 'bottom':
                if (current === length -1 ) {
                    break;
                }
                index = length -1
                this.handleCurrentRow(currentData, rows, current, index, totalData, editTable)
            break;
            case 'confirm':
                // 获取当前数据
                let orderDataAll = editTable.getAllData('adjust_order_comp')
                // 触发回调
                this.props.confirm(orderDataAll)
                this.setState({
                    show: false
                })
                // this.props.confirm(this.handleCallBackData(orderDataAll))
            break;
            case 'cancel':
                this.setState({
                    show: false
                })
            break;
        }
    }
    // handleCallBackData(tableData) {
    //     let pk_wa_taxsetArray = []
    //     let pk_wa_taxsetbase = null
    //     tableData.rows.map(item => {
    //         pk_wa_taxsetArray.push(item.values.pk_wa_taxset.value)
    //         if(!pk_wa_taxsetbase) pk_wa_taxsetbase = item.values.pk_wa_taxsetbase.value 
    //     })
    //     return {
    //         pk_wa_taxsetbase,
    //         pk_wa_taxsetArray
    //     }
    // }
    /**
     * @param  {缓存当前选中行数据} currentData
     * @param  {所有行} rows
     * @param  {当前索引} current
     * @param  {操作之后索引} index
     * @param  {总的表格数据} totalData
     * @param  {} editTable
     */
    handleCurrentRow(currentData, rows,current, index, totalData, editTable) {
        // debugger
        rows.splice(index, 0, currentData)
        editTable.setTableData('adjust_order_comp',{rows:rows})
        this.setState({
            totalData: totalData,
            current: index
        }, () => {
            editTable.focusRowByIndex('adjust_order_comp', index)
        })
    }
    show() {
        const {ctx, metaParent, data} = this.props;
        const {meta} = ctx
        let parentMeta = JSON.parse(JSON.stringify(metaParent))
        this.setAdjustMeta(meta, parentMeta, this.setAdjustData, data)
        this.setState({
            show: true,
            totalData: this.props.data
        })
    }
    cancel() {
        this.setState({
            show: false
        })
    }
    onRowClick(props, moduleid, record, index, e) {
        this.setState({
            current: index
        })
    }
    render () {
        const {editTable} = this.props.ctx;
        let {createEditTable} = editTable;
        const {json} = this.state
        return (
            <NCModal id="payleave-add" visible={this.state.show} onCancel={this.cancel.bind(this)} size="md">
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{json['hrpub-000166']}</NCModal.Title>{/* 国际化处理： 新增*/}
                </NCModal.Header>
                <NCModal.Body>
                    <div className='adjustOrder'>
                        <NCRow>
                            <NCCol md={20}>
                                <div className='filedTable flex-container'>
                                    {
                                        createEditTable('adjust_order_comp', {
                                            onRowClick: this.onRowClick,
                                            adaptionHeight: true
                                        })
                                    }
                                </div>
                            </NCCol>
                            <NCCol md={4} className='display-button'>
                            <NCButton shape='border' colors='default' onClick={this.displayOrderButtonClick.bind(this, 'top', editTable)}>
                                {json['hrpub-000167']}
                            </NCButton>
                            <NCButton shape='border' colors='default' onClick={this.displayOrderButtonClick.bind(this, 'up', editTable)}>
                                {json['hrpub-000168']}
                            </NCButton>
                            <NCButton shape='border' colors='default' onClick={this.displayOrderButtonClick.bind(this, 'down', editTable)}>
                                {json['hrpub-000169']}
                            </NCButton>
                            <NCButton shape='border' colors='default' onClick={this.displayOrderButtonClick.bind(this, 'bottom', editTable)}>
                                {json['hrpub-000170']}
                            </NCButton>
                            </NCCol>
                        </NCRow>
                    </div>
                </NCModal.Body>
                <NCModal.Footer>
                        <NCButton colors='danger' onClick={this.displayOrderButtonClick.bind(this, 'confirm', editTable)}>
                            {json['hrpub-000055']}
                        </NCButton>
                        <NCButton colors='default' onClick={this.displayOrderButtonClick.bind(this, 'cancel')}>
                            {json['hrpub-000056']}
                        </NCButton>
                </NCModal.Footer>
            </NCModal>
        )
    }
}
export default AdjustOrder
