import React from 'react';
import './index.less';

const { NCButton, NCSelect } = $nccPlatform.base;
const { NCOption } = NCSelect;

export default class TreeTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            targets: "2", // 全部0 格式1 名称2
            value: this.props.value || {},//穿梭框返回的结果
            transferId: this.props.transferId,//穿梭框id
            leftTreeData: this.props.leftTreeData || [],//左树初始化数据
            rightTreeData: this.props.rightTreeData || [],//右树初始化数据
            leftFixedNode: this.props.leftFixedNode || [],//左侧固定节点
            rightFixedNode: this.props.rightFixedNode || [],//右侧固定节点
        }
        this.state.value.leftTreeData = this.state.leftTreeData;
        this.state.value.rightTreeData = this.state.rightTreeData;
        this.leftTreeId = `${this.state.transferId}_left_tree`;
        this.rightTreeId = `${this.state.transferId}'_right_tree`;
        $appRoot.Content = this;
    }

    async componentDidMount() {
        $appRoot.props.syncTree.setSyncTreeData(this.leftTreeId, this.state.leftTreeData);
        $appRoot.props.syncTree.setSyncTreeData(this.rightTreeId, this.state.rightTreeData);

        this.state.leftFixedNode.forEach(node => $appRoot.props.syncTree.setNodeDisable(this.leftTreeId, true, node));
        this.state.rightFixedNode.forEach(node => $appRoot.props.syncTree.setNodeDisable(this.rightTreeId, true, node));
    }

    /**
     * 左右树节点穿梭，树结构层数不固定，用递归处理
     * @param {*} ids 同一层中所有节点
     * @param {*} checkedIds 选中节点id
     * @param {*} isToRight 是否向右穿梭
     * @param {*} fromTreeId 左侧树id
     * @param {*} toTreeId 右侧树id
     * @param {*} isAll 是否全穿梭
     * @returns 
     */
    transferNode(ids, checkedIds, isToRight, fromTreeId, toTreeId, isAll) {
        if (!ids || ids.length == 0) {
            return [];
        }
        let moveNodes = [];
        ids.forEach(id => {
            let node = $appRoot.props.syncTree.getSyncTreeValue(fromTreeId, id);
            // 非叶子节点
            if (!node.isleaf) {
                let childIds = node.children.map(childNode => childNode.id);
                // 先处理子节点
                let moveChildNodes = this.transferNode(childIds, checkedIds, isToRight, fromTreeId, toTreeId, isAll);
                if (!moveChildNodes || moveChildNodes.length == 0) {
                    return;
                }

                // 对侧树不存在此节点时，拷贝到对侧树
                let otherNode = $appRoot.props.syncTree.getSyncTreeValue(toTreeId, id);
                if (!otherNode) {
                    otherNode = _.cloneDeep(node);
                    otherNode.nodeData = {};
                    otherNode.children = [];
                    // 是否存在父节点，并且对侧树不存在此非节点的父节点时，将子节点存入队列交由父节点处理
                    if (node.pid) {
                        let otherParentNode = $appRoot.props.syncTree.getSyncTreeValue(toTreeId, node.pid);
                        if (!otherParentNode) {
                            moveNodes.push(otherNode);
                            moveNodes.push(...moveChildNodes);
                            return;
                        }
                    }
                    // 拷贝到对侧树
                    $appRoot.props.syncTree.addNodeSuccess(toTreeId, otherNode);
                }

                // 子节点处理，如果是叶子节点只移动，如果是非叶子节点做删除处理。
                moveChildNodes.forEach(moveChildNode =>{
                    $appRoot.props.syncTree.addNodeSuccess(toTreeId, moveChildNode);
                    if (!moveChildNode.isleaf && (!node.children || node.children.length == 0)) {
                        if ((isToRight && this.state.leftFixedNode.indexOf(id) == -1)
                            || (!isToRight && this.state.rightFixedNode.indexOf(id) == -1)) {
                            $appRoot.props.syncTree.delNodeSuceess(fromTreeId, id);
                        }
                    }
                });
                // 本侧树删除已经没有子节点的非叶子节点
                if (!node.children || node.children.length == 0) {
                    if ((isToRight && this.state.leftFixedNode.indexOf(id) == -1)
                        || (!isToRight && this.state.rightFixedNode.indexOf(id) == -1)) {
                        $appRoot.props.syncTree.delNodeSuceess(fromTreeId, id);
                    }
                }
            // 叶子节点 只做删除处理
            } else if (isAll || checkedIds.indexOf(id) != -1) {
                if ((isToRight && this.state.leftFixedNode.indexOf(id) == -1)
                    || (!isToRight && this.state.rightFixedNode.indexOf(id) == -1)) {
                    moveNodes.push(node);
                    $appRoot.props.syncTree.delNodeSuceess(fromTreeId, id);
                }
            }
        });
        return moveNodes;
    }

    ['>'] = () => {
        let checkedIds = $appRoot.props.syncTree.getCheckedKeys(this.leftTreeId);
        if (checkedIds.length == 0) {
            return;
        }
        let rootNodes = $appRoot.props.syncTree.getSyncTreeValue(this.leftTreeId);
        let rootIds = rootNodes.map(rootNode => rootNode.id);
        this.transferNode(rootIds, checkedIds, true, this.leftTreeId, this.rightTreeId, false);
        $appRoot.props.syncTree.setNodeChecked(this.leftTreeId, []);
        $appRoot.props.syncTree.setNodeChecked(this.rightTreeId, []);
    };
    ['<'] = () => {
        let checkedIds = $appRoot.props.syncTree.getCheckedKeys(this.rightTreeId);
        if (checkedIds.length == 0) {
            return;
        }
        let rootNodes = $appRoot.props.syncTree.getSyncTreeValue(this.rightTreeId);
        let rootIds = rootNodes.map(rootNode => rootNode.id);
        this.transferNode(rootIds, checkedIds, false, this.rightTreeId, this.leftTreeId, false);
        $appRoot.props.syncTree.setNodeChecked(this.leftTreeId, []);
        $appRoot.props.syncTree.setNodeChecked(this.rightTreeId, []);
    };
    ['>>'] = () => {
        let rootNodes = $appRoot.props.syncTree.getSyncTreeValue(this.leftTreeId);
        let rootIds = rootNodes.map(rootNode => rootNode.id);
        this.transferNode(rootIds, null, true, this.leftTreeId, this.rightTreeId, true);
        $appRoot.props.syncTree.setNodeChecked(this.leftTreeId, []);
        $appRoot.props.syncTree.setNodeChecked(this.rightTreeId, []);
    };
    ['<<'] = () => {
        let rootNodes = $appRoot.props.syncTree.getSyncTreeValue(this.rightTreeId);
        let rootIds = rootNodes.map(rootNode => rootNode.id);
        this.transferNode(rootIds, null, false, this.rightTreeId, this.leftTreeId, true);
        $appRoot.props.syncTree.setNodeChecked(this.leftTreeId, []);
        $appRoot.props.syncTree.setNodeChecked(this.rightTreeId, []);
    }

    /**
     * 获取所有选中的节点id
     * @param {*} checkedKeys 所有选中的节点id
     * @param {*} cheched 是否勾选
     * @param {*} node 递归节点
     * @param {*} isLeft 是否左侧树
     * @param {*} treeId 操作的树id
     * @returns 
     */
    getAllCheckedKeys(checkedKeys, cheched, node, isLeft, treeId) {
        if (cheched) {
            if (checkedKeys.indexOf(node.props.refpk) < 0) {
                if ((isLeft && this.state.leftFixedNode.indexOf(node.props.refpk) == -1)
                    || (!isLeft && this.state.rightFixedNode.indexOf(node.props.refpk) == -1)) {
                    checkedKeys.push(node.props.refpk);
                }
            }
        } else {
            if (checkedKeys.indexOf(node.props.refpk) >= 0) {
                checkedKeys.splice(checkedKeys.indexOf(node.props.refpk), 1);
            }
        }
        if (node.props.isleaf) {
            return checkedKeys;
        }
        node.props.children.forEach(childNode => {
            this.getAllCheckedKeys(checkedKeys, cheched, childNode, isLeft, treeId);
        });
    }

    onCheckLeftEve = (props, checkedKeys, { checked, checkedNodes, node, event }) => {
        checkedKeys = this.getAllCheckedKeys(checkedKeys, checked, node, true, this.leftTreeId);
        $appRoot.props.syncTree.setNodeChecked(this.leftTreeId, checkedKeys);
    }
    onCheckRightEve = (props, checkedKeys,{ checked, checkedNodes, node, event })  => {
        checkedKeys = this.getAllCheckedKeys(checkedKeys, checked, node, false, this.rightTreeId);
        $appRoot.props.syncTree.setNodeChecked(this.leftTreeId, checkedKeys);
    }
    render() {
        return <div>
            <div className={'step_transfer_approval'} style={{ height: '400px' }}>
                <div className={'step_common step_left'}>
                    {
                        $appRoot.props.syncTree.createSyncTree({
                            treeId: this.leftTreeId, // 组件id
                            needSearch: false,
                            defaultExpandAll : true,
                            checkable: true,
                            onCheckEve: this.onCheckLeftEve
                        })
                    }
                </div>
                <div className={'step_btn_wrapper'}>
                    <div className={'step_btn'}>
                        <NCButton onClick={this[">"]} className='uf uf uf-arrow-right' fieldid="arrowright_btn"><span><i class="iconfont icon-chuansuo-you"></i></span></NCButton>
                        <NCButton onClick={this[">>"]} className='uf uf uf-2arrow-right' fieldid="2arrowright_btn"><span><i class="iconfont icon-chuansuo-quanbuyou"></i></span></NCButton>
                        <NCButton onClick={this["<<"]} className='rotate180 uf uf uf-2arrow-left' fieldid="2arrowleft_btn"><span><i class="iconfont icon-chuansuo-quanbuyou"></i></span></NCButton>
                        <NCButton onClick={this["<"]} className='rotate180 uf uf uf-arrow-left' fieldid="arrowleft_btn"><span><i class="iconfont icon-chuansuo-you"></i></span></NCButton>                      
                    </div>
                </div>
                <div className={'step_common step_right'}>
                    {
                        $appRoot.props.syncTree.createSyncTree({
                            treeId: this.rightTreeId, // 组件id
                            needSearch: false,
                            defaultExpandAll : true,
                            checkable: true,
                            onCheckEve: this.onCheckRightEve
                        })
                    }
                </div>
            </div>
            <div className='exportExcel_item exportExcel_file'>
                <div className='exportExcel_lable'>文件类型</div>
                <NCSelect
                    defaultValue="2"
                    onChange={(val)=>{
                        this.state.targets = val

                    }}
                    fieldid="targets_select"
                >
                    <NCOption fieldid="targets2_option" value="2">{'Excel工作簿' + '(*.xlsx)'}</NCOption>
                    <NCOption fieldid="targets1_option" value="1">{'Excel97-2003工作簿' + '(*.xls)'}</NCOption>
                    <NCOption fieldid="targets0_option" value="0">{'CSV文件'}</NCOption>
                </NCSelect>
            </div>
        </div>
    }
}
