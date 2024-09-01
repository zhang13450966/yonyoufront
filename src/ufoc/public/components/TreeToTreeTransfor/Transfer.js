import {base, deepClone, getMultiLang, toast} from "nc-lightapp-front";
import React, {Component} from "react";
import Treetransfer from "./transfer/treeTransfer";
import Trtree from "./transfer/Trtree";
import "./index.less";

window.$appRoot = window.$appRoot ? window.$appRoot : {state: {json: {}}};
window._ = top._;  //引入lodash

const {NCTree} = base;
const NCTreeNode = NCTree.NCTreeNode;

/**
 * 根据树节点获取该节点下的所有末级
 */
const getlastNodes = (node, lastNodes) => {
    if (node.children && node.children.length > 0) {
        node.children.forEach((item) => {
            if (item.children && item.children.length > 0) {
                getlastNodes(item, lastNodes);
            } else {
                lastNodes.push(item);
            }
        });
    } else {
        lastNodes.push(node);
    }
};

let resetLeftExpanded = [], resetRightExpanded = [];


/**
 * 创建穿梭框
 */
export default class Transfer extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            selectType: this.props.selectType || "default",
            treeType: this.props.treeType,
            disableBtns: this.props.disableBtns,
            hiddenAllMoveBtns: this.props.hiddenAllMoveBtns,
            value: this.props.value || {},//穿梭框返回的结果
            TransferId: this.props.TransferId,//穿梭框id
            leftTreeData: this.props.leftTreeData || [],//左树初始化数据
            rightTreeData: this.props.rightTreeData || [],//右树初始化数据
            leftExpandedKeys: [],  //左侧展开的节点？
            rightExpandedKeys: [],
            leftCheckedKeys: [],  //左侧选中的节点
            leftHalfCheckedKeys: [],  //左侧半选的节点
            rightHalfCheckedKeys: [],
            rightCheckedKeys: [],
            leftSearchValue: "",
            // leftSearchTree: this.props.leftTreeData || [],
            leftSearchTree: [],
            rightSearchValue: "",
            isLeftSearch: false,
            isRightSearch: false,
            // rightSearchTree: this.props.rightTreeData || [],
            rightSearchTree: [],
            beforeMove: this.props.beforeMove,//异动前事件
            afterMove: this.props.afterMove,//移动后事件
            leftTreeConfig: this.props.leftTreeConfig,//左树配置，为对象{}
            rightTreeConfig: this.props.rightTreeConfig,//右树配置，为对象{}
            TransfertreeData: {},
            isHover: "",  //判断鼠标是否悬停在节点上
            editKey: "",  //判断是否处于修改态
            currentNodeKey: "",
            isDraggable: true  //用于控制右侧树是否可以拖动（左侧树永不拖动）
        };
        this.state.value.leftTreeData = this.state.leftTreeData;
        this.state.value.rightTreeData = this.state.rightTreeData;
        this.TransferTreeMethods = {
            createTree: Trtree.createTree.bind(this),
            // getSelectedValue : Trtree.getSelectedValue.bind(this),
            // getCheckedValue: Trtree.getCheckedValue.bind(this),
            // getHalfCheckedValue: Trtree.getHalfCheckedValue.bind(this),
            // setStateEve : Trtree.setStateEve.bind(this),
            delNode: Trtree.delNode.bind(this),
            getNodeByTreeIdAndKey: Trtree.getNodeByTreeIdAndKey.bind(this),
            getTreeDataById: Trtree.getTreeDataById.bind(this),
            getAllNodeKeys: Trtree.getAllNodeKeys.bind(this),
            delParents: Trtree.delParents.bind(this),
            addToTree: Trtree.addToTree.bind(this),
            getNodeByKey: Trtree.getNodeByKey.bind(this),
            findAllParentsKey: Trtree.findAllParentsKey.bind(this),
            filterMovedNodes: Trtree.filterMovedNodes.bind(this),
            addToRightList: Trtree.addToRightList.bind(this),
            addToTreeIgnoreDir: Trtree.addToTreeIgnoreDir.bind(this)
        };
        this.leftTreeId = `${this.state.TransferId}_left_tree`;
        this.rightTreeId = `${this.state.TransferId}'_right_tree`;
        this.leftDataList = [];
        this.rightDataList = [];
        this.directExceptParentNodeKeys = [];
        this.generateList(this.props.leftTreeData, this.leftDataList);
        this.generateList(this.props.rightTreeData, this.rightDataList);
        this.currentNodeKey = "";  //只允许是右侧的key
        this.btnFlag = false;  //控制必报必录等3个按钮的可用性
        this.moveFlag = false;  //控制上下移动按钮的可用性
        this.addNum = 0;  //新增分类的后缀
    }

    componentWillMount() {
        if (_.isEmpty($appRoot.state.json)) {
            // 初始化调用getPlatformLang方法获取多语
            let callback = (json, bool, LangData) => {
                $appRoot.state.json = json;
            };
            getMultiLang({domainName: "ufoe", moduleId: "public_lang", callback}); // moduleId为所需加载json文件夹名称前缀
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState(prevState => ({
            // expand: [],
            // status,
            // onlySelf: nextProps.onlySelf,
            // onlyChild: nextProps.onlyChild,
            // onlyLeaf: nextProps.onlyLeaf,

            // 节点选种方式
            selectType: nextProps.selectType || "default",

            treeType: this.props.treeType,
            hiddenAllMoveBtns: this.props.hiddenAllMoveBtns,
            disableBtns: nextProps.disableBtns,
            value: nextProps.value ? nextProps.value : {},//穿梭框返回的结果
            TransferId: nextProps.TransferId,//穿梭框id
            leftTreeData: nextProps.leftTreeData || [],//左树初始化数据
            rightTreeData: nextProps.rightTreeData || [],//右树初始化数据
            leftExpandedKeys: resetLeftExpanded,
            rightExpandedKeys: resetRightExpanded,
            leftCheckedKeys: prevState.leftCheckedKeys,
            leftHalfCheckedKeys: prevState.leftHalfCheckedKeys,
            rightHalfCheckedKeys: prevState.rightHalfCheckedKeys,
            rightCheckedKeys: prevState.rightCheckedKeys,
            // leftSearchTree: this.props.leftTreeData || [],
            leftSearchTree: [],
            leftSearchValue: "",
            rightSearchValue: "",
            isRightSearch: false,
            isLeftSearch: false,
            // rightSearchTree: this.props.rightTreeData || [],
            rightSearchTree: [],
            beforeMove: nextProps.beforeMove,//异动前事件
            afterMove: nextProps.afterMove,//移动后事件
            leftTreeConfig: nextProps.leftTreeConfig,//左树配置，为对象{}
            rightTreeConfig: nextProps.rightTreeConfig,//右树配置，为对象{}
            TransfertreeData: {}
        }));
        this.state.value.leftTreeData = this.state.leftTreeData;
        this.state.value.rightTreeData = this.state.rightTreeData;
        this.leftTreeId = `${this.state.TransferId}_left_tree`;
        this.rightTreeId = `${this.state.TransferId}'_right_tree`;
        this.leftDataList = [];
        this.rightDataList = [];
        // this.isLeftSearch = false;
        // this.isRightSearch = false;
        this.generateList(nextProps.leftTreeData, this.leftDataList);
        this.generateList(nextProps.rightTreeData, this.rightDataList);
    }

    /**
     * 自定义按钮
     */
    personal = () => {
        this.setState({
            leftTreeData: [],
            rightTreeData: []
        });
    };

    /**
     * 添加到左树
     */
    toLeft = () => {
        let checkedKeys = this.state.rightCheckedKeys.reverse();
        let halfCheckedKeys = this.state.rightHalfCheckedKeys.reverse();
        let moveNodes = [];
        if (checkedKeys.length == 0) {
            return;
        } else {
            //删除右树节点
            // //debugger;
            let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
            let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
            if (this.props.beforeMove && typeof this.props.beforeMove === "function") {
                let nodes = checkedKeys.map(key => {
                    return this.TransferTreeMethods.getNodeByKey(rightTree, key);
                });
                let result = this.props.beforeMove(nodes, this.state.value, "br2l");//从右树到左树移动前事件
                if (!result) return;
            }
            let nodes = this.TransferTreeMethods.addToTree(this.state.treeType, rightTree, leftTree, checkedKeys, halfCheckedKeys, this.rightDataList, this.leftDataList, this.props.rightFixed, this.state.selectType, this.props.referLeftTree);
            // nodes = this.TransferTreeMethods.delParents(nodes, rightTree);
            this.generateList(nodes, [], {}, undefined, moveNodes);
            this.delTreeNode(nodes, this.rightTreeId);
            // this.TransferTreeMethods.setStateEve();

            let leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
            let rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);

            this.state.value.leftTreeData = leftTreeData;
            this.state.value.rightTreeData = rightTreeData;
            this.setState({
                rightCheckedKeys: [],
                rightHalfCheckedKeys: [],
                leftCheckedKeys: [],
                leftHalfCheckedKeys: [],
                leftTreeData: leftTreeData,
                rightTreeData: rightTreeData,
                isLeftSearch: false,
                isRightSearch: false
            });
            this.leftDataList = [];
            this.rightDataList = [];
            // this.isLeftSearch = false;
            // this.isRightSearch = false;
            this.generateList(leftTreeData, this.leftDataList);
            this.generateList(rightTreeData, this.rightDataList);
            // console.log('toLeft-movenodes', moveNodes);
            if (this.state.afterMove && typeof this.state.afterMove === "function") {//添加移动后事件
                this.state.afterMove(moveNodes, this.state.value, "ar2l");//从右树到左树移动后事件
            }
        }
    };

    /**
     * 添加到右树
     */
    toRight = () => {
        let checkedKeys = this.state.leftCheckedKeys.reverse();  //获取选中的节点
        if (this.props.treeType === "businessActivity") {
            checkedKeys = this.props.getNewCheckedKeys();
        }
        if (this.state.selectType === "onlyDirectChild") {
            checkedKeys = checkedKeys.filter(item => {
                return !this.directExceptParentNodeKeys.includes(item);
            });
        }
        let halfCheckedKeys = this.state.leftHalfCheckedKeys.reverse();  //获取半选节点
        let moveNodes = [];  //被移动的节点数组，用于移动后事件
        if (checkedKeys.length === 0) {
            return;
        } else {
            let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);  //从state中获取左侧数据
            let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);  //从state中获取右侧数据
            //移动前事件
            if (this.props.beforeMove && typeof this.props.beforeMove === "function") {
                let nodes = checkedKeys.map(key => {
                    return this.TransferTreeMethods.getNodeByKey(leftTree, key);
                });
                let result = this.props.beforeMove(nodes, this.state.value, "bl2r");//从左树到右树移动前事件
                if (!result) return;
            }
            //在右侧添加相应节点，返回移除节点
            let nodes = this.TransferTreeMethods.addToTree(this.state.treeType, leftTree, rightTree, checkedKeys, halfCheckedKeys, this.leftDataList, this.rightDataList, false, this.state.selectType);
            if (!this.props.referLeftTree) {// 左树不是参照树
                this.delTreeNode(nodes, this.leftTreeId);  //在左侧删除相应节点
            }
            this.generateList(nodes, [], {}, undefined, moveNodes);  //给moveNodes赋值
            this.setState({
                leftCheckedKeys: [],
                leftHalfCheckedKeys: [],
                rightCheckedKeys: [],
                rightHalfCheckedKeys: [],
                isLeftSearch: false,
                isRightSearch: false
            });
            this.leftDataList = [];  //push()之前需要置空，不然会重复
            this.rightDataList = [];  //push()之前需要置空，不然会重复
            let leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);  //从state中获取左侧数据
            let rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);  //从state中获取右侧数据
            this.state.value.leftTreeData = leftTreeData;  //更新state.value
            this.state.value.rightTreeData = rightTreeData;  //更新state.value
            this.generateList(leftTreeData, this.leftDataList);  //将数据以列表形式push()到this.leftDataList
            this.generateList(rightTreeData, this.rightDataList);  //将数据以列表形式push()到this.rightDataList
            //移动后事件
            if (this.state.afterMove && typeof this.state.afterMove === "function") {//添加移动后事件
                this.state.afterMove(moveNodes, this.state.value, "al2r");//从左树到右树移动后事件
            }
        }
    };

    allToLeft = () => {
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
        let leftTreeData;
        let rightTreeData;
        let nodes;
        let moveNodes = [];
        // 不通过合并算法  右树有固定节点且右树是左树的子集, 直接过滤掉非固定节点。
        if (this.props.allToLeft_without_merge) {
            if (this.props.leftFixed) {

            }
            if (this.props.rightFixed) {
                // 过滤非固定节点
                this.TransferTreeMethods.filterMovedNodes(rightTree);
                rightTreeData = rightTree;
                leftTreeData = leftTree;
            }
        } else {
            let checkedKeys = this.TransferTreeMethods.getAllNodeKeys(rightTree);
            checkedKeys = this.state.treeType == "VRFusion" ? checkedKeys.reverse() : checkedKeys;
            let halfCheckedKeys = [];
            let moveNodes = [];
            // console.log('nodeKeys', selectNodeKeys);
            if (!checkedKeys || checkedKeys.length === 0) {
                return;
            } else {
                if (this.props.beforeMove && typeof this.props.beforeMove === "function") {
                    let nodes = checkedKeys.map(key => {
                        return this.TransferTreeMethods.getNodeByKey(rightTree, key);
                    });
                    let result = this.props.beforeMove(nodes, this.state.value, "br2l");//从右树到左树移动前事件
                    if (!result) return;
                }
                // 删除右树节点
                if (this.props.rightFixed) {
                    let unfixedNodes = [];
                    this.generateList(rightTree, [], {}, undefined, undefined, undefined, unfixedNodes);
                    moveNodes = unfixedNodes;
                    unfixedNodes.forEach(item => {
                        let rightParent = this.TransferTreeMethods.getNodeByKey(rightTree, item.pid);
                        let children = rightParent.children;
                        let removeNode = deepClone(this.TransferTreeMethods.getNodeByKey(rightParent.children, item.id));
                        let newChildren = children.filter(child => {
                            return child.key !== item.id;
                        });
                        rightParent.children = newChildren;
                        // console.log('rightTree', rightTree)
                        let leftParent = this.TransferTreeMethods.getNodeByKey(leftTree, item.pid);
                        if (!leftParent) {
                            leftTree.push(item);
                            return;
                        }
                        if (!leftParent.children) {
                            leftParent.children = [];
                        }
                        let hasSiblingNode = this.TransferTreeMethods.getNodeByKey([leftParent], item.id);
                        !hasSiblingNode && leftParent.children.push(removeNode);
                    });

                } else {
                    nodes = this.TransferTreeMethods.addToTree(this.state.treeType, rightTree, leftTree, checkedKeys, halfCheckedKeys, this.rightDataList, this.leftDataList, false, this.state.selectType);
                    // nodes = this.TransferTreeMethods.delParents(nodes, rightTree);
                    this.generateList(nodes, [], {}, undefined, moveNodes);
                    this.delTreeNode(nodes, this.rightTreeId);
                }
                // this.TransferTreeMethods.setStateEve();
                leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
                rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);

            }
        }

        this.state.value.leftTreeData = leftTreeData;
        this.state.value.rightTreeData = rightTreeData;
        this.setState({
            leftCheckedKeys: [],
            rightCheckedKeys: [],
            rightHalfCheckedKeys: [],
            leftTreeData: leftTreeData,
            rightTreeData: rightTreeData
        });
        this.leftDataList = [];
        this.rightDataList = [];
        this.generateList(leftTreeData, this.leftDataList);
        this.generateList(rightTreeData, this.rightDataList);
        if (this.state.afterMove && typeof this.state.afterMove === "function") {
            this.state.afterMove(moveNodes, this.state.value, "ar2l");
        }
    };

    allToRight = () => {
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
        let leftTreeData;
        let rightTreeData;
        let nodes;
        let moveNodes = [];
        // 左树是参照树.
        if (this.props.referLeftTree) {
            let fromTreelist = [];
            let toTreeFixedList = [];
            let toTreelist = [];
            this.generateList(leftTree, [], {}, undefined, fromTreelist);
            this.generateList(rightTree, [], {}, undefined, toTreelist, toTreeFixedList);
            moveNodes = this.getMovedNodes(fromTreelist, toTreelist);
            console.log("moveNodes", moveNodes, "fromTreelist", fromTreelist, "toTreelist", toTreelist);
            if (this.props.rightFixed) {
                let cloneLeftTree = deepClone(leftTree);
                // 右侧有固定数据，求出合并后的树.
                this.mergeToFixedTree(toTreeFixedList, cloneLeftTree);
                rightTree.length = 0;
                rightTree.push.apply(rightTree, cloneLeftTree);
                rightTreeData = rightTree;
                leftTreeData = leftTree;
            } else {
                rightTreeData = deepClone(leftTree);
                leftTreeData = leftTree;
            }
        } else {
            let checkedKeys = this.TransferTreeMethods.getAllNodeKeys(leftTree);
            checkedKeys = this.state.treeType == "VRFusion" ? checkedKeys.reverse() : checkedKeys;
            // console.log('allcheckedkeys', checkedKeys);
            let halfCheckedKeys = [];
            if (!checkedKeys || checkedKeys.length === 0) {
                return;
            } else {
                if (this.props.beforeMove && typeof this.props.beforeMove === "function") {
                    let nodes = checkedKeys.map(key => {
                        return this.TransferTreeMethods.getNodeByKey(leftTree, key);
                    });
                    let result = this.props.beforeMove(nodes, this.state.value, "bl2r");//从右树到左树移动前事件
                    if (!result) return;
                }
                //删除左树节点
                nodes = this.TransferTreeMethods.addToTree(this.state.treeType, leftTree, rightTree, checkedKeys, halfCheckedKeys, this.leftDataList, this.rightDataList, false, this.state.selectType);
                // console.log('allToRight-delete-nodes', nodes);
                // nodes = this.TransferTreeMethods.delParents(nodes, leftTree);
                this.generateList(nodes, [], {}, undefined, moveNodes);
                this.delTreeNode(nodes, this.leftTreeId);
                // this.TransferTreeMethods.setStateEve();
                leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
                rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);

            }
        }

        this.state.value.leftTreeData = leftTreeData;
        this.state.value.rightTreeData = rightTreeData;
        this.setState({
            rightCheckedKeys: [],
            leftCheckedKeys: [],
            leftHalfCheckedKeys: [],
            leftTreeData: leftTreeData,
            rightTreeData: rightTreeData
        });
        this.leftDataList = [];
        this.rightDataList = [];
        this.generateList(leftTreeData, this.leftDataList);
        this.generateList(rightTreeData, this.rightDataList);
        console.log("allToRight-moveNodes", moveNodes);
        if (this.state.afterMove && typeof this.state.afterMove === "function") {
            this.state.afterMove(moveNodes, this.state.value, "al2r");
        }
    };

    delTreeNode = (nodes, treeid) => {
        nodes.forEach((item, index) => {
            this.TransferTreeMethods.delNode(treeid, item.key, false);
            if (item.children && item.children.length > 0) {
                this.delTreeNode(item.children, treeid);
            }
        });
    };

    /**
     * 删除非dir的元素节点
     * @param nodes
     * @param treeid
     */
    delTreeNodeIgnoreDir = (nodes, treeid) => {
        nodes.forEach((item, index) => {
            !item.isDir && this.TransferTreeMethods.delNode(treeid, item.key, false);
            if (item.children && item.children.length) {
                this.delTreeNodeIgnoreDir(item.children, treeid);
            }
        });
    };

    /**
     * 删除dir的元素节点
     * @param nodes
     * @param treeid
     */
    delTreeNodeDir = (item, treeid) => {
        item.isDir && !item.isRoot && this.TransferTreeMethods.delNode(treeid, item.key);
        if (item.children && item.children.length) {
            return item.children;
        }
    };

    onExpand = (treeId, expandedKeys) => {
        if (treeId == this.leftTreeId) {
            if (this.state.leftSearchValue == "") {
                resetLeftExpanded = expandedKeys;
            }
            this.setState({
                leftExpandedKeys: expandedKeys
            });
        }
        if (treeId == this.rightTreeId) {
            if (this.state.rightSearchValue == "") {
                resetRightExpanded = expandedKeys;
            }
            this.setState({
                rightExpandedKeys: expandedKeys
            });
        }
    };
    onCheck = (treeId, checkedKeys, halfCheckedKeys, directExceptParentNodeKeys) => {
        // console.log('onCheck-checkedKeys', checkedKeys)
        if (this.state.selectType == "onlyDirectChild" && directExceptParentNodeKeys.length > 0) {
            this.directExceptParentNodeKeys = directExceptParentNodeKeys;
        }
        if (treeId == this.leftTreeId) {
            this.setState({
                leftCheckedKeys: checkedKeys,
                leftHalfCheckedKeys: halfCheckedKeys || []
            });
        }
        if (treeId == this.rightTreeId) {
            this.setState({
                rightCheckedKeys: checkedKeys,
                rightHalfCheckedKeys: halfCheckedKeys || []
            });
        }
    };
    clearCheckedKeys = (treeId) => {
        if (treeId === this.leftTreeId) {
            this.setState({
                rightCheckedKeys: []
            });
        } else {
            this.setState({
                leftCheckedKeys: []
            });
        }
    };
    updateState = () => {
        this.setState({
            TransfertreeData: this.state.TransfertreeData
        });
    };

    filterSearchNodeFunc = (searchValue, expandedKeys, treeData, upNode) => {
        for (let i = 0; i < treeData.length; i++) {
            let node = treeData[i];
            if (expandedKeys.includes(node.key)) {
                let newNode = deepClone(node);
                if (node.children.length > 0) newNode.children = [];
                upNode.push(newNode);
                this.filterSearchNodeFunc(searchValue, expandedKeys, node.children, newNode.children);
            } else if (node.name.search(searchValue) != -1) {
                let newNode = deepClone(node);
                upNode.push(newNode);
            }
        }

    };

    leftSearch = (searchValue) => {
        if (searchValue == "") {
            this.setState({
                leftSearchValue: searchValue,
                leftExpandedKeys: resetLeftExpanded,
                isLeftSearch: false,
                leftCheckedKeys: []
            });
            return;
        }
        let expandedKeys = this.computeKeys(searchValue, this.leftDataList, this.props.leftTreeData);
        let leafNodes = this.filterSearchLeafNode(searchValue, this.props.leftTreeData, expandedKeys);
        console.log("expandedKeys", expandedKeys, "leafNodes", leafNodes);

        // 正常搜索新算法
        if (this.state.treeType != "VRFusion") {
            let newData = [];
            this.filterSearchNodeFunc(searchValue, expandedKeys, this.props.leftTreeData, newData);
            console.log("treeData-test", newData);
            this.isLeftSearch = true;
            // console.log('hasPar', hasPar, 'filterExpandNodes', filterExpandNodes);
            this.setState({
                isLeftSearch: true,
                leftSearchValue: searchValue,
                leftExpandedKeys: expandedKeys,
                leftSearchTree: newData,
                leftCheckedKeys: []
            });
            return;
        }

        let leafMap = {}, topLeaf = [];
        leafNodes.forEach(item => {
            let hasPar = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.leftTreeData, item.pid));
            if (this.state.treeType == "VRFusion") {
                let typeId = item.nodeData.typeId;
                if (!hasPar) {
                    if (expandedKeys.includes(typeId)) {
                        if (!leafMap[typeId]) {
                            leafMap[typeId] = [item];
                        } else {
                            leafMap[typeId].push(item);
                        }
                    } else {
                        topLeaf.push(item);
                    }
                } else {
                    if (expandedKeys.includes(item.pid)) {
                        if (!leafMap[item.pid]) {
                            leafMap[item.pid] = [item];
                        } else {
                            leafMap[item.pid].push(item);
                        }
                    } else {
                        topLeaf.push(item);
                    }
                }
            }
            if (this.state.treeType != "VRFusion") {
                // 可废弃
                if (hasPar) {
                    if (expandedKeys.includes(item.pid)) {
                        if (!leafMap[item.pid]) {
                            leafMap[item.pid] = [item];
                        } else {
                            leafMap[item.pid].push(item);
                        }
                    } else {
                        topLeaf.push(item);
                    }
                } else {
                    topLeaf.push(item);
                }
            }
        });

        let expandNodes = expandedKeys.map((key, index) => {
            let node = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.leftTreeData, key));
            node.children = [];
            if (leafMap[key] && leafMap[key].length > 0) {
                node.children = node.children.concat(leafMap[key]);
            }
            return node;
        });
        let hasPar = [];
        // console.log('expandNodes', expandNodes);
        for (let i = expandNodes.length - 1; i >= 0; i--) {
            let node = expandNodes[i];
            let pid = expandNodes[i].pid;
            if (!pid) {
                continue;
            } else {
                for (let j = expandNodes.length - 1; j >= 0; j--) {
                    if (pid == expandNodes[j].id && node.id != expandNodes[j].id) {
                        expandNodes[j].children.unshift(node);
                        hasPar.push(node);
                    }
                }
            }
        }
        let searchNodes = expandNodes.filter(item => {
            return !hasPar.includes(item);
        });
        console.log("searchNodes, topLeaf", searchNodes, topLeaf);
        searchNodes = [...searchNodes, ...topLeaf];
        let virtualParMap = {};
        let filterSearchNodes;
        if (this.state.treeType == "VRFusion") {
            filterSearchNodes = searchNodes.filter(searchNode => {
                let typeId = searchNode.nodeData.typeId;
                let virtualNode = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.leftTreeData, typeId));
                if (virtualNode && typeId != searchNode.id) {
                    if (!virtualParMap[virtualNode.id]) {
                        virtualNode.children = [];
                        virtualNode.children.push(searchNode);
                        virtualParMap[virtualNode.id] = virtualNode;
                    } else {
                        virtualParMap[virtualNode.id].children.push(searchNode);
                    }
                    return false;
                } else {
                    return true;
                }
            });
            let virtualExpandKeys = Object.keys(virtualParMap);
            expandedKeys = [...virtualExpandKeys, ...expandedKeys];
            // console.log('1111', expandedKeys);
            // console.log('virtualParMap', virtualParMap);
            let fitVirtualNodes = []; // 添加虚父节点
            for (let virtualId in virtualParMap) {
                fitVirtualNodes.push(virtualParMap[virtualId]);
            }
            searchNodes = [...fitVirtualNodes, ...filterSearchNodes];
            // console.log('111searchNodes', searchNodes)
        }

        this.isLeftSearch = true;
        // console.log('hasPar', hasPar, 'filterExpandNodes', filterExpandNodes);
        this.setState({
            isLeftSearch: true,
            leftSearchValue: searchValue,
            leftExpandedKeys: expandedKeys,
            leftSearchTree: searchNodes,
            leftCheckedKeys: []
        });
    };

    rightSearch = (searchValue) => {
        if (searchValue == "") {
            // this.isRightSearch = false;
            this.setState({
                rightSearchValue: searchValue,
                rightExpandedKeys: resetRightExpanded,
                isRightSearch: false,
                rightCheckedKeys: []
            });
            return;
        }
        ;
        let expandedKeys = this.computeKeys(searchValue, this.rightDataList, this.props.rightTreeData);
        let leafNodes = this.filterSearchLeafNode(searchValue, this.props.rightTreeData, expandedKeys);
        // console.log('expandedKeys', expandedKeys);

        // 正常搜索新算法
        if (this.state.treeType != "VRFusion") {
            let newData = [];
            this.filterSearchNodeFunc(searchValue, expandedKeys, this.props.rightTreeData, newData);
            // console.log('treeData-test', newData);
            this.isRightSearch = true;
            // console.log('hasPar', hasPar, 'filterExpandNodes', filterExpandNodes);
            this.setState({
                isRightSearch: true,
                rightSearchValue: searchValue,
                rightSearchTree: newData,
                rightExpandedKeys: expandedKeys,
                rightCheckedKeys: []
            });
            return;
        }

        let leafMap = {}, topLeaf = [];

        leafNodes.forEach(item => {
            let hasPar = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.rightTreeData, item.pid));
            if (this.state.treeType == "VRFusion") {
                let typeId = item.nodeData.typeId;
                if (!hasPar) {
                    if (expandedKeys.includes(typeId)) {
                        if (!leafMap[typeId]) {
                            leafMap[typeId] = [item];
                        } else {
                            leafMap[typeId].push(item);
                        }
                    } else {
                        topLeaf.push(item);
                    }
                } else {
                    if (expandedKeys.includes(item.pid)) {
                        if (!leafMap[item.pid]) {
                            leafMap[item.pid] = [item];
                        } else {
                            leafMap[item.pid].push(item);
                        }
                    } else {
                        topLeaf.push(item);
                    }
                }
            }
            if (this.state.treeType != "VRFusion") {
                if (hasPar) {
                    if (expandedKeys.includes(item.pid)) {
                        if (!leafMap[item.pid]) {
                            leafMap[item.pid] = [item];
                        } else {
                            leafMap[item.pid].push(item);
                        }
                    } else {
                        topLeaf.push(item);
                    }
                } else {
                    topLeaf.push(item);
                }
            }
        });

        let expandNodes = expandedKeys.map((key, index) => {
            let node = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.rightTreeData, key));
            node.children = [];
            if (leafMap[key] && leafMap[key].length > 0) {
                node.children = node.children.concat(leafMap[key]);
            }
            return node;
        });
        let hasPar = [];
        // console.log('expandNodes', expandNodes);
        for (let i = expandNodes.length - 1; i >= 0; i--) {
            let node = expandNodes[i];
            let pid = expandNodes[i].pid;
            if (!pid) {
                continue;
            } else {
                for (let j = expandNodes.length - 1; j >= 0; j--) {
                    if (pid == expandNodes[j].id && node.id != expandNodes[j].id) {
                        expandNodes[j].children.unshift(node);
                        hasPar.push(node);
                    }
                }
            }
        }
        let searchNodes = expandNodes.filter(item => {
            return !hasPar.includes(item);
        });
        searchNodes = [...searchNodes, ...topLeaf];
        // console.log('initSearchNodes', searchNodes)
        let virtualParMap = {};
        let filterSearchNodes;
        if (this.state.treeType == "VRFusion") {
            filterSearchNodes = searchNodes.filter(searchNode => {
                let typeId = searchNode.nodeData.typeId;
                let virtualNode = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.rightTreeData, typeId));
                if (virtualNode && typeId != searchNode.id) {
                    if (!virtualParMap[virtualNode.id]) {
                        virtualNode.children = [];
                        virtualNode.children.push(searchNode);
                        virtualParMap[virtualNode.id] = virtualNode;
                    } else {
                        virtualParMap[virtualNode.id].children.push(searchNode);
                    }
                    return false;
                } else {
                    return true;
                }
            });
            let virtualExpandKeys = Object.keys(virtualParMap);
            expandedKeys = Array.from(new Set([...virtualExpandKeys, ...expandedKeys]));
            // console.log('1111', expandedKeys);
            // console.log('virtualParMap', virtualParMap);
            let fitVirtualNodes = []; // 添加虚父节点
            for (let virtualId in virtualParMap) {
                fitVirtualNodes.push(virtualParMap[virtualId]);
            }
            searchNodes = [...fitVirtualNodes, ...filterSearchNodes];
            // console.log('111searchNodes', searchNodes)
        }
        // this.isRightSearch = true;
        this.setState({
            isRightSearch: true,
            rightSearchValue: searchValue,
            rightSearchTree: searchNodes,
            rightExpandedKeys: expandedKeys,
            rightCheckedKeys: []
        });
    };

    filterSearchLeafNode = (searchValue, treeData, expandedKeys) => {
        let leafNodes = [];
        let recrusive = (searchValue, treeData) => {
            treeData.forEach(item => {
                let index = item.name.search(searchValue);
                if (index > -1 && (!item.children || (item.children.length > 0 && !expandedKeys.includes(item.id)))) {
                    //判断一下子节点中是否包换查找的节点, 不包含就push
                    leafNodes.push(deepClone(item));
                } else if (item.children && item.children.length > 0) {
                    recrusive(searchValue, item.children);
                }
            });
        };
        recrusive(searchValue, treeData);
        return leafNodes;
    };

    //拖动
    onDrop = (info) => {
        const dropPos = info.node.props.pos.split("-");
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);  //-1 当前缺口，1 后缺口，0 不在缺口


        const dragKey = info.dragNode.props.eventKey;  //获取被拖拽元素的key
        const dropKey = info.node.props.eventKey;  //获取放下元素的key
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = [...this.state.rightTreeData];
        let dragObj, dropObj;
        loop(data, dragKey, item => dragObj = item);  //找出被拖拽的元素
        loop(data, dropKey, item => dropObj = item);  //找出放下位置元素
        //添加被拖拽元素
        if (info.dropToGap && dropKey !== "root") {  //拖拽到缝隙上（但不是根节点的缝）
            loop(data, dragKey, (item, index, arr) => arr.splice(index, 1));  //删除被拖拽元素
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            ar.splice(i, 0, dragObj);
            dragObj.pid = dropObj.pid;  //更新pid
        } else if (dropObj.isDir) {  //拖拽到节点上，并且此节点是Dir
            if (!dragObj.isDir) {  //如果被拖拽元素是表样
                loop(data, dragKey, (item, index, arr) => arr.splice(index, 1));  //删除被拖拽元素
                loop(data, dropKey, (item) => {
                    item.children = item.children || [];
                    item.children.push(dragObj);
                });
                dragObj.pid = dropObj.id;  //更新pid
            }
        }
        this.setState({
            rightTreeData: data
        });
    };

    onDragEnter = (info) => {
    };

    onMouseEnter = (e) => {
        this.setState({
            isHover: e.node.props.eventKey
        });
    };
    onMouseLeave = (e, treenode) => {
        this.setState({
            isHover: "",
            editKey: "",
            isDraggable: true  //将树设置为可以拖动
        });
    };
    editRender = (item) => {
        this.setState({
            editKey: item.key,
            isDraggable: false  //将树设置为不可拖动
        });
    };
    nodechange = (item, value) => {
        item.name = value || $appRoot.state.json["public_lang-000249"];/* 国际化处理： 未命名分类*/
    };

    onTitleClick = (key) => {
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        let currentRightNode = this.TransferTreeMethods.getNodeByKey(rightTree, key);
        if (currentRightNode) {  //这么写，是为了使currentNodeKey仅为右侧节点的key
            this.currentNodeKey = key;
            this.btnFlag = currentRightNode.isDir;
        }
        // {/*点击标题自动勾选*/
        //     const rightCheckedKeys = this.state.rightCheckedKeys;
        //     let index = rightCheckedKeys.indexOf(key);
        //     if (index === -1) {
        //         rightCheckedKeys.push(key);
        //     } else {
        //         rightCheckedKeys.splice(index, 1);
        //     }
        //     this.setState({
        //         rightCheckedKeys  //忽略了半选中的问题
        //     });
        // }
    };

    changeReportStyle = (style) => {
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        let selectNodes = [];  //所有选中的节点
        const rightCheckedKeys = [...this.state.rightCheckedKeys];  //获取右侧选中节点key
        rightCheckedKeys.forEach(key => {
            selectNodes.push(
                this.TransferTreeMethods.getNodeByKey(rightTree, key)
            );
        });
        selectNodes.forEach(node => {
            if (!node.isDir) {
                node.reportStyle = style;
            }
        });
        this.setState({});
    };

    /**
     * 单个节点的移动方法
     * @param type 上移up/下移down
     */
    moveNode = (type) => {
        let currentNodeKey = this.currentNodeKey;
        if (!currentNodeKey) {
            return;
        }
        const upGo = (arr, index) => {
            if (index !== 0) {
                arr[index] = arr.splice(index - 1, 1, arr[index])[0];
            } else {
                arr.push(arr.shift());
            }
        };
        const downGo = (arr, index) => {
            if (index !== arr.length - 1) {
                arr[index] = arr.splice(index + 1, 1, arr[index])[0];
            } else {
                arr.unshift(arr.splice(index, 1)[0]);
            }
        };
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        const loopOpr = (arr) => {
            try {
                arr.forEach((item, index, arr) => {
                    if (item.key === currentNodeKey) {
                        if (type === "up") {
                            upGo(arr, index);
                        } else if (type === "down") {
                            downGo(arr, index);
                        }
                        throw Error();
                    }
                    if (item.children && item.children.length) {
                        loopOpr(item.children);
                    }
                });
            } catch (e) {
            }
        };
        loopOpr(rightTree);
        this.setState({});
    };

    /**
     * 多个节点的移动方法
     * @param type 上移up/下移down
     */
    moveNodes = (type) => {
        const upGo = (arr, index) => {  //在arr中，将位置为index的元素向前移动一个位置
            if (index !== 0) {
                arr[index] = arr.splice(index - 1, 1, arr[index])[0];
            }
        };
        const downGo = (arr, index) => {  //在arr中，将位置为index的元素向后移动一个位置
            if (index !== arr.length - 1) {
                arr[index] = arr.splice(index + 1, 1, arr[index])[0];
            }
        };
        const upInsert = (arr, index, item) => {  //在arr中，位置为index的元素前方插入item
            arr.splice(index, 0, item);
        };

        const downInsert = (arr, index, item) => {  //在arr中，位置为index的元素后方插入item
            arr.splice(index + 1, 0, item);
        };
        const upGoNum = (arr, index, n) => {  //在arr中，将位置为index的元素向前移动n个位置
            if (index !== 0) {
                let item = arr.splice(index - n < 0 ? 0 : index - n, 1, arr[index])[0];
                arr.splice(index, 1);
                arr.splice(index - n < 0 ? 1 : index - n + 1, 0, item);
            }
        };

        let newSelectTopIndex;  //第一个选中的元素移动后的key
        let existsArr;  //newSelectTopIndex对应的数组
        const loopOpr = (arr, moveKey) => {  //从arr中找到key为moveKey的元素并进行相应的操作
            try {
                arr.forEach((item, index, arr) => {
                    if (item.key === moveKey) {
                        existsArr = arr;  //将存在元素的arr保存
                        if (type === "up") {
                            newSelectTopIndex = index !== 0 ? index - 1 : index;
                        } else if (type === "down") {
                            newSelectTopIndex = index !== arr.length - 1 ? index + 1 : index;
                        }
                        if (type === "up") {
                            upGo(arr, index);
                        } else if (type === "down") {
                            downGo(arr, index);
                        }
                        throw Error();
                    }
                    if (item.children && item.children.length) {
                        loopOpr(item.children, moveKey);
                    }
                });
            } catch (e) {
            }
        };
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        const rightCheckedKeys = [...this.state.rightCheckedKeys];  //获取右侧选中节点key
        const rightHalfCheckedKeys = [...this.state.rightHalfCheckedKeys];  //获取右侧半选中节点key
        if (rightHalfCheckedKeys.length === 0) {  //当全部选中
            return toast({content: $appRoot.state.json["public_lang-000250"], color: "warning"});/* 国际化处理： 请选择需要移动的表样*/
        }
        if (rightHalfCheckedKeys.length >= 3) {
            /*办选节点超过3个的时候，证明至少存在2个表样分类没有被全选，此时不支持移动*/
            toast({content: $appRoot.state.json["public_lang-000251"], color: "warning"});/* 国际化处理： 不支持多个分组内的表样同时移动*/
            return;
        } else if (rightHalfCheckedKeys.length === 2) {  //需要考虑是否存在跨分类的情况
            let selectNodes = [];
            rightCheckedKeys.forEach(key => {
                selectNodes.push(
                    this.TransferTreeMethods.getNodeByKey(rightTree, key)
                );
            });
            let selectPids = selectNodes.reduce((did, curNode) => {
                did.push(curNode.pid);
                return did;
            }, []);
            const filterSelectPids = Array.from(new Set(selectPids));
            if (filterSelectPids.length > 1) {
                toast({content: $appRoot.state.json["public_lang-000251"], color: "warning"});/* 国际化处理： 不支持多个分组内的表样同时移动*/
                return;
            } else {
                let selectTopKey = type === "up" ? rightCheckedKeys.shift() : rightCheckedKeys.pop();  //取出第一个选中的key
                let selectOtherObjs = [];  //除去第一个，剩余选中的节点对象
                let selectTree = this.TransferTreeMethods.getNodeByKey(rightTree, filterSelectPids[0]).children;
                rightCheckedKeys.length && rightCheckedKeys.forEach(selectKey => {  //此时已经去除第一个key
                    const Loop = (arr) => {
                        arr.map((item, index, arr) => {
                            if (item.key === selectKey) {
                                selectOtherObjs.push(
                                    arr.splice(index, 1)[0]
                                );
                            }
                            if (item.children && item.children.length) {
                                Loop(item.children);
                            }
                        });
                    };
                    Loop(selectTree);
                });
                loopOpr(selectTree, selectTopKey);
                selectOtherObjs.length && selectOtherObjs.reverse().forEach(item => {
                    if (type === "up") {
                        downInsert(existsArr, newSelectTopIndex, item);
                    } else if (type === "down") {
                        upInsert(existsArr, newSelectTopIndex, item);
                    }
                });
            }
        } else if (rightHalfCheckedKeys.length === 1) {  //当只存在一个半选节点时
            {/*难点：如果选择了整组二级分类，上移的时候需要将二级分类的key向前移动其分类下子元素个数的位置，以确保selectTopKey的值是正确的*/
                if (type === "up") {
                    let selectNodes = [];  //所有选中的节点
                    let selectDirKeys = [];  //所有选中的二级分类的key
                    rightCheckedKeys.forEach(key => {
                        selectNodes.push(
                            this.TransferTreeMethods.getNodeByKey(rightTree, key)
                        );
                    });
                    selectNodes.forEach(item => {
                        if (item.isDir) {
                            selectDirKeys.push(item.key);
                        }
                    });
                    let oprSelectDirObj = selectNodes.reduce((did, cur) => {
                        if (selectDirKeys.includes(cur.key)) {
                            if (cur.children) {
                                did[cur.key] = cur.children.length;
                            } else {
                                did[cur.key] = 0;
                            }
                        }
                        return did;
                    }, {});
                    rightCheckedKeys.forEach((key, index, arr) => {
                        if (selectDirKeys.includes(key)) {
                            upGoNum(arr, index, oprSelectDirObj[key]);
                        }
                    });
                }
            }
            let selectTopKey = type === "up" ? rightCheckedKeys.shift() : rightCheckedKeys.pop();  //移动方向上的第一个key
            let selectOtherObjs = [];  //除去第一个，剩余选中的节点对象
            rightCheckedKeys.length && rightCheckedKeys.forEach(selectKey => {  //此时已经去除第一个key
                const Loop = (arr) => {
                    arr.map((item, index, arr) => {
                        if (item.key === selectKey && item.pid === rightTree[0].id) {  //判断pid为了过滤二级分类下的节点
                            selectOtherObjs.push(arr.splice(index, 1)[0]);  //给selectOtherObjs赋值
                        }
                        if (item.children && item.children.length) {
                            Loop(item.children);
                        }
                    });
                };
                Loop(rightTree);
            });
            loopOpr(rightTree, selectTopKey);
            selectOtherObjs.length && selectOtherObjs.reverse().forEach(item => {
                if (type === "up") {
                    downInsert(existsArr, newSelectTopIndex, item);
                } else if (type === "down") {
                    upInsert(existsArr, newSelectTopIndex, item);
                }
            });
        } else {
            return;
        }
        this.setState({});
    };

    deleteNode = (item) => {
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        let allDirs = _.cloneDeep(rightTree[0].children);
        let dirIndex = allDirs.findIndex(dir => dir.key === item.key);
        let nextDirKey = _.get(allDirs[dirIndex + 1], "key");

        let children = this.delTreeNodeDir(item, this.rightTreeId);  //在右侧删除相应节点
        rightTree[0].children || (rightTree[0].children = []);
        const id = rightTree[0].id;
        if (Array.isArray(children)) {
            children.forEach(item => item.pid = id);  //修改id
            rightTree[0].children.push(...children);
        }

        this.setState({
            rightCheckedKeys: [],
            rightHalfCheckedKeys: [],
            leftCheckedKeys: [],
            leftHalfCheckedKeys: [],
            isLeftSearch: false,
            isRightSearch: false,
            isHover: nextDirKey  //删除当前分类后，下一个分类自动显示删除图标
        });
        this.leftDataList = [];
        this.rightDataList = [];
        let leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
        let rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        this.state.value.leftTreeData = leftTreeData;
        this.state.value.rightTreeData = rightTreeData;
        this.generateList(leftTreeData, this.leftDataList);
        this.generateList(rightTreeData, this.rightDataList);
    };

    /**
     * 左树区域
     */
    leftArea = () => {
        let data = this.state.isLeftSearch ? this.state.leftSearchTree : this.state.leftTreeData;
        return this.TransferTreeMethods.createTree.call(this, {
            treeId: this.leftTreeId,
            data: data,
            onExpand: this.onExpand,
            onCheck: this.onCheck,
            searchMode: this.state.isLeftSearch,
            selectType: this.state.selectType,
            cacheTree: this.state.leftTreeData,
            clearCheckedKeys: this.clearCheckedKeys,
            searchValue: this.state.leftSearchValue,
            checkedKeys: this.state.leftCheckedKeys,
            expandedKeys: this.state.leftExpandedKeys,
            autoExpandParent: false,
            otherConfig: this.state.leftTreeConfig,
            fixed: this.props.rightFixed || this.props.leftFixed ? this.props.leftFixed ? this.leftTreeId : this.rightTreeId : "",
            getCheckedKeys: this.props.getCheckedKeys,
            isDraggable: false
        });
    };


    /**
     * 右树区域
     */
    rightArea = () => {
        let data = this.state.isRightSearch ? this.state.rightSearchTree : this.state.rightTreeData;
        return this.TransferTreeMethods.createTree.call(this, {
            treeId: this.rightTreeId,
            treeType: this.props.treeType,
            data: data,
            searchValue: this.state.rightSearchValue,
            expandedKeys: this.state.rightExpandedKeys,
            checkedKeys: this.state.rightCheckedKeys,
            searchMode: this.state.isRightSearch,
            cacheTree: this.state.rightTreeData,
            selectType: this.state.selectType,
            autoExpandParent: false,
            onExpand: this.onExpand,
            onCheck: this.onCheck,
            clearCheckedKeys: this.clearCheckedKeys,
            otherConfig: this.state.rightTreeConfig,
            fixed: this.props.rightFixed || this.props.leftFixed ? this.props.leftFixed ? this.leftTreeId : this.rightTreeId : "",
            isDraggable: this.state.isDraggable,
            onDrop: this.onDrop,
            onDragEnter: this.onDragEnter,
            onMouseLeave: this.onMouseLeave,
            onMouseEnter: this.onMouseEnter
        });
    };

    mergeToFixedTree = (fixedList, fromTree) => {
        let parent, node;
        fixedList.forEach(item => {
            item.pid && (parent = this.TransferTreeMethods.getNodeByKey(fromTree, item.pid));
            if (parent) {
                node = this.TransferTreeMethods.getNodeByKey(parent.children, item.id);
                node.fixed = true;
            } else {
                node = this.TransferTreeMethods.getNodeByKey(fromTree, item.id);
                node.fixed = true;
            }
        });
    };

    generateList = (data, dataList, hash, list, listWithoutChildren, fixedList, unfixedList) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            let title = node.name;
            let keyid = node.key;
            let pid = node.pid;
            let fixed = node.fixed;
            dataList.push({
                key: title,
                pid: pid,
                keyid: keyid
            });
            list && (list.push(keyid));
            if (node.children && node.children.length > 0) {
                this.generateList(node.children, dataList, hash, list, listWithoutChildren, fixedList, unfixedList);
            } else {
                if (!hash || hash[keyid]) continue;

                listWithoutChildren && (listWithoutChildren.push({id: keyid, pid}));
                if (fixed) {
                    fixedList && (fixedList.push({id: keyid, pid}));
                } else {
                    unfixedList && (unfixedList[unfixedList.length] = {id: keyid, pid});
                }
                hash[keyid] = true;
            }
        }

    };

    getMovedNodes = (fromTreeList, toTreeList) => {
        let hash = {};
        let diffNodes = [];
        let i = 0;
        while (i < toTreeList.length) {
            hash[toTreeList[i].id] = true;
            i++;
        }
        fromTreeList.forEach(item => {
            if (!hash[item.id]) {
                diffNodes[diffNodes.length] = item;
            }
        });
        return diffNodes;
    };


    computeKeys = (searchValue, dataList, tree) => {
        let expandedKeys = [];
        let _this = this;
        dataList.forEach(item => {
            if (item.key.indexOf(searchValue) > -1) {
                // console.log('keyid', item.keyid)
                let parentKeys = [];
                // console.log('key_parent',_this.getParentKey(item.key, gdata))
                // expandedKeys.push(_this.getParentKey(item.key, gdata));
                _this.TransferTreeMethods.findAllParentsKey(item.keyid, tree, parentKeys);
                // if(item.pid){
                expandedKeys = expandedKeys.concat(parentKeys);
                // }
            }
        });
        // console.log('dataList', dataList, 'expandedKeys', expandedKeys);
        const uniqueExpandedKeys = [...new Set(expandedKeys)];
        return uniqueExpandedKeys;
    };

    /**
     * 新增分类
     */
    addStyle = () => {
        this.addNum++;
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);  //从state中获取右侧数据
        let key = new Date().getTime().toString();
        let title = $appRoot.state.json["public_lang-000252"] + this.addNum;/* 国际化处理： 新增分类*/
        let refname = $appRoot.state.json["public_lang-000252"] + this.addNum;/* 国际化处理： 新增分类*/
        let pid = rightTree[0].id;
        let name = $appRoot.state.json["public_lang-000252"] + this.addNum;/* 国际化处理： 新增分类*/
        let isDir = true;
        let children = [];
        let typeObj = {
            key, title, refname, refpk: key, id: key, pid, name, code: key, isDir, children
        };
        rightTree[0].children || (rightTree[0].children = []);
        rightTree[0].children.push(typeObj);
        this.setState({
            rightExpandedKeys: [rightTree[0].key]
        });
    };


    /**
     * 添加到左树
     */
    toLeft2 = () => {
        let checkedKeys = this.state.rightCheckedKeys.reverse();
        let halfCheckedKeys = this.state.rightHalfCheckedKeys.reverse();
        if (!checkedKeys.length) {
            return;
        } else {
            let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
            let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
            let checkedNodes = checkedKeys.map(item => this.TransferTreeMethods.getNodeByKey(rightTree, item));  //获取选中的节点数据
            //穿梭前的处理
            checkedNodes.forEach(item => {
                if (!item.isDir) {
                    item.pid = item.oldPid;  //解决搜索问题
                }
            });
            this.TransferTreeMethods.addToTreeIgnoreDir(rightTree, leftTree, checkedNodes, this.leftDataList);  //左侧添加相应的节点
            this.delTreeNodeIgnoreDir(checkedNodes, this.rightTreeId);  //在右侧删除相应节点
            this.setState({
                rightCheckedKeys: [],
                rightHalfCheckedKeys: [],
                leftCheckedKeys: [],
                leftHalfCheckedKeys: [],
                isLeftSearch: false,
                isRightSearch: false
            });
            this.leftDataList = [];
            this.rightDataList = [];
            let leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
            let rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
            this.state.value.leftTreeData = leftTreeData;
            this.state.value.rightTreeData = rightTreeData;
            this.generateList(leftTreeData, this.leftDataList);
            this.generateList(rightTreeData, this.rightDataList);
        }
    };

    /**
     * 添加到右树
     */
    toRight2 = () => {
        let checkedKeys = this.state.leftCheckedKeys.reverse();  //获取选中的节点
        if (!checkedKeys.length) {
            return;
        } else {
            let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);  //从state中获取左侧数据
            let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);  //从state中获取右侧数据
            let checkedNodes = checkedKeys.map(item => this.TransferTreeMethods.getNodeByKey(leftTree, item));  //获取选中的节点数据
            //穿梭前的处理
            checkedNodes.forEach(item => {
                if (!item.isDir) {
                    item.oldPid = item.pid;  //解决搜索问题
                    item.pid = rightTree[0].id;  //解决搜索问题
                }
            });
            this.TransferTreeMethods.addToRightList(checkedNodes, rightTree);  //右侧添加节点
            this.delTreeNodeIgnoreDir(checkedNodes, this.leftTreeId);  //在左侧删除相应节点
            this.setState({
                leftCheckedKeys: [],
                leftHalfCheckedKeys: [],
                rightCheckedKeys: [],
                rightHalfCheckedKeys: [],
                isLeftSearch: false,
                isRightSearch: false
            });
            this.leftDataList = [];  //push()之前需要置空，不然会重复
            this.rightDataList = [];  //push()之前需要置空，不然会重复
            let leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);  //从state中获取左侧数据
            let rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);  //从state中获取右侧数据
            this.state.value.leftTreeData = leftTreeData;  //更新state.value
            this.state.value.rightTreeData = rightTreeData;  //更新state.value
            this.generateList(leftTreeData, this.leftDataList);  //将数据以列表形式push()到this.leftDataList
            this.generateList(rightTreeData, this.rightDataList);  //将数据以列表形式push()到this.rightDataList
        }
    };

    allToLeft2 = () => {
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        let checkedKeys = this.TransferTreeMethods.getAllNodeKeys(rightTree);
        this.state.rightCheckedKeys = checkedKeys;
        this.toLeft2();
    };

    allToRight2 = () => {
        let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
        let checkedKeys = this.TransferTreeMethods.getAllNodeKeys(leftTree);
        this.state.leftCheckedKeys = checkedKeys;
        this.toRight2();
    };

    onRightCheckAllChange = flag => {
        if (flag) {
            const rightKeys = this.rightDataList.reduce((did, cur) => {
                did.push(cur.keyid);
                return did;
            }, []);
            this.setState({
                rightHalfCheckedKeys: [],
                rightCheckedKeys: rightKeys
            });
        } else {
            this.setState({
                rightHalfCheckedKeys: [],
                rightCheckedKeys: []
            });
        }
    };

    onLeftCheckAllChange = flag => {
        if (flag) {
            const leftKeys = this.leftDataList.reduce((did, cur) => {
                did.push(cur.keyid);
                return did;
            }, []);
            this.setState({
                leftHalfCheckedKeys: [],
                leftCheckedKeys: leftKeys
            });
        } else {
            this.setState({
                leftHalfCheckedKeys: [],
                leftCheckedKeys: []
            });
        }
    };

    /**
     * 将传入的keys中过滤出表样的key
     * @param keys          传入的keys数组
     * @param LeftOrRight   属于左树还是右树
     */
    filterNotDirKeys = (keys, LeftOrRight) => {
        let leafKeys;
        let checkedNodes;
        if (LeftOrRight === "left") {
            checkedNodes = keys.map(key => this.TransferTreeMethods.getNodeByKey(this.state.leftTreeData, key));
        } else if (LeftOrRight === "right") {
            checkedNodes = keys.map(key => this.TransferTreeMethods.getNodeByKey(this.state.rightTreeData, key));
        }
        leafKeys = checkedNodes && checkedNodes.filter(node => {
            if (node && !node.isDir) {
                return node.key;
            }
        });
        return leafKeys;
    };

    filterNotDirNodes = (dataList, LeftOrRight) => {
        let allKeys = dataList.map(item => item.keyid);
        return this.filterNotDirKeys(allKeys, LeftOrRight);
    };

    render() {
        //第二个是常用的树
        return this.props.original ? (
                <Treetransfer
                    title={this.props.title}  //穿梭框上侧标题
                    searchPlaceholder={this.props.searchPlaceholder}  //搜索框文字
                    autoSearch={this.props.autoSearch}
                    addStyle={this.addStyle}  //自定义按钮功能
                    changeReportStyle={this.changeReportStyle}
                    toRight={this.toRight.bind(this)}  //右移函数
                    toLeft={this.toLeft.bind(this)}  //左移函数
                    allToLeft={this.allToLeft.bind(this)}  //全部左移函数
                    allToRight={this.allToRight.bind(this)}  //全部右移函数
                    fullscreen={this.props.fullscreen}
                    leftArea={this.leftArea.bind(this)}  //左侧穿梭框内容
                    rightArea={this.rightArea.bind(this)}  //右侧穿梭框内容
                    leftSearch={this.leftSearch.bind(this)}  //左侧搜索函数
                    rightSearch={this.rightSearch.bind(this)}  //右侧搜索函数
                    rightFixed={this.props.rightFixed}
                    allToLeft_without_merge={this.props.allToLeft_without_merge}
                    hiddenAllMoveBtns={this.props.hiddenAllMoveBtns}
                    disableBtns={this.state.disableBtns}
                    btnFlag={this.btnFlag}
                    moveFlag={this.moveFlag}
                    moveNode={this.moveNode}
                    moveNodes={this.moveNodes}
                    original={this.props.original}  //原始的
                    leftChecked={this.state.leftCheckedKeys.length === this.leftDataList.length}
                    leftIndeterminate={this.state.leftCheckedKeys.length !== this.leftDataList.length && this.state.leftCheckedKeys.length !== 0}  //左侧肩部的复选框状态
                    rightChecked={this.state.rightCheckedKeys.length === this.rightDataList.length}  //右侧肩部的复选框状态
                    rightIndeterminate={this.state.rightCheckedKeys.length !== this.rightDataList.length && this.state.rightCheckedKeys.length !== 0}  //右侧肩部的复选框状态
                    leftSelectDataLength={this.filterNotDirKeys(this.state.leftCheckedKeys, "left").length}
                    rightSelectDataLength={this.filterNotDirKeys(this.state.rightCheckedKeys, "right").length}
                    leftDataLength={this.filterNotDirNodes(this.leftDataList, "left").length}
                    rightDataLength={this.filterNotDirNodes(this.rightDataList, "right").length}
                    onRightCheckAllChange={this.onRightCheckAllChange}
                    onLeftCheckAllChange={this.onLeftCheckAllChange}
                />
            ) :
            (
                <Treetransfer
                    title={this.props.title}  //穿梭框上侧标题
                    searchPlaceholder={this.props.searchPlaceholder}  //搜索框文字
                    autoSearch={this.props.autoSearch}
                    addStyle={this.addStyle}  //自定义按钮功能
                    changeReportStyle={this.changeReportStyle}
                    toRight={this.toRight2.bind(this)}  //右移函数
                    toLeft={this.toLeft2.bind(this)}  //左移函数
                    allToLeft={this.allToLeft2.bind(this)}  //全部左移函数
                    allToRight={this.allToRight2.bind(this)}  //全部右移函数
                    fullscreen={this.props.fullscreen}
                    leftArea={this.leftArea.bind(this)}  //左侧穿梭框内容
                    rightArea={this.rightArea.bind(this)}  //右侧穿梭框内容
                    leftSearch={this.leftSearch.bind(this)}  //左侧搜索函数
                    rightSearch={this.rightSearch.bind(this)}  //右侧搜索函数
                    rightFixed={this.props.rightFixed}
                    allToLeft_without_merge={this.props.allToLeft_without_merge}
                    hiddenAllMoveBtns={this.props.hiddenAllMoveBtns}
                    disableBtns={this.state.disableBtns}
                    isHideLeft={this.props.isHideLeft}
                    btnFlag={this.btnFlag}
                    moveFlag={this.moveFlag}
                    moveNode={this.moveNode}
                    moveNodes={this.moveNodes}
                    leftChecked={this.state.leftCheckedKeys.length === this.leftDataList.length}
                    leftIndeterminate={this.state.leftCheckedKeys.length !== this.leftDataList.length && this.state.leftCheckedKeys.length !== 0}  //左侧肩部的复选框状态
                    rightChecked={this.state.rightCheckedKeys.length === this.rightDataList.length}  //右侧肩部的复选框状态
                    rightIndeterminate={this.state.rightCheckedKeys.length !== this.rightDataList.length && this.state.rightCheckedKeys.length !== 0}  //右侧肩部的复选框状态
                    leftSelectDataLength={this.filterNotDirKeys(this.state.leftCheckedKeys, "left").length}
                    rightSelectDataLength={this.filterNotDirKeys(this.state.rightCheckedKeys, "right").length}
                    leftDataLength={this.filterNotDirNodes(this.leftDataList, "left").length}
                    rightDataLength={this.filterNotDirNodes(this.rightDataList, "right").length}
                    onRightCheckAllChange={this.onRightCheckAllChange}
                    onLeftCheckAllChange={this.onLeftCheckAllChange}
                />
            );
    }
}

