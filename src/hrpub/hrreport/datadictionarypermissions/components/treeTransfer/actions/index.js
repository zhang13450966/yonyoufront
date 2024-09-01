import { base, toast, promptBox, getBusinessInfo } from 'nc-lightapp-front';
import CommonAction from '../../../actions/commonAction';
const { NCButton, NCFormControl, NCCheckbox } = base;
import deepCopy from 'src/hrpub/common/utils/deep-copy.js'
export default class AddAction extends CommonAction {

    constructor(comp) {
        super();
        this.comp = comp;
    }
    toRight = async () => {
        const { props } = this.comp;
        const { ddp, syncTree } = props;
        if (ddp.transData.length === 0) return;
        let rightList = deepCopy(ddp.rightList);
        rightList.push(ddp.transData)
        // 删除左边的
        let leftTreeData = ddp.activeKey === '1' ? deepCopy(ddp.roleLeftDatas) : deepCopy(ddp.userLeftDatas)
        let restLeftData = leftTreeData && leftTreeData[0].children.filter(item => item.refpk !== ddp.transData.refpk);
        leftTreeData[0].children = restLeftData;
        let treeId = ddp.activeKey === '1' ? 'roletreef_l' : 'usertreef_2'
        syncTree.delNodeSuceess(treeId, ddp.transData.refpk)
        if (ddp.activeKey === '1') {
            await this.update({
                roleLeftDatas: leftTreeData,
                rightList: rightList,
                transData: []
            })
        } else {
            await this.update({
                userLeftDatas: leftTreeData,
                rightList: rightList,
                transData: []
            })
        }
    }
    toLeft = () => {
        const { props } = this.comp;
        const { ddp: { transData, roleLeftDatas, rightList, activeKey, userLeftDatas }, syncTree } = props;
        if (transData.length === 0) return;
        let rightList1 = rightList.filter(item => item.refpk !== transData.refpk)
        let treeId = activeKey === '1' ? 'roletreef_l' : 'usertreef_2'
        syncTree.addNodeSuccess(treeId, transData)
        if (transData['flag'] === 'role') {
            let leftTreeData = deepCopy(roleLeftDatas)
            leftTreeData[0].children.push(transData);
            this.update({
                roleLeftDatas: leftTreeData,
                rightList: rightList1,
                transData: []
            })
        } else {
            let leftTreeData = deepCopy(userLeftDatas)
            leftTreeData[0].children.push(transData);
            this.update({
                userLeftDatas: leftTreeData,
                rightList: rightList1,
                transData: []
            })
        }
    }
    allToRight = async () => {
        const { props } = this.comp;
        const { ddp, syncTree } = props;
        let rightList = deepCopy(ddp.rightList)

        if (ddp.activeKey === '1') {
            let roleDatas = deepCopy(ddp.roleLeftDatas)
            rightList = rightList.concat(roleDatas[0].children);
            await this.update({
                rightList: rightList,
                roleLeftDatas: [{
                    code: 'root',
                    id: 'root',
                    key: 'root',
                    name: ddp.language["report-000040"] || '角色组列表', // 
                    refname: ddp.language["report-000040"] || '角色组列表', //
                    refpk: 'root',
                    children: []
                }],
                transData: []
            })
        } else {
            let userDatas = deepCopy(ddp.userLeftDatas)
            rightList = rightList.concat(userDatas[0].children);
            await this.update({
                rightList: rightList,
                userLeftDatas: [{
                    code: 'root',
                    id: 'root',
                    key: 'root',
                    name: ddp.language["report-000041"] || '用户列表', // 
                    refname: ddp.language["report-000041"] || '用户列表', //
                    refpk: 'root',
                    children: [],
                }],
                transData: []
            })
        }
        this.refreshTree()
    }

    allToLeft = () => {
        const { props } = this.comp;
        const { ddp, syncTree } = props;
        let rightList = deepCopy(ddp.rightList)
        let treeId = ddp.activeKey === '1' ? 'roletreef_l' : 'usertreef_2';
        let roleDatas = deepCopy(ddp.roleLeftDatas);
        let userDatas = deepCopy(ddp.userLeftDatas);
        let role = rightList.filter((item) => item['flag'] === 'role');
        let user = rightList.filter((item) => item['flag'] === 'user');
        let roleDatas1 = roleDatas[0].children.concat(role)
        let userDatas1 = userDatas[0].children.concat(user)
        syncTree.addNodeSuccess(treeId, role)
        syncTree.addNodeSuccess(treeId, user)
        if (ddp.activeKey === '1') {
            this.update({
                rightList: [],
                roleLeftDatas: [{
                    code: 'root',
                    id: 'root',
                    key: 'root',
                    name: ddp.language["report-000040"] || '角色组列表', // 
                    refname: ddp.language["report-000040"] || '角色组列表', //
                    refpk: 'root',
                    children: roleDatas1
                }],
                transData: []
            })
        } else {
            this.update({
                rightList: [],
                userLeftDatas: [{
                    code: 'root',
                    id: 'root',
                    key: 'root',
                    name: ddp.language["report-000041"] || '用户列表', // 
                    refname: ddp.language["report-000041"] || '用户列表', //
                    refpk: 'root',
                    children: userDatas1,
                }],
                transData: []
            })
        }
    }
    onSelectEve = (pk, item) => {
        const { props } = this.comp;
        const { ddp } = props;
        if (pk === 'root') {
            this.update({
                transData: []
            })
            return false;
        }
        this.update({
            transData: item
        })
    }

    handleClick = (item) => {
        this.update({
            transData: item
        })
    }
    changeTab = (key) => {
        this.update({
            activeKey: key
        })
    }

    /**
     * 更新树
     */
    refreshTree = () => {
        const { props } = this.comp;
        const { ddp, syncTree: { setSyncTreeData, openNodeByPk } } = props;
        setSyncTreeData('roletreef_l', ddp.roleLeftDatas)
        setSyncTreeData('usertreef_2', ddp.userLeftDatas)
        openNodeByPk('roletreef_l', 'root')
        openNodeByPk('usertreef_2', 'root')
    }
}
