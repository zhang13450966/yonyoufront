import {promptBox,toast} from 'nc-lightapp-front';

export default class TableAction {
    constructor(comp){
        this.comp = comp
    }
    //分页事件
    paginationEve = (key) => {
        const {props, action} = this.comp
        const {dispatch, enterpriseOrg} = props
        let pageInfo = enterpriseOrg.pageInfo
        pageInfo.pageIndex = key
        dispatch({
            type: 'enterpriseOrg/update',
            payload: {
                pageInfo
            }
        })
        action.tableAction.getMainTableData(enterpriseOrg.isApply, pageInfo, enterpriseOrg.pk_org)
    }
    // 每页显示条数
    pageSizeSelect = (val) => {
        const {props, action} = this.comp
        const {dispatch, enterpriseOrg} = props
        let pageInfo = enterpriseOrg.pageInfo
        pageInfo.pageSize = val
        dispatch({
            type: 'enterpriseOrg/update',
            payload: {
                pageInfo
            }
        })
        action.tableAction.getMainTableData(enterpriseOrg.isApply, pageInfo, enterpriseOrg.pk_org)
    }
    // 点击编辑执行函数
    editInTable = (record) => {
        const {action} = this.comp
        action.addEditAction.setPronameAndProfile(record)
    }
    // 点击删除执行函数
    deleteInTable = (record) => {
        const {props} = this.comp
        const {enterpriseOrg} = props
        const {json} = enterpriseOrg
        promptBox({
            color: "warning",
            title: enterpriseOrg.json['orgmap-000018'], /* 国际化处理： 提示*/
            content: json['orgmap-000253'], /* 国际化处理： 确定删除吗*/
            beSureBtnClick: this.beSureBtnClick.bind(this, record)
        })
    }
    beSureBtnClick = async (record) => {
        const {props, action} = this.comp
        const {dispatch, enterpriseOrg} = props
        const {json} = enterpriseOrg
        let pk_orgprofile = record.values.pk_orgprofile.value
        try {
            let res = await dispatch({
                type: 'enterpriseOrg/orgProFileDeleteAction',
                payload: {
                    postData: {
                        pk_orgprofile
                    }
                }
            });
            if (res.success) {
                toast({
                    color: 'success',
                    content: json['orgmap-000017'] // 删除成功！
                })
            }
            action.tableAction.getMainTableData(enterpriseOrg.isApply, enterpriseOrg.pageInfo, enterpriseOrg.pk_org)
        }
        catch(e) {
            throw e
        }
    }
    // 点击启用或者停用执行函数
    disableOrEnableInTable = async (record) => {
        const {props, action} = this.comp
        const {enterpriseOrg, dispatch} = props
        const {json} = enterpriseOrg
        let pk_orgprofile = record.values.pk_orgprofile.value
        let enablestate = record.values.enablestate.value
        let enable = true
        if (enablestate === '2') {
            enable = false
        }
        let res = await dispatch({
            type: 'enterpriseOrg/orgProFileEnableAction',
            payload: {
                postData: {
                    pk_orgprofile,
                    enable 
                }
            } 
        })
        if (res.success) {
            if (enablestate === '2') {
                toast({
                    color: 'success',
                    content: json['orgmap-000254'] // 停用成功
                })
            } else {
                toast({
                    color: 'success',
                    content: json['orgmap-000255'] // 启用成功
                })
            }
            action.tableAction.getMainTableData(enterpriseOrg.isApply, enterpriseOrg.pageInfo, enterpriseOrg.pk_org)
        }
    }
    // 计算变革高度
    getHeight = () => {
		let wH = window.innerHeight,
			gap = 150;
		return wH - gap;
    }
    initMeta = (pk_org) => {
        const {action, props} = this.comp
        const {enterpriseOrg, meta} = props
        const {json} = enterpriseOrg
        const {tableAction} = action
        let template = meta.getMeta()
        let items = template.orgprolist.items
        let itemsLen = items.length
        for (let i=0; i < itemsLen; i++) {
            if (items[i].attrcode === 'handleArea') {
                items.splice(itemsLen - 1, 1)
            }
        }
        items.push({
            attrcode: 'handleArea',
            itemtype: 'customer',
            hyperlinkflag: false,
            label: json['orgmap-000046'], // 操作
            width: '180px',
            textAlign: 'center',
            visible: true,
            render(text, record, index) {
                let recordPkorg = record.values.pk_org.value
                return (
                    <div style={{display: pk_org === recordPkorg ? '' : 'none'}}>
                        {/* 编辑 */}
                        <span style={{color: '#0073E1', cursor: 'pointer',marginRight: '12px'}}
                            onClick={tableAction.editInTable.bind(this, record)}
                        >
                            {json['orgmap-000215']}
                        </span>
                        {/* 删除 */}
                        <span style={{color: '#0073E1', cursor: 'pointer',marginRight: '12px'}}
                            onClick={tableAction.deleteInTable.bind(this, record)}
                        >
                            {json['orgmap-000039']}
                        </span>
                        {/* 停用 */}
                        <span style={{color: '#0073E1', cursor: 'pointer'}}
                            onClick={tableAction.disableOrEnableInTable.bind(this, record)}
                        >
                            {/* 停用 启用 */}
                            {record.values.enablestate.value === '2' ? json['orgmap-000248'] : json['orgmap-000249']}
                        </span>
                    </div>
                )
            }
        })
        meta.setMeta(template)
    }
    // 查询列表接口
    getMainTableData = async (isApply, pageInfo, pk_org) => {
        const {props} = this.comp
        const {dispatch, editTable} = props
        try {
            let res = await dispatch({
                type: 'enterpriseOrg/getMainTableData',
                payload: {
                    postData: {
                        pk_org,
                        showDisable: isApply,
                        pageInfo
                    }
                }
            });
            let rows = []
            if (res.data) {
                this.initMeta(pk_org)
                rows = res.data.orgprolist.rows
                let pageInfo = res.data.orgprolist.pageInfo
                dispatch({
                    type: 'enterpriseOrg/update',
                    payload: {
                        pageInfo
                    }
                })
            }
            let tableData = {rows}
            editTable.setTableData('orgprolist',tableData)
        }
        catch(e) {
            throw e
        }
    }
    didMount = () => {
        
    }
}
