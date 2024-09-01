/*
 * @Author: xiahui 
 * @PageInfo: 数据源面板
 * @Date: 2019-03-05 13:45:51 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2022-03-11 10:37:33
 */
import React, { Component } from 'react';
import { base, ajax, formDownload } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';

const { NCButton, NCModal, NCHotKeys, NCTooltip } = base;
const { Header, Title, Body, Footer } = NCModal;

const URL = {
	// 数据源配置-查询
	query: '/nccloud/scmpub/datasource/query.do',
	// 数据源配置-确认
	confirm: '/nccloud/scmpub/datasource/confirm.do'
};

// 命名常量
const DSNAME = {
	treeName: 'dataSourceTree',
	fileName: '数据源配置.xml'
};

class DataSourceDlg extends Component {
	constructor() {
		super();
		this.state = {};
		this.pk_checked = null; // 数据源配置勾选数据主键
		this.isFlag = false;
		this.billType = null; // 单据类型
		initLang(this, [ '4001components' ], 'scmpub');
	}

	componentWillReceiveProps(nextProps) {
		let { show } = nextProps;
		if (show && !this.isFlag) {
			this.billType = nextProps.billType;
			// 设置界面初始数据
			ajax({
				url: URL.query,
				data: {
					billType: this.billType
				},
				success: (res) => {
					if (res.success && res.data) {
						this.isFlag = true;
						addBeforeName(res.data.rows);
						this.props.asyncTree.setTreeData(DSNAME.treeName, res.data.rows);
						this.props.asyncTree.openNodeByPkAsync(DSNAME.treeName, res.data.rows[0].refpk);
					}
				}
			});
		}
	}

	loadTreeData = (pk, treeNode) => {
		ajax({
			url: URL.query,
			data: {
				metaparams: pk
			},
			success: (res) => {
				if (res.success && res.data) {
					addBeforeName(res.data.rows);
					this.props.asyncTree.setTreeData(DSNAME.treeName, res.data.rows, treeNode);
				}
			}
		});
	};

	render() {
		let { show, asyncTree } = this.props;
		let { createAsyncTree } = asyncTree;
		return (
			<NCModal show={show} onHide={this.props.close} size="md" className="data-source-dlg">
				<NCHotKeys
					keyMap={{
						confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
						cancelBtnHandler: 'ALT+N'
					}}
					handlers={{
						confirmBtnHandler: confirmBtnClick.bind(this),
						cancelBtnHandler: this.props.close
					}}
					className="simpleModal-hotkeys-wrapper"
					focused={true}
					attach={document.body}
				/>
				<Header closeButton>
					<Title>{getLangByResId(this, '4001COMPONENTS-000026') /* 国际化处理： 数据集*/}</Title>
				</Header>
				<Body>
					{createAsyncTree({
						treeId: DSNAME.treeName,
						loadTreeData: this.loadTreeData.bind(this), //加载子节点数据
						checkable: true,
						editType: false,
						checkStrictly: false,
						onCheckEve: (props, checkedKeys, { checked, checkedNodes, node, event }) => {
							this.pk_checked = checkedKeys;
						}
					})}
				</Body>
				<Footer>
					<NCTooltip
						placement="top"
						inverse
						overlay={`${getLangByResId(this, '4001COMPONENTS-000000')} (Alt+Y)`}
						trigger={[ 'focus', 'hover' ]}
						className="model-helper-overlay"
					>
						<NCButton onClick={confirmBtnClick.bind(this)} className="button-primary" fieldid="confirm">
							{getLangByResId(this, '4001COMPONENTS-000000')}(<u>Y</u>){/* 国际化处理： 确定*/}
						</NCButton>
					</NCTooltip>
					<NCTooltip
						placement="top"
						inverse
						overlay={`${getLangByResId(this, '4001COMPONENTS-000001')} (Alt+N)`}
						trigger={[ 'focus', 'hover' ]}
						className="model-helper-overlay"
					>
						<NCButton onClick={this.props.close} fieldid="cancel">
							{getLangByResId(this, '4001COMPONENTS-000001')}(<u>N</u>){/* 国际化处理： 取消*/}
						</NCButton>
					</NCTooltip>
				</Footer>
			</NCModal>
		);
	}
}

/**
 * 添加显示的前名称
 * @param {*} data 
 */
function addBeforeName(rows) {
	rows.map((row) => {
		Object.assign(row, { beforeName: row.refcode });
	});
}

/**
 * 数据源配置, 确认操作
 */
function confirmBtnClick() {
	if (!this.pk_checked) return;
	let data = new Map();
	this.pk_checked.map((pk) => {
		let treeNode = this.props.asyncTree.getAsyncTreeValue(DSNAME.treeName, pk);
		data.set(treeNode.fullPath, treeNode.refname);
	});

	formDownload({
		params: {
			billType: this.billType,
			checkNodes: JSON.stringify(data),
			fileName: DSNAME.fileName
		},
		url: URL.confirm,
		enctype: 1
	});
}

export default DataSourceDlg;
