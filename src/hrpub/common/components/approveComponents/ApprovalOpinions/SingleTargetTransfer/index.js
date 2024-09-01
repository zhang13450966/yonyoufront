/*
 * @Author: huangkwf 
 * @Date: 2018-05-28 15:22:46 
 * @Last Modified by: yanxbm
 * @Last Modified time: 2019-05-24 16:37:38
 */

import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import PropTypes from 'prop-types';
const { NCFormControl } = base;
import List from './list';
import Operation from './operation';
import { initState } from './method';
// require('./index.less');

export default class SingleTargetTransfer extends Component {
	constructor(props) {
		super(props);
		let { targetKeys = [],selectedKeys = [] } = props;
		let { sourceSelectedKeys, tTargetSelectedKeys, bTargetSelectedKeys } = initState(
			selectedKeys,
			targetKeys,
		);
		this.state = {
			targetKeys: [ ...targetKeys ], //上方目标区域key值集合
			sourceSelectedKeys,
			tTargetSelectedKeys,
			bTargetSelectedKeys,
			showTab: 0
		};
		// singletargettransfermodal_001 消息  singletargettransfermodal_002 邮件
		this.tabs = [this.props.json['singletargettransfermodal_001'], this.props.json['singletargettransfermodal_002']];
	}
	componentWillReceiveProps(nextProps) {
		let { targetKeys = [], selectedKeys = [] } = nextProps;
		let { sourceSelectedKeys, tTargetSelectedKeys, bTargetSelectedKeys } = initState(
			selectedKeys,
			targetKeys
		);
		this.setState({
			targetKeys: [ ...targetKeys ],
			sourceSelectedKeys,
			tTargetSelectedKeys,
			bTargetSelectedKeys
		});
	}
	// 拆分DataSource
	splitDataSource = () => {
		let res = { leftData: [], tTargetData: [], bTargetData: [] };
		let { targetKeys = [] } = this.state;
		let dataSource = [ ...this.props.dataSource ];
		targetKeys.forEach((key, index) => {
			dataSource.forEach((item, i) => {
				if (item['key'] == key) {
					res.tTargetData.push(item);
					//dataSource.splice(i, 1);
				}
			});
		});
		res.leftData = dataSource;
		return res;
	};


	//获取选中集合名称
	getSelectedKeysName = (direction) => {
		let selectedKeysName;
		switch (direction) {
			case 'left':
				selectedKeysName = 'sourceSelectedKeys';
				break;
			case 'rTop':
				selectedKeysName = 'tTargetSelectedKeys';
				break;
			case 'rBottom':
				selectedKeysName = 'bTargetSelectedKeys';
				break;
			default:
				break;
		}
		return selectedKeysName;
	};


	//单行选中/取消
	itemClick = (direction, item, check) => {
		let handleSelectedKeys = [];
		let { sourceSelectedKeys, tTargetSelectedKeys, bTargetSelectedKeys } = this.state;
		switch (direction) {
			case 'left':
				handleSelectedKeys = [ ...sourceSelectedKeys ];
				break;
			case 'rTop':
				handleSelectedKeys = [ ...tTargetSelectedKeys ];
				break;
			case 'rBottom':
				handleSelectedKeys = [ ...bTargetSelectedKeys ];
				break;
			default:
				break;
		}
		if (check) {
			handleSelectedKeys.push(item.key);
		} else {
			let index = handleSelectedKeys.indexOf(item.key);
			handleSelectedKeys.splice(index, 1);
		}
		let selectedKeysName = this.getSelectedKeysName(direction);
		this.setState({ [selectedKeysName]: handleSelectedKeys });
	};
	//单行点击源数据
	handleLeftSelect = (item, check) => {
		this.itemClick('left', item, check);
	};



	//转移数据
	moveTo = (direction, targetKeys, targetSelectedKeys) => {
		let selectedKeys = [];
		let tarKeys = [ ...this.state[targetKeys] ];
		let { onChange } = this.props;
		let splitDataRes;
		if (direction == 'right') {
			selectedKeys = [ ...this.state['sourceSelectedKeys'] ];
			//去重---已添加的不再选中
			selectedKeys.forEach((item)=>{
				if(!tarKeys.includes(item)){
					tarKeys.push(item);
				}
			})
			this.setState({ [targetKeys]: tarKeys, sourceSelectedKeys: [] }, () => {
				//splitDataRes = this.splitDataSource();
				if (onChange && typeof onChange === 'function') {
					let { targetKeys} = this.state;
					onChange(targetKeys);
				}
			});
		} else {
			selectedKeys = [ ...this.state[targetSelectedKeys] ];
			selectedKeys.forEach((key, index) => {
				let i = tarKeys.indexOf(key);
				tarKeys.splice(i, 1);
			});
			this.setState({ [targetKeys]: tarKeys, [targetSelectedKeys]: [] }, () => {
				//splitDataRes = this.splitDataSource();
				if (onChange && typeof onChange === 'function') {
					let { targetKeys} = this.state;
					onChange(targetKeys);
				}
			});
		}
	};
	//源数据和目标1之间转移数据
	moveToRTop = (direction) => {
		this.moveTo(direction, 'targetKeys', 'tTargetSelectedKeys');
	};

	//列表全选
	allCheckChange = (dataSource, selectedKeysName, checkedStatus) => {
		if (checkedStatus) {
			let newSelectedKeys = dataSource.map((item) => {
				return item.key;
			});
			this.setState({ [selectedKeysName]: newSelectedKeys });
		} else {
			this.setState({ [selectedKeysName]: [] });
		}
	};
	//源数据全选操作
	sourceAllCheckChange = (dataSource, checkedStatus) => {
		this.allCheckChange(dataSource, 'sourceSelectedKeys', checkedStatus);
	};

	render() {
		let { leftData, tTargetData, bTargetData } = this.splitDataSource();
		let { sourceSelectedKeys, tTargetSelectedKeys, bTargetSelectedKeys, targetKeys } = this.state;
		let { className, json } = this.props;
		let targetArr = [tTargetData,bTargetData]
		return (
			<div className={className?`${className} user-transfer` : 'user-transfer'}>
				<div className="user-transfer-source-list source-list nc-theme-transfer-wrap-bgc">
					<NCFormControl
						type="search"
						className = "source-search"
					/>
					<List
						className="user-transfer-list nc-theme-transfer-list-body-bgc"
						showAllCheck = {true}
						showCheck = {true}
						title={'singletargettransfermodal_000'} // singletargettransfermodal_000 用户
						dataSource={leftData}
						selectedKeys={sourceSelectedKeys}
						allCheckChange={this.sourceAllCheckChange.bind(this, leftData)}
						itemClick={this.handleLeftSelect}
					/>
				</div>
				<div className="user-transfer-operation-group">
					<Operation
						className="user-transfer-operation"
						moveTo={this.moveToRTop}
						content={json['singletargettransfermodal_007']} // singletargettransfermodal_007 选择
						sourceSelectedKeys={sourceSelectedKeys}
						targetSelectedKeys={tTargetSelectedKeys}
					/>
				</div>
				<div className="user-transfer-target-list target-list nc-theme-transfer-wrap-bgc">
					<List
						className={this.state.showTab === 0?"show-list user-transfer-list nc-theme-transfer-list-body-bgc":"hide-list user-transfer-list"}
						showAllCheck = {false}
						deleteItem = {(key)=>{
							targetKeys=targetKeys.filter((item)=>item!=key);
							this.props.onChange &&this.props.onChange(targetKeys)
						}}
						showCheck = {false}
						dataSource={tTargetData}
						selectedKeys={tTargetSelectedKeys}
					/>
				</div>
			</div>
		);
	}
}

SingleTargetTransfer.defaultProps = {
	className: [],
	dataSource: [],
	showSortBtn: true,
	onChange: null,
	targetKeys: [],
	selectedKeys: []
};
SingleTargetTransfer.propTypes = {
	className: PropTypes.array,
	dataSource: PropTypes.array,
	showSortBtn: PropTypes.bool,
	onChange: PropTypes.func,
	targetKeys: PropTypes.array,
	selectedKeys: PropTypes.array
};
