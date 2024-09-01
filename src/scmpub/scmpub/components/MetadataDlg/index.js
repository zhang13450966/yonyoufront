/*
 * @Author: xiahui 
 * @PageInfo: 元数据树面板
 * @Date: 2019-03-05 13:45:51 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-07-06 09:56:35
 */
import React, { Component } from 'react';
import { base, ajax, toast } from 'nc-lightapp-front';
import './index.less';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';

const { NCButton, NCModal } = base;
const { Header, Title, Body, Footer } = NCModal;

const URL = {
	// 数据源配置-查询
	query: '/nccloud/scmpub/datasource/query.do'
};
let codeNameMap = new Map();
class DataSourceDlg extends Component {
	constructor(props) {
		super(props);
		this.state = {
			valObj: this.keysToValueObj(props.keysStr) // 存放单元格的display和value，display用于显示，value用于保存
		};
		this.pk_checked = null; // 数据源配置勾选数据主键
		this.voMeta = null; //元数据
		initLang(this, [ '4001components' ], 'scmpub');
	}
	// value字符串转成包含display和value的对象
	keysToValueObj = (keys) => {
		// 传进来的keys可能是逗号分隔的key组成的字符串或者targetkeys数组
		let targetKeys;
		if (typeof keys === 'string') {
			targetKeys = this.keysStrToTargetKeys(keys);
		} else if (keys instanceof Array) {
			targetKeys = keys;
		} else {
			return { display: '', value: '' };
		}

		let valueObj = targetKeys.reduce((prev, cur_key, index) => {
			let curItem = this.findItemsByKey(cur_key, this.props.dataSource);
			if (curItem) {
				return {
					display: index == 0 ? curItem.title : prev.display + ', ' + curItem.title,
					value: index == 0 ? curItem.key : prev.value + ',' + curItem.key
				};
			} else {
				return prev;
			}
		}, '');
		return valueObj ? valueObj : { display: '', value: '' };
	};

	componentWillReceiveProps(nextProps) {
		let oldshowModal = this.props.showModal;
		let { showModal } = nextProps;
		if (showModal && oldshowModal !== showModal) {
			this.voMeta = nextProps.voMeta;
			// 设置界面初始数据
			ajax({
				url: URL.query,
				data: {
					voMeta: this.voMeta
				},
				success: (res) => {
					if (res.success && res.data) {
						addBeforeName(res.data.rows);
						this.props.asyncTree.setTreeData('tree1', res.data.rows);
						this.props.asyncTree.openNodeByPkAsync('tree1', res.data.rows[0].refpk, true);
					} else {
						this.props.asyncTree.setTreeData('tree1', []);
					}
				},
				error: (res) => {
					let msgContent = JSON.stringify(res.message);
					toast({ color: 'danger', content: msgContent });
					this.props.asyncTree.setTreeData('tree1', []);
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
					this.props.asyncTree.setTreeData('tree1', res.data.rows, treeNode);
				}
			}
		});
	};

	render() {
		let { showModal, asyncTree, title } = this.props;
		let { createAsyncTree } = asyncTree;
		return (
			<NCModal
				fieldid="metadata_dlg"
				show={showModal}
				onHide={this.props.close}
				size="md"
				className="data-source-dlg"
			>
				<Header fieldid="metadata_head" closeButton>
					<Title fieldid="metadata_title">{title}</Title>
				</Header>
				<Body fieldid="metadata_body">
					{createAsyncTree({
						treeId: 'tree1',
						loadTreeData: this.loadTreeData.bind(this), //加载子节点数据
						checkable: false,
						needEdit: false,
						onSelectEve: (props, checkedKeys, {}) => {
							let refcodeall = checkedKeys.fullPath.substring(
								checkedKeys.fullPath.indexOf('.') + 1,
								checkedKeys.fullPath.length
							);
							let refcodesplit = [];
							let refnameall;
							refcodesplit = refcodeall.split('.');
							if (refcodesplit.length > 1) {
								refcodesplit.forEach((item, index) => {
									for (let codeKey of codeNameMap.keys()) {
										if (index < refcodesplit.length - 1 && item !== '') {
											if (codeKey == item) {
												if (refnameall == undefined) {
													refnameall = codeNameMap.get(codeKey) + '.';
												} else {
													refnameall = refnameall + codeNameMap.get(codeKey) + '.';
												}
												return;
											}
										} else {
											refnameall = refnameall + checkedKeys.refname;
											break;
										}
									}
								});
							} else {
								(refcodeall = checkedKeys.refcode), (refnameall = checkedKeys.refname);
							}
							this.pk_checked = {
								refcode: refcodeall,
								refname: refnameall
							};
						}
					})}
				</Body>
				<Footer>
					<NCButton fieldid="metadatasure_btn" onClick={beSureBtnClick.bind(this)} className="button-primary">
						{getLangByResId(this, '4001COMPONENTS-000000') /* 国际化处理： 确定*/}
					</NCButton>
					<NCButton fieldid="metadatacancle_btn" onClick={this.props.close}>
						{getLangByResId(this, '4001COMPONENTS-000001') /* 国际化处理： 取消*/}
					</NCButton>
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
		if (!row.isleaf) {
			codeNameMap.set(row.refcode, row.refname);
		}
	});
}
/**
 * 确认操作
 */
function beSureBtnClick() {
	this.props.close();
	if (this.pk_checked) {
		// this.props.onBlur({ display: this.pk_checked.refcode, value: this.pk_checked.refcode });
		// 适配平台张横的onchange事件
		// this.props.onChange(this.pk_checked.refcode, { display: this.pk_checked.refname, value: this.pk_checked.refcode });
		this.props.onChange(
			{ display: this.pk_checked.refname, value: this.pk_checked.refcode },
			{ display: this.pk_checked.refname, value: this.pk_checked.refcode }
		);

		this.props.onTargetKeysChange({ display: this.pk_checked.refcode, value: this.pk_checked.refcode });
	}
}
export default DataSourceDlg;
