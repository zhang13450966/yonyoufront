import {getAppPageConfig} from 'src/hrpub/common/utils/utils'
export default class HeaderAction {
    constructor(comp){
        this.comp = comp   
    }
    appConfig = {
        appcode: '60024010',
        pagecode: '60089005p'
    }
    //获取模版
    getTemplate = (refpk)=> {
        const {props, action} = this.comp
        const {createUIDom,button,meta, enterpriseOrg} = props
        createUIDom(this.appConfig,(data)=>{
            meta.setMeta(data.template || [])
            button.setButtons(data.button || [])
            const {isApply, pageInfo} = enterpriseOrg
            action.tableAction.getMainTableData(isApply, pageInfo, refpk)
        })
    }
    onButtonClick = (props, btn) => {
        const {action} = this.comp
        action.addEditAction.openModel()
    }
    // 点击显示停用的勾选框
    changeCheck = () => {
        const {props,action} = this.comp
        const {dispatch, enterpriseOrg} = props
        dispatch({
            type: 'enterpriseOrg/update',
            payload: {
                isApply: !enterpriseOrg.isApply
            }
        });
        action.tableAction.getMainTableData(!enterpriseOrg.isApply, enterpriseOrg.pageInfo, enterpriseOrg.pk_org)
    }
    // 组织改变触发函数
    handleTreeChange = (value) => {
        const {props} = this.comp
        const {dispatch} = props
        dispatch({
            type: 'enterpriseOrg/update',
            payload: {
                pk_org: value.refpk,
                orgValue: value
            }
        })
        if (value.refpk) {
            dispatch({
                type: 'enterpriseOrg/update',
                payload: {
                    shwoTable: true
                }
            })
            if (window.location.href.match('localhost:3006')) {
                window.location.hash = '#/ifr?page=2019815105156114'
                this.appConfig = getAppPageConfig()
            }
            this.getTemplate(value.refpk)
        } else {
            dispatch({
                type: 'enterpriseOrg/update',
                payload: {
                    shwoTable: false
                }
            })
        }
    }
    didMount = () => {
        
    }
}