import proFetch from '../../../../hrpub/common/utils/project-fetch';
import {promptBox,toast} from 'nc-lightapp-front';



export default class HeaderAction {
    constructor(comp){
        this.comp = comp   
    }
    onButtonClick = (props, btn) => {
        const {action} = this.comp
        action.addEditAction.openModel()
    }
    // 点击显示停用的勾选框
    changeCheck = () => {
        const {props,action} = this.comp
        const {dispatch, enterpriseGroup} = props
        dispatch({
            type: 'enterpriseGroup/update',
            payload: {
                isApply: !enterpriseGroup.isApply
            }
        });
        action.tableAction.getMainTableData(!enterpriseGroup.isApply, enterpriseGroup.pageInfo)
    }
    didMount = () => {
        
    }
}