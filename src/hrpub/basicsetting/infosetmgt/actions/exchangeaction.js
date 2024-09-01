/**
 * 卡片模式action
 * @constructor
 * @author neo
*/
import { cacheTools, toast, promptBox, base, high } from 'nc-lightapp-front';
// import exConfirm from '../components/exconfirm';
export default class ExchangeAction {
	constructor(comp) {
		this.comp = comp;
	}
	/* 信息项交换模态框关闭 */
	closeModal = () => {
		const { dispatch, infosetmgt } = this.comp.props;
		if (infosetmgt.exShowMode === 'card-edit') {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					exconfirmShow: true
				}
			});
		} else {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					bShowExchangeModal: false
				}
			});
		}
	};
	/* 信息项交换列表/卡片视图切换 */
	toExList = () => {
		const { dispatch } = this.comp.props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				exShowMode: 'list-browse'
			}
		});
		this.setTableData();
	};
	/* 组织参照 */
	searchChange = (val) => {
		const { dispatch, infosetmgt } = this.comp.props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				hrorgobj: val
			}
		});
		if (infosetmgt.exShowMode === 'list-browse') {
			setTimeout(() => {
				this.setTableData();
			}, 100);
		} else {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					exrowpk: '',
					exShowMode: 'card-browse'
				}
			});

			setTimeout(() => {
				this.doubleClick();
			}, 100);
		}
	};
	/* 按钮点击事件代理 */
	handleButtonClick = (props, event) => {
		this[event].call(this, props, event);
	};
	// 交换信息项(exShowMode:list-browse) - 新增信息项
	exadd = (props, event) => {
		const { dispatch, form, editTable } = props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				exShowMode: 'card-edit'
				// exrowpk: ''
			}
		});
		form.setFormStatus('card', 'edit');
		editTable.setStatus('sub', 'edit');
		form.EmptyAllFormValue('card');
		editTable.setTableData('sub', { rows: [] });
	};
	// 交换信息项(exShowMode:list-browse) - 修改信息项
	exedit = (props, event) => {
		const { dispatch, infosetmgt, form, editTable, button } = props;
		dispatch({
			type: 'infosetmgt/exchangeCardData',
			payload: {
				postData: {
					pk_infoset_map: infosetmgt.exrowpk,
					pk_org: infosetmgt.hrorgobj.refpk
				}
			}
		}).then((res) => {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					exShowMode: 'card-edit'
				}
			});
			button.setButtonDisabled([ 'exsaveandnew' ], true);
			form.setFormStatus('card', 'edit');
			editTable.setStatus('sub', 'edit');
			form.setAllFormValue(res.data.head);
			editTable.setTableData('sub', res.data.bodys.sub || { rows: [] });
		});
	};
	// 交换信息项(exShowMode:list-browse) - 删除信息项
	exdelete = (props, event) => {
		const { dispatch, infosetmgt } = props;
		dispatch({
			type: 'infosetmgt/exchangeDeleteData',
			payload: {
				postData: {
					pk_infoset_map: infosetmgt.exrowpk,
					pk_org: infosetmgt.hrorgobj.refpk
				}
			}
		}).then((res) => {
			if (infosetmgt.exShowMode === 'list-browse') {
				this.setTableData();
			} else {
				let _allpks_ = cacheTools.get('allpks');
				let nextpk = '';
				if (_allpks_.length > 1) {
					if (infosetmgt.exrowindex + 1 === _allpks_.length) {
						nextpk = _allpks_.splice(infosetmgt.exrowindex - 1, 1);
					} else {
						nextpk = _allpks_.splice(infosetmgt.exrowindex + 1, 1);
					}
				}
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						exrowpk: nextpk[0]
					}
				});
				this.doubleClick();
			}
		});
	};
	// 交换信息项(exShowMode:list-browse) - 刷新信息项
	exrefresh = (props, event) => {
		this.setTableData();
	};
	// 交换信息项(exShowMode:list-browse) - 列表数据选择行
	setSelectRow = (props, moduleId, record, index, event) => {
		const { dispatch } = props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				exrowpk: record.values.pk_infoset_map.value,
				exrowindex: index
			}
		});
	};
	// 交换信息项(exShowMode:list-browse) - 卡片数据渲染
	doubleClick = (record, index, props, event) => {
        if (record) {
            const { dispatch } = props;
            dispatch({
                type: 'infosetmgt/update',
                payload: {
                    exrowpk: record.values.pk_infoset_map.value,
                    exrowindex: index
                }
            });
        }
		const { dispatch, infosetmgt, form, editTable } = this.comp.props;
		dispatch({
			type: 'infosetmgt/exchangeCardData',
			payload: {
				postData: {
					pk_infoset_map: (record && record.values.pk_infoset_map.value) || infosetmgt.exrowpk,
					pk_org: infosetmgt.hrorgobj.refpk
				}
			}
		}).then((res) => {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					exShowMode: 'card-browse'
				}
			});
			if (res.data === 'success') {
				form.EmptyAllFormValue('card');
				editTable.setTableData('sub', { rows: [] });
			} else {
				form.setAllFormValue(res.data.head);
				editTable.setTableData('sub', res.data.bodys.sub || { rows: [] });
			}
		});
	};
	// 交换信息项(exShowMode:list-browse) - 列表数据渲染
	setTableData = () => {
		const { props } = this.comp;
		const { dispatch, infosetmgt, editTable } = props;
		dispatch({
			type: 'infosetmgt/exchangeListData',
			payload: {
				postData: {
					pk_org: infosetmgt.hrorgobj.refpk
				}
			}
		}).then((res) => {
			let allpks = [];
			if (res.data) {
				res.data.list.rows.forEach((item) => {
					allpks.push(item.values.pk_infoset_map.value);
				});
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						exrowpk: res.data['list'].rows[0].values.pk_infoset_map.value
					}
				});
				editTable.setTableData('list', res.data.list);
				//cacheTools.set('allpks', allpks);
			} else {
				editTable.setTableData('list', { rows: [] });
				//cacheTools.set('allpks', []);
			}
		});
	};
	// 交换信息项(exShowMode:card-edit)-增加交换信息项主表参数
	exchangeBeforeEvent = (props, moduleId, key, value, oldValue) => {
		const { meta, infosetmgt } = props;
		let tempInfo = meta.getMeta();
		tempInfo.card.items.forEach((item) => {
			if (item.attrcode === 'pk_sourceinfoset') {
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.hr.infosetmap.sqlbuilder.SourceInfosetRefSqlBuilder',
						pk_infoset_sort: infosetmgt.selectedTreePid
					};
				};
			}
			if (item.attrcode === 'pk_targetinfoset') {
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.hr.infosetmap.sqlbuilder.TargetInfosetRefSqlBuilder',
						pk_infoset_sort: infosetmgt.selectedTreePid
					};
				};
			}
		});
		meta.setMeta(tempInfo);
		return true;
	};
	// 交换信息项(exShowMode:card-edit) - 新增子表行
	exsubadd = (props, event) => {
		const { editTable } = props;
		editTable.addRow('sub', undefined, false, { itemType:{value:"refer"}});
	};
	// 交换信息项(exShowMode:card-edit) - 删除子表行
	exsubdel = (props, event) => {
		const { editTable, infosetmgt } = props;
		let selected = editTable.getClickRowIndex('sub')
			? editTable.getClickRowIndex('sub').record
			: editTable.getAllRows('sub')[0];
		selected && editTable.deleteTableRowsByRowId('sub', selected.rowid);
	};
	// 交换信息项(exShowMode:card-edit) - 增加子表参数
	setSubRowBeforeEvent = (props, moduleId, item, index, value, record) => {
		const { meta, infosetmgt, form } = props;
		let tempInfo = meta.getMeta();
		tempInfo.sub.items.forEach((item) => {
			if (item.attrcode === 'pk_sourceinfoitem') {
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.hr.infosetmap.sqlbuilder.SourceInfoitemRefSqlBuilder',
						pk_infoset_sort: infosetmgt.selectedTreePid,
						pk_infoset: form.getFormItemsValue('card', 'pk_sourceinfoset').value
					};
				};
			}
			if (item.attrcode === 'pk_targetinfoitem') {
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.hr.infosetmap.sqlbuilder.TargetInfoitemRefSqlBuilder',
						pk_infoset_sort: infosetmgt.selectedTreePid,
						pk_infoset: form.getFormItemsValue('card', 'pk_targetinfoset').value
					};
				};
			}
		});
		meta.setMeta(tempInfo);
		return true;
	};
	// 交换信息项(exShowMode:card-edit) - 保存
	exsave = (props, event) => {
		const { dispatch, form, editTable, infosetmgt } = this.comp.props;
		let validateTable = editTable.getAllRows('sub').length
			? editTable.checkRequired('sub', editTable.getAllRows('sub'))
			: true;
		if (!form.isCheckNow('card') || !validateTable) {
			return;
		} else {
			let postData = {
				card: form.getAllFormValue('card'),
				sub: {
					areacode: 'sub',
					rows: editTable.getAllRows('sub')
				},
				pk_org: infosetmgt.hrorgobj.refpk
			};

			dispatch({
				type: 'infosetmgt/exchangeSaveData',
				payload: {
					postData
				}
			}).then((res) => {
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						exShowMode: 'card-browse',
						exrowpk: res.data.head.card.rows[0].values.pk_infoset_map.value
					}
				});
				form.setFormStatus('card', 'browse');
				editTable.setStatus('sub', 'browse');
				form.setAllFormValue(res.data.head);
				editTable.setTableData('sub', res.data.bodys.sub);
			});
		}
	};
	// 交换信息项(exShowMode:card-edit) - 保存新增
	// exsaveandnew = async (props, event) => {
	// 	await this.exsave();
	// 	await this.exadd();
	// };
	// 交换信息项(exShowMode:card-edit) - 取消保存
	excancel = (props, event) => {
		const { infosetmgt, dispatch, form, editTable } = props;
		const { lang, exShowMode } = infosetmgt;
		promptBox({
			title: lang['hrpub-000115'],
			color: 'danger',
			content: lang['hrpub-000088'],
			beSureBtnClick: () => {
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						exShowMode: 'card-browse'
					}
				});
				form.setFormStatus('card', 'browse');
				editTable.setStatus('sub', 'browse');
				this.doubleClick();
			},
			cancelBtnClick: () => {}
		});
	};
}
