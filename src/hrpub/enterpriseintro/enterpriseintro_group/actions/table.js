import {promptBox,toast,getBusinessInfo} from 'nc-lightapp-front';
import {getAppPageConfig} from 'src/hrpub/common/utils/utils'
let appConfig = getAppPageConfig()
export default class TableAction {
    constructor(comp){
        this.comp = comp
    }
    //分页事件
    paginationEve = (key) => {
        const {props, action} = this.comp
        const {dispatch, enterpriseGroup} = props
        let pageInfo = enterpriseGroup.pageInfo
        pageInfo.pageIndex = key
        dispatch({
            type: 'enterpriseGroup/update',
            payload: {
                pageInfo
            }
        })
        action.tableAction.getMainTableData(enterpriseGroup.isApply, pageInfo)
    }
    // 每页显示条数
    pageSizeSelect = (val) => {
        const {props, action} = this.comp
        const {dispatch, enterpriseGroup} = props
        let pageInfo = enterpriseGroup.pageInfo
        pageInfo.pageSize = val
        dispatch({
            type: 'enterpriseGroup/update',
            payload: {
                pageInfo
            }
        })
        action.tableAction.getMainTableData(enterpriseGroup.isApply, pageInfo)
    }
    // 点击编辑执行函数
    editInTable = (record) => {
        const {action} = this.comp
        action.addEditAction.setPronameAndProfile(record)
    }
    // 点击删除执行函数
    deleteInTable = (record) => {
        const {props} = this.comp
        const {enterpriseGroup} = props
        const {json} = enterpriseGroup
        promptBox({
            color: "warning",
            title: enterpriseGroup.json['orgmap-000018'], /* 国际化处理： 提示*/
            content: json['orgmap-000253'], /* 国际化处理： 确定删除吗*/
            beSureBtnClick: this.beSureBtnClick.bind(this, record)
        })
    }
    beSureBtnClick = async (record) => {
        const {props, action} = this.comp
        const {dispatch, enterpriseGroup} = props
        const {json} = enterpriseGroup
        let pk_orgprofile = record.values.pk_orgprofile.value
        try {
            let res = await dispatch({
                type: 'enterpriseGroup/orgProFileDeleteAction',
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
            action.tableAction.getMainTableData(enterpriseGroup.isApply, enterpriseGroup.pageInfo)
        }
        catch(e) {
            throw e
        }
    }
    // 点击启用或者停用执行函数
    disableOrEnableInTable = async (record) => {
        const {props, action} = this.comp
        const {enterpriseGroup, dispatch} = props
        const {json} = enterpriseGroup
        let pk_orgprofile = record.values.pk_orgprofile.value
        let enablestate = record.values.enablestate.value
        let enable = true
        if (enablestate === '2') {
            enable = false
        }
        let res = await dispatch({
            type: 'enterpriseGroup/orgProFileEnableAction',
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
            action.tableAction.getMainTableData(enterpriseGroup.isApply, enterpriseGroup.pageInfo)
        }
    }
    // 计算变革高度
    getHeight = () => {
		let wH = window.innerHeight,
			gap = 150;
		return wH - gap;
    }
    // 查询列表接口
    getMainTableData = async (isApply, pageInfo) => {
        const {props} = this.comp
        const {dispatch, editTable, enterpriseGroup} = props
        const info = getBusinessInfo()
        try {
            let res = await dispatch({
                type: 'enterpriseGroup/getMainTableData',
                payload: {
                    postData: {
                        pk_org: info&&info.groupId ? info.groupId : '0001AB10000000000N6U', // 0001AB10000000000N6U 0001AB10000000003OGX
                        showDisable: isApply,
                        appcode: appConfig.appcode,
                        pageInfo
                    }
                }
            });
            let rows = []
            if (res.data) {
                rows = res.data.orgprolist.rows
                let pageInfo = res.data.orgprolist.pageInfo
                dispatch({
                    type: 'enterpriseGroup/update',
                    payload: {
                        pageInfo,
                        pk_group: info && info.groupId ? info.groupId : '0001AB10000000003OGX'
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
