import { base, toast, promptBox, getBusinessInfo } from 'nc-lightapp-front';
import CommonAction from './commonAction';
let formId = 'sort';
export default class TreeAction extends CommonAction {

    constructor(comp) {
        super();
        this.comp = comp;
        this.pk_org = 'GLOBLE00000000000000'; // 全局的
        if(this.comp.props.nodeType === 'group') {
            this.pk_org = getBusinessInfo() && getBusinessInfo().groupId || ''
        }
    }
    /**
     * 表单编辑前
     */
     onFormBeforeEvent = (props, moduleId, key, value, index) => {
         let {meta} = this.comp.props;
         let that = this;
        if(key === 'pk_parent') {
            let template = meta.getMeta()
            template[moduleId].items.forEach((item) => {
            if (item.attrcode === key) {
                    item.queryCondition = {
                        pk_org: props.rsc.orgVal && props.rsc.orgVal.refpk || that.pk_org
                    }
                }
            })
            meta.setMeta(template)
        }
        this.update({
            test: ''
        })
        return true;
    }
    onTreeClick = (props, btnCode) => {
        let {rsc} = this.comp.props;
        // 新增组
        if (btnCode === 'addCf') {
            this.openEditTreeNodeModal('add');
        }
        // 修改组
        else if (btnCode === 'editCf') {
            this.openEditTreeNodeModal('edit');
        }
        // 删除组
        else if (btnCode === 'delCf') {
            this.deleteTreeNode();
        }
        // 刷新组
        else if (btnCode === 'refreshCf') {
            this.pubSub.publish('getTreeData');
            toast({
                color: 'success',
                content: rsc.language["report-000057"] || '刷新成功！'
            })
        }

        // this.props.doDisabledTreeNodeList();
    }
    openEditTreeNodeModal = (type) => {

        const {
            form, rsc: {allCurrentTreeItem, currentTreePk}
        } = this.comp.props;
        
        this.update({
            editTreeVisible: true
        })

        form.setFormStatus(formId, "edit");
        if (type === 'edit') {
            // 名称不可编辑 只能编辑上级
            form.setFormItemsValue(formId, {"name": {value: allCurrentTreeItem.refname, display: allCurrentTreeItem.refname}})
            /*设置表单编辑性*/
            form.setFormItemsDisabled(formId, {name: true})
        } else {
            if(currentTreePk !== 'root') {
                form.setFormItemsDisabled(formId, {name: false})
                form.setFormItemsValue(formId, {"pk_parent": {value: allCurrentTreeItem.key, display: allCurrentTreeItem.refname}})
            }
            
        }
        this.update({
            treeType: type
        })
    }
    submitTreeNodeEdit = async() => {
        const {props, action} = this.comp;
        const {rsc, form, dispatch } = props;
        let formData = form.getAllFormValue('sort');
        let postData = {
            saveDatas: {model: formData},
            pk_org: rsc.orgVal && rsc.orgVal.refpk || this.pk_org
        }
        let res = await dispatch({
            type: 'rsc/sortSaveAction',
            payload: {
                postData
            }
        })
        if (res.success) {
            this.closeModal();
            this.pubSub.publish('getTreeData');
            toast({
                color: 'success',
                content: rsc.language["report-000058"] || '分类保存成功！'
            })
        }
    }
    deleteTreeNode = () => {
        const {
            syncTree, rsc, dispatch
        } = this.comp.props;
        promptBox({
            color: 'warning',
            title: rsc.language["report-000059"] || '确认删除', //'确认删除',
            content: rsc.language["report-000060"] || '您确定要删除所选数据吗', // '您确定要删除所选数据吗',
            beSureBtnClick: async() => {
                let postData = {
                    pk_sort: rsc.currentTreePk,
                    pk_org: rsc.orgVal && rsc.orgVal.refpk || this.pk_org
                };
                let res = await dispatch({
                    type: 'rsc/sortDelAction',
                    payload: {
                        postData
                    }
                })
                if (res.success) {
                    this.closeModal();
                    this.pubSub.publish('getTreeData');
                    toast({
                        color: 'success',
                        content: rsc.language["report-000039"] || '删除成功！'
                    })
                }
                    // syncTree.delNodeSuceess('rscTree', rsc.currentTreePk);
            }
        });
    }
    closeModal = () => {
        this.comp.props.form.EmptyAllFormValue(formId);
        this.update({
            editTreeVisible: false
        })
    }
}
