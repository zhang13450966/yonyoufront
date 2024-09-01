/*
 * @Author: huangkwf 
 * @Date: 2018-05-28 15:23:16 
 * @Last Modified by:   huangkwf 
 * @Last Modified time: 2018-05-28 15:23:16 
 */

import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
const { NCCheckbox } = base;

export default class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allCheck: {
				openList: false,
				checked: false,
				indeterminate: false
			}
		};
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

	//删除
	deleteItem = (item) =>{
		this.props.deleteItem && this.props.deleteItem(item);
	}

	//全选改变状态回调
	allCheckChange = () => {
		let { checked, indeterminate } = this.state.allCheck;
		if (checked) {
			this.state.allCheck.checked = false;
			this.state.allCheck.indeterminate = false;
		} else {
			this.state.allCheck.checked = true;
			this.state.allCheck.indeterminate = false;
		}
		this.setState({ allCheck: this.state.allCheck });
		this.props.allCheckChange && this.props.allCheckChange(this.state.allCheck.checked);
	};

	render() {
		let { dataSource, selectedKeys, className, title, showSortBtn,showAllCheck, showCheck } = this.props;
		let { checked, indeterminate } = this.state.allCheck;
		return (
			<div className={className}>
				{showAllCheck && <div className="user-transfer-list-header">
					<NCCheckbox onClick={this.allCheckChange} checked={checked} indeterminate={indeterminate} />
					<span 
						className={`iconfont icon ${this.state.openList?'icon-jiantouxia1':'icon-jiantouyou'}`}
						onClick={()=>{
							this.setState({
								openList: !this.state.openList
							})
						}}
						>
					</span>
					<span className="user-transfer-list-header-title">{title}</span>
				</div> }
				<div className={`${!this.state.openList && showAllCheck&& 'hide-list'} user-transfer-list-body`}>
					<ul className="user-transfer-list-content">
						{dataSource.map((item, index) => {
							let checked = selectedKeys.indexOf(item.key) != -1 ? true : false;
							return <li 
								className="user-transfer-list-content-item"
								key={item.key}
								onClick={showCheck && this.itemClick.bind(this,item)}>
								{showCheck &&<NCCheckbox 
									checked={checked} 
									colors="primary" 
								/>}
								<span>{`${item.user_code?item.user_code.value:''} ${item.user_name?item.user_name.value:''} `}</span>
								{!showCheck &&<span 
									className="close-item iconfont icon icon-guanbi"
									onClick = {this.deleteItem.bind(this,item.key)}
								></span>}
							</li>
						})}
					</ul>
				</div>
			</div>
		);
	}
}
