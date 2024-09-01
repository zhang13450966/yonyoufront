/*
 * @Author: huangkewei 
 * @Date: 2018-04-17 10:55:13 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-23 09:52:03
 */
import React, { Component } from 'react';
import { ajax } from 'nc-lightapp-front';
import { defaultRuleInfo } from '../event/config';
import { queryTreeData } from './method';
import { BATCHCODERULE_CONST } from '../const';

export default class LeftTree extends Component {
	constructor() {
		super();
	}
	componentDidMount() {
		let { syncTree } = this.props.NCProps;
		queryTreeData('tree', this.props.NCProps, null);
	}

	// 选中节点事件-查询具体物料分类设置的批次规则
	selectTree = (val, node, treeData) => {
		this.props.getPk('pk_marbasclass', val);
		ajax({
			url: BATCHCODERULE_CONST.QUERYURL,
			data: { pk_marbasclass: val },
			success: (res) => {
				if (res.success) {
					if (res.data) {
						let ruleInfo = { ...defaultRuleInfo, ...res.data.batchcoderule.rows[0].values };
						this.props.queryNodeRule(ruleInfo);
					} else {
						const item = {
							vprefix: { value: '' },
							object1: { value: '' },
							object2: { value: '' },
							vyear: { value: '' },
							vmonth: { value: '' },
							vday: { value: '' },
							snnum: { value: '0' },
							vsuffix: { value: '' },
							obj1length: { value: '' },
							obj2length: { value: '' },
							snresetflag: { value: '0' }
						};
						this.props.queryNodeRule(item);
					}
				}
			}
		});
	};

	handleIsEdit = (val) => {
		this.props.getPk('pk_marbasclass', val.refpk);
		this.selectTree(val.refpk);
		this.props.handleIsEdit();
	};

	onMouseEnterEve = (key) => {
		let { syncTree } = this.props.NCProps;
		let obj = {
			delIcon: false, // false:隐藏； true:显示; 默认都为true显示
			editIcon: true,
			addIcon: false
		};
		syncTree.hideIcon('tree', key, obj);
	};

	render() {
		let { syncTree } = this.props.NCProps;
		return (
			<div>
				{syncTree.createSyncTree({
					treeId: 'tree', // 树组件id
					needSearch: false,
					needEdit: true,
					showModal: false,
					showLine: true,
					clickEditIconEve: this.handleIsEdit.bind(this),
					onMouseEnterEve: this.onMouseEnterEve.bind(this),
					onSelectEve: this.selectTree.bind(this) // 节点点击事件
				})}
			</div>
		);
	}
}
