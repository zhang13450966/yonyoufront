/*
 * @Author: huangkwf 
 * @Date: 2018-05-28 15:22:46 
 * @Last Modified by: yanxbm
 * @Last Modified time: 2019-05-24 17:11:53
 */

import React, { Component } from 'react';
import { getMultiLang, base } from 'nc-lightapp-front';
import PropTypes from 'prop-types';
import List from './list';
import Operation from './operation';
import { initState } from './method';
import './index.less';

const { NCFormControl } = base;

export default class MulTargetTransfer extends Component {
	constructor(props) {
		super(props);
		let { topTargetKeys = [], bottomTargetKeys = [], selectedKeys = [] } = props;
		let { sourceSelectedKeys, tTargetSelectedKeys, bTargetSelectedKeys } = initState(
			selectedKeys,
			topTargetKeys,
			bottomTargetKeys
		);
		this.state = {
			leftData: this.props.dataSource,
			topTargetKeys: [ ...topTargetKeys ], //上方目标区域key值集合
			bottomTargetKeys: [ ...bottomTargetKeys ], //下方目标区域key值集合
			sourceSelectedKeys,
			tTargetSelectedKeys,
			bTargetSelectedKeys,
			showTab: 0,
			searchValue: '',
			json: {},
			inlt: null
		};
		// this.tabs = ['消息','邮件'];
		this.dataSource = this.props.dataSource;
		this.onSearchChange = this.onSearchChange.bind(this);
	}
	componentWillMount(){
		let callback = (json, status, inlt) => {
			if(status){
				this.setState({json, inlt});
			}else{
				console.log('未加载 containers_approvecomment.json 多语文件')
			}
		}
		getMultiLang({
			moduleId: 'containers_approvecomment',
			domainName: 'uap',
			callback
		});
	}
	componentDidMount(){
	}
	componentWillReceiveProps(nextProps) {
		console.log('dataSource', nextProps)
		if((this.props.topTargetKeys && nextProps.topTargetKeys && nextProps.topTargetKeys.length != this.props.topTargetKeys.length) || 
			(this.props.bottomTargetKeys && nextProps.bottomTargetKeys && nextProps.bottomTargetKeys.length != this.props.bottomTargetKeys.length)) {
			let { topTargetKeys = [], bottomTargetKeys = [], selectedKeys = [] } = nextProps;
			let { sourceSelectedKeys, tTargetSelectedKeys, bTargetSelectedKeys } = initState(
				selectedKeys,
				topTargetKeys,
				bottomTargetKeys
			);
			this.setState({
				leftData: nextProps.dataSource,
				topTargetKeys: [ ...topTargetKeys ],
				bottomTargetKeys: [ ...bottomTargetKeys ],
				sourceSelectedKeys,
				tTargetSelectedKeys,
				bTargetSelectedKeys
			});
		}
		
	
		
	}
	// 拆分DataSource
	splitDataSource = () => {
		let res = { leftData: [], tTargetData: [], bTargetData: [] };
		let { topTargetKeys = [], bottomTargetKeys = [] } = this.state;
		let dataSource = [ ...this.props.dataSource ];
		topTargetKeys.forEach((key, index) => {
			dataSource.forEach((item, i) => {
				if (item['key'] == key) {
					res.tTargetData.push(item);
					//dataSource.splice(i, 1);
				}
			});
		});
		bottomTargetKeys.forEach((key, index) => {
			dataSource.forEach((item, i) => {
				if (item['key'] == key) {
					res.bTargetData.push(item);
					//dataSource.splice(i, 1);
				}
			});
		});
		// res.leftData = dataSource;
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
		let { onChange } = this.props;
		let splitDataRes;
		if (direction == 'right') {
			selectedKeys = [ ...this.state['sourceSelectedKeys'] ];
			//去重---已添加的不再选中
			if('allTargetKeys' != targetKeys) {//点击的是非全部类型,则按照各自state对应值转移至数组
				let tarKeys = [ ...this.state[targetKeys] ];
				selectedKeys.forEach((item)=>{
					if(!tarKeys.includes(item)){
						tarKeys.push(item);
					}
				})
				this.setState({ [targetKeys]: tarKeys, sourceSelectedKeys: [] }, () => {
					//splitDataRes = this.splitDataSource();
					if (onChange && typeof onChange === 'function') {
						let { topTargetKeys, bottomTargetKeys } = this.state;
						onChange({ topTargetKeys, bottomTargetKeys });
					}
				});
			}else {
				let tarKeys = [ ...this.state.topTargetKeys ];
				let bottomTarKeys = [ ...this.state.bottomTargetKeys ];
				let bottomSelectedKeys = [];
				selectedKeys.forEach((item)=>{
					if(!tarKeys.includes(item)){
						tarKeys.push(item);
					}
				})
				selectedKeys.forEach((item)=>{
					if(!bottomTarKeys.includes(item)){
						bottomTarKeys.push(item);
					}
				})
				this.setState({ ['topTargetKeys']: tarKeys, ['bottomTargetKeys'] :bottomTarKeys,sourceSelectedKeys: [] }, () => {
					//splitDataRes = this.splitDataSource();
					if (onChange && typeof onChange === 'function') {
						let { topTargetKeys, bottomTargetKeys } = this.state;
						onChange({ topTargetKeys, bottomTargetKeys });
					}
				});
			}
		} else {
			selectedKeys = [ ...this.state[targetSelectedKeys] ];
			selectedKeys.forEach((key, index) => {
				let i = tarKeys.indexOf(key);
				tarKeys.splice(i, 1);
			});
			this.setState({ [targetKeys]: tarKeys, [targetSelectedKeys]: [] }, () => {
				//splitDataRes = this.splitDataSource();
				if (onChange && typeof onChange === 'function') {
					let { topTargetKeys, bottomTargetKeys } = this.state;
					onChange({ topTargetKeys, bottomTargetKeys });
				}
			});
		}
		this.setState({
			leftData: this.dataSource
		});
	};
	//源数据和目标1之间转移数据
	moveToRTop = (direction) => {
		this.moveTo(direction, 'topTargetKeys', 'tTargetSelectedKeys');
	};
	//源数据和目标2之间转移数据
	moveToRBottom = (direction) => {
		this.moveTo(direction, 'bottomTargetKeys', 'bTargetSelectedKeys');
	};

	moveToRAll = (direction) => {//全部类型转移
		this.moveTo(direction, 'allTargetKeys', 'allTargetSelectedKeys');
	}


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

	onSearchChange = (value) => {
		console.log('value', value);
		// value.replace(/^\s+|\s+$/g,'');
		let regStr = '^\\s+|\\s+$'
		let trimValue = value.replace(new RegExp(regStr, 'g'),'');
		let dataSource = this.dataSource;
		if(trimValue !== ''){
			this.setState({
				searchValue: trimValue,
				leftData: dataSource.filter(item => {
					return item.user_name.value.includes(trimValue) || item.user_code.value.includes(trimValue);
				})
			});
		}else{
			this.setState({
				searchValue: trimValue,
				leftData: dataSource
			});
		}
	}

	render() {
		let leftData = this.state.leftData;
		let { tTargetData, bTargetData } = this.splitDataSource();
		let { sourceSelectedKeys, tTargetSelectedKeys, bTargetSelectedKeys, topTargetKeys, bottomTargetKeys, json } = this.state;
		let { className, showSortBtn } = this.props;
		let targetArr = [tTargetData,bTargetData];
		let titles = [json['index_000'], json['multargettransfer_004'], json['multargettransfer_005']]; // index__000 用户 multargettransfer_004 目标一 multargettransfer_005 目标二
		this.tabs = [json['multargettransfer_000'], json['multargettransfer_001']];  // multargettransfer_000 消息  multargettransfer_001 邮件
		return (
			<div className={className?`${className} user-transfer` : 'user-transfer'}>
				<div className="list-wrapper nc-theme-l-area-bgc">
					<div className="user-transfer-source-list nc-theme-area-split-bc source-list nc-theme-transfer-wrap-bgc">
						{/* multargettransfer_006 用户 */}
						<h2 className="nc-theme-transfer-list-header-c nc-theme-transfer-list-header-bgc">{json['multargettransfer_006']}</h2>
						<NCFormControl
							fieldid="search"
							type="search"
							value={this.state.searchValue}
							className = "source-search"
							value={this.state.searchValue}
							onChange={this.onSearchChange}
						/>
						<List
							className="user-transfer-list nc-theme-transfer-list-body-bgc"
							showAllCheck = {true}
							showCheck = {true}
							title={titles[0]}
							dataSource={leftData}
							selectedKeys={sourceSelectedKeys}
							allCheckChange={this.sourceAllCheckChange.bind(this, leftData)}
							itemClick={this.handleLeftSelect}
						/>
					</div>
				</div>
				<div className="user-transfer-operation-group">
					<div className="operation-container">
						<Operation
							className="user-transfer-operation"
							moveTo={this.moveToRTop}
							content={json['multargettransfer_000']} // multargettransfer_000 消息
							sourceSelectedKeys={sourceSelectedKeys}
							targetSelectedKeys={tTargetSelectedKeys}
						/>
						<Operation
							className="user-transfer-operation"
							moveTo={this.moveToRBottom}
							content={json['multargettransfer_001']} // multargettransfer_001 邮件
							sourceSelectedKeys={sourceSelectedKeys}
							targetSelectedKeys={bTargetSelectedKeys}
						/>
						<Operation
							className="user-transfer-operation"
							moveTo={this.moveToRAll}
							content={json['multargettransfer_002']} // multargettransfer_002 全部类型
						/>
					</div>
				</div>
				<div className="list-wrapper nc-theme-l-area-bgc">
					<div className="user-transfer-target-list nc-theme-area-split-bc target-list nc-theme-transfer-wrap-bgc">
						<ul className="list-tab nc-theme-transfer-list-header-bgc">
							{this.tabs.map((item, index)=>{
								return <li className={this.state.showTab===index?"active list nc-theme-copytransfer-list-header-c":"list nc-theme-transfer-list-header-c"}
									onClick={()=>{
										this.setState({
											showTab: index
										})
									}}
								>{item} 
								{/* multargettransfer_007 人 */}
								<span className="info">{`(${targetArr && targetArr[index] && targetArr[index].length}${json['multargettransfer_007']})`}</span>
								</li>
							})}
						</ul>
						<List
							className={this.state.showTab === 0?"show-list user-transfer-list nc-theme-transfer-list-body-bgc":"hide-list user-transfer-list"}
							showAllCheck = {false}
							deleteItem = {(key)=>{
								topTargetKeys=topTargetKeys.filter((item)=>item!=key);
								this.props.onChange &&this.props.onChange({
									topTargetKeys : topTargetKeys,
									bottomTargetKeys : bottomTargetKeys
								})
							}}
							showCheck = {false}
							dataSource={tTargetData}
							selectedKeys={tTargetSelectedKeys}
						/>
						<List
							className={this.state.showTab === 1?"show-list user-transfer-list nc-theme-transfer-list-body-bgc":"hide-list user-transfer-list"}
							showAllCheck = {false}
							deleteItem = {(key)=>{
								bottomTargetKeys=bottomTargetKeys.filter((item)=>item !=key);
								this.props.onChange &&this.props.onChange({
									bottomTargetKeys : bottomTargetKeys,
									topTargetKeys: topTargetKeys
								})
							}}
							showCheck = {false}
							dataSource={bTargetData}
							selectedKeys={bTargetSelectedKeys}
						/>
					</div>
				</div>
			</div>
		);
	}
}

MulTargetTransfer.defaultProps = {
	className: [],
	dataSource: [],
	showSortBtn: true,
	onChange: null,
	topTargetKeys: [],
	selectedKeys: [],
	bottomTargetKeys: [],
	// titles: [ '数据源', '目标一', '目标二' ]
};
MulTargetTransfer.propTypes = {
	className: PropTypes.array,
	dataSource: PropTypes.array,
	showSortBtn: PropTypes.bool,
	onChange: PropTypes.func,
	topTargetKeys: PropTypes.array,
	selectedKeys: PropTypes.array,
	bottomTargetKeys: PropTypes.array,
	titles: PropTypes.array
};
