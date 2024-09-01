import {base} from "nc-lightapp-front";
import React,{useState,useEffect} from "react";
import addNodeNormal from "./addNodeNormal";
import addNodeVRFusion from "./addNodeVRFusion";
import addToTreeIgnoreDir from "./addToTreeIgnoreDir";
import * as tree_utils from "./tree_utils";
// 公共基础组件
const {NCIcon,NCFormControl, NCTooltip: Tooltip,} = base;

const {
    delNode,
    delParents,
    filterChildrens,
    getTreeDataById,
    getNodeByTreeIdAndKey,
    getNodeByKey,
    findAllParentsKey,
    getAllNodeKeys,
    arrayBIsContaindA,
    noneAInB,
    filterMovedNodes,
    addToRightList
} = tree_utils;
// import Utils from '../utils';
const {NCTree} = base;
const NCTreeNode = NCTree.NCTreeNode;

let appUpstreamNode = []; // 应用节点的上游节点
let appNodeKeys = []; // 不能删除的应用节点(需要保留的节点)


/**
 * 获取当前树选中Node
 */
// function getSelectedValue(treeId){
// 	return this.state.TransfertreeData[treeId].selectedValue;
// }

// function getCheckedValue(treeId){
// 	return this.state.TransfertreeData[treeId].checkedValue;
// }

// function getHalfCheckedValue(treeId){
// 	return this.state.TransfertreeData[treeId].halfCheckedValue;
// }


/**
 * 根据treeid和pid查找所有子节点
 */

/* function getChildrenByPid(treeId,pid){
	let tree = getTreeDataById.bind(this)(treeId);
	let childrens = [];
	getChildrenNode(tree,pid,childrens);
	return childrens;
} */

function addToTree(treeType, from_tree, to_tree, checkedKeys, halfCheckedKeys, fromTreeDataList, toTreeDataList, fixed, selectType, isRefer) {
    appNodeKeys = [];
    if (treeType == "VRFusion") {
        // 虚实节点类型
        return addNodeVRFusion(from_tree, to_tree, checkedKeys, halfCheckedKeys, fromTreeDataList, toTreeDataList, fixed, selectType, isRefer);
    } else {
        // normal
        return addNodeNormal(from_tree, to_tree, checkedKeys, halfCheckedKeys, fromTreeDataList, toTreeDataList, fixed, selectType, isRefer);
    }
}


/**
 * 创建树
 */
function createTree({
                        treeId,
                        data,
                        // onSelect,
                        onExpand,
                        onCheck,
                        searchMode,
                        selectType,
                        treeType,
                        cacheTree,
                        clearCheckedKeys,
                        searchValue,
                        checkedKeys,
                        expandedKeys,
                        autoExpandParent,
                        fixed,
                        getCheckedKeys,
                        otherConfig = {},
                        isDraggable,
                        onDrop,
                        onDragEnter,
                        onMouseLeave,
                        onMouseEnter
                    } = {}) {
    let thisTree = this.state.TransfertreeData[treeId];
    filterChildrens(data);
    // console.log('checkedKeys', checkedKeys)
    if (!thisTree) {
        thisTree = this.state.TransfertreeData[treeId] = {};
        thisTree.autoExpandParent = autoExpandParent;  //是否展开父节点
        // thisTree.onExpand = onExpand;
        // thisTree.expandedKeys = expandedKeys;
        // thisTree.onSelect = onSelect;//当用户选择树节点触发的回调函数

        // thisTree.currentTree = null;//保存当前点击的树节点pk
        // thisTree.treeNode = null;   //节点对象
        // thisTree.saveItem = '';  //保存当前操作节点对象，用于重置
        // thisTree.pkArr = [];  //
        // thisTree.itemArr = [];  //
        // thisTree.selectedValue = [];  // 保存当前选中的节点key
        // thisTree.checkedValue = []; // 保存checked的节点
        // thisTree.saveExpendKey = [];  // 保存当前选中的节点key
        // thisTree.halfCheckedValue = [];
        // thisTree.data = data?filterChildrens(data):[];
        // console.log('transfertreeData', thisTree.data, this.state.leftTreeData, this.state.rightTreeData);
    }

    const classMap = {
        "0": "iconfont icon-yonghuzu",
        "1": "iconfont icon-yonghu",
        "org_0": "iconfont icon-yewudanyuan ",
        "org_1": "iconfont icon-bumen ",
        "org_2": "iconfont icon-xuzuzhi",
        "org_3": "iconfont icon-jituan"
    };

    const isDisable = (item) => {
        if (item.fixed && (!item.children || item.children.length == 0)) {
            return true;
        } else {
            return false;
        }
    };

    const setIcon = (iconKey) => {
        let className;
        className = classMap[iconKey];
        return className ? className : "";
    };

    /**
     * 生成树节点
     */
    const loop = data => data.map((item) => {
        let title,      //文本标题
            inputTitle, //编辑态标题
            finalTitle, //最终的图标
            editIcon,   //编辑图标
            deleIcon;   //删除图标
        let extTitle = {
            reportedRecorded: $appRoot.state.json['public_lang-000241'],/* 国际化处理： （必报必录）*/
            reported: $appRoot.state.json['public_lang-000242'],/* 国际化处理： （必报非必录）*/
            notReport: $appRoot.state.json['public_lang-000243'],/* 国际化处理： （非必报）*/
            undefined: "",
            "": ""
        };

        if (searchValue) {  //如果搜索条件存在
            const index = item.name.search(searchValue);
            if (index > -1) {
                const beforeStr = item.name.substr(0, index);
                const afterStr = item.name.substr(index + searchValue.length);
                title = <span className={!item.isDir && item.reportStyle}
                              onClick={e => this.onTitleClick(item.key)}>{beforeStr}<span
                    className="u-tree-searchable-filter">{searchValue}</span>{afterStr + extTitle[item.reportStyle]}</span>;
            } else {
                title = <span className={!item.isDir && item.reportStyle}
                              onClick={e => this.onTitleClick(item.key)}>{item.name + extTitle[item.reportStyle]}</span>;
            }
        } else {
            title = <span className={!item.isDir && item.reportStyle}
                          onClick={e => this.onTitleClick(item.key, e)}>{item.name + extTitle[item.reportStyle]}</span>;
        }

        //编辑时input框
        if (this.state.editKey == item.key) {
            inputTitle = (
                <span className='input-span'>
                   <EditInput
                        value={item.name}
                        onChange={val => {
                            item.newName = val
                            // this.nodechange(item, val);
                        }}
                    />                   
                    {/* /编辑状态 */}
                    <span className="ncuploader-nav-list-operation edit">
                        <Tooltip delay={1000} placement="top" overlay={$appRoot.state.json['public_lang-000021']}>
                            <i
                                className="icon iconfont icon-shenpitongguo"
                                onClick={eve => {
                                    this.setState({
                                        isHover: "",
                                        editKey: "",
                                        isDraggable: true  //将树设置为可以拖动
                                    });                                  
                                    this.nodechange(item, item.newName);
                                }}
                            />
                        </Tooltip>
                        <Tooltip delay={1000} placement="top" overlay={$appRoot.state.json['public_lang-000022']}>
                            <i
                                className="icon iconfont icon-shenpibohui"
                                onClick={eve => {
                                    this.nodechange(item, item.name);
                                    this.setState({
                                        isHover: "",
                                        editKey: "",
                                        isDraggable: true  //将树设置为可以拖动
                                    });                                     
                                }}
                            />
                        </Tooltip>
                    
                    </span>                                
                </span>
            )
            
                              
        } else {
            inputTitle = title;
            //编辑图标
            if (this.state.isHover === item.key && item.isDir && !item.isRoot) {
                editIcon = <i type="uf-code" className="icon iconfont icon-bianji edit-icon" onClick={(e) => this.editRender(item)}></i>;
            }
    
            //删除图标
            if (this.state.isHover === item.key && item.isDir && !item.isRoot) {
                deleIcon = <i type="uf-code" className="icon iconfont icon-shanchu delete-ico" onClick={(e) => this.deleteNode(item)}></i>;
            }
        }


        finalTitle = (
            <div className="title-con" >
                {inputTitle}
                {editIcon}
                {deleIcon}
            </div>
        );

        if (item.children) {
            return (
                <NCTreeNode
                    fieldid={item.key}
                    key={item.key}
                    title={finalTitle}
                    liAttr={{fieldid: item.key + "_node"}}
                >
                    {loop(item.children)}
                </NCTreeNode>
            );
        }

        return (
            <NCTreeNode
                fieldid={item.key}
                key={item.key}
                title={finalTitle}
                liAttr={{fieldid: item.key + "_node"}}
                disabled={fixed == treeId ? isDisable(item) : false}
            />
        );
    });

    const treeNodes = loop(data);

    const editRender = (item) => {
        this.setState({
            editKey: item.key
        });
    };

    const nodechange = (item, value) => {
        item.name = value;
    };

    const onSelectNode = (selectedKeys, e) => {
        console.log($appRoot.state.json['public_lang-000244'], getNodeByKey(data, selectedKeys[0]));/* 国际化处理： 当前节点数据:*/
        thisTree.selectedValue = selectedKeys;
        if (thisTree.onSelect && typeof thisTree.onSelect === "function") {
            thisTree.onSelect(selectedKeys, e);
        }
        let expandedKeys = []
        let eventKey = e.node.props.eventKey;
        if (treeId === this.leftTreeId) {
            let {leftExpandedKeys} = this.state
            if (leftExpandedKeys.includes(eventKey)) {
                _.remove(leftExpandedKeys, v => v==eventKey)
            } else {
                leftExpandedKeys.push(eventKey)
            }
            expandedKeys = [...leftExpandedKeys]
        }
        if (treeId === this.rightTreeId) {
            let {rightExpandedKeys} = this.state
            if (rightExpandedKeys.includes(eventKey)) {
                _.remove(rightExpandedKeys, v => v==eventKey)
            } else {
                rightExpandedKeys.push(eventKey)
            }
            expandedKeys = [...rightExpandedKeys]
        }
        onExpand(treeId, expandedKeys,selectedKeys);
    };

    const onCheckNode = (checkedKeys, e) => {
        console.log("checkedKeys", checkedKeys, e);
        let halfCheckedKeys = e.halfCheckedKeys;

        if (treeType == "businessActivity" && treeId.indexOf("_right_tree") > -1) {
            // 处理 业务活动树 的选择节点规则
            let curKey = e.node.props.eventKey;
            let curNode = getNodeByKey(data, curKey);
            if (curNode.nodeData.type == "1") {
                // 业务活动节点
                let appNodeKeyIndex = appNodeKeys.indexOf(curNode.pid);
                if (e.checked) {  // 选中

                    appNodeKeyIndex == -1 && appNodeKeys.push(curNode.pid);
                } else {  // 取消选中
                    // 业务活动节点是否有被勾选
                    let hasbusiness = getNodeByKey(data, curNode.pid).children.some(node => checkedKeys.includes(node.key));
                    appNodeKeyIndex != -1 && !hasbusiness && appNodeKeys.splice(appNodeKeyIndex, 1);
                }
            } else if (curNode.nodeData.type == "0") {
                //  应用节点, 选中应用节点则从appNodekeys中剔除
                let index = appNodeKeys.indexOf(curKey);
                index > -1 && appNodeKeys.splice(index, 1);
            }
            if (appNodeKeys.length > 0) {
                appUpstreamNode = [];
                // 查找需要保留的应用节点的上游节点
                appNodeKeys.forEach(key => {
                    findAllParentsKey(key, data, appUpstreamNode);
                    appUpstreamNode.push(key);
                });
                // 去重
                appUpstreamNode = Array.from(new Set(appUpstreamNode));
            } else {
                // 没有需要保留的应用节点，则清空上游节点数组。
                appUpstreamNode = [];
            }
            checkedKeys = checkedKeys.filter(key => {
                if (!appUpstreamNode.includes(key)) {
                    // 确保已选中的节点中不包含应用节点的上游节点，从而避免左移时将应用节点的上游节点移除。
                    return true;
                } else {
                    // 上游节点中包含全选节点则将其给半选节点，避免左移后丢失父节点。
                    halfCheckedKeys.unshift(key);
                    return false;
                }
            });

            console.log($appRoot.state.json['public_lang-000245'], appNodeKeys, appUpstreamNode, halfCheckedKeys);/* 国际化处理： 应用节点*/
        }


        if (typeof getCheckedKeys === "function") getCheckedKeys(checkedKeys, e);
        // let halfCheckedKeys = e.halfCheckedKeys;
        let newCheckedKeys = [];
        if (searchMode) {
            checkedKeys.forEach((itemKey, index) => {
                let itemNodeInB = getNodeByKey(cacheTree, itemKey);
                let itemNodeInA = getNodeByKey(data, itemKey);
                // console.log('nodeInA', itemNodeInA, 'nodeInB', itemNodeInB);
                if (itemNodeInB && itemNodeInB.children && itemNodeInB.children.length > 0) {
                    let allNodeKeysInB = getAllNodeKeys([itemNodeInB]);
                    allNodeKeysInB.splice(allNodeKeysInB.indexOf(itemKey), 1);
                    let allNodeKeysInA = getAllNodeKeys([itemNodeInA]);
                    allNodeKeysInA.splice(allNodeKeysInA.indexOf(itemKey), 1);
                    // console.log(itemKey,allNodeKeysInA, allNodeKeysInB);
                    if (allNodeKeysInA.length == allNodeKeysInB.length && arrayBIsContaindA(allNodeKeysInA, allNodeKeysInB)) {
                        // 相等
                        console.log($appRoot.state.json['public_lang-000246'], itemKey);/* 国际化处理： 相等*/
                        newCheckedKeys.push(itemKey);
                    } else if (noneAInB(allNodeKeysInA, allNodeKeysInB)) {
                        console.log($appRoot.state.json['public_lang-000247']);/* 国际化处理： 不包含*/
                        // 不包含
                    } else {
                        console.log($appRoot.state.json['public_lang-000248'], itemKey);/* 国际化处理： 包含部分*/
                        // 包含部分
                        if (selectType !== "default" || !selectType) {
                            newCheckedKeys.push(itemKey);
                            halfCheckedKeys = [];
                        } else {
                            halfCheckedKeys.push(itemKey);
                        }
                    }
                } else {
                    newCheckedKeys.push(itemKey);
                }
            });
            checkedKeys = newCheckedKeys;
        }
        let directExceptParentNode = [];
        if (selectType == "onlyChild" || selectType == "onlyLeaf") {
            let key = e.node.props.eventKey;
            let node = getNodeByKey(data, key);
            if (e.checked) {
                if (node.children && node.children.length > 0) {
                    let childrenKeys = getAllNodeKeys(node.children);
                    checkedKeys = checkedKeys.concat(childrenKeys);
                }
            } else {
                if (node.children && node.children.length > 0) {
                    let childrenKeys = getAllNodeKeys(node.children);
                    checkedKeys = checkedKeys.filter(item => {
                        return !childrenKeys.includes(item);
                    });
                } else {
                    let index = checkedKeys.indexOf(key);
                    index > -1 && checkedKeys.splice(index, 1);
                }
            }
        } else if (selectType == "onlyDirectChild") {
            // 仅直接下级
            let key = e.node.props.eventKey;
            let node = getNodeByKey(data, key);
            if (e.checked) {
                if (node.children && node.children.length > 0) {
                    let directChildrenKeys = node.children.map(child => {
                        return child.key;
                    });
                    checkedKeys = checkedKeys.concat(directChildrenKeys);
                    directExceptParentNode.push(key);
                }
            } else {
                if (node.children && node.children.length > 0) {
                    let directChildrenKeys = node.children.map(child => {
                        return child.key;
                    });
                    checkedKeys = checkedKeys.filter(item => {
                        return !directChildrenKeys.includes(item);
                    });
                    let index = directExceptParentNode.indexOf(key);
                    directExceptParentNode.splice(index, 1);
                }
            }
        }

        onCheck(treeId, checkedKeys, halfCheckedKeys, directExceptParentNode || []);
        clearCheckedKeys(treeId);
    };

    const onExpandNode = (expandedKeys) => {
        onExpand(treeId, expandedKeys);
    };

    const onDropNode = (info) => {
        onDrop && onDrop(info);
    };

    const onDragEnterNode = (info) => {
        onDragEnter && onDragEnter(info);
    };

    const onMouseLeaveNode = (e, treenode) => {
        onMouseLeave && onMouseLeave(e, treenode);
    };

    const onMouseEnterNode = (e) => {
        onMouseEnter && onMouseEnter(e);
    };

    return (
        <NCTree
            draggable={isDraggable}
            showLine
            checkable
            openIcon={<i className='iconfont icon-shu_zk nc-theme-tree-sich-c'/>}
            closeIcon={<i className='iconfont icon-shushouqi nc-theme-tree-sich-c'/>}
            expandedKeys={expandedKeys}
            onDragEnter={onDragEnterNode}
            onDrop={onDropNode}  //放下节点时触发
            onSelect={onSelectNode.bind(this)}  //点击节点内容触发
            onCheck={onCheckNode.bind(this)}  //点击复选框触发
            onExpand={onExpandNode.bind(this)}  //展开/收起节点触发
            onMouseLeave={onMouseLeaveNode}  //离开节点事件
            onMouseEnter={onMouseEnterNode}  //进入节点事件
            checkedKeys={checkedKeys}
            checkStrictly={selectType == "onlySelf" || selectType == "onlyChild" || selectType == "onlyLeaf" || selectType == "onlyDirectChild"}
            autoExpandParent={thisTree.autoExpandParent}    //是否自动展开父节点
            {...otherConfig}
        >
            {treeNodes}
        </NCTree>
    );

}

const Trtree = {
    createTree: createTree,	//创建树
    // getSelectedValue : getSelectedValue,	//获取树选中Node
    // getCheckedValue: getCheckedValue,
    // getHalfCheckedValue: getHalfCheckedValue,
    // setStateEve : setStateEve,	//更新树
    delNode: delNode,	//删除树节点
    getNodeByTreeIdAndKey: getNodeByTreeIdAndKey,	//
    getTreeDataById: getTreeDataById,	//根据treeId获取树的节点数据数组
    getAllNodeKeys: getAllNodeKeys,
    delParents: delParents,
    addToTree: addToTree,
    getNodeByKey: getNodeByKey,
    findAllParentsKey: findAllParentsKey,
    filterMovedNodes,
    addToRightList,
    addToTreeIgnoreDir
};
export default Trtree;

function EditInput ({value='',onChange=()=>{}}) {
    const [inpuVal, inpuValSet] = useState('');
    useEffect(() => {
        inpuValSet(value)
    }, [value]);

    return <NCFormControl
        autoFocus
        value={inpuVal}
        onClick={eve => {
            eve.stopPropagation();
        }}
        onChange={val => {
            inpuValSet(val)
            onChange(val)
        }}
/>  
}