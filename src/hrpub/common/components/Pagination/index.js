import React, {Component} from 'react';

import './index.less';

import * as all from 'nc-lightapp-front';

import {getColor, debounce} from '../../../../hrpub/common/utils/utils';
import {THEME} from './theme';

const base = all.base;

const {NCSelect} = base;

const {NCOption} = NCSelect;

/**
 *
 * current: 当前页面, 从 1 开始计算，如果传入了这个props，则组件视为可控组件
 * defaultCurrent: 默认当前页
 * defaultPageSize: 默认每页条数
 * hideOnSinglePage: 只有一页时是否隐藏分页器
 * pageSize: 每页条数
 * pageSizeOptions: 指定每页显示多少条
 * showQuickJumper: 是否可以快速跳转至某页
 * showSizeChanger: 是否可以改变pageSize
 * showTotal: 函数 用于展示有多少条
 * size: 分页器尺寸
 * total: 数据总数
 * onChange: 页码改变回调函数
 * onShowSizeChange: pageSize改变的回调函数
 * showSizeInput: 展示pagesize修改输入框，按下回车触发onShowSizeChange函数，与showSizeChanger互斥
 * onBlur: 查询输入框失去焦点
 * onInput: 输入框输入
 *
 */

class Pagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageSize: props.pageSize || props.defaultPageSize || 10,
            current: props.current || props.defaultCurrent || props.pageIndex || 1,
            quickJumperInput: '',
            language: {},
            customPageSize: props.pageSize || props.defaultPageSize || 10,
            searchInputValue: ''
        };

        this.getPageTotal = this.getPageTotal.bind(this);
        this.renderPaginationItems = this.renderPaginationItems.bind(this);
        this.changePage = this.changePage.bind(this);
        this.movePage = this.movePage.bind(this);
        this.changeQuickJumper = this.changeQuickJumper.bind(this);
        this.quickJumperKeyUp = this.quickJumperKeyUp.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.turnFivePage = this.turnFivePage.bind(this);
        this.changePageSizeInput = this.changePageSizeInput.bind(this);
        this.doChangePageSizeInput = this.doChangePageSizeInput.bind(this);
        this.searchInput = this.searchInput.bind(this);
        this.blurSearchInput = this.blurSearchInput.bind(this);
    }

    doChangePageSizeInput(e) {
        if (e.keyCode === 13) {
            this.setState(
                {
                    pageSize: this.state.customPageSize
                },
                () => {
                    this.changePageSize(this.state.customPageSize);
                }
            );
        }
    }

    changePageSizeInput(e) {
        this.setState({
            customPageSize: e.target.value
        });
    }

    componentDidMount() {
        all.getMultiLang({
            moduleId: 'hrpub',
            domainName: 'hrpub',
            callback: (json, status, init) => {
                this.setState({
                    language: json
                });
            }
        });
    }

    changePageSize(pageSize) {
        if(Array.isArray(pageSize)) return;
        const {searchInputValue} = this.state;

        let pageSizeValue = searchInputValue;

        if (!pageSizeValue || pageSizeValue === '0') {
            pageSizeValue = pageSize;
        }

        this.setState({
            pageSize: pageSizeValue,
            searchInputValue: ''
        });

        if ('onShowSizeChange' in this.props) {
            this.props.onShowSizeChange(pageSizeValue);
        }
    }

    quickJumperKeyUp(e) {
        let {quickJumperInput} = this.state;

        if (e.keyCode === 13) {
            quickJumperInput = parseInt(quickJumperInput);
            if (!isNaN(quickJumperInput)) {
                this.changePage(quickJumperInput)();
            }
            this.setState({
                quickJumperInput: ''
            });
        }
    }

    changeQuickJumper(e) {
        let v = e.target.value;
        let totalPage = this.getPageTotal();
        let oldValue = this.state.quickJumperInput;

        if (/^\d*$/.test(v)) {
            let finalV = parseInt(v);

            if (isNaN(finalV)) {
                this.setState({
                    quickJumperInput: v
                });
            } else if (parseInt(v) <= totalPage && finalV <= totalPage && finalV > 0) {
                this.setState({
                    quickJumperInput: finalV
                });
            }
        }
    }

    changePage(page) {
        return () => {
            if ('onChange' in this.props) {
                this.props.onChange(page);
            }
            if (!('current' in this.props)) {
                let totalPage = this.getPageTotal();
                let nCurrent = page;

                if (page <= 0) {
                    nCurrent = 0;
                } else if (page >= totalPage) {
                    nCurrent = totalPage;
                }

                this.setState({
                    current: nCurrent
                });
            }
        };
    }

    movePage(direction) {
        return () => {
            let {current} = this.state;
            if ('current' in this.props) {
                current = parseInt(this.props.current);
            }

            let totalPage = this.getPageTotal();
            let nCurrent = current;

            if (direction === 'prev') {
                if (current - 1 > 0) {
                    nCurrent = current - 1;
                }
            } else if (direction === 'next') {
                if (current + 1 <= totalPage) {
                    nCurrent = current + 1;
                }
            }

            this.changePage(nCurrent)();
        };
    }

    getPageTotal() {
        // const {pageSize} = this.state;

        const {total = 1,pageSize} = this.props;

        let pageCount = Math.ceil(total / pageSize);

        return pageCount;
    }

    turnFivePage(type) {
        return () => {
            let {current} = this.state;

            if ('current' in this.props) {
                current = parseInt(this.props.current);
            }

            if (type === 'prev') {
                this.changePage(current - 4)();
            } else if (type === 'next') {
                this.changePage(current + 4)();
            }
        };
    }

    renderPaginationItems() {
        let {current} = this.state;

        if ('current' in this.props) {
            current = parseInt(this.props.current);
        }

        let pageCount = this.getPageTotal();
        let paginationItems = [];

        paginationItems.push(
            <span
                className={`ncc-hr-pagination-item ${current === 1 ? 'active' : THEME.borderC}`}
                key={0}
                onClick={this.changePage(1)}
                style={{
                    color: current === 1 ? '' : getColor().color, // active 时 显示红色字体
                    backgroundColor: getColor().bgColor
                }}
            >
				{1}
			</span>
        );
        if (pageCount < 9) {
            for (let i = 1; i < pageCount; i++) {
                pushPage.call(this, i);
            }
        } else {
            let len = pageCount - current > 2 ? current + 2 : pageCount - 1;

            if (current > 4) {
                paginationItems.push(
                    <span
                        className={`ncc-hr-pagination-item ncc-hr-pagination-turn-five ${THEME.borderC}`}
                        onClick={this.turnFivePage('prev')}
                        style={{
                            color: getColor().color,
                            backgroundColor: getColor().bgColor
                        }}
                    >
						<i className="icon-prev"/>
					</span>
                );
                for (let i = current - 3; i < len; i++) {
                    pushPage.call(this, i);
                }
            } else {
                for (let i = 1; i < len; i++) {
                    pushPage.call(this, i);
                }
            }

            if (pageCount - current > 3) {
                paginationItems.push(
                    <span
                        className={`ncc-hr-pagination-item ncc-hr-pagination-turn-five ${THEME.borderC}`}
                        onClick={this.turnFivePage('next')}
                        style={{
                            color: getColor().color,
                            backgroundColor: getColor().bgColor
                        }}
                    >
						<i className="icon-next"/>
					</span>
                );
            }
            paginationItems.push(
                <span
                    className={`ncc-hr-pagination-item ${current === pageCount ? 'active' : THEME.borderC}`}
                    onClick={this.changePage(pageCount)}
                    style={{
                        color: current === pageCount ? '' : getColor().color, // active 时 显示红色字体
                        backgroundColor: getColor().bgColor
                    }}
                >
					{pageCount}
				</span>
            );
        }

        function pushPage(i) {
            let classList = ['ncc-hr-pagination-item'];
            if (parseInt(current) === i + 1) {
                classList.push('active');
            } else {
                classList.push(THEME.borderC);
            }

            paginationItems.push(
                <span
                    className={classList.join(' ')}
                    key={i}
                    onClick={this.changePage(i + 1)}
                    style={{
                        color: classList.includes('active') ? '' : getColor().color, // active 时 显示红色字体
                        backgroundColor: getColor().bgColor
                    }}
                >
					{i + 1}
				</span>
            );
        }

        return paginationItems;
    }

    searchInput(value) {
        if (value > 100000) {
            value = 100000;
        }
        if(!value)return
        this.setState({
            searchInputValue: value
        });

        'onInput' in this.props && this.props.onInput(value);
    }

    blurSearchInput() {
        const {searchInputValue} = this.state;

        if (!searchInputValue || searchInputValue === '0') {
            return;
        }
        if (new RegExp(`^[1-9]+[0-9]*[0-9]*$`).test(searchInputValue)) {
            this.changePageSize(searchInputValue);
        }

        'onBlur' in this.props && this.props.onBlur(searchInputValue);
    }

    render() {
        const {
            showQuickJumper,
            showSizeChanger,
            pageSizeOptions = [5, 10, 20, 50, 100],
            defaultPageSize = 10,
            hideOnSinglePage = false,
            pageSize: propsPageSize,
            showSizeInput,
            hasRightPadding = false,
            total
        } = this.props;

        const {quickJumperInput, language, pageSize, customPageSize} = this.state;
        let totalPage = this.getPageTotal();
        let currentPageSize = Number(propsPageSize ? propsPageSize : pageSize);

        if (totalPage === 1 && hideOnSinglePage) {
            return null;
        }
        return (
            <div className={`ncc-hr-pagination-wrapper ${hasRightPadding && 'have-right-padding'}`}>
				<span
                    className={`ncc-hr-pagination-item ${THEME.borderC} ${parseInt(this.props.current) === 1
                        ? 'disabledBtn'
                        : ''}`}
                    onClick={this.movePage('prev')}
                    style={{
                        color: getColor().color,
                        backgroundColor: getColor().bgColor
                    }}
                >
					{`<`}
				</span>
                {this.renderPaginationItems()}
                <span
                    className={`ncc-hr-pagination-item ${THEME.borderC} ${parseInt(this.props.current) === totalPage ||
                    !totalPage
                        ? 'disabledBtn'
                        : ''}`}
                    onClick={this.movePage('next')}
                    style={{
                        color: getColor().color,
                        backgroundColor: getColor().bgColor
                    }}
                >
					{'>'}
				</span>
                {/*{!!showSizeInput &&
				!showSizeChanger && [
					<input
						className={`ncc-hr-pagination-input`}
						value={customPageSize}
						onChange={this.changePageSizeInput}
						onKeyUp={this.doChangePageSizeInput}
					/>,
					<span
						className={`ncc-hr-pagination-letter`}
						style={{
							color: getColor().color
						}}
					>
						{language['hrpub-000084'] /** 条 *!//{language['hrpub-000085'] /** 页 *!/
					</span>
				]}*/}
                <span className="ncc-hr-pagination-select-wrapper">
						<NCSelect
                            className={`ncc-hr-pagination-select`}
                            onChange={this.changePageSize}
                            defaultValue={defaultPageSize}
                            value={parseInt(currentPageSize)}
                            supportWrite={true}
                            showSearch={true}
                            supportSearch={true}
                            onSearch={this.searchInput}
                            onKeyDown={debounce(this.blurSearchInput, 800)}
                            onBlur={this.blurSearchInput}
                        >
							{pageSizeOptions.map((item, index) => {
                                return (
                                    <NCOption key={index} value={item}>
                                        {item}
                                    </NCOption>
                                );
                            })}
						</NCSelect>
					</span>
                <span
                    className={`ncc-hr-pagination-letter`}
                    style={{
                        color: getColor().color
                    }}
                >
						{language['hrpub-000084'] /** 条 */}/{language['hrpub-000085'] /** 页 */}
					</span>
                <span
                    className={`ncc-hr-pagination-letter`}
                    style={{
                        color: getColor().color
                    }}
                >
					{language['hrpub-000126'] /** 共 */}
                    {total}
                    {language['hrpub-000084'] /** 条 */}
				</span>
                {!!showQuickJumper && [
                    <span
                        className={`ncc-hr-pagination-letter`}
                        style={{
                            color: getColor().color
                        }}
                    >
						{language['hrpub-000086'] /** 跳至 */}
					</span>,
                    <input
                        className={`ncc-hr-pagination-input`}
                        value={quickJumperInput}
                        onChange={this.changeQuickJumper}
                        onKeyUp={this.quickJumperKeyUp}
                    />,
                    <span
                        className={`ncc-hr-pagination-letter`}
                        style={{
                            color: getColor().color
                        }}
                    >
						{language['hrpub-000085'] /** 页 */}
					</span>
                ]}
            </div>
        );
    }
}

export default Pagination;
