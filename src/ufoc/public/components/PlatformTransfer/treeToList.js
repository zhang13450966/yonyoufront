/*
 * @Author: bbqin
 * @Date: 2021-07-09 13:52:24
 * @LastEditTime: 2022-04-24 14:28:05
 * @LastEditors: Please set LastEditors
 * @Description: 树表穿梭框
 * @FilePath: \Platform_Front\src\platform\components\Transfer\treeToList.js
 * 树表穿梭框根据checkable参数来确定树是否有checkbook，有checkbox的遵从自动包含下级的选中规则，没有checkbox的遵从仅本机的选中规则
 * 有checkbox：点击行展开节点，搜索末级，保持树的结构并高亮，shift连选需点击checkbox；
 * 没有checkbook：点击行选中/取消选中并展开节点，搜索所有，保持树的结构并高亮；
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import './treeToList.less'
import List from './list';
import MoveButton from './moveButton';
import { DragDropContext } from 'react-beautiful-dnd';
import {base,getMultiLang, getSysFieldid} from 'nc-lightapp-front'
let { NCTree:Tree, NCInput : FormControl, NCCheckbox:Checkbox, NCAlert:Alert } = base;
import PropTypes from 'prop-types';
import _ from 'lodash';
import {getTeeHandler} from './getTeeHandler'
// import './index.less';
// import './tree.less';
export class TreeToListTransfer extends Component {
    constructor(props) {
        super(props);
        // 树默认展示第一级；多根节点展示根     
        let defaultTreeExpandedKeys = props.dataSource.length === 1 ? [props.dataSource[0][props.rowKey]] : [];
        const { finalTreeData, listData, leafKeys, treeAllFlatData, dataMap, filterLeafKeys, filterFlatData, listDataKeys } = this.generate(props, { treeSearchKey: '', treeExpandedKeys: defaultTreeExpandedKeys });
        this.dataMap = dataMap;
        this.leftTreeMapping = null // 包含获取树形数据所有下级，直接下级，末级等方法
        this.state = {
            finalTreeData: finalTreeData, // 树的树型数据
            treeAllFlatData: treeAllFlatData, // 树所有的扁平数据
            listData: listData, // 右边列表的数据
            leafKeys: leafKeys, // 树的叶子节点的 key 集合 Set 判断是否是叶子节点，是看节点的chilren是否有值，空数组和数据都不是叶子节点
            listDataKeys: listDataKeys,//右边列表的key 集合 Set
            treeCheckedKeys: [], // 树复选框选中的 key 
            treeSelectedKeys: [], // 树节点选中的 key 
            filterLeafKeys,//过滤后所有叶子节点的key Set
            filterFlatData,//过滤后铺平的所有数据
            treeExpandedKeys: defaultTreeExpandedKeys, // 树展开的节点的 key
            listCheckedKeys: [], // 目标框列表勾选中的 key 
            listSelectedKeys: [], // 目标框列表点击选中的 key 
            treeSearchKey: '', // 树的搜索关键词
            listSearchKey: '', // 列表的搜索关键词
            unLoadAlert: false, // 异步加载提示显示状态
            json: {},
        };
        let {instance = () => {}} = props
        instance(this)
        window.TreeToListTransfer = this
    }

    componentWillMount() {
        // 初始化多语
        let callback = (json, bool, LangData) => {
            this.setState({ json })
        }
        getMultiLang({ moduleId: 'container_transfer', callback }) // moduleId为所需加载json文件夹名称前缀
    }

    componentWillReceiveProps(nextProps) {
        let { treeSearchKey, treeExpandedKeys } = this.state;
        let defaultTreeExpandedKeys = nextProps.dataSource.length === 1 ? [nextProps.dataSource[0][nextProps.rowKey]] : [];
        if (treeExpandedKeys.length === 0) treeExpandedKeys = defaultTreeExpandedKeys;
        const { finalTreeData, listData, leafKeys, treeAllFlatData, filterLeafKeys, filterFlatData, dataMap, expandedKeys, listDataKeys } = this.generate(nextProps, this.state);
        this.dataMap = dataMap;
        this.setState({
            finalTreeData,
            listData,
            leafKeys,
            filterLeafKeys,
            filterFlatData,
            treeAllFlatData,
            listDataKeys,
            treeCheckedKeys:[],
            treeExpandedKeys: treeSearchKey ? expandedKeys : [...treeExpandedKeys]
        });
    }

    // 根据传进来的 props 数据生成需要的各种数据
    generate = (nextProps, state = {}) => {
        const { dataSource, targetKeys, rowKey, rowTitle,disabledNodeKeys } = nextProps;
        const { treeSearchKey, treeExpandedKeys } = state;
        const listDataKeys = new Set();// 右边列表的key集合
        let listData = [];
        let rootId = _.get(dataSource[0],'pid');
        //生成穿梭框的各种原始数据
        let { treeAllFlatData, dataMap, leafKeys } = this.treeToArray(dataSource,{},disabledNodeKeys);
        targetKeys.forEach(key => {
            let listItem = dataMap.get(key);
            if (listItem && !listItem.disabledNode) {
                let listNode = { ...listItem, [rowKey]: listItem[rowKey], [rowTitle]: listItem[rowTitle], key: listItem[rowKey] }
                listData.push(listNode);
                listDataKeys.add(key);
            }
        });
        //根据搜索关键字和右边有的过滤数据,以及搜索时需要展开的行
        let { filterFlatData, expandedKeys, filterLeafKeys } = this.treeFilter(treeAllFlatData, treeSearchKey, leafKeys, listDataKeys, dataMap, treeExpandedKeys);
        //过滤后剩余的叶子节点的key 集合
        //将过滤过的数据转换为树形数据
        let finalTreeData = this.listToTree(filterFlatData, dataMap, rootId);
        // if (expandedKeys.length === 0) {
        //     expandedKeys = [_.get(finalTreeData[0],rowKey)]
        // }
        return {
            finalTreeData,
            leafKeys,
            listData,
            filterLeafKeys,
            filterFlatData,
            expandedKeys,
            dataMap,
            listDataKeys,
            treeAllFlatData,
        };
    };

    //根据搜索关键字、右边列表中的有的，从所有的叶子节点找
    treeFilter = (rows, keyword, leafKeys, listDataKeys, dataMap, treeExpandedKeys) => {
        let { checkable,checkStrictly } = this.props;
        let result = []; // 存放有效的可以穿梭的节点，用来反查父节点组成树数据
        let expandedKeys = [];
        let filterLeafKeys = new Set();
        if (checkable) {
            if (!keyword && listDataKeys.size === 0) {
                return { filterFlatData: rows, expandedKeys: treeExpandedKeys, filterLeafKeys: leafKeys };
            }
            keyword = keyword.toLowerCase();
            if (checkStrictly) {
                //从所有的数据节点里面找
                for (const [nodeKey,node] of dataMap) {
                    if (node && !listDataKeys.has(nodeKey) && !node.disabledNode) {
                        if (!keyword || node.title.toLowerCase().indexOf(keyword) > -1) {
                            result.push(node);
                            if (leafKeys.has(nodeKey)) {
                                filterLeafKeys.add(nodeKey);
                            }
                        }
                    }
                }                
            } else {
                //从所有的叶子节点里面找
                for (const leaf of leafKeys) {
                    let node = dataMap.get(leaf);
                    if (node && !listDataKeys.has(leaf)) {
                        if (!keyword || node.title.toLowerCase().indexOf(keyword) > -1) {
                            result.push(node);
                            filterLeafKeys.add(leaf);
                        }
                    }
                }
            }
            let rowSet = new Set();
            let allResultRow = [];
            // let numFlag = 0;
            // 反查父节点
            result.forEach(node => {
                let parentRow = [];
                let parentNode = dataMap.get(node.pid);
                if (!rowSet.has(node.key)) {
                    rowSet.add(node.key);
                    parentRow.unshift(node);
                }
                // numFlag++;
                while (parentNode) {
                    if (!rowSet.has(parentNode.key)) {
                        rowSet.add(parentNode.key, parentNode);
                        // numFlag === 1 && expandedKeys.push(parentNode.key);
                        expandedKeys.push(parentNode.key);
                        parentRow.unshift(parentNode);
                        parentNode = dataMap.get(parentNode.pid);
                    } else {
                        break;
                    }
                }
                allResultRow.push(...parentRow)
            });
            // 如果有关键字，所有树节点都应该展开
            if (keyword) {
                expandedKeys = [...rowSet]
            }
            return { filterFlatData: allResultRow, expandedKeys, filterLeafKeys };
        } else {
            if (!keyword) {
                return { filterFlatData: rows, expandedKeys: treeExpandedKeys, filterLeafKeys: leafKeys };
            }
            keyword = keyword.toLowerCase();
            result = rows.filter(row => {
                let { title } = row;
                let res = title.toLowerCase().indexOf(keyword);
                return res > -1;
            });
            let rowSet = new Set();
            let allResultRow = [];
            let numFlag = 0;
            // 反查父节点
            result.forEach(node => {
                let parentNode = dataMap.get(node.pid);
                if (!rowSet.has(node.key)) {
                    rowSet.add(node.key);
                    allResultRow.push(node);
                }
                numFlag++;
                while (parentNode) {
                    if (!rowSet.has(parentNode.key)) {
                        rowSet.add(parentNode.key, parentNode);
                        numFlag === 1 && expandedKeys.push(parentNode.key);
                        allResultRow.push(parentNode);
                        parentNode = dataMap.get(parentNode.pid);
                    } else {
                        break;
                    }
                }
            });
            return { filterFlatData: allResultRow, expandedKeys, filterLeafKeys: leafKeys };
        }
    };

    //深度优先先序遍历,返回平铺的list数据，平铺的map，以及叶子节点的set
    treeToArray = (treeData, { pid, leafKeys = new Set(), treeAllFlatData = [], dataMap = new Map() } = {},disabledNodeKeys = []) => {
        let { rowChildren, rowKey, rowTitle } = this.props;
        let disabledNodeSet = new Set(disabledNodeKeys)
        let treeNode, list = [...treeData];
        //每次都从第一个开始
        while (treeNode = list.shift()) {
            treeNode.pid = treeNode.pid || pid;
            let { [rowChildren]: children, ...node } = treeNode;
            let newNode = { ...node, key: node[rowKey], title: node[rowTitle] }
            treeAllFlatData.push(newNode);
            newNode.disabledNode = disabledNodeSet.has(newNode.key)
            dataMap.set(node[rowKey], newNode);
            if (Array.isArray(children)) {
                //如果有孩子，将孩子放在第一个
                list.unshift(...children)
            } else {
                leafKeys.add(treeNode[rowKey]);
            }
        }
        return { treeAllFlatData, dataMap, leafKeys };
    }

    //将列表转为树
    listToTree = (list, dataMap, rootId) => {
        return list.filter(item => {
            let node = dataMap.get(item.pid);
            if (node) {
                if (!node.children) {
                    node.children = [];
                }
                node.children.push(item);
            }
            return item.pid === rootId;
        })
    }

    hasUnLoadNode = (node) => {
        let status = false;
        const loop = (data) =>
            data.forEach((item) => {
                if (item.props.children && !status) {
                    if (item.props.children.length === 0) {
                        status = true;
                        return;
                    } else {
                        loop(item.props.children);
                    }
                }
            });
        loop(node);
        return status;
    };

    toggle = (ary, ele) => {
        let index = ary.indexOf(ele);
        if (index == -1) {
            ary.push(ele);
        } else {
            ary.splice(index, 1);
        }
        return ary;
    };

    // 左边树勾选选中
    onTreeCheck = (checkedKeys, e) => {
        let { treeCheckedKeys, filterLeafKeys } = this.state;
        let { selectedValue } = this.props;
        let {checkStrictly} = this.props
        let hasCheckdKeys = [];
        treeCheckedKeys.forEach(element => {
            if (!checkStrictly) {
                // 不是叶子节点的节点key就加入到hasCheckdKeys
                !filterLeafKeys.has(element) && hasCheckdKeys.push(element);
            }
        });
        // 在勾选时控制
        if (checkStrictly) {
            if (![true,false].includes(e)) {                
                if (e.checked) {
                    hasCheckdKeys = [...this.leftTreeMapping[selectedValue]([e.node.props.id]).map(item => item.key),...treeCheckedKeys]
                    if (['getLeafNoMe','getLowerNoMe'].includes(selectedValue)) {
                        _.remove(checkedKeys,v => v == e.node.props.id)
                    }
                } else {
                    // 获取取消勾选的勾选项
                    let needCancelCheckdKeys = this.leftTreeMapping[selectedValue]([e.node.props.id]).map(item => item.key)
                    checkedKeys = checkedKeys.filter(key => !needCancelCheckdKeys.includes(key))
                }
            }
        }        
        let checked, node, eventObject, isShiftCheck = false;
        let oldCheckedKey = this.checkedKeys;
        let filterKeys = new Set();
        let dateMap = this.dataMap;
        if (typeof e === 'object') {
            checked = e.checked;
            node = e.node;
            eventObject = e.eventObject;
            // if (checked) {
            //     this.checkedKeys = node?.props?.eventKey;
            // } else {
            //     this.checkedKeys = undefined;
            // }
            this.checkedKeys = _.get(node,`props.eventKey`,[]); 
        } else {
            checked = e;
        }

        //shift连选
        if (_.get(eventObject,'shiftKey') === true && oldCheckedKey && this.checkedKeys && oldCheckedKey !== this.checkedKeys) {
            isShiftCheck = true;
            let beginIndex, endIndex, isDownFalg;
            const { filterFlatData, filterLeafKeys } = this.state;
            for (let index = 0; index < filterFlatData.length; index++) {
                const elementKey = filterFlatData[index]["key"];
                if (elementKey === oldCheckedKey) {
                    beginIndex = index;
                } else if (elementKey === this.checkedKeys) {
                    endIndex = index;
                }
                if (typeof beginIndex === 'number' && typeof endIndex === "undefined") {
                    isDownFalg = true;
                    if (checkStrictly) {
                        filterKeys.add(elementKey);
                    } else {
                        if (filterLeafKeys.has(elementKey)) {
                            filterKeys.add(elementKey);
                        }                        
                    }
                } else if (typeof beginIndex === 'undefined' && typeof endIndex === "number") {
                    isDownFalg = false;
                    if (checkStrictly) {
                        filterKeys.add(elementKey);
                    } else {
                        if (filterLeafKeys.has(elementKey)) {
                            filterKeys.add(elementKey);
                        }
                    }
                }
                if (typeof beginIndex === 'number' && typeof endIndex === 'number') break;
            }

            if (isDownFalg) {
                // console.log('向下选');
                //找到this.checkedKeys的所有下级叶子节点
                let checkedKeyNode = dateMap.get(this.checkedKeys);
                let treeNode, list = [checkedKeyNode];
                while (treeNode = list.shift()) {
                    let { children } = treeNode;
                    if (Array.isArray(children)) {
                        //如果有孩子，将孩子放在第一个
                        list.unshift(...children);
                    } else {
                        filterKeys.add(treeNode.key);
                    }
                }
            } else {
                // console.log("向上选");
                //找到oldCheckedKey的所有下级叶子节点
                let checkedKeyNode = dateMap.get(oldCheckedKey);
                let treeNode, list = [checkedKeyNode];
                while (treeNode = list.shift()) {
                    let { children } = treeNode;
                    if (Array.isArray(children)) {
                        //如果有孩子，将孩子放在第一个
                        list.unshift(...children);
                    } else {
                        filterKeys.add(treeNode.key);
                    }
                }
            }
        }
        if (checked) {
            if (this.props.onLoadData && this.hasUnLoadNode([e.node])) {
                this.setState({ unLoadAlert: true });
                return;
            }
        }
        if (!checkStrictly) {
            checkedKeys = checkedKeys.filter(key => this.state.leafKeys.has(key))
        }
        this.setState({
            treeCheckedKeys: isShiftCheck ? [...new Set([...filterKeys, ...treeCheckedKeys])] : [...new Set([...hasCheckdKeys, ...checkedKeys])],
            unLoadAlert: false,
            treeSelectedKeys: this.checkedKeys ? [this.checkedKeys] : []
        });

    };

    // 左边树点击选中  展开/收起
    onTreeSelect = (treeSelectedKeys, info) => {
        let selectedKey = _.get(info,`node.props.eventKey`);
        if (selectedKey) {
            if (!this.state.leafKeys.has(selectedKey)) {
                this.setState({ treeExpandedKeys: this.toggle(this.state.treeExpandedKeys, selectedKey) }, () => { if (!this.state.treeSearchKey) this.preTreeExpandedKeys = [...this.state.treeExpandedKeys]; })
            }
        }
        if (this.props.checkable) return false; // 如果有复选框，就不能点击选中树节点
        this.setState({ treeSelectedKeys });
    };

    // 右边列表的选中
    onListCheck = (selectedItem, result,) => {
        let keys = this.props.checkable ? 'listCheckedKeys' : 'listSelectedKeys';
        this.setState(
            { [keys]: this.toggle([...this.state[keys]], selectedItem.key) });
    };

    //右边列表全选
    onListAllCheck = (selectedItem, result) => {
        let keys = this.props.checkable ? 'listCheckedKeys' : 'listSelectedKeys';
        const selected = result ? [] : selectedItem.map(item => item.key);
        this.setState({ [keys]: selected });
    }

    //展开收起事件
    onExpand = expandedKeys => {
        this.setState({
            treeExpandedKeys: expandedKeys,
        }, () => { if (!this.state.treeSearchKey) this.preTreeExpandedKeys = [...this.state.treeExpandedKeys]; });
    }

    // 搜索左边树
    onTreeSearch = value => {
        // console.log(value);
        this.setState(
            { treeSearchKey: value },
            () => {
                if (this.props.onLoadData && this.props.onTreeSearch) {
                    // async search
                    this.props.onTreeSearch(value);
                } else {
                    // 树默认展示第一级；多根节点展示根
                    let defaultTreeExpandedKeys = this.props.dataSource.length === 1 ? [this.props.dataSource[0][this.props.rowKey]] : [];
                    const { finalTreeData, listData, leafKeys, filterLeafKeys, filterFlatData, treeAllFlatData, expandedKeys, dataMap, listDataKeys } = this.generate(this.props, this.state);
                    this.dataMap = dataMap;
                    this.setState({
                        finalTreeData,
                        listData,
                        leafKeys,
                        filterLeafKeys,
                        filterFlatData,
                        treeAllFlatData,
                        listDataKeys,
                        treeExpandedKeys: value ? expandedKeys : this.preTreeExpandedKeys || defaultTreeExpandedKeys,
                    });
                }
            },
        );
    };

    // 搜索右边列表
    onListSearch = (value) => {
        this.setState({ listSearchKey: value })
    };

    // 操作
    handleMove = direction => {
        let {selectedValue,checkStrictly,disabledNodeKeys } = this.props
        let checkable = this.props.checkable;
        let { treeCheckedKeys, treeSelectedKeys, listCheckedKeys, listSelectedKeys, listDataKeys, filterLeafKeys, filterFlatData,treeAllFlatData  } = this.state;
        let leftTemp = checkable ? treeCheckedKeys : treeSelectedKeys; // 左边选中的 key 集合
        let rightTemp = checkable ? listCheckedKeys : listSelectedKeys; // 右边选中的 key 集合
        // 在勾选时控制
        // if (checkStrictly) {
        //     leftTemp = this.leftTreeMapping[selectedValue](leftTemp).map(item => item.key)
        // }
        switch (direction) {
            case "right":
                if (leftTemp.length > 0) {
                    // let filterKeys = [];
                    // let filterSearchKeys;
                    // if (checkable) {
                    //     filterSearchKeys = filterLeafKeys;
                    // } else {
                    //     filterSearchKeys = new Set(filterFlatData.map(i => i.key));
                    // }
                    // leftTemp.forEach(element => {
                    //     if (filterSearchKeys.has(element)) {
                    //         filterKeys.push(element);
                    //     }
                    // });
                    this.setState({ treeCheckedKeys: [], treeSelectedKeys: [], listCheckedKeys: [], listSelectedKeys: [] });
                    this.props.onTargetKeysChange && this.props.onTargetKeysChange([...new Set([...listDataKeys, ...leftTemp])]);
                }
                break;
            case "left":
                if (rightTemp.length > 0) {
                    // let rightKeys = [...listDataKeys].filter(i => !(rightTemp.includes(i)));
                    let rightKeys = [...listDataKeys].filter(i => !(new Set([...rightTemp]).has(i)));
                    this.setState({ treeCheckedKeys: [], treeSelectedKeys: [], listCheckedKeys: [], listSelectedKeys: [] });
                    let param = {
                        transToLeft:rightTemp
                    }
                    this.props.onTargetKeysChange && this.props.onTargetKeysChange(rightKeys,param);
                }
                break;
            case "allLeft":
                this.setState({ treeCheckedKeys: [], treeSelectedKeys: [], listCheckedKeys: [], listSelectedKeys: [] });
                //把过滤后全部移过来
                this.filterListData.forEach(element => {
                    listDataKeys.has(element.key) && listDataKeys.delete(element.key);
                });
                let param = {
                    transToLeft:rightTemp
                }
                this.props.onTargetKeysChange && this.props.onTargetKeysChange([...listDataKeys],param);
                break;
            case "allRight":
                let filterSearchKeys;
                if (checkable) {
                    if (checkStrictly) {
                        filterSearchKeys = treeAllFlatData.filter(item => !disabledNodeKeys.includes(item.key)).map(item => item.key)
                    } else {
                        filterSearchKeys = filterLeafKeys;
                    }
                } else {
                    filterSearchKeys = (filterFlatData.map(i => i.key));
                }
                this.setState({ treeCheckedKeys: [], treeSelectedKeys: [], listCheckedKeys: [], listSelectedKeys: [] });
                this.props.onTargetKeysChange && this.props.onTargetKeysChange([...new Set([...listDataKeys, ...filterSearchKeys])]);
                break;
            default:
                break;
        }
    };
    //列表的shift连选回调
    handleShiftSelect = (selectedItems) => {
        // console.log(selectedItems);
        let keys = this.props.checkable ? 'listCheckedKeys' : 'listSelectedKeys';
        const selected = selectedItems.map(item => item.key);
        this.setState({ [keys]: selected });
    }

    //双击树节点加入已选  禁用或者已选的return
    onDoubleClick = (checkedKeys, info) => {
        let checkable = this.props.checkable;
        if (checkable && !this.state.leafKeys.has(checkedKeys)) return;
        let listDataKeys = this.state.listDataKeys;
        //如果不在已选，就加入
        let targetKeys = listDataKeys.has(checkedKeys);
        if (!targetKeys) {
            this.setState({ unLoadAlert: false });
            this.props.onTargetKeysChange && this.props.onTargetKeysChange([...listDataKeys, checkedKeys]);
        }

    }

    handleRightDataSourceFilter = (filterListData = []) => {
        this.filterListData = filterListData
    }

    renderTitle = (item) => {
        // 左侧树和右侧列表的节点render区分开，若有treeNodeRender则用treeNodeRender，没有则两侧共用listRender
        // 报表数据订阅 新增第三步参加发送的报表，左右两侧节点文本组成是不一样的，需要区分开
        const { showSearch, listRender,treeNodeRender, checkable } = this.props;
        const { treeSearchKey } = this.state;
        const { children, title } = item;
        // title 前icon 通过 jsx  HTML和content
        const getIcon = el => {
            return <span className={item.inRight ? 'inRight' : ''}><i className="iconfont"></i>{el}</span>
        }
        let nodeTitle = treeNodeRender ? treeNodeRender(item) : listRender(item);
        if (!Array.isArray(children) || !checkable) {
            if (showSearch && treeSearchKey && treeSearchKey.length > 0) {
                if (title.indexOf(treeSearchKey) > -1) {
                    const idx = nodeTitle.indexOf(treeSearchKey);
                    nodeTitle = (
                        <span>
                            {nodeTitle.substr(0, idx)}
                            <span style={{ color: '#f50' }}>{treeSearchKey}</span>
                            {nodeTitle.substr(idx + treeSearchKey.length)}
                        </span>
                    );
                }
            }
        }
        return getIcon(nodeTitle);
    }
    //findParentNode

    findParentNode = (result) => {
        // 反查父节点
        let dataMap = this.dataMap;
        let allResultRow = new Set();
        if (Array.isArray(result)) {
            let resultSet = new Set([...result]);
            let notCheck = new Set();
            result.forEach(key => {
                let node = dataMap.get(key);
                let parentNode = dataMap.get(node.pid);
                allResultRow.add(node.key);
                while (parentNode) {
                    let checkFlag = true;
                    let childNode = parentNode.children;
                    for (let index = 0; index < childNode.length; index++) {
                        const element = childNode[index];
                        //是叶子节点的情况，直接把自己记录下来
                        if (resultSet.has(element.key)) {
                            allResultRow.add(element.key);
                        } else {
                            notCheck.add(element.key);
                            checkFlag = false;
                        }
                    }
                    if (checkFlag) {
                        allResultRow.add(parentNode.key);
                        parentNode = dataMap.get(parentNode.pid);
                    } else {
                        break;
                    }

                }
            });
        }

        return [...allResultRow];

    }
    render() {
        let {
            className,
            titles,
            prefixCls = 'ncc-transfer',
            showSearch,
            showListSearch,
            onLoadData,
            operations,
            searchPlaceholder,
            notFoundContent,
            showMoveBtn,
            checkable,
            disable,
            dataSource,
            renderOperation,
            listRender,
            lazyLoad = false,
            rowKey,
            checkStrictly,
            disabledNodeKeys
        } = this.props;
        // titles = titles || [this.state.json['container-transfer-0001'], this.state.json['container-transfer-0002']]
        notFoundContent = notFoundContent || '';//this.state.json['container-transfer-0003']
        searchPlaceholder = searchPlaceholder || this.state.json['container-transfer-0004'];

        // let [sourceTitle, targetTitle] = titles;
        let {
            finalTreeData,
            treeAllFlatData,
            listData,
            leafKeys,
            listDataKeys,
            filterFlatData,
            treeCheckedKeys,
            treeSelectedKeys,
            listCheckedKeys,
            listSelectedKeys,
            treeExpandedKeys,
            listSearchKey,
            unLoadAlert,
            filterLeafKeys,
            json
        } = this.state;
        let leftTemp = checkable ? treeCheckedKeys : treeSelectedKeys; // 左边选中的 key 集合
        let rightTemp = checkable ? listCheckedKeys : listSelectedKeys; // 右边选中的 key 集合
        // 穿梭过去的要在左侧树置灰，针对只穿父节点的情况
        treeAllFlatData.forEach(item => {
            // 已穿梭过去的
            item.inRight = listDataKeys.has(item.key)
           
            // 不能穿梭到右侧的标志
            // item.disabledTransfer = listDataKeys.has(item.key) || disabledNodeKeys.includes(item.key)
            // console.warn(disabledNodeKeys.includes(item.key))
        })
        
        let validTreeNum// 树中可以穿梭到列表中有效的数据的总数
        if (checkStrictly) {
            validTreeNum = filterFlatData.filter(item => !item.disabled && !item.disabledNode).length
        } else {
            validTreeNum = checkable ? filterLeafKeys.size : filterFlatData.length; // 树中可以穿梭到列表中有效的数据的总数
        }
        //从左右选中的挑选出筛选后选中的节点
        let filterCheckKeys = [];
        leftTemp.forEach(element => {
            if (checkStrictly) {
                let node = filterFlatData.find(ele => ele[rowKey] === element)
                if (node && !node.disabledNode) {
                    filterCheckKeys.push(element);
                }
            } else {
                if (filterLeafKeys.has(element)) {
                    filterCheckKeys.push(element);
                }
            }
        });
        const leftActive = rightTemp.length > 0;
        const rightActive = filterCheckKeys.length > 0;

        const treeTransferlistBodyClass = classNames({
            'ncc-transfer-list-body': true,
            'ncc-transfer-list-body-with-search': showSearch,
        });
        // const checkedKeys = this.findParentNode(treeCheckedKeys);
        // 包含获取树形数据所有下级，直接下级，末级等方法
        this.leftTreeMapping = getTeeHandler(finalTreeData);
        const treeProps = {
            className: 'tree-padding',
            checkable,
            treeData: finalTreeData,
            showLine: false,
            multiple: !checkable,
            checkedKeys: treeCheckedKeys,
            selectedKeys: treeSelectedKeys,
            onSelect: this.onTreeSelect,
            onCheck: this.onTreeCheck,
            onExpand: this.onExpand,
            renderTitle: this.renderTitle,
            onDoubleClick: this.onDoubleClick,
            expandedKeys: treeExpandedKeys,
            loadData: onLoadData,
            checkStrictly, // 控制父子关联勾选
            mustExpandable: true, //支持disabled的节点可以自定义展开收起
        };

        const cls = classNames(className, prefixCls);
        return (

            <div className={cls} fieldid={getSysFieldid('transfer_area')}>
                <DragDropContext>
                    <div className="ncc-transfer-list" fieldid={getSysFieldid('left_area')}>
                        <div className="ncc-transfer-list-header">
                            {checkable && <Checkbox
                                disabled={disable}
                                checked={filterCheckKeys.length > 0 && filterCheckKeys.length === validTreeNum}
                                indeterminate={filterCheckKeys.length > 0 && filterCheckKeys.length < validTreeNum}
                                onChange={value => {
                                    let finalChecked = []
                                    if (checkStrictly) {
                                        finalChecked = filterFlatData.filter(item => !item.disabled && !item.disabledNode).map(item => item.key)
                                    } else {
                                        finalChecked = [...filterLeafKeys] 
                                    }
                                    let checkedKeys = value ? finalChecked : [];
                                    this.onTreeCheck(checkedKeys, value);
                                }}
                            />}
                            <span className="ncc-transfer-list-header-selected">
                                {this.state.json['container-transfer-select']} {`(${filterCheckKeys.length}/${validTreeNum})`}
                            </span>
                            {/* <span className="ncc-transfer-list-header-title">{sourceTitle}</span> */}
                        </div>
                        <div className={treeTransferlistBodyClass}>
                            {showSearch ? (
                                <div className="ncc-transfer-list-body-search-wrapper">
                                    <FormControl
                                        type="search"
                                        placeholder={searchPlaceholder}
                                        onChange={this.onTreeSearch}
                                        value={this.state.treeSearchKey}
                                    />
                                </div>
                            ) : null}
                            {unLoadAlert ? (
                                <div className="tree-transfer-panel-body-alert">
                                    <Alert dark onDismiss={() => this.setState({ unLoadAlert: false })} closeLabel="close">
                                        {this.state.json['container-transfer-alert']}
                                    </Alert>
                                </div>
                            ) : null}
                            <div className="ncc-transfer-list-content">
                                <Tree {...treeProps}></Tree>
                            </div>
                            {dataSource.length === 0 && (
                                <div className={`${prefixCls}-list-body-not-found ${dataSource.length == 0 ? "show" : ""}`}>
                                    {notFoundContent}
                                </div>
                            )}
                        </div>
                    </div>

                    <MoveButton
                        left={{
                            text: operations[0],
                            active: leftActive,
                            move: this.handleMove.bind(this, 'left'),
                        }}
                        right={{
                            text: operations[1],
                            active: rightActive,
                            move: this.handleMove.bind(this, 'right'),
                        }}
                        allLeft={{
                            text: operations[2],
                            active: listData.length !== 0,
                            move: this.handleMove.bind(this, 'allLeft'),
                        }}
                        allRight={{
                            text: operations[3],
                            active: validTreeNum !== 0,
                            move: this.handleMove.bind(this, 'allRight'),
                        }}
                        langJson={json}
                        direction={'horizontal'}
                        renderOperation={renderOperation}
                    />

                    <List
                        titleText={''}  //右侧标题
                        dataSource={listData}   //右侧数据源
                        filter={listSearchKey}    //搜索框中输入的内容
                        // filterOption={filterOption}  //用户自定义搜索过滤方法 参数(inputValue, option)
                        // style={listStyle}  //自定义的columns的样式表
                        checkedKeys={rightTemp}  //右侧已勾选的item的keys
                        handleFilter={this.onListSearch}  //右侧搜索框值更改事件
                        dataSourceFilter={this.handleRightDataSourceFilter}  //右侧搜索框值更改事件
                        handleClear={this.onListSearch}  //清空右侧搜索框内容
                        handleSelect={this.onListCheck}  //点击右侧列表中的item，改变选中或取消选中状态
                        handleSelectAll={this.onListAllCheck} //点击右侧全选
                        render={listRender}
                        showSearch={showListSearch}  //是否显示搜索框
                        searchPlaceholder={searchPlaceholder} //搜索框placeholder
                        notFoundContent={notFoundContent} //当没有相关内容的显示内容
                        // body={body}
                        // footer={footer}
                        prefixCls={`${prefixCls}-list`}
                        showCheckbox={checkable}
                        draggable={false}
                        id={'2'}
                        // pagination={false}
                        lazyLoad={lazyLoad}
                        fieldid={getSysFieldid('right_area')}
                        desc={json['container-transfer-selected']}

                        // 数据变化了
                        dataSourceChange={(dataSource, checkedKeys, direction) => {
                            let targetKeys = dataSource.map(i => i.key);
                            let keys = this.props.checkable ? 'listCheckedKeys' : 'listSelectedKeys';
                            this.setState({ [keys]: checkedKeys });
                            this.props.onTargetKeysChange && this.props.onTargetKeysChange(targetKeys);
                        }}
                        operations={operations}
                        // disabled={disabled}
                        langJson={json}
                        renderOperation={renderOperation}
                        showMoveBtn={showMoveBtn}
                        lazy = {{container:"modal"}}
                        // 双击
                        // onDoubleClick={(item, event) => {
                        //     this.moveItemToDirection('left', item.key);
                        // }}
                        // shift 选中
                        handleShiftSelect={(selectedItems, checked) => this.handleShiftSelect(selectedItems)}
                    />

                </DragDropContext>
            </div>


        );
    }
}


TreeToListTransfer.propTypes = {
    // style: PropTypes.object, //没用到
    showSearch: PropTypes.bool,
    showListSearch: PropTypes.bool, // 右侧列表搜索框
    showMoveBtn: PropTypes.bool,
    checkable: PropTypes.bool,
    titles: PropTypes.array,
    // treeLoading: PropTypes.bool, //没用到
    className: PropTypes.string,
    rowKey: PropTypes.string,
    rowTitle: PropTypes.string,
    rowChildren: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    notFoundContent: PropTypes.string,
    operations: PropTypes.array,
    dataSource: PropTypes.array,
    targetKeys: PropTypes.array,
    listRender: PropTypes.func,
    onTargetKeysChange: PropTypes.func, //目标变化的回调
    onLoadData: PropTypes.func,//异步加载数据
    onTreeSearch: PropTypes.func,//异步加载数据的搜索
    disable: PropTypes.bool,//禁用所有功能
    checkStrictly: PropTypes.bool,
    disabledNodeKeys: PropTypes.array,
    selectedValue: PropTypes.string
};
TreeToListTransfer.defaultProps = {
    showSearch: true,
    showListSearch: true,
    showMoveBtn: true,
    checkable: true,//true:自动包含下级，有全选，半选，全消；false：仅本级，没有全选，半选，全消
    disable: false,
    // titles: ['来源', '目标'],
    operations: ['', '', '', '', '', '', '', ''],
    rowKey: 'key',
    rowTitle: 'title',
    rowChildren: 'children',
    dataSource: [],
    targetKeys: [],
    treeLoading: false,
    // searchPlaceholder: '提示词', // 搜索框的提示文字
    // notFoundContent: '暂无数据', // 列表为空时显示的内容
    listRender: ({ title }) => title, // 列表渲染的字段内容
    renderOperation: () => '',//自定义操作,
    checkStrictly:true, // checkStrictly为true和selectedValue要一起用
    disabledNodeKeys:[],
    selectedValue : 'getCurrent',
};

export default TreeToListTransfer;
