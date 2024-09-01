/*
 * @Author: bbqin
 * @Date: 2021-07-09 13:40:38
 * @LastEditTime: 2022-04-24 14:25:32
 * @LastEditors: Please set LastEditors
 * @Description: 列表展示、搜索、多选、快捷键、拖拽、懒加载等
 * @FilePath: \Platform_Front\src\platform\components\Transfer\list.js
 * 这锅我不背
 */
import React, { Component, Fragment } from 'react';
import Search from './search';
import classNames from 'classnames';
// import Animate from 'bee-animate';
// import PureRenderMixin from './PureRenderMixin';
import Item from './listItem';
import {base} from 'nc-lightapp-front'

let { NCIcon:Icon, NCInput: FormControl, NCCheckbox:Checkbox }  = base;
import MoveButton from './moveButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const KeyCode = {};
function noop() {
}
const defaultProps = {
    dataSource: [],
    titleText: '',
    showSearch: true,
    render: noop,
    pagination: false,
    lazyLoad: false,
    // loadBuffer: 50,
};
function isRenderResultPlainObject(result) {
    return result && !React.isValidElement(result) &&
        Object.prototype.toString.call(result) === '[object Object]';
}


class List extends Component {
    constructor(props) {
        super(props);
        const { pagination, checkedKeys } = props
        const dataSource = this.handleFilterDataSource()
        const totalPages = Math.ceil(dataSource.length / 10)
        const paginationInfo = pagination ? {
            currentPage: 1,
            totalPages: totalPages === 0 ? 1 : totalPages
        } : {}

        let { disabled } = this.getButtonStatus(dataSource, checkedKeys);

        this.state = {
            mounted: false,
            paginationInfo,
            loadStartIndex: 0,
            loadBuffer: 500,
            dataSource,
            disabled,
            clicked: null,
        };
        window.TransferList = this
    }

    handleListBodyScroll = event => {
        let { loadBuffer, loadStartIndex } = this.state;
        let $target = event.target;
        let scrollHeight = $target.scrollHeight;
        let offsetHeight = $target.offsetHeight;
        let scrollTop = $target.scrollTop;
        if (offsetHeight + scrollTop > scrollHeight * 0.9) {
            this.setState({
                loadBuffer: loadBuffer + loadBuffer / 2,
            });
        }
    }

    componentDidMount() {
        let { prefixCls, lazyLoad } = this.props;
        let listBody = this.listPanel && this.listPanel.querySelector(`.${prefixCls}-content`);
        lazyLoad && listBody && listBody.addEventListener('scroll', this.handleListBodyScroll)
        this.timer = setTimeout(() => {
            this.setState({
                mounted: true,
            });
        }, 0);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { paginationInfo } = this.state
        const { pagination, checkedKeys = [] } = nextProps
        const dataSource = this.handleFilterDataSource(nextProps)
        if (pagination) {
            const totalPages = Math.ceil(dataSource.length / 10)
            const currentPage = paginationInfo.currentPage
            this.setState({
                dataSource,
                paginationInfo: {
                    totalPages: totalPages === 0 ? 1 : totalPages,
                    currentPage: totalPages === 0 ? 1 : (currentPage && totalPages && totalPages < currentPage) ? totalPages : currentPage // 在最后一页移除元素之后，当前页设置为最后一页
                }
            })
        } else {
            let { disabled } = this.getButtonStatus(dataSource, checkedKeys);

            this.setState({
                dataSource,
                disabled: { ...this.state.disabled, ...disabled }
            })
        }
        return {};
    };

    componentWillUnmount() {
        let { prefixCls, lazyLoad } = this.props;
        let listBody = this.listPanel && this.listPanel.querySelector(`${prefixCls}-content`);
        lazyLoad && listBody && listBody.removeEventListener('scroll', this.handleListBodyScroll);
        clearTimeout(this.timer);
    }

    shouldComponentUpdate(...args) {
        // return PureRenderMixin.shouldComponentUpdate.apply(this, args);
        return true;
    }


    matchFilter = (text, item, filter, filterOption) => {
        //filter：搜索框中的内容
        //filterOption：用户自定义的搜索过滤方法
        if (filterOption) {
            return filterOption(filter, item);
        }
        return text.indexOf(filter) >= 0;
    }

    /**
     * 获取Button状态
     * @param {*} filteredDataSource dataSource中刨去设置为disabled的部分
     */
    getButtonStatus(filteredDataSource, checkedKeys = []) {
        let status = '';
        let len = filteredDataSource.length;
        let first = false;
        let last = false;

        // 过滤之后checkedKeys修正
        const checkedKeysObj = {};
        checkedKeys.forEach(key => {
            checkedKeysObj[key] = key;
        });
        checkedKeys = [];
        filteredDataSource.forEach(item => { checkedKeysObj[item.key] && checkedKeys.push(item.key) });

        filteredDataSource.some((item, i) => {
            if (checkedKeys.indexOf(item.key) >= 0 && i === 0) {
                status = 'first'; // 仅选首个
                first = true;
            } else if (!status && i === len - 1) {
                status = 'last'; // 仅选末尾
            } else if (checkedKeys.indexOf(item.key) >= 0) {
                status = 'part'; //部分已选
            }
            if (i === len - 1 && checkedKeys.indexOf(item.key) >= 0) {
                last = true;
            }
        });

        if (checkedKeys.length === 0) {
            status = 'none'; //全部未选
        }

        if (filteredDataSource.every(item => checkedKeys.indexOf(item.key) >= 0)) {
            status = 'all';  //全部已选
        }


        let disabled = {
            top: false,
            bottom: false,
            up: false,
            down: false,
        };

        // 仅选首项
        if (status === 'first') {
            disabled = {
                top: true,
                up: true,
                down: false,
                bottom: false,
            };
        }

        // 仅选末项
        if (status === 'last') {
            disabled = {
                top: false,
                up: false,
                down: true,
                bottom: true,

            };
        }

        // 未选 和 全选
        if (!checkedKeys.length || checkedKeys.length === filteredDataSource.length) {
            disabled = {
                top: true,
                bottom: true,
                up: true,
                down: true,
            };
        }


        // 其他情况/部分选择
        if (status === 'part') {
            // 包含首项并且一直连续
            if (first) {
                let continuity = 0;
                filteredDataSource.forEach(item => {
                    if (checkedKeys.indexOf(item.key) >= 0) {
                        continuity = continuity === 0 ? 0 : 2;
                    } else {
                        continuity = continuity === 0 ? 1 : (continuity === 1 ? 1 : 2);
                    }
                })
                if (continuity !== 2) {
                    disabled = {
                        top: true,
                        up: true,
                        down: false,
                        bottom: false,
                    };
                }
            }

            // 包含末项并且一直连续
            if (last) {
                let continuity = 0;
                let len = filteredDataSource.length;
                for (let index = len - 1; index >= 0; index--) {
                    const element = filteredDataSource[index];
                    if (checkedKeys.indexOf(element.key) >= 0) {
                        continuity = continuity === 0 ? 0 : 2;
                    } else {
                        //初始是 0
                        continuity = continuity === 0 ? 1 : (continuity === 1 ? 1 : 2);
                    }
                }
                if (continuity !== 2) {
                    disabled = {
                        top: false,
                        up: false,
                        down: true,
                        bottom: true,
                    };
                }
            }
        }

        return { status, disabled };
    }

    /**
     * 获取Checkbox状态
     * @param {*} filteredDataSource dataSource中刨去设置为disabled的部分
     */
    getCheckStatus(filteredDataSource, filterCheckedLength) {
        const { checkedKeys } = this.props;
        if (filterCheckedLength === 0) {
            return 'none'; //全部未选
        } else if (filteredDataSource.every(item => checkedKeys.indexOf(item.key) >= 0)) {
            return 'all';  //全部已选
        }
        return 'part';   //部分已选
    }

    /**
     * 点击list item，选中或取消选中
     * @param selectedItem 选中的item的信息，和dataSource数据源中的item信息一致
     */
    handleSelect = (selectedItem, shiftKey) => {
        // checkedKeys：已勾选的Keys数组
        // result：是否已勾选，true：已勾选  false：未勾选
        const { checkedKeys } = this.props;
        const result = checkedKeys.some((key) => key === selectedItem.key);

        // 用于shift选中
        let oldSelectedItem = this.state.clicked;

        // 触发点击选中的效果
        this.props.handleSelect(selectedItem, result);

        // if (shiftKey && !result) {
        if (shiftKey) {
            let dataSource = this.state.dataSource;
            let selectedItems = [],
                tempValid = 0;
            dataSource.forEach(item => {
                if (!item.disabled) {
                    if (oldSelectedItem && oldSelectedItem.key === item.key) {
                        tempValid++;
                        selectedItems.push(item);
                    } else if (selectedItem && selectedItem.key === item.key) {
                        tempValid++;
                        selectedItems.push(item);
                    } else if (tempValid === 1) {
                        selectedItems.push(item);
                    }
                }
            });

            tempValid == 2 && this.props.handleShiftSelect && this.props.handleShiftSelect(selectedItems, false);
        } else {
            // !result && this.setState({
            //     clicked: selectedItem
            // })
            this.setState({
                clicked: selectedItem
            })
        }
    }

    handleFilter = (e) => {
        const dataSource = this.handleFilterDataSource({ ...this.props, filter: e });
        this.props.handleFilter(e, dataSource);
    }

    handleClear = () => {
        this.props.handleClear();
    }
    renderItem = (item) => {
        const { render = noop, filter } = this.props;
        const renderResult = render(item, filter);
        const isRenderResultPlain = isRenderResultPlainObject(renderResult);
        // 处理下搜索高亮
        let renderedEl = isRenderResultPlain ? renderResult.label : renderResult;
        if (renderedEl && renderedEl.replace) {
            const index = renderedEl.indexOf(filter);
            if (filter && index !== -1) {
                const beforeStr = renderedEl.substr(0, index);
                const afterStr = renderedEl.substr(index + filter.length);
                const filterDom = <span className="search-match-key">{filter}</span>;
                renderedEl = <span>{beforeStr}{filterDom}{afterStr}</span>
            }
        }
        return {
            renderedText: isRenderResultPlain ? renderResult.value : renderResult,
            renderedEl: renderedEl,
        };
    }
    renderCheckbox({ prefixCls, filteredDataSource, checked, checkPart, disabled, checkable }) {
        const checkAll = (!checkPart) && checked; //非半选 && 全选
        prefixCls = "wui"
        const checkboxCls = classNames({
            [`${prefixCls}-checkbox-indeterminate`]: checkPart,
            [`${prefixCls}-checkbox-disabled`]: disabled,
        });
        return (
            <Checkbox
                onChange={() => this.props.handleSelectAll(filteredDataSource, checkAll)}
                className={checkboxCls}
                checked={checkAll}
            />
        );
    }

    onKeyDown = (event, provided, snapshot, item) => {
        if (provided.dragHandleProps) {
            provided.dragHandleProps.onKeyDown(event);
        }

        if (event.defaultPrevented) {
            return;
        }

        if (snapshot.isDragging) {
            return;
        }

        if (event.keyCode !== KeyCode.ENTER) {
            return;
        }

        // 为了选择，我们使用此事件 we are using the event for selection
        event.preventDefault();

        this.performAction(event, item);
    };

    handleChangePage = value => {
        let val = +value
        const { paginationInfo } = this.state
        if (Number.isNaN(val) || typeof val !== 'number' || val % 1 !== 0) {
            return
        }
        if (val > paginationInfo.totalPages) {
            val = paginationInfo.totalPages
        }
        if (val < 1) {
            val = 1
        }
        this.setState({
            paginationInfo: {
                ...paginationInfo,
                currentPage: val
            }
        })
    }

    handleMove = step => {
        const { currentPage, totalPages } = this.state.paginationInfo
        const newCurrentPage = currentPage + step
        if (newCurrentPage < 1 || newCurrentPage > totalPages) {
            return
        }
        this.setState({
            paginationInfo: {
                totalPages,
                currentPage: newCurrentPage
            }
        })
    }


    // 点击上移和下移按钮
    handleMoveBtn = direction => {
        const { checkedKeys = [], dataSourceChange, filter, dataSource: originDataSource } = this.props;
        const { dataSource } = this.state;
        const dataSourceClone = JSON.parse(JSON.stringify(dataSource));
        // 记录要移动的项和其他不移动的项
        let moveDataSource = [];
        let firstIndex = -1;
        let beforeDataSource = [];
        let afterDataSource = [];
        let otherDataSource = [];
        let lastIndex = -1;
        let resultDataSource = dataSourceClone;
        // 转对象 方便判断
        const checkedKeysObj = {};
        checkedKeys.forEach(element => {
            checkedKeysObj[element] = element;
        });
        // 计算移动的项和非移动的项
        dataSourceClone.forEach((element, index) => {
            if (checkedKeysObj[element.key]) {
                moveDataSource.push(element);
                lastIndex = index;
                if (firstIndex === -1) {
                    firstIndex = index;
                } else {
                    // 把记录的afterDataSource 拿到
                    otherDataSource = otherDataSource.concat(afterDataSource);
                    // 清空
                    afterDataSource = [];
                }
            } else {
                if (firstIndex === -1) {
                    beforeDataSource.push(element);
                } else {
                    afterDataSource.push(element);
                }
            }
        });

        switch (direction) {
            case 'up':
                const prev = beforeDataSource.pop();
                resultDataSource = [...beforeDataSource, ...moveDataSource, ...(prev ? [prev] : []), ...otherDataSource, ...afterDataSource];
                break;
            case 'down':
                const next = afterDataSource.splice(0, 1);
                resultDataSource = [...beforeDataSource, ...otherDataSource, ...(next || []), ...moveDataSource, ...afterDataSource];
                break;
            case 'top':
                resultDataSource = [...moveDataSource, ...beforeDataSource, ...otherDataSource, ...afterDataSource];
                break;
            case 'bottom':
                resultDataSource = [...beforeDataSource, ...otherDataSource, ...afterDataSource, ...moveDataSource,];
                break;
            default:
                break;
        }

        console.log(resultDataSource, 'resultDataSource')

        // 滚动到首个元素
        // let el = document.querySelector('li.base-transfer-list-content-item > label.is-checked > input[type="checkbox"]')
        // setTimeout(() => {
        //     el && el.focus()
        // }, 20)

        let { disabled } = this.getButtonStatus(resultDataSource, checkedKeys);

        //处理筛选的数据
        if (filter) {
            let resultDataSourceKey = new Set(resultDataSource.map(i => i.key));
            for (let index = 0, j = 0; index < originDataSource.length; index++) {
                const element = originDataSource[index];
                if (resultDataSourceKey.has(element.key)) {
                    originDataSource[index] = resultDataSource[j];
                    j++;
                }
                if (j === resultDataSource.length) break;
            }
            resultDataSource = originDataSource;
        }

        this.setState({
            dataSource: resultDataSource,
            disabled: { ...this.state.disabled, ...disabled }
        }, () => {
            // 数据变化的回调
            dataSourceChange && dataSourceChange(resultDataSource, checkedKeys);
        })
    };

    createListPagination = () => {
        const { prefixCls } = this.props
        const { paginationInfo } = this.state
        const { currentPage, totalPages } = paginationInfo
        return <div className={`${prefixCls}-pagination`}>
            <span
                onClick={() => this.handleMove(-1)}
                className={`prev-link ${currentPage === 1 ? 'disabled' : ''}`}
            >
                <Icon type="uf-arrow-left" />
            </span>
            <FormControl
                size="sm"
                value={currentPage}
                ref="input"
                onChange={this.handleChangePage}
            />
            <span
                className={`${prefixCls}-pagination-slash`}
            >/</span>
            <span>{totalPages}</span>
            <span
                onClick={() => this.handleMove(1)}
                className={`next-link ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                <Icon type="uf-arrow-right" />
            </span>
        </div>
    }

    handleFilterDataSource = (nextProps) => {
        const { dataSourceFilter } = this.props;
        const { dataSource, filter, filterOption, } = nextProps || this.props
        let filteredDataSource = dataSource.filter(data => {
            const { renderedText } = this.renderItem(data);
            if (filter && filter.trim() && !this.matchFilter(renderedText, data, filter, filterOption)) {
                return false
            }
            return true
        })
        dataSourceFilter && dataSourceFilter(filteredDataSource);
        return filteredDataSource;
    }

    render() {
        const { prefixCls, titleText, filter, checkedKeys, lazy, filterOption, pagination, lazyLoad, fieldid,
            body = noop, footer = noop, showSearch, render = noop, style, id, showCheckbox, draggable, droppableId, draggingItemId, desc,
            operations = [], langJson, renderOperation, showMoveBtn = true, onDoubleClick, dataSourceChange } = this.props;
        let { searchPlaceholder, notFoundContent } = this.props;

        // Custom Layout
        const { paginationInfo, dataSource, disabled, loadBuffer, loadStartIndex } = this.state
        const footerDom = footer(Object.assign({}, this.props));
        const bodyDom = body(Object.assign({}, this.props));

        const listCls = classNames(prefixCls, {
            [`${prefixCls}-with-footer`]: !!footerDom,
            [`${prefixCls}-draggable`]: !!draggable,
            [`${prefixCls}-with-pagination`]: !!pagination,
            [`${prefixCls}-with-lazyload`]: !!lazyLoad
        });
        let filteredDataSource = [];
        const totalDataSource = pagination || lazyLoad ? dataSource : [];
        let splitDataSource = !pagination ? dataSource.concat() : dataSource.slice(10 * (paginationInfo.currentPage - 1), 10 * paginationInfo.currentPage)
        if (pagination || lazyLoad) {
            filteredDataSource = dataSource.filter(item => !item.disabled)
        }
        // lazyLoad(假)
        if (lazyLoad) {
            splitDataSource = dataSource.slice(loadStartIndex, loadStartIndex + loadBuffer);
        }

        const showItems = splitDataSource.map((item, index) => {
            if (!item) { return }
            const { renderedText, renderedEl } = this.renderItem(item);

            // all show items
            if (!pagination && !lazyLoad) {
                totalDataSource.push(item);
            }

            if (!item.disabled && !pagination && !lazyLoad) {
                filteredDataSource.push(item);
            }

            const checked = checkedKeys.indexOf(item.key) >= 0;
            return (
                <Draggable key={item.key} index={index} draggableId={`${item.key}`} isDragDisabled={draggable ? item.disabled : !draggable}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            // onClick={(event) =>this.handleDrag(event, provided, snapshot, item)}
                            onKeyDown={(event) =>
                                this.onKeyDown(event, provided, snapshot, item)
                            }
                            // className={classnames({
                            //     ...getClass(this.props,snapshot.isDragging).drag
                            //   })}
                            style={{ ...provided.draggableProps.style }}>
                            <Item
                                // ref={provided.innerRef} //Error: provided.innerRef has not been provided with a HTMLElement
                                // key={item.key}
                                item={item}
                                lazy={lazy}
                                render={render}
                                renderedText={renderedText}
                                renderedEl={renderedEl}
                                filter={filter}
                                filterOption={filterOption}
                                checked={checked}
                                checkedKeys={checkedKeys}
                                prefixCls={prefixCls}
                                onClick={this.handleSelect}
                                showCheckbox={showCheckbox}
                                isMultiDragSource={draggingItemId === item.key}
                                draggingItemId={draggingItemId}
                                onDoubleClick={(event) => {
                                    dataSource.some((element, i) => {
                                        let temp = element.key === item.key;
                                        if (temp) {
                                            dataSource.splice(i, 1);
                                            checkedKeys.some((cKey, index) => {
                                                let temp = element.key === cKey;
                                                temp && checkedKeys.splice(index, 1);
                                                return temp;
                                            })
                                        }
                                        return temp;
                                    });
                                    this.setState({
                                        dataSource,
                                    }, () => {
                                        dataSourceChange && !onDoubleClick && dataSourceChange(dataSource, checkedKeys);
                                        onDoubleClick && onDoubleClick(item, event);
                                    })
                                }}
                            />
                        </div>
                    )}
                </Draggable>)
        });

        let unit = '';
        const antLocale = this.context.antLocale;
        if (antLocale && antLocale.Transfer) {
            const transferLocale = antLocale.Transfer;
            unit = dataSource.length > 1 ? transferLocale.itemsUnit : transferLocale.itemUnit;
            searchPlaceholder = searchPlaceholder || transferLocale.searchPlaceholder;
            notFoundContent = notFoundContent || transferLocale.notFoundContent;
        }

        // 当前筛选的  不能选中
        const checkedKeysObj = {};
        checkedKeys.forEach(key => {
            checkedKeysObj[key] = key;
        });
        const filterCheckedLength = filter ? (filteredDataSource.filter(item => checkedKeysObj[item.key])).length : checkedKeys.length;

        const checkStatus = this.getCheckStatus(filteredDataSource, filterCheckedLength);
        const outerPrefixCls = prefixCls.replace('-list', '');
        const search = showSearch ? (
            <div className={`${prefixCls}-body-search-wrapper`}>
                <Search
                    prefixCls={`${prefixCls}-search`}
                    onChange={this.handleFilter}
                    handleClear={this.handleClear}
                    placeholder={searchPlaceholder}
                    value={filter}
                />
            </div>
        ) : null;

        const listBody = bodyDom || (
            <div className={showSearch ? `${prefixCls}-body ${prefixCls}-body-with-search` : `${prefixCls}-body`}>
                {search}
                <Droppable droppableId={`droppable_${id}`} direction='vertical' isDropDisabled={!draggable}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} key={id} className={`${prefixCls}-content`}>
                            <div style={{ display: 'none' }}>{provided.placeholder}</div>
                            {/* <Animate
                                component="ul"
                                transitionName={this.state.mounted ? `${prefixCls}-content-item-highlight` : ''}
                                transitionLeave={false}
                            > */}
                            {showItems}
                            {/* </Animate> */}
                            <div className={`${prefixCls}-delete-selected ${snapshot.isDraggingOver && droppableId === 'droppable_2' ? 'show' : ''}`}>
                                <div className={`${prefixCls}-del-btn`}>
                                    <Icon type="uf-arrow-down-2"></Icon>
                                    <span>移除已选</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Droppable>
                {pagination ? this.createListPagination() : null}
                <div className={`${prefixCls}-body-not-found ${dataSource.length == 0 ? "show" : ""}`}>
                    {notFoundContent}
                </div>
            </div>
        );

        const listFooter = footerDom ? (
            <div className={`${prefixCls}-footer`}>
                {footerDom}
            </div>
        ) : null;

        const renderedCheckbox = this.renderCheckbox({
            prefixCls: outerPrefixCls,
            checked: checkStatus === 'all',
            checkPart: checkStatus === 'part',
            checkable: <span className={`${outerPrefixCls}-checkbox-inner`} />,
            filteredDataSource,
            disabled: false,
        });

        return (
            <Fragment >
                <div ref={dom => { return this.listPanel = dom }} className={listCls} style={style} fieldid={fieldid}>
                    <div className={`${prefixCls}-header`}>
                        {showCheckbox ? renderedCheckbox : ''}
                        <span className={`${prefixCls}-header-selected`}>
                            <span className={`${prefixCls}-header-selected-content`}>
                                {/* {desc} {(checkedKeys.length > 0 ? `${checkedKeys.length}/` : '') + totalDataSource.length} {unit} */}
                                <span title={`${desc} (${filterCheckedLength}/${totalDataSource.length}) ${unit}`} >{desc} {`(${filterCheckedLength}/${totalDataSource.length})`} {unit}</span>
                            </span>
                            {/* <span className={`${prefixCls}-header-title`}>
                                <span title={`${titleText}`}>
                                    {titleText}
                                </span>
                            </span> */}
                        </span>
                    </div>
                    {listBody}
                    {listFooter}
                </div>
                {!draggable && showMoveBtn ?
                    <MoveButton
                        up={{
                            text: operations[5],
                            active: !disabled.up,
                            move: this.handleMoveBtn.bind(this, 'up'),
                        }}
                        top={{
                            text: operations[6],
                            active: !disabled.top,
                            move: this.handleMoveBtn.bind(this, 'top'),
                        }}
                        down={{
                            text: operations[7],
                            active: !disabled.down,
                            move: this.handleMoveBtn.bind(this, 'down'),
                        }}
                        bottom={{
                            text: operations[8],
                            active: !disabled.bottom,
                            move: this.handleMoveBtn.bind(this, 'bottom'),
                        }}
                        langJson={langJson}
                        // vertical
                        direction={'vertical'}
                        renderOperation={renderOperation}
                    />
                    : ''
                }
            </Fragment>
        );
    }
}


List.defaultProps = defaultProps;

export default List;