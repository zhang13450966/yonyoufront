/**
 * 列表action
 * @constructor
 * @author neo   
*/
import { cacheTools, promptBox, toast, deepClone } from 'nc-lightapp-front';
// import deepCopy from 'src/hrpub/common/utils/deep-copy';
export default class TableAction {
	constructor(comp) {
		this.comp = comp;
	}
	/* 主表行选择 */
	setSelectRow = ($props, $moduleId, record, index, event) => {
		const { props } = this.comp;
		const { dispatch } = props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				rowpk: record.values.pk_infoset.value,
				rowindex: index
			}
		});
	};
	/* 子表行选择 */
	setSubTableSelectRow = ($props, $moduleId, record, index, event) => {
		const { button, infosetmgt, form } = $props;
		if (form.getFormItemsValue('infosetform', 'infoset_type').value === '1') {
			if (infosetmgt.editFrom === 'edit') {
				button.setButtonDisabled([ 'addsubrow', 'editsubrow', 'deletesubrow' ], false);
			}
			if (infosetmgt.editFrom === 'add') {
				button.setButtonDisabled([ 'editsubrow', 'deletesubrow' ], false);
			}
		} else {
			button.setButtonDisabled([ 'addsubrow', 'editsubrow', 'deletesubrow' ], true);
		}
	};
	/* 双击子表表格行/修改行 行为 */
	editSubItem = (record, index) => {
		const { dispatch, infosetmgt, form, editTable, meta } = this.comp.props;
		let infosetItemId = 'updinfosetitem';
		// let status = editTable.getClickRowIndex('infosetitemgrid');
		let params = {
			infosetform: form.getAllFormValue('infosetform'),
			infosetitemgrid: {
				areacode: 'infosetitemgrid',
				rows: [
					editTable.getClickRowIndex('infosetitemgrid').record
					// editTable.getAllData('infosetitemgrid').rows[editTable.getClickRowIndex('infosetitemgrid').index]
				]
			},
			pk_org: 'GLOBLE00000000000000'
		};
		// 只能匹配 ("scale":-1234) 或 ("scale":qwer),前后可能有逗号
		let paramsStr = JSON.stringify(params);
		paramsStr = paramsStr.replace(/,"scale":[-\d\w]*/g, '');
		paramsStr = paramsStr.replace(/"scale":[-\d\w]*,/g, '');
		// 不能同时去掉前后的逗号，否则会破坏json结构
		//params = JSON.parse(JSON.stringify(params).replace(/(,)?"scale":[-\d\w]*(,)?/g, ''));
		params = JSON.parse(paramsStr);
		dispatch({
			type: 'infosetmgt/editInfosetItem',
			payload: {
				postData: params
			}
		}).then((res) => {
			let _meta_ = meta.getMeta();
			Object.assign(_meta_[infosetItemId], res.data.formMeta);
			meta.setMeta(_meta_);
			let disabledObj = {};
			res.data.formMeta.items.forEach((element) => {
				disabledObj[element.attrcode] = element.disabled;
			});
			form.setFormItemsDisabled(infosetItemId, disabledObj);
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					bShowInfosetItemModal: true,
					editItemFrom: 'editsubrow'
				}
			});
			if (infosetmgt.showMode === 'card-edit') {
				if (form.getFormItemsValue('infosetform', 'infoset_type').value !== '1') {
					form.setFormStatus(infosetItemId, 'browse');
				} else {
					form.setFormStatus(infosetItemId, 'edit');
				}
			}
			if (infosetmgt.showMode === 'card-browse') {
				form.setFormStatus(infosetItemId, 'browse');
			}
			form.setAllFormValue({ [infosetItemId]: { rows: res.data.formData[infosetItemId].rows } });
			let disabledFlag = form.getFormItemsValue('infosetform','main_table_flag') && form.getFormItemsValue('infosetform','main_table_flag').value;
			form.setFormItemsDisabled(infosetItemId,{
				'pk_main_item': disabledFlag
			})
		});
	};
	/* 修改信息项,更新信息项表格数据 */
	updateInfosetItemTable = () => {
		const { dispatch, infosetmgt, form, editTable, meta } = this.comp.props;
		let infosetItemId = 'updinfosetitem',
			uistate = '1';
		if (infosetmgt.editItemFrom === 'addsubrow') {
			infosetItemId = 'addinfosetitem';
			uistate = '1';
		}
		if (infosetmgt.editItemFrom === 'editsubrow') {
			infosetItemId = 'updinfosetitem';
			uistate = '2';
		}
		// let _meta_ = meta.getMeta()[infosetItemId];
		if (infosetmgt.showMode !== 'card-edit') {
			this.closeInfosetItemModal();
		} else {
			if (!form.isCheckNow(infosetItemId)) {
				return;
			}
			if (
				form.getFormItemsValue(infosetItemId, 'data_type').value === '5' &&
				!form.getFormItemsValue(infosetItemId, 'ref_model_name').value
			) {
				return toast({ color: 'danger', content: infosetmgt.lang['hrpub-000146'] });
			}
			let params = {
				infosetform: form.getAllFormValue('infosetform'),
				model: form.getAllFormValue(infosetItemId),
				infosetitemgrid_all: {
					areacode: 'infosetitemgrid',
					rows: editTable.getVisibleRows('infosetitemgrid')
				},
				pk_org: 'GLOBLE00000000000000', // infosetmgt.pkOrg
				uistate
			};
			// 只能匹配 ("scale":-1234) 或 ("scale":qwer),前后可能有逗号
			let paramsStr = JSON.stringify(params);
			paramsStr = paramsStr.replace(/,"scale":[-\d\w]*/g, '');
			paramsStr = paramsStr.replace(/"scale":[-\d\w]*,/g, '');
			// 不能同时去掉前后的逗号，否则会破坏json结构
			//params = JSON.parse(JSON.stringify(params).replace(/(,)?"scale":[-\d\w]*(,)?/g, ''));
			params = JSON.parse(paramsStr);
			dispatch({
				type: 'infosetmgt/checkInfoItemDataOnServer',
				payload: {
					postData: params
				}
			}).then((res) => {
				if (infosetmgt.editItemFrom === 'editsubrow') {
					let formData = form.getAllFormValue(infosetItemId),
						tableRow = editTable.getClickRowIndex('infosetitemgrid');
					let data = { index: tableRow.index, data: formData.rows[0] };
					let status = tableRow.record.status;
					editTable.updateDataByIndexs('infosetitemgrid', [ data ], true);
					// infosetmgt.editFrom === 'add' && editTable.setRowStatus('infosetitemgrid', tableRow.index, '2');
					status === '2' && editTable.setRowStatus('infosetitemgrid', tableRow.index, '2');
					this.closeInfosetItemModal();
				} else {
					let formData = form.getAllFormValue(infosetItemId);
					editTable.insertRowsAfterIndex(
						'infosetitemgrid',
						formData.rows[0],
						editTable.getNumberOfRows('infosetitemgrid')
					);
					editTable.setStatus('infosetitemgrid', 'browse')
					this.closeInfosetItemModal();
				}
			});
		}
	};
	/* 双击主表表格行行为 */
	doubleClick = (record, index) => {
		const { action, props } = this.comp;
		const { dispatch } = props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				rowpk: record.values.pk_infoset.value,
				rowindex: index
			}
		});
		setTimeout(() => {
			action.CardAction.setFormData();
		}, 100);
	};
	/* 主表数据设置 */
	setMainTableData = () => {
		const { dispatch, infosetmgt, editTable } = this.comp.props;
		const params = {
			pk_org: infosetmgt.pkOrg,
			pageCode: infosetmgt.pagecode,
			appCode: infosetmgt.appcode,
			areaCode: 'infosetgrid',
			pageInfo: { pageIndex: infosetmgt.pageInfo.pageIndex, pageSize: infosetmgt.pageInfo.pageSize },
			queryType: 0,
			pkInfosetSort: infosetmgt.selectedTreePid
		};
		dispatch({
			type: 'infosetmgt/getMainTableData',
			payload: {
				postData: params
			}
		}).then((res) => {
			if (res && res.data) {
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						hasMainTableData: true,
						pageInfo: res.data.infosetgrid.pageInfo,
						rowpk: res.data['infosetgrid'].rows[0].values.pk_infoset.value
					}
				});
				editTable.setTableData('infosetgrid', res.data.infosetgrid);
				cacheTools.set('allpks', res.data.infosetgrid.allpks);
			} else {
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						hasMainTableData: false
					}
				});
				editTable.setTableData('infosetgrid', []);
			}
		});
	};
	/* 信息项显示顺序调整模态框关闭 */
	closeOrderModal = () => {
		const { dispatch } = this.comp.props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				bShowOrderModal: false
			}
		});
	};
	/* 信息项修改模态框关闭 */
	closeInfosetItemModal = () => {
		const { dispatch } = this.comp.props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				bShowInfosetItemModal: false
			}
		});
	};
	/* 双击实现checkbox checked控制 */
	doubleClickOrderTable = (record, index) => {
		const { editTable } = this.comp.props;
		editTable.selectTableRows('setdisplayorder', index, !record.selected);
	};
	/* 信息项显示顺序调整-保存调整 */
	saveOrderData = () => {
		const { dispatch, editTable, infosetmgt } = this.comp.props;
		const tableId = 'setdisplayorder';
		let allData = editTable.getAllData(tableId);
		let _itemListPk_ = allData.rows.map((item) => item.values.pk_infoset_item.value);
		dispatch({
			type: 'infosetmgt/saveOrderData',
			payload: {
				postData: {
					pkInfoset: infosetmgt.rowpk,
					itemListPk: _itemListPk_
				}
			}
		}).then((res) => {
			if (res.data === 'success') {
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						bShowOrderModal: false,
						hasOrderData: false
					}
				});
				toast({ color: 'success', content: infosetmgt.lang['hrpub-000102'] });
			}
		});
	};
	/* 信息项显示顺序调整-调整至首行 */
	orderToFirst = () => {
		const { editTable } = this.comp.props;
		const tableId = 'setdisplayorder';
		let allData = editTable.getAllData(tableId);
		let sRows = editTable.getCheckedRows('setdisplayorder');
		let startIndex = sRows[0].index;
		sRows.forEach((item) => {
			allData = this.moveArrayItem(allData, item.index, startIndex, 'up');
			editTable.setTableData('setdisplayorder', allData);
		});
	};
	/* 信息项显示顺序调整-调整至末行 */
	orderToLast = () => {
		const { editTable } = this.comp.props;
		const tableId = 'setdisplayorder';
		let allData = editTable.getAllData(tableId);
		let sRows = editTable.getCheckedRows('setdisplayorder');
		let endIndex = sRows[sRows.length - 1].index;
		sRows.reverse().forEach((item) => {
			allData = this.moveArrayItem(allData, item.index, allData.rows.length - endIndex - 1, 'down');
			editTable.setTableData('setdisplayorder', allData);
		});
	};
	/* 信息项显示顺序调整-调整至上一行 */
	orderUp = () => {
		const { editTable } = this.comp.props;
		const tableId = 'setdisplayorder';
		let allData = editTable.getAllData(tableId);
		let sRows = editTable.getCheckedRows('setdisplayorder');
		// let startIndex = sRows[0].index;
		sRows.forEach((item) => {
			allData = this.moveArrayItem(allData, item.index, 1, 'up');
			editTable.setTableData('setdisplayorder', allData);
		});
	};
	/* 信息项显示顺序调整-调整至下一行 */
	orderDown = () => {
		const { editTable } = this.comp.props;
		const tableId = 'setdisplayorder';
		let allData = editTable.getAllData(tableId);
		let sRows = editTable.getCheckedRows('setdisplayorder');
		// 最后的先执行
		sRows.reverse().forEach((item) => {
			allData = this.moveArrayItem(allData, item.index, 1, 'down');
			editTable.setTableData('setdisplayorder', allData);
		});
	};
	/* 
     * @tabledata object  所要操作的表格数据对象,包含rows
     * @curIndex  number  当前所选行index
     * @moveNum   number  移动量
     * @dire      string  up||down 上移下移字符
    */
	moveArrayItem = (tabledata, curIndex, moveNum, dire) => {
		if (dire === 'up') {
			for (let i = 0; i < moveNum; i++) {
				tabledata.rows.splice(
					curIndex - i - 1,
					1,
					...tabledata.rows.splice(curIndex - i, 1, tabledata.rows[curIndex - i - 1])
				);
			}
		}
		if (dire === 'down') {
			for (let i = 0; i < moveNum; i++) {
				tabledata.rows.splice(
					curIndex + i,
					1,
					...tabledata.rows.splice(curIndex + i + 1, 1, tabledata.rows[curIndex + i])
				);
			}
		}
		tabledata.rows.forEach((item, index) => {
			item.values.showorder.value = index;
		});
		return tabledata;
	};
	/* 获取当前页面可见高度 */
	getHeight = () => {
		const { infosetmgt } = this.comp.props;
		let wH = window.innerHeight,
			domHeight = 0,
			gap = infosetmgt.hasMainTableData ? 120 : 50;
		if (infosetmgt.selectedTreePid) {
			domHeight += document.querySelector('.row-header') && document.querySelector('.row-header').clientHeight;
		}
		return wH - domHeight - gap;
	};
}
