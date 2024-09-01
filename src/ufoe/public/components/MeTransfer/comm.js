/**
 * Todo
 * 异步树处理
 * 搜索点击 X 号清除搜索数据
 * 勾选相邻的实现排序
 * 带着子级穿梭
 */

/**
 * 逻辑说明：
 * props.checkable 为 true 时，树带复选框，只有叶子节点可以穿梭到右边，勾选复选框选中实现穿梭；
 * props.checkable 为 false 时，树不带复选框，所有节点都可以穿梭到右边，通过点击树节点选中实现穿梭
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Tree , FormControl, Checkbox, Alert} from 'tinper-bee';
let {getMultiLang,getSysFieldid} = $nccPlatform
import classNames from 'classnames';
import difference from 'lodash/difference';
import { hasUnLoadNode, toggle } from './methods';
// import { getMultiLang, getSysFieldid } from '@platform/api';

// require('./index.less');

const TreeNode = Tree.TreeNode;
export default class TreeToListTransfer extends Component {
    constructor(props) {
        super(props);
        const { treeNode, listData, leafKeys, treeData } = this.generate(props);
        let treeCheckedKeys = [];
        let treeSelectedKeys = [];
        let targetKeys = listData.map(({ key }) => key);
        props.checkable ? (treeCheckedKeys = targetKeys) : (treeSelectedKeys = targetKeys);
        this.state = {
            treeNode, // 树的树型数据
            treeData, // 树所有的扁平数据
            listData, // 列表的扁平数据
            leafKeys, // 树的叶子节点的 key 集合
            treeCheckedKeys, // 树复选框选中的 key 集合
            treeSelectedKeys, // 树节点选中的 key 集合
            treeExpandedKeys: treeCheckedKeys, // 树展开的节点的 key集合
            treeAutoExpandParent: true, // 自动展开父节点 初始为true 有展开操作的时候为false
            listCheckedKeys: [], // 目标框列表勾选中的 key 集合
            listSelectedKeys: [], // 目标框列表点击选中的 key 集合
            treeSearchKey: '', // 树的搜索关键词
            listSearchKey: '', // 列表的搜索关键词
            unLoadAlert: false, // 异步加载提示显示状态
            upDisabled: true, // 上移禁用状态
            downDisabled: true, //下移禁用状态
            // 多语
            LangData: null,
            json: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        const { treeNode, listData, leafKeys, expandedKeys } = this.generate(nextProps, this.state);
        const keys = this.props.checkable ? 'treeCheckedKeys' : 'treeSelectedKeys'; // 根据 checkable 来决定是修改树的 checked 还是 selected keys 的值；
        const selected = listData.map(({ key }) => key);
        const { treeSearchKey, treeExpandedKeys } = this.state;
        const searching = !!(nextProps.showSearch && treeSearchKey && treeSearchKey.length > 0);
        this.setState(
            {
                treeNode,
                listData,
                leafKeys,
                [keys]: selected,
                treeExpandedKeys: searching ? [...new Set([...[keys], ...expandedKeys])] : treeExpandedKeys,
                treeAutoExpandParent: searching, // 搜索的时候 自动展开父节点设为true
            },
            () => this.changeDisabled(nextProps.targetKeys),
        );
    }
    componentWillMount() {
        // 初始化调用getPlatformLang方法获取多语
        let callback = (json, bool, LangData) => {
            this.setState({ json, LangData }, () => {
                //  在这里进行之前组件willMount的操作，比如加载缓存之类的
            })
        }
        getMultiLang({ moduleId: 'container_transfer', callback }) // moduleId为所需加载json文件夹名称前缀
    }
	// 根据传进来的 props 数据生成本页面需要的各种数据
	generate = (props, state = {}) => {
	    const { dataSource, targetKeys, rowKey, rowTitle, rowChildren, showSearch, showListSearch, listRender } = props;
	    const { treeSearchKey } = state;
	    const leafKeys = []; // 叶子节点 key 的集合
	    const listData = []; // 列表数据
	    const expandedKeys = []; // 搜索时 展开的节点
	    const leafNodes = []; // 叶子节点集合
	    const treeData = []; // 所有节点集合
	    // title 前icon 通过 jsx  HTML和content
	    const getIcon = el => {
	        return <span><i className="iconfont"></i>{el}</span>
	    }
	    const loop = data =>
	        data.map(item => {
	            const { [rowChildren]: children, [rowKey]: key, [rowTitle]: title, ...otherProps } = item;
	            treeData.push({ key, title });
	            if (Object.prototype.toString.call(children) !== '[object Array]') {
	                leafKeys.push(key);
	                let nodeTitle = listRender(item);
	                if (showSearch && treeSearchKey && treeSearchKey.length > 0) {
	                    // if tree searching
	                    if (title.indexOf(treeSearchKey) > -1) {
	                        expandedKeys.push(key);
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
	                leafNodes.push({ key, title: nodeTitle });
	                return <TreeNode className='node-item' key={key} title={getIcon(nodeTitle)} disableCheckbox={this.props.disable} isLeaf {...otherProps} />;
	            } else {
	                return (
	                    <TreeNode className='node-item' key={key} title={getIcon(listRender(item))} disableCheckbox={this.props.disable} {...otherProps}>
	                        {loop(item.children)}
	                    </TreeNode>
	                );
	            }
	        });

	    let treeNode = loop(dataSource);
	    targetKeys.map(key => {
	        let listItem = treeData.find(cur => cur.key == key);
	        listItem && listData.push(listItem);
	    });
	    return {
	        treeNode,
	        leafKeys,
	        listData,
	        expandedKeys,
	        treeData,
	    };
	};

	// 左边树勾选选中
	onTreeCheck = (checkedKeys, e) => {
	    let checked = typeof e === 'object' ? e.checked : e;
	    if (checked) {
	        if (this.props.onLoadData && hasUnLoadNode([e.node])) {
	            this.setState({ unLoadAlert: true });
	        } else {
	            this.setState({
	                treeCheckedKeys: checkedKeys.filter(key => this.state.leafKeys.indexOf(key) > -1),
	                unLoadAlert: false,
	            });
	        }
	    } else {
	        this.setState({
	            treeCheckedKeys: checkedKeys.filter(key => this.state.leafKeys.indexOf(key) > -1),
	            unLoadAlert: false,
	        });
	    }
	};

	// 右边列表的勾选选中
	onListCheck = (value, checkedKeys) => {
	    let keys = this.props.checkable ? 'listCheckedKeys' : 'listSelectedKeys';
	    if (value) {
	        this.setState(
	            { [keys]: [...new Set([...this.state[keys], ...checkedKeys])] },
	            this.changeDisabled,
	        );
	    } else {
	        this.setState(
	            { [keys]: this.state[keys].filter(key => checkedKeys.indexOf(key) < 0) },
	            this.changeDisabled,
	        );
	    }
	};

	// 左边树点击选中
	onTreeSelect = (treeSelectedKeys, info) => {
        console.log($appRoot.state.json['public_lang-000104'],treeSelectedKeys, info);/* 国际化处理： 左边树点击选中*/
	    if (this.props.checkable) return false; // 如果有复选框，就不能点击选中树节点
	    this.setState({ treeSelectedKeys });
	};

	// 右边列表点击选中
	onListSelect = key => {
	    // console.log('点击列表项 ', key);
	    let keys = this.props.checkable ? 'listCheckedKeys' : 'listSelectedKeys';
	    this.setState(
	        { [keys]: toggle(this.state[keys], key) },
	        this.changeDisabled,
	    );
	};

	// 搜索左边树
	onTreeSearch = value => {
	    this.setState(
	        { treeSearchKey: value },
	        () => {
	            if (this.props.onLoadData && this.props.onTreeSearch) {
	                // async search
	                this.props.onTreeSearch(value);
	            } else {
	                const { treeNode, listData, leafKeys, expandedKeys } = this.generate(this.props, this.state);
	                const treeCheckedKeys = listData.map(({ key }) => key);
	                this.setState({
	                    treeNode,
	                    listData,
	                    leafKeys,
	                    treeCheckedKeys,
	                    treeExpandedKeys: [...new Set([...treeCheckedKeys, ...expandedKeys])],
	                    treeAutoExpandParent: true, // 搜索的时候 自动展开父节点设为true
	                });
	            }
	        },
	    );
	};

	// 搜索右边列表
	onListSearch = value => {
	    this.setState({ listSearchKey: value });
	};

	// 上移下移和置顶置底按钮禁用状态切换
	// 上移下移和置顶置底按钮禁用状态切换
	changeDisabled = (targetKeys = this.props.targetKeys) => {
	    // 找到选中的targetSelectedKeys中每一项在targetKeys 对应的索引,组成indexAry
	    // 对indexAry从小到大排序, 如果相邻两项的差都为1, 说明选中的是连续的节点, 否则不不连续
	    let { listCheckedKeys, listSelectedKeys } = this.state;
	    let keysAry = this.props.checkable ? listCheckedKeys : listSelectedKeys;

	    let indexAry = keysAry.map(item => targetKeys.indexOf(item)).sort((a, b) => a - b);
	    let continuous = () => {
	        if (indexAry.length > 1) {
	            for (let i = 0; i < indexAry.length - 1; i++) {
	                if (indexAry[i + 1] - indexAry[i] != 1) {
	                    return false;
	                }
	            }
	        } else if (indexAry.length == 0) {
	            return false;
	        }
	        return true;
	    };

	    let continuousFlag = continuous();
	    if (continuousFlag) {
	        // 选中的是连续的
	        // 选中的包含了目标框中的第一个元素，不能上移
	        if (indexAry[0] === 0) {
	            this.setState({ upDisabled: true });
	        } else {
	            this.setState({ upDisabled: false });
	        }
	        // 选中的包含了目标框中的最后一个元素，不能下移
	        if (indexAry[indexAry.length - 1] === targetKeys.length - 1) {
	            this.setState({ downDisabled: true });
	        } else {
	            this.setState({ downDisabled: false });
	        }
	    } else {
	        this.setState({
	            upDisabled: true,
	            downDisabled: true,
	        });
	    }
	};
	// 点击上移和下移按钮
	handleMove = direction => {
	    let { targetKeys, checkable } = this.props;
	    let { listCheckedKeys, listSelectedKeys } = this.state;
	    let temp = JSON.parse(JSON.stringify(targetKeys));
	    let keysAry = checkable ? listCheckedKeys : listSelectedKeys;
	    let indexAry = keysAry.map(item => targetKeys.indexOf(item)).sort((a, b) => a - b);
	    let before = targetKeys.slice(0, indexAry[0]);
	    let selected = keysAry;
	    let after = targetKeys.slice(indexAry[indexAry.length - 1] + 1, targetKeys.length);
	    switch (direction) {
	        case 'up':
	            if (before.length > 0) {
	                let lastBeforeItem = before[before.length - 1];
	                before.splice(before.length - 1, 1);
	                temp = [...before, ...selected, lastBeforeItem, ...after];
	            }
	            break;
	        case 'down':
	            if (after.length > 0) {
	                let firstAfterItem = after[0];
	                after.splice(0, 1);
	                temp = [...before, firstAfterItem, ...selected, ...after];
	            }
	            break;
	        case 'top':
	            temp = [...selected, ...before, ...after];
	            break;
	        case 'bottom':
	            temp = [...before, ...after, ...selected];
	            break;
	        default:
	            break;
	    }
	    this.props.onTargetKeysChange(temp);
	    this.getRightSelectEle();
	    this.changeDisabled(temp);
	};
	// 获取右侧第一个选中的元素 input聚焦 滚动到视口区域
	getRightSelectEle = () => {
	    let el = document.querySelector('li.u-transfer-list-content-item > label.is-checked > input[type="checkbox"]')
	    setTimeout(() => {
	        el && el.focus()
	    }, 20)
	}
	render() {
	    let {
	        className,
	        treeLoading,
	        titles,
	        showSearch,
	        showListSearch,
	        onLoadData,
	        operations,
	        searchPlaceholder,
	        notFoundContent,
	        showMoveBtn,
	        style,
	        checkable,
	        disable,
	    } = this.props;
	    titles = titles || [$appRoot.state.json['public_lang-000105'], $appRoot.state.json['public_lang-000105']]/* 国际化处理： 测试,测试*/
	    notFoundContent = notFoundContent || $appRoot.state.json['public_lang-000105']/* 国际化处理： 测试*/
	    searchPlaceholder = searchPlaceholder || $appRoot.state.json['public_lang-000105']/* 国际化处理： 测试*/
	    let [sourceTitle, targetTitle] = titles;
	    const {
	        treeNode,
	        treeData,
	        listData,
	        leafKeys,
	        treeCheckedKeys,
	        treeSelectedKeys,
	        listCheckedKeys,
	        listSelectedKeys,
	        treeExpandedKeys,
	        treeAutoExpandParent,
	        listSearchKey,
	        unLoadAlert,
	        upDisabled,
	        downDisabled,
	    } = this.state;

	    let leftTemp = checkable ? treeCheckedKeys : treeSelectedKeys; // 左边选中的 key 集合
	    let validTreeNum = checkable ? leafKeys.length : treeData.length; // 树中可以穿梭到列表中有效的数据的总数
	    let rightTemp = checkable ? listCheckedKeys : listSelectedKeys; // 右边选中的 key 集合

	    const treeTransferClass = classNames({
	        'transfer-wrap': true,
	        [className]: !!className, // 接收传进来的 class 名
	    });
	    const treeTransferlistBodyClass = classNames({
	        'u-transfer-list-body': true,
	        'u-transfer-list-body-with-search': showSearch,
	    });
	    const treeTransferlistBodyClassRight = classNames({
	        'u-transfer-list-body': true,
	        'u-transfer-list-body-with-search': showListSearch,
	    });
	    const openIcon = <Icon type="uf-reduce-s-o" />
	    const closeIcon = <Icon type="uf-add-s-o" />
	    const treeProps = {
	        checkable,
	        multiple: !checkable,
	        showLine: false,
	        checkedKeys: treeCheckedKeys,
	        selectedKeys: treeSelectedKeys,
	        onSelect: this.onTreeSelect,
	        onCheck: this.onTreeCheck,
	        expandedKeys: treeExpandedKeys,
	        autoExpandParent: treeAutoExpandParent,
	        onExpand: expandedKeys => {
	            this.setState({
	                treeAutoExpandParent: false,
	                treeExpandedKeys: expandedKeys,
	            });
	        },
	        loadData: onLoadData,
	        openIcon,
	        closeIcon,
	    };

	    const sourceHeaderCheckProps = {
	        checked: treeCheckedKeys.length > 0 && treeCheckedKeys.length === leafKeys.length,
	        indeterminate: treeCheckedKeys.length > 0 && treeCheckedKeys.length < leafKeys.length,
	        onChange: value => {
	            let checkedKeys = value ? leafKeys : [];
	            this.onTreeCheck(checkedKeys, value);
	        },
	    };

	    let keys = checkable ? 'listCheckedKeys' : 'listSelectedKeys';
	    const listHeaderCheckProps = {
	        checked: this.state[keys].length > 0 && this.state[keys].length === listData.length,
	        indeterminate: this.state[keys].length > 0 && this.state[keys].length < listData.length,
	        onChange: value => this.onListCheck(value, listData.map(({ key }) => key)),
	    };

	    const operaRightButtonProps = {
	        className: 'btn-primary',
	        size: 'sm',
	        disabled:
				difference(leftTemp, listData.map(({ key }) => key)).length === 0 &&
				difference(listData.map(({ key }) => key), leftTemp).length === 0,
	        onClick: () => {
	            this.setState({ unLoadAlert: false });
	            this.props.onTargetKeysChange && this.props.onTargetKeysChange(leftTemp);
	        },
	    };

	    const operaLeftButtonProps = {
	        className: 'btn-primary',
	        size: 'sm',
	        disabled: rightTemp.length === 0,
	        onClick: () => {
	            this.setState({
	                listCheckedKeys: [],
	                listSelectedKeys: [],
	                unLoadAlert: false,
	            });
	            let restTargetKeys = this.state.listData
	                .map(({ key }) => key)
	                .filter(key => rightTemp.indexOf(key) < 0); //剩下的目标项
	            this.props.onTargetKeysChange && this.props.onTargetKeysChange(restTargetKeys);
	        },
	    };
	    // all to right
	    const operaAllRightButtonProps = {
	        className: 'btn-primary',
	        size: 'sm',
	        disabled: disable || false,
	        onClick: () => {
	            this.setState({ unLoadAlert: false })
	            this.props.onTargetKeysChange && this.props.onTargetKeysChange(leafKeys, 'allToRight');
	        },
	    }
	    // all to left
	    const operaAllLeftButtonProps = {
	        className: 'btn-primary',
	        size: 'sm',
	        disabled: this.state.listData.length === 0,
	        onClick: () => {
	            this.setState({
	                listCheckedKeys: [],
	                listSelectedKeys: [],
	                unLoadAlert: false,
	            });
	            this.props.onTargetKeysChange && this.props.onTargetKeysChange([], 'allToLeft');
	        },
	    }
	    return (
	        <div className={treeTransferClass}>
	            <div className="u-transfer" fieldid={getSysFieldid('transfer_area')}>
	                <div className="u-transfer-list u-transfer-list-left" fieldid={getSysFieldid('left_area')}>
	                    <div className="u-transfer-list-header">
	                        {checkable && <Checkbox disabled={disable} {...sourceHeaderCheckProps} />}
	                        <span className="u-transfer-list-header-selected">
	                            {`${leftTemp.length > 0 ? `${leftTemp.length}/` : ''}${validTreeNum} `}
	                            {$appRoot.state.json['public_lang-000105']}{/* 国际化处理： 测试*/}
	                        </span>
	                        <span className="u-transfer-list-header-title">{sourceTitle}</span>
	                    </div>
	                    <div className={treeTransferlistBodyClass}>
	                        {showSearch ? (
	                            <div className="u-transfer-list-body-search-wrapper">
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
	                                <Alert dark onDismiss={() => this.setState({ unLoadAlert: false })} closeLabel={$appRoot.state.json['public_lang-000106']}>{/* 国际化处理： 关闭*/}
										{$appRoot.state.json['public_lang-000107']}{/* 国际化处理： 无法选中，原因：子节点未完全加载*/}
	                                </Alert>
	                            </div>
	                        ) : null}
	                        <div className="u-transfer-list-content">
	                            <Tree {...treeProps}>{treeNode}</Tree>
	                        </div>
	                        {this.props.dataSource.length === 0 && (
	                            <div style={{ display: 'block' }} className="u-transfer-list-body-not-found">
	                                {notFoundContent}
	                            </div>
	                        )}
	                        {/* <Loadingstate show={treeLoading} colors="info">
						</Loadingstate> */}
	                    </div>
	                </div>
	                <div className="u-transfer-operation">
	                    <Button {...operaRightButtonProps}>
	                        <span>
	                            {operations[0]}
	                            <Icon className="uf uf-arrow-right" />
	                        </span>
	                    </Button>
	                    <Button {...operaAllRightButtonProps}>
	                        <span>
	                            <Icon className="uf uf-2arrow-right"></Icon>
	                        </span>
	                    </Button>
	                    <Button {...operaAllLeftButtonProps}>
	                        <span>
	                            <Icon className="uf uf-2arrow-left"></Icon>
	                        </span>
	                    </Button>
	                    <Button {...operaLeftButtonProps}>
	                        <span>
	                            <Icon className="uf uf-arrow-left" />
	                            {operations[1]}
	                        </span>
	                    </Button>
	                </div>
	                <div className="u-transfer-list u-transfer-list-right" fieldid={getSysFieldid('right_area')}>
	                    <div className="u-transfer-list-header">
	                        <Checkbox {...listHeaderCheckProps} />
	                        <span className="u-transfer-list-header-select">
	                            {`${rightTemp.length > 0 ? `${rightTemp.length}/` : ''}${listData.length} `}
	                            {$appRoot.state.json['public_lang-000105']}{/* 国际化处理： 测试*/}
	                        </span>
	                        <span className="u-transfer-list-header-title">{targetTitle}</span>
	                    </div>
	                    <div className={treeTransferlistBodyClassRight}>
	                        {showListSearch ? (
	                            <div className="u-transfer-list-body-search-wrapper">
	                                <FormControl
	                                    type="search"
	                                    placeholder={searchPlaceholder}
	                                    onChange={this.onListSearch}
	                                    value={this.state.listSearchKey}
	                                />
	                            </div>
	                        ) : null}
	                        <ul className="u-transfer-list-content">
	                            {listData.map(item => (
	                                <li
	                                    className={
	                                        listSelectedKeys.indexOf(item.key) == -1 ? (
	                                            'u-transfer-list-content-item'
	                                        ) : (
	                                            'u-transfer-list-content-item u-transfer-list-content-item-selected'
	                                        )
	                                    }
	                                    key={item.key}
	                                    title={item.title}
	                                    onClick={() => this.onListSelect(item.key)}
	                                >
	                                    {checkable && (
	                                        <Checkbox
	                                            checked={listCheckedKeys.indexOf(item.key) > -1}
	                                            onChange={value => this.onListCheck(value, [item.key])}
	                                        />
	                                    )}
	                                    {showSearch &&
											listSearchKey &&
											listSearchKey.length > 0 &&
											item.title.indexOf(listSearchKey) > -1 ? (
	                                            <span>
	                                                {item.title.substr(0, item.title.indexOf(listSearchKey))}
	                                                <span style={{ color: '#f50' }}>{listSearchKey}</span>
	                                                {item.title.substr(
	                                                    item.title.indexOf(listSearchKey) + listSearchKey.length,
	                                                )}
	                                            </span>
	                                        ) : (
	                                            <span>{item.title}</span>
	                                        )}
	                                </li>
	                            ))}
	                            {listData.length === 0 && (
	                                <div style={{ display: 'block' }} className="u-transfer-list-body-not-found">
	                                    {notFoundContent}
	                                </div>
	                            )}
	                        </ul>
	                    </div>
	                </div>
	            </div>
	            {showMoveBtn && (
	                <div className="move-btns">
	                    <Button
	                        className="move-btn move-up"
	                        disabled={upDisabled}
	                        onClick={() => this.handleMove('up')}
	                    >
	                        <Icon type="uf uf-arrow-up"></Icon>
	                    </Button>
	                    <Button
	                        className="move-btn move-down"
	                        disabled={downDisabled}
	                        onClick={() => this.handleMove('down')}
	                    >
	                        <Icon type="uf uf-arrow-down"></Icon>
	                    </Button>
	                    <Button
	                        className="move-btn move-top"
	                        disabled={upDisabled}
	                        onClick={() => this.handleMove('top')}
	                    >
	                        <Icon type="uf uf-2arrow-up"></Icon>
	                    </Button>
	                    <Button
	                        className="move-btn move-bottom"
	                        disabled={downDisabled}
	                        onClick={() => this.handleMove('bottom')}
	                    >
	                        <Icon type="uf uf-2arrow-down"></Icon>
	                    </Button>
	                </div>
	            )}
	            {this.props.children}
	        </div>
	    );
	}
}

TreeToListTransfer.propTypes = {
    style: PropTypes.object,
    showSearch: PropTypes.bool,
    showListSearch: PropTypes.bool, // 右侧列表搜索框
    showMoveBtn: PropTypes.bool,
    checkable: PropTypes.bool,
    // titles: PropTypes.array,
    treeLoading: PropTypes.bool,
    className: PropTypes.string,
    rowKey: PropTypes.string,
    rowTitle: PropTypes.string,
    rowChildren: PropTypes.string,
    // searchPlaceholder: PropTypes.string,
    // notFoundContent: PropTypes.string,
    operations: PropTypes.array,
    dataSource: PropTypes.array,
    targetKeys: PropTypes.array,
    listRender: PropTypes.func,
    onTargetKeysChange: PropTypes.func,
    onLoadData: PropTypes.func,
    onTreeSearch: PropTypes.func,
    disable: PropTypes.bool,
};
TreeToListTransfer.defaultProps = {
    // 显示tree search
    showSearch: true,
    showListSearch: false,
    showMoveBtn: false,
    checkable: true,
    disable: false,
    // titles: [ '来源', '目标' ],
    operations: ['', ''],
    rowKey: 'key',
    rowTitle: 'title',
    rowChildren: 'children',
    dataSource: [],
    targetKeys: [],
    treeLoading: false,
    // searchPlaceholder: '提示词', // 搜索框的提示文字
    // notFoundContent: '暂无数据', // 列表为空时显示的内容
    listRender: ({ title }) => title, // 列表渲染的字段内容
};
