/*
 * @Author: bbqin
 * @Date: 2021-07-09 13:52:24
 * @LastEditTime: 2022-04-24 14:26:38
 * @LastEditors: Please set LastEditors
 * @Description: 表表、继承至transfer
 * @FilePath: \Platform_Front\src\platform\components\Transfer\listToList.js
 * 这锅我不背
 */
import React, { Component } from 'react';
import List from './list';
import classNames from 'classnames';
import MoveButton from './moveButton';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import {getMultiLang, getSysFieldid} from 'nc-lightapp-front'
// import './index.less';
/**
 * a little function to help us with reordering the result
 * @param {*} list 
 * @param {*} targetKeys
 * @param {*} startIndex 
 * @param {*} endIndex 
 */
const reorder = (list, targetKeys, startIndex, endIndex) => {
    const result1 = Array.from(list);
    const [removed1] = result1.splice(startIndex, 1);
    result1.splice(endIndex, 0, removed1);

    const result2 = Array.from(targetKeys);
    const [removed2] = result2.splice(startIndex, 1);
    result2.splice(endIndex, 0, removed2);

    let result = {};
    result.dataArr = result1;
    result.targetKeyArr = result2;

    return result;
};

/**
 * Moves an item from one list to another list.
 * @param {*} source 
 * @param {*} destination 
 * @param {*} droppableSource 
 * @param {*} droppableDestination 
 * @param {*} targetKeys
 */
const move = (source, destination, droppableSource, droppableDestination, targetKeys) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);
    targetKeys.splice(droppableDestination.index, 0, removed.key);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    result.newTargetKeys = targetKeys;
    return result;
};
function noop() {
}

const defaultProps = {
    dataSource: [],
    // render: noop,
    showSearch: true,
    searchPlaceholder: '',
    notFoundContent: '',
    showCheckbox: true,
    draggable: false,
    appendToBottom: true,
    renderOperation: () => '',//自定义操作,
    pagination: false,
    // 全部移动时 那些不能移动
    allMoveFilter: item => !item.disabled,
};

const propTypes = {
    prefixCls: PropTypes.string,
    dataSource: PropTypes.array,
    render: PropTypes.func,
    targetKeys: PropTypes.array,
    onTargetKeysChange: PropTypes.func,
    height: PropTypes.number,
    listStyle: PropTypes.object,
    className: PropTypes.string,
    titles: PropTypes.array,
    operations: PropTypes.array,
    showSearch: PropTypes.bool,
    filterOption: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    notFoundContent: PropTypes.node,
    body: PropTypes.func,
    footer: PropTypes.func,
    rowKey: PropTypes.func,
    lazy: PropTypes.object,
    showCheckbox: PropTypes.bool,
    draggable: PropTypes.bool,
    appendToBottom: PropTypes.bool,
    renderOperation: PropTypes.func,
    pagination: PropTypes.bool,
    allMoveFilter: PropTypes.func,
};

const defaultTitles = ['', ''];

export class ListToListTransfer extends Component {
    constructor(props) {
        super(props);
        const { selectedKeys = [], targetKeys = [] } = props;
        this.state = {
            leftFilter: '',
            rightFilter: '',
            sourceSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) === -1),
            targetSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) > -1),
            leftDataSource: [],
            rightDataSource: [],
            droppableId: '',
            draggingItemId: '',

            // 多语
            langJson: {},
            // 按钮组禁用状态
            disabled: {},
        };
        this.cacheTargetKeys = [...targetKeys];
        this.rightFilteredDataSourceKeys = [];
        this.leftFilteredDataSourceKeys = [];
    }

    componentWillMount() {
        // 初始化调用getPlatformLang方法获取多语
        let callback = (json, bool, langObj) => {
            this.setState({ langJson: json }, () => {
                //  在这里进行之前组件willMount的操作，比如加载缓存之类的
            })
        }
        getMultiLang({ moduleId: 'container_transfer', callback }) // moduleId为所需加载json文件夹名称前缀
    }

    componentDidMount() {
        this.splitDataSource();
    }

    componentWillReceiveProps(nextProps) {
        const { sourceSelectedKeys, targetSelectedKeys } = this.state;
        if (nextProps.targetKeys !== this.props.targetKeys ||
            nextProps.dataSource !== this.props.dataSource ||
            nextProps.targetKeys !== this.cacheTargetKeys) {
            // clear cached splited dataSource
            this.splitedDataSource = null;

            const { dataSource, targetKeys = [] } = nextProps;
            function existInDateSourcekey(key) {
                return dataSource.filter(item => item.key === key).length;
            }
            // clear key nolonger existed
            // clear checkedKeys according to targetKeys
            this.setState({
                sourceSelectedKeys: sourceSelectedKeys.filter(existInDateSourcekey)
                    .filter(data => targetKeys.filter(key => key === data).length === 0),
                targetSelectedKeys: targetSelectedKeys.filter(existInDateSourcekey)
                    .filter(data => targetKeys.filter(key => key === data).length > 0),
            });
            //异步加载时 || 动态改变targetKeys时
            if (this.props.dataSource.length === 0 || !this.props.draggable) {
                this.splitDataSource(targetKeys, dataSource);
            }
        }
        if (nextProps.selectedKeys) {
            const targetKeys = nextProps.targetKeys;
            this.setState({
                sourceSelectedKeys: nextProps.selectedKeys.filter(key => targetKeys.indexOf(key) === -1),
                targetSelectedKeys: nextProps.selectedKeys.filter(key => targetKeys.indexOf(key) > -1),
            });
        }
    }

    /**
     * 给dataSource里的数据值指定唯一 key 值
     */
    addUniqueKey = (dataSource) => {
        const { rowKey } = this.props;
        if (rowKey) {
            if (typeof rowKey === 'string') {
                dataSource.forEach(record => {
                    record.key = record[rowKey];
                });
            } else {
                dataSource.forEach(record => {
                    record.key = rowKey(record);
                });
            }
        }
        return dataSource;
    }

    /**
     * 从源dataSource中分离出leftDataSource和rightDataSource（点击按钮穿梭时调用）
     * @param {*} newTargetKeys 更新后的targetKeys
     * @param {*} newDataSource 异步加载数据源时，从nextProps中获取的dataSource
     */
    splitDataSource(newTargetKeys, newDataSource) {
        // targetKeys：展示在右边列表的数据集
        if (this.splitedDataSource) {
            return this.splitedDataSource;
        }

        let targetKeys = newTargetKeys || this.props.targetKeys;
        //异步加载数据源时/移除已选时
        let dataSource = newDataSource || this.props.dataSource;

        dataSource = this.addUniqueKey(dataSource);
        this.allSourceKeys = dataSource.map(({ key }) => key);

        const leftDataSource = dataSource.filter(({ key }) => targetKeys.indexOf(key) === -1);
        // const rightDataSource = dataSource.filter(({key}) => targetKeys.indexOf(key) > -1);
        // 右侧数据源根据传入的targetKeys进行排序
        let rightDataSource = [];
        let tempIndex = -1;
        targetKeys.forEach((key) => {
            tempIndex = this.allSourceKeys.indexOf(key);
            dataSource[tempIndex] && rightDataSource.push(dataSource[tempIndex]);
        })

        this.splitedDataSource = {
            leftDataSource,
            rightDataSource,
        };
        this.setState({
            leftDataSource,
            rightDataSource,
        })

        return this.splitedDataSource;
    }

    /**
     * 从自定义顺序的dataSource中分离出leftDataSource和rightDataSource（拖拽场景调用）
     * @param {*} newTargetKeys 更新后的targetKeys
     * @param {*} newDataSource 通过 leftDataSource.concat(rightDataSource) 得到的newDataSource
     */
    splitDataSource2(newTargetKeys, newDataSource) {
        // targetKeys：展示在右边列表的数据集
        if (this.splitedDataSource) {
            return this.splitedDataSource;
        }

        let targetKeys = newTargetKeys || this.props.targetKeys;
        //异步加载数据源时/移除已选时
        let sourceDataSource = this.props.dataSource;
        newDataSource = this.addUniqueKey(newDataSource);
        sourceDataSource = this.addUniqueKey(sourceDataSource);
        const leftDataSource = sourceDataSource.filter(({ key }) => targetKeys.indexOf(key) === -1);
        const rightDataSource = targetKeys.map(key => {
            return newDataSource.find(data => data.key === key)
        })
        this.splitedDataSource = {
            leftDataSource,
            rightDataSource,
        };
        this.setState({
            leftDataSource,
            rightDataSource,
        })

        return this.splitedDataSource;
    }

    moveTo = ({ direction, insertIndex, moveKeys }) => {
        const { targetKeys = [], onTargetKeysChange, appendToBottom = true } = this.props;
        let { sourceSelectedKeys, targetSelectedKeys, leftDataSource, rightDataSource, droppableId } = this.state;

        // 处理下selected中被移除的项
        let newSourceSelectedKeys = [],
            newTargetSelectedKeys = [];
        if (direction === 'right') {
            sourceSelectedKeys.forEach(item => {
                // 未被移动的
                if (moveKeys.indexOf(item) === -1) {
                    newSourceSelectedKeys.push(item);
                }
            });
        } else {
            targetSelectedKeys.forEach(item => {
                // 未被移动的
                if (moveKeys.indexOf(item) === -1) {
                    newTargetSelectedKeys.push(item);
                }
            });
        }

        let temp = [];
        if (appendToBottom) {
            temp = targetKeys.concat(moveKeys);
        } else if (insertIndex) {
            targetKeys.splice(insertIndex, 0, ...moveKeys);
            temp = targetKeys;
        } else {
            temp = moveKeys.concat(targetKeys);
        }
        // move items to target box
        const newTargetKeys = direction === 'right' ? temp : targetKeys.filter(targetKey => moveKeys.indexOf(targetKey) === -1);

        // empty checked keys
        const oppositeDirection = direction === 'right' ? 'left' : 'right';
        this.setState(oppositeDirection === 'left' ? {
            sourceSelectedKeys: newSourceSelectedKeys,
        } : {
            targetSelectedKeys: newTargetSelectedKeys,
        });
        this.handleSelectChange(oppositeDirection, []);

        // 变化事件
        if (onTargetKeysChange) {
            onTargetKeysChange(newTargetKeys, direction, moveKeys);
        }
        // 区分拖拽穿梭还是点击穿梭
        let newDataSource = leftDataSource.concat(rightDataSource);
        this.splitedDataSource = null; // 重新计算dataSource
        droppableId ? this.splitDataSource2(newTargetKeys, newDataSource) : this.splitDataSource(newTargetKeys);
    }

    moveToLeft = () => {
        const { targetKeys = [] } = this.props;
        const { sourceSelectedKeys, targetSelectedKeys, leftDataSource, rightDataSource } = this.state;

        this.moveTo({
            direction: 'left',
            // insertIndex,
            moveKeys: targetSelectedKeys,
        });
    }
    moveToRight = () => {
        const { targetKeys = [] } = this.props;
        const { sourceSelectedKeys, targetSelectedKeys, leftDataSource, rightDataSource } = this.state;

        this.moveTo({
            direction: 'right',
            // insertIndex,
            moveKeys: sourceSelectedKeys,
        });
    }
    moveAllToLeft = () => {
        const { targetKeys = [], allMoveFilter } = this.props;
        let { sourceSelectedKeys, targetSelectedKeys, leftDataSource, rightDataSource = [], rightFilter } = this.state;
        if (allMoveFilter) {
            rightDataSource = rightDataSource.filter(allMoveFilter);
        }
        const moveKeys = rightFilter ? this.rightFilteredDataSourceKeys : rightDataSource.map(item => item.key)
        this.moveTo({
            direction: 'left',
            // insertIndex,
            moveKeys: moveKeys,
        });
    }
    moveAllToRight = () => {
        const { targetKeys = [], allMoveFilter } = this.props;
        let { sourceSelectedKeys, targetSelectedKeys, leftDataSource = [], rightDataSource, leftFilter } = this.state;
        if (allMoveFilter) {
            leftDataSource = leftDataSource.filter(allMoveFilter);
        }
        const moveKeys = leftFilter ? this.leftFilteredDataSourceKeys : leftDataSource.map(item => item.key)
        this.moveTo({
            direction: 'right',
            // insertIndex,
            moveKeys: moveKeys,
        });
    }
    moveItemToDirection = (direction, item) => {
        this.moveTo({
            direction: direction,
            // insertIndex,
            moveKeys: [item],
        });
    }
    multiMoveToRight = insertIndex => {
        const { targetKeys = [] } = this.props;
        const { sourceSelectedKeys, targetSelectedKeys, leftDataSource, rightDataSource } = this.state;

        this.moveTo({
            direction: 'right',
            insertIndex,
            moveKeys: sourceSelectedKeys,
        });
    }

    /**
     * List中的item选中/未选中状态改变时触发
     * @param {*} direction 'left' or 'right'
     * @param {*} holder 更新后的'sourceSelectedKeys' or 'targetSelectedKeys'
     */
    handleSelectChange(direction, holder) {
        // onSelectChange：当选中的item发生改变时的回调 参数(sourceSelectedKeys, targetSelectedKeys)
        const { sourceSelectedKeys, targetSelectedKeys } = this.state;
        const onSelectChange = this.props.onSelectChange;
        if (!onSelectChange) {
            return;
        }

        if (direction === 'left') {
            onSelectChange(holder, targetSelectedKeys);
        } else {
            onSelectChange(sourceSelectedKeys, holder);
        }
    }

    handleSelectAll = (direction, filteredDataSource, checkAll) => {
        const holder = checkAll ? [] : filteredDataSource.map(item => item.key);
        this.handleSelectChange(direction, holder);

        if (!this.props.selectedKeys) {
            this.setState({
                [this.getSelectedKeysName(direction)]: holder,
            });
        }
    }

    /**
     * 左侧列表全选事件
     * @param filteredDataSource dataSource中刨去设置为disabled的部分
     * @param checkAll 是否是全选状态 true：全选
     */
    handleLeftSelectAll = (filteredDataSource, checkAll) => {
        this.handleSelectAll('left', filteredDataSource, checkAll)
    }
    handleRightSelectAll = (filteredDataSource, checkAll) => (
        this.handleSelectAll('right', filteredDataSource, checkAll)
    )

    /**
     * 搜索框值更改事件
     * @param direction 'left' or 'right'
     * @param value 输入的值
     */
    handleFilter = (direction, value, filteredDataSource) => {
        const filteredDataSourceKeys = filteredDataSource.map(item => item.key) || [];
        this.setState({
            // add filter
            [`${direction}Filter`]: value,
            [`${direction}FilteredDataSourceKeys`]: filteredDataSourceKeys,
        });
    }

    handleLeftFilter = (v, filteredDataSource) => this.handleFilter('left', v, filteredDataSource)
    handleRightFilter = (v, filteredDataSource) => this.handleFilter('right', v, filteredDataSource)

    handleLeftDataSourceFilter = (filteredDataSource = []) => {
        let allMoveFilter = this.props.allMoveFilter;
        if (allMoveFilter) {
            filteredDataSource = filteredDataSource.filter(allMoveFilter);
        }
        this.leftFilteredDataSourceKeys = filteredDataSource.map(item => item.key) || [];
    };

    handleRightDataSourceFilter = (filteredDataSource = []) => {
        let allMoveFilter = this.props.allMoveFilter;
        if (allMoveFilter) {
            filteredDataSource = filteredDataSource.filter(allMoveFilter);
        }
        this.rightFilteredDataSourceKeys = filteredDataSource.map(item => item.key) || [];
    }

    /**
     * 清空搜索框内容
     * @param direction 'left' or 'right'
     */
    handleClear = (direction) => {
        this.setState({
            [`${direction}Filter`]: '',
            [`${direction}FilteredDataSourceKeys`]: [],
        });
    }

    handleLeftClear = () => this.handleClear('left')
    handleRightClear = () => this.handleClear('right')

    /**
     * 点击list item，选中或取消选中
     * @param direction 'left' or 'right'
     * @param selectedItem 选中的item的信息，和dataSource数据源中的item信息一致
     * @param checked 是否已勾选，true：已勾选 false：未勾选
     */
    handleSelect = (direction, selectedItem, checked) => {
        const { sourceSelectedKeys, targetSelectedKeys } = this.state;
        const holder = direction === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys];
        const index = holder.indexOf(selectedItem.key);
        if (checked) {  //已勾选
            holder.splice(index, 1);
        } else if (index === -1) {  //未勾选
            holder.push(selectedItem.key);
        }
        this.handleSelectChange(direction, holder);

        if (!this.props.selectedKeys) {
            this.setState({
                [this.getSelectedKeysName(direction)]: holder,
            });
        }
    }
    handleShiftSelect = (direction, selectedItems = [], checked) => {
        const { sourceSelectedKeys, targetSelectedKeys } = this.state;
        const holder = direction === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys];

        for (let selectedItem of selectedItems) {
            const index = holder.indexOf(selectedItem.key);
            // 未勾选
            if (index === -1) {
                holder.push(selectedItem.key);
            }
        }

        this.handleSelectChange(direction, holder);

        if (!this.props.selectedKeys) {
            this.setState({
                [this.getSelectedKeysName(direction)]: holder,
            });
        }
    }

    handleLeftSelect = (selectedItem, checked) => this.handleSelect('left', selectedItem, checked);
    handleRightSelect = (selectedItem, checked) => this.handleSelect('right', selectedItem, checked);

    getTitles = () => {
        if (this.props.titles) {
            return this.props.titles;
        }
        if (this.context &&
            this.context.antLocale &&
            this.context.antLocale.Transfer
        ) {
            return this.context.antLocale.Transfer.titles || [];
        }
        return defaultTitles;
    }

    getSelectedKeysName(direction) {
        return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
    }

    id2List = {
        droppable_1: 'leftDataSource',
        droppable_2: 'rightDataSource'
    };

    getList = id => this.state[this.id2List[id]];

    /**
     * 拖拽结束时触发
     */
    onDragEnd = result => {
        this.setState({
            draggingItemId: ''
        })
        const { source, destination, draggableId } = result;
        let { targetKeys, onTargetKeysChange } = this.props;
        let sourceIndex = source ? source.index : ''; //初始位置
        let disIndex = destination ? destination.index : ''; //移动后的位置
        let temp; //拖拽的元素

        // case1：拖拽到列表之外
        if (!destination) {
            return;
        }

        if (destination.droppableId === 'droppable_1') {
            // case2：在左侧列表中拖拽
            if (source.droppableId === destination.droppableId) return;
            // case3：从右往左拖拽（移除已选）
            this.moveToLeft();
            return;
        }

        // case4：在右侧列表中拖拽改变items顺序
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                targetKeys,
                sourceIndex,
                disIndex
            );
            this.setState({
                rightDataSource: items.dataArr,
                sourceSelectedKeys: [],
                targetSelectedKeys: []
            });
            if (onTargetKeysChange) {
                onTargetKeysChange(items.targetKeyArr, "", draggableId);
            }
        } else {  // case5：从左往右拖拽（添加已选）
            if (this.state.sourceSelectedKeys.length > 1) {
                return this.multiMoveToRight(destination.index)
            }
            const result = move( // 一次移动的方法
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination,
                targetKeys
            )
            if (onTargetKeysChange) { // onTargetKeysChange事件
                onTargetKeysChange(result.newTargetKeys, "", draggableId);
            }
            this.setState({
                leftDataSource: result.droppable_1,
                rightDataSource: result.droppable_2,
                sourceSelectedKeys: [],
                targetSelectedKeys: []
            })
        }
    };

    /**
     * 拖拽开始时触发
     */
    onDragStart = result => {
        let selectedItem = {};
        const { source } = result;
        selectedItem.key = result.draggableId;
        if (source.droppableId === 'droppable_1') {  // leftMenu
            this.handleLeftSelect(selectedItem);
        } else if (source.droppableId === 'droppable_2') {  // rightMenu
            this.handleRightSelect(selectedItem);
        }
        this.setState({
            droppableId: source.droppableId,
            draggingItemId: result.draggableId
        })
    }

    render() {
        // 兼容
        const showMoveBtn = this.props.showMoveBtn;
        const listRender = this.props.listRender || (({ title } = {}) => title);

        // 原始
        const {
            prefixCls = 'ncc-transfer', operations = [], showSearch, notFoundContent,
            searchPlaceholder, body, footer, listStyle, className = '', pagination,
            onTargetKeysChange,
            filterOption, render = listRender, lazy, showCheckbox, draggable = showMoveBtn, renderOperation,
            allMoveFilter,
            lazyLoad,
        } = this.props;
        const { leftFilter, rightFilter, sourceSelectedKeys, targetSelectedKeys, leftDataSource, rightDataSource, droppableId, draggingItemId, langJson, disabled } = this.state;

        // const { leftDataSource, rightDataSource } = this.splitDataSource(this.props);
        const leftActive = targetSelectedKeys.length > 0;
        const rightActive = sourceSelectedKeys.length > 0;
        const leftAllActive = (allMoveFilter ? rightDataSource.filter(allMoveFilter) : rightDataSource).length > 0;
        const rightAllActive = (allMoveFilter ? leftDataSource.filter(allMoveFilter) : leftDataSource).length > 0;

        const cls = classNames(className, prefixCls);

        const titles = this.getTitles();

        return (
            <div className={cls} fieldid={getSysFieldid('transfer_area')}>
                <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart} >
                    <List
                        titleText={titles[0]}    //左侧标题
                        dataSource={leftDataSource} //左侧数据源
                        filter={leftFilter}    //搜索框中输入的内容
                        filterOption={filterOption} //搜索过滤方法 参数(inputValue, option)
                        style={listStyle}  //自定义的columns的样式表
                        checkedKeys={sourceSelectedKeys}  //左侧已勾选的item的keys
                        handleFilter={this.handleLeftFilter}  //左侧搜索框值更改事件
                        dataSourceFilter={this.handleLeftDataSourceFilter}  //左侧搜索框值更改事件
                        handleClear={this.handleLeftClear}   //清空左侧搜索框内容
                        handleSelect={this.handleLeftSelect}  //点击左侧列表中的item，改变选中或取消选中状态
                        handleSelectAll={this.handleLeftSelectAll} //点击左侧全选
                        render={render}
                        showSearch={showSearch} //是否显示搜索框
                        searchPlaceholder={searchPlaceholder || langJson['container-transfer-0004']} //搜索框placeholder
                        notFoundContent={notFoundContent || langJson['container-transfer-0003']} //当没有相关内容的显示内容
                        // body={body}
                        // footer={footer}
                        prefixCls={`${prefixCls}-list`}
                        lazy={lazy}
                        lazyLoad={lazyLoad}
                        showCheckbox={showCheckbox}
                        draggable={draggable}
                        id={'1'}
                        droppableId={droppableId}
                        draggingItemId={draggingItemId}
                        pagination={pagination}
                        desc={langJson['container-transfer-select'] || '待选'}
                        showMoveBtn={false}
                        onDoubleClick={(item, event) => {
                            this.moveItemToDirection('right', item.key);
                        }}
                        // shift 选中
                        handleShiftSelect={(selectedItems, checked) => this.handleShiftSelect('left', selectedItems, true)}
                    />
                    {!draggable ?
                        <MoveButton
                            left={{
                                text: operations[0],
                                active: leftActive,
                                move: this.moveToLeft,
                            }}
                            right={{
                                text: operations[1],
                                active: rightActive,
                                move: this.moveToRight,
                            }}
                            allLeft={{
                                text: operations[3],
                                active: leftAllActive,
                                move: this.moveAllToLeft,
                            }}
                            allRight={{
                                text: operations[4],
                                active: rightAllActive,
                                move: this.moveAllToRight,
                            }}
                            langJson={langJson}
                            // vertical
                            direction={'horizontal'}
                            renderOperation={renderOperation}
                        />
                        : ''
                    }
                    <List
                        titleText={titles[1]}  //右侧标题
                        dataSource={rightDataSource}   //右侧数据源
                        filter={rightFilter}    //搜索框中输入的内容
                        filterOption={filterOption}  //搜索过滤方法 参数(inputValue, option)
                        style={listStyle}  //自定义的columns的样式表
                        checkedKeys={targetSelectedKeys}  //右侧已勾选的item的keys
                        handleFilter={this.handleRightFilter}  //右侧搜索框值更改事件
                        dataSourceFilter={this.handleRightDataSourceFilter}  //右侧搜索框值更改事件
                        handleClear={this.handleRightClear}  //清空右侧搜索框内容
                        handleSelect={this.handleRightSelect}  //点击右侧列表中的item，改变选中或取消选中状态
                        handleSelectAll={this.handleRightSelectAll} //点击右侧全选
                        render={render}
                        showSearch={showSearch}  //是否显示搜索框
                        searchPlaceholder={searchPlaceholder || langJson['container-transfer-0004']} //搜索框placeholder
                        notFoundContent={notFoundContent || langJson['container-transfer-0003']} //当没有相关内容的显示内容
                        body={body}
                        footer={footer}
                        prefixCls={`${prefixCls}-list`}
                        lazy={lazy}
                        lazyLoad={lazyLoad}
                        showCheckbox={showCheckbox}
                        draggable={draggable}
                        id={'2'}
                        pagination={pagination}
                        desc={langJson['container-transfer-selected'] || '已选'}

                        // 数据变化了
                        dataSourceChange={(dataSource, checkedKeys, direction) => {
                            let targetKeys = dataSource.map(i => i.key);
                            this.setState({
                                rightDataSource: dataSource,
                            });
                            onTargetKeysChange && onTargetKeysChange(targetKeys, direction, checkedKeys);
                        }}
                        operations={operations}
                        disabled={disabled}
                        langJson={langJson}
                        renderOperation={renderOperation}
                        showMoveBtn={showMoveBtn}

                        // 双击
                        onDoubleClick={(item, event) => {
                            this.moveItemToDirection('left', item.key);
                        }}
                        // shift 选中
                        handleShiftSelect={(selectedItems, checked) => this.handleShiftSelect('right', selectedItems, true)}
                    />
                </DragDropContext>
            </div>
        );
    }
}

ListToListTransfer.List = ListToListTransfer.List;
ListToListTransfer.Operation = ListToListTransfer.MoveButton;
ListToListTransfer.Search = ListToListTransfer.Search;

ListToListTransfer.propTypes = propTypes;
ListToListTransfer.defaultProps = defaultProps;

export default ListToListTransfer;