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
        let rightList1 = deepCopy(ddp.rightList1);
        rightList1.push(ddp.transData)
        // 删除左边的
        let HRDataDicSort = deepCopy(ddp.HRDataDicSort);

        syncTree.delNodeSuceess('hrinfoTree', ddp.transData.refpk);
        this.update({
            rightList1: rightList1,
            transData: []
        })

    }
    toLeft = () => {
        const { props } = this.comp;
        const { ddp: { transData, rightList1 }, syncTree } = props;
        if (transData.length === 0) return;
        let rightList = rightList1.filter(item => item.refpk !== transData.refpk)
        syncTree.addNodeSuccess('hrinfoTree', transData)

        this.update({
            rightList1: rightList,
            transData: []
        })
    }
    allToRight = async () => {
        const { props } = this.comp;
        const { ddp, syncTree } = props;
        let HRDataDicSort = deepCopy(ddp.HRDataDicSort);
        // 树结构平铺 只要子集
        let HRData = HRDataDicSort[0].children;
        let transData = this.getAllChildren(HRData);
        let rightList1 = deepCopy(ddp.rightList1)
        // concat不改变原数组
        rightList1 = rightList1.concat(transData)
        transData.forEach(item => {
            syncTree.delNodeSuceess('hrinfoTree', item.refpk);
        })

        this.update({
            rightList1: rightList1,
            transData: []
        })
    }

    allToLeft = () => {
        const { props } = this.comp;
        const { ddp, syncTree } = props;
        let rightList1 = deepCopy(ddp.rightList1)

        syncTree.addNodeSuccess('hrinfoTree', rightList1)
        this.update({
            rightList1: [],
            transData: []
        })
    }
    /**
     * 获取全部子集
     * @returns 
     */
    getAllChildren = (treeData) => {
        // 平铺, 只要children
        let tree = []
        treeData.forEach((item) => {
            if (item.children && item.children.length > 0) {
                tree = tree.concat(item.children)
            }
        })
        return tree;
    }
    /**
 * 将树子节点数组为空的节点，删除children属性
 */
    filterChildrens = (tree) => {
        tree.forEach((item, index) => {
            if (item.children && item.children.length === 0) {
                delete item.children;
            } else if (item.children && item.children.length > 0) {
                filterChildrens(item.children);
            }
        });
        return tree;
    };
    onSelectEve = (pk, item) => {
        const { props } = this.comp;
        const { ddp } = props;
        if (item.pid === 'root') {
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

}
