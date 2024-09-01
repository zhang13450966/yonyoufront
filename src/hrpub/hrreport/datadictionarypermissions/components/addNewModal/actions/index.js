import { base, toast, promptBox, getBusinessInfo } from 'nc-lightapp-front';
import { hrAjax as ajax } from 'src/hrpub/common/utils/utils';
import CommonAction from '../../../actions/commonAction';
import MainAction from '../../../actions/main';
const { NCButton, NCFormControl, NCCheckbox } = base;
import deepCopy  from 'src/hrpub/common/utils/deep-copy.js';

export default class AddAction extends CommonAction {

    constructor(comp) {
        super();
        this.comp = comp;
    }
 
    onFormAfterEvent = (props, moduleId, key, value, oldValue) => {
        this.getAddTreeData(value)
    }
    getAddTreeData = async(val) => {
        const {props, action} = this.comp;
        const {ddp, dispatch, form,  syncTree: { setSyncTreeData, openNodeByPk }} = props;

        let pk_org, display;
        if ( !val ) {
            pk_org = getBusinessInfo() && getBusinessInfo().groupId || "0001A710000000000DWH"
            display = getBusinessInfo() && getBusinessInfo().groupName || "集团01"
        } else {
            pk_org = val.refpk;
            display = val.refname;
        }
       
        
        let res = await dispatch({
            type: 'ddp/addAction',
            payload: {
                postData: {
                    pk_org
                }
            }
        })
        if (res.success && res.data) {
            let roleDatas = this.dealTreeData(res.data.roleDatas, 'role');
            let userDatas = this.dealTreeData(res.data.userDatas, 'user');
            let HRDataDicSort = deepCopy(res.data.HRDataDicSort);
            HRDataDicSort.forEach(item => {
                item.pid = 'root'
            })
            let roleRoot =[{
                code: 'root',
                id: 'root',
                key: 'root',
                name: ddp.language["report-000040"] || '角色组列表', // ''角色组列表'',
                refname: ddp.language["report-000040"] || '角色组列表', //''角色组列表'',
                refpk: 'root',
                pid: null,
                children: roleDatas
            }]
            
            let userRoot = [{
                code: 'root',
                id: 'root',
                key: 'root',
                name: ddp.language["report-000041"]||'用户列表', // ''用户列表'',
                refname: ddp.language["report-000041"]||'用户列表', //''用户列表'',
                refpk: 'root',
                pid: null,
                children: userDatas
            }]

            let hrInfoRoot = [{
                code: 'root',
                id: 'root',
                key: 'root',
                name: ddp.language["report-000034"] || 'HR信息集', // ''HR信息集'',
                refname: ddp.language["report-000034"] || 'HR信息集', //''HR信息集'',
                refpk: 'root',
                children: HRDataDicSort
            }]
            this.update({
                addModalVisible: true,
                roleLeftDatas: roleRoot,
                userLeftDatas: userRoot,
                HRDataDicSort: hrInfoRoot
            })
           
            form.setFormItemsValue('org', {'pk_org': {value: pk_org, display: display}})
            form.setFormStatus('org', "edit");
            setSyncTreeData('roletreef_l', roleRoot)
            setSyncTreeData('usertreef_2', userRoot)
            openNodeByPk('roletreef_l', 'root')
            openNodeByPk('usertreef_2', 'root')
        }
    }

     /**
     * 处理树数据  加refpk
     */
      dealTreeData = (data, flag) => {
        data.length > 0 && data.forEach((item) => {
            item['refpk'] = item['pk_role_group'] || item['pk_role'] || item['pk_usergroup'] || item['cuserid'] || '';
            item['refname'] = item['group_name'] || item['role_name'] || item['groupname'] || item['user_name'] || '';
            item['refcode'] = item['group_code'] || item['role_code'] || item['groupcode'] || item['user_code'] || '';
            item['flag'] = flag
            item['pid'] = 'root'
        })
        return data;
    }

    changeCheck = (v) => {
        this.update({
            detailChecked: v
        })
    }

    stepHandle = async(type) => {
        const {props} = this.comp;
        const {ddp, dispatch, form,  syncTree: { setSyncTreeData, openNodeByPk }} = props;
        if (type === 'next') {
            if (ddp.rightList.length === 0) {
                toast({
                    color: 'warning',
                    content: ddp.language["report-000042"] || '用户或者角色不能为空！'  
                })
                return false;
            }
            await this.update({
                stepsCurrent: 1
            })
            setSyncTreeData('hrinfoTree', ddp.HRDataDicSort)
            openNodeByPk('hrinfoTree', 'root')
        } else {
            this.update({
                stepsCurrent: 0
            })  
        }
       
    }
    finish = async(type) => {
        const {props, action} = this.comp;
        const {dispatch, ddp} = props;

        let rightList = ddp.rightList;
        let rightList1 = ddp.rightList1;
        if (rightList1.length === 0) {
            toast({
                color: 'warning',
                content: ddp.language["report-000043"] || '选择的HR信息集不能为空!'  
            })
            return false;
        }
        let pk_role = rightList.filter((item) => item.flag === 'role').map(item => item.refpk)
        let pk_user = rightList.filter((item) => item.flag === 'user').map(item => item.refpk)
        let refpks = rightList1.map(item => item.refpk)
        let postData = {
            pk_role: pk_role.join(','),
            pk_user: pk_user.join(','),
            refpks: refpks.join(','),
        }
        let res = await dispatch({
            type: 'ddp/saveAction',
            payload: {
                postData: postData
            }
        })
        if (res.success) {
            toast({
                color: 'success', 
                content: ddp.language["report-000035"] || '保存成功！'
            })
            if (type === 'close') {  // 保存 关闭
                this.cancel();
            } else { // 保存并新增
                this.update({
                    stepsCurrent: 0
                }) 
            }
        }
    }

    cancel = () => {
        const {props, action} = this.comp;
        this.update({
            addModalVisible: false,
            roleLeftDatas: [],
            userLeftDatas: [],
            rightList: [],
            transData: [],
            HRDataDicSort: [],
            rightList1: [],
            activeKey: "1",
            stepsCurrent: 0
        })
        this.pubSub.publish('refresh');
    }
}
