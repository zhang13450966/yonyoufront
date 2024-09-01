/*
 * @Author: huangkwf
 * @Date: 2018-05-28 15:23:16
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 13:18:02
 */

import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import Item from './item';
const { NCButton: Button, NCCheckbox: Checkbox } = base;
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';

export default class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allCheck: {
				checked: false,
				indeterminate: false
			}
		};
		initLang(this, [ '4001components' ], 'scmpub', () => this.setState(this.state));
	}
	componentWillReceiveProps(nextProps) {
		let { dataSource, selectedKeys } = nextProps;
		let resCheck = this.cumputedCheckStatus(dataSource, selectedKeys);
		this.setState({ allCheck: resCheck });
	}
	//计算全选按钮选中状态
	cumputedCheckStatus = (dataSource, selectedKeys) => {
		let checkedCount = 0,
			resCheck = { checked: false, indeterminate: false };
		if (dataSource.length) {
			for (let i = 0; i < dataSource.length; i++) {
				if (selectedKeys.indexOf(dataSource[i].key) != -1) {
					checkedCount++;
				}
			}
			if (checkedCount == dataSource.length) {
				resCheck.checked = true;
			} else if (checkedCount == 0) {
				resCheck.checked = false;
				resCheck.indeterminate = false;
			} else {
				resCheck.checked = false;
				resCheck.indeterminate = true;
			}
		}
		return resCheck;
	};
	//单行点击
	itemClick = (item) => {
		let { selectedKeys } = this.props;
		let check = selectedKeys.some((key) => {
			return item.key == key;
		});
		this.props.itemClick(item, !check);
	};
	//全选改变状态回调
	allCheckChange = () => {
		let { checked } = this.state.allCheck;
		if (checked) {
			this.state.allCheck.checked = false;
			this.state.allCheck.indeterminate = false;
		} else {
			this.state.allCheck.checked = true;
			this.state.allCheck.indeterminate = false;
		}
		this.setState({ allCheck: this.state.allCheck });
		this.props.allCheckChange(this.state.allCheck.checked);
	};
	//上移/下移
	sortMove = (direction) => {
		this.props.sortMove(direction);
	};
	render() {
		let { dataSource, selectedKeys, fieldid, title, showSortBtn, isDisabled } = this.props;
		let { checked, indeterminate } = this.state.allCheck;
		return (
			<div className="m-transfer-list nc-theme-transfer-wrap-bgc nc-theme-area-split-bc" fieldid={fieldid}>
				<div className="m-transfer-list-header nc-theme-transfer-list-header-bgc nc-theme-transfer-list-header-bc">
					<Checkbox
						fieldid={`m-title${dataSource.length}`}
						onClick={isDisabled ? () => {} : this.allCheckChange}
						checked={checked}
						disabled={isDisabled}
						indeterminate={indeterminate}
					/>
					<span className="m-transfer-list-header-title nc-theme-transfer-list-header-c">{title}</span>
					<span className="m-transfer-list-header-selected-count nc-theme-transfer-list-header-c">
						{selectedKeys.length > 0 ? `${selectedKeys.length}/` : ''}
						{dataSource.length}
					</span>
				</div>
				<div className="m-transfer-list-body nc-theme-transfer-list-body-bgc">
					<ul className="m-transfer-list-content">
						{dataSource.map((item) => {
							let checked = selectedKeys.indexOf(item.key) != -1 ? true : false;
							return (
								<Item
									isDisabled={isDisabled}
									key={item.key}
									checked={checked}
									itemClick={this.itemClick}
									item={item}
								/>
							);
						})}
					</ul>
				</div>
				{showSortBtn && (
					<div className="m-transfer-list-footer nc-theme-area-split-bc">
						<Button
							fieldid="up_btn"
							className="sort-move sort-top nc-theme-btn-secondary"
							disabled={selectedKeys.length == 1 ? false : true}
							onClick={this.sortMove.bind(this, 'up')}
						>
							{getLangByResId(this, '4001COMPONENTS-000020') /* 国际化处理： 上移*/}
						</Button>
						<Button
							fieldid="down_btn"
							className="sort-move sort-bottom nc-theme-btn-secondary"
							disabled={selectedKeys.length == 1 ? false : true}
							onClick={this.sortMove.bind(this, 'down')}
						>
							{getLangByResId(this, '4001COMPONENTS-000021') /*国际化处理： 下移*/}
						</Button>
					</div>
				)}
			</div>
		);
	}
}
