/**
 * 卡片模式action
 * @constructor
 * @author neo   
*/
import { cacheTools, toast, promptBox } from 'nc-lightapp-front';
export default class CardAction {
	constructor(comp) {
		this.comp = comp;
	}
	/* @@主表表单页面赋值
     * @mode 区分浏览态/编辑态
    */
	setFormData = (mode) => {
		const { props } = this.comp;
		const { form, infosetmgt, dispatch, meta } = props;
		const allpks = cacheTools.get('allpks');

		if (mode) {
			if (mode === 'edit') {
				form.setFormStatus('infosetform', 'edit');
				this._setFormData_(mode);
			}
			if (mode === 'add') {
				this._addFormData_(mode);
			}
		} else {
			form.setFormStatus('infosetform', 'browse');
			this._setFormData_();
		}
	};
	setFormDisabled = async (data = null) => {
		const { props } = this.comp;
		const { form, infosetmgt, dispatch } = props;
		const setItemDisabled = (res) => {
			let disabledObj = {};
			res.items.forEach((element) => {
				disabledObj[element.attrcode] = element.disabled;
			});
			form.setFormItemsDisabled('infosetform', disabledObj);
		};
		if (!data) {
			await dispatch({
				type: 'infosetmgt/getFormMeta',
				payload: {
					postData: {
						pk_org: 'GLOBLE00000000000000',
						pkInfoset: infosetmgt.rowpk
					}
				}
			}).then((res) => {
				setItemDisabled(res.data);
			});
		} else {
			setItemDisabled(data);
		}
	};
	_addFormData_ = (mode) => {
		const { props } = this.comp;
		const { dispatch, infosetmgt, editTable, form, cardPagination, button, meta } = props;
		const allpks = cacheTools.get('allpks');
		// this.setFormDisabled();
		dispatch({
			type: 'infosetmgt/addInfoset',
			payload: {
				postData: {
					pk_org: 'GLOBLE00000000000000',
					strTypePk: infosetmgt.selectedTreePid
				}
			}
		}).then((res) => {
			// this.setFormDisabled();
			if (res.success) {
				form.setFormStatus('infosetform', 'edit');
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						showMode: 'card-edit'
					}
				});
				let _meta_ = meta.getMeta();
				let infosetformId = 'infosetform';
				Object.assign(_meta_[infosetformId], res.data.formMeta);
				meta.setMeta(_meta_, () => {
					this.setFormDisabled(res.data.formMeta);
					form.setAllFormValue({ infosetform: { rows: res.data.extCard.head['infosetgrid'].rows } });
					editTable.setTableData('infosetitemgrid', res.data.extCard.bodys['infosetitemgrid']);
					button.setButtonDisabled([ 'addsubrow', 'editsubrow', 'deletesubrow' ], true);
					// form.getFormItemsValue('infosetform', 'infoset_type').value !== '1'
					// 	? button.setButtonDisabled([ 'addsubrow', 'editsubrow', 'deletesubrow' ], true)
					// 	: button.setButtonDisabled([ 'addsubrow', 'editsubrow', 'deletesubrow' ], false);
				});
			}
		});
	};
	_setFormData_ = (mode) => {
		const { props } = this.comp;
		const { dispatch, infosetmgt, editTable, form, cardPagination, button } = props;
		const allpks = cacheTools.get('allpks');
		// this.setFormDisabled();
		dispatch({
			type: 'infosetmgt/getSelectedViewData',
			payload: {
				postData: { pkInfoset: infosetmgt.rowpk }
			}
		}).then((res) => {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					showMode: mode && mode === 'edit' ? 'card-edit' : 'card-browse',
					infosetitemgridData: res.data.itemGrid['infosetitemgrid']
				}
			});
			this.setFormDisabled();
			form.setAllFormValue({ infosetform: { rows: res.data.infoSetForm['infosetform'].rows } });
			editTable.setTableData('infosetitemgrid', res.data.itemGrid['infosetitemgrid']);
			cardPagination.setCardPaginationId({ id: infosetmgt.rowpk, status: 1 });
			mode === 'edit' && form.getFormItemsValue('infosetform', 'infoset_type').value === '1'
				? button.setButtonDisabled([ 'addsubrow' ], false)
				: button.setButtonDisabled([ 'addsubrow' ], true);
		});
	};
	/* 子表按钮事件代理 */
	handleButtonClick = (props, event) => {
		this[event].call(this, props, event);
	};
	/* 子表增行 */
	addsubrow = (props, event) => {
		//弹窗显示
		const { dispatch, infosetmgt, form, editTable, meta } = this.comp.props;
		const pk_org = 'GLOBLE00000000000000';
		// 有返回数据后,用上面的dispatch方式打开弹窗
		let params = {
			postData: {
				pk_org,
				infosetform: form.getAllFormValue('infosetform'),
				infosetitemgrid_all: {
					areacode: 'infosetitemgrid',
					rows: editTable.getVisibleRows('infosetitemgrid')
				}
			}
		};
		// 只能匹配 ("scale":-1234) 或 ("scale":qwer),前后可能有逗号
		let paramsStr = JSON.stringify(params);
		paramsStr = paramsStr.replace(/,"scale":[-\d\w]*/g, '');
		paramsStr = paramsStr.replace(/"scale":[-\d\w]*,/g, '');
		// 不能同时去掉前后的逗号，否则会破坏json结构
		//params = JSON.parse(JSON.stringify(params).replace(/(,)?"scale":[-\d\w]*(,)?/g, ''));
		params = JSON.parse(paramsStr);
		dispatch({
			type: 'infosetmgt/addInfosetItem',
			payload: params
		}).then((res) => {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					bShowInfosetItemModal: true,
					editItemFrom: event
				}
			});
			let _meta_ = meta.getMeta();
			let infosetItemId = 'addinfosetitem';
			Object.assign(_meta_[infosetItemId], res.data.formMeta);
			meta.setMeta(_meta_);
			let disabledObj = {};
			res.data.formMeta.items.forEach((element) => {
				disabledObj[element.attrcode] = element.disabled;
			});
			form.setFormItemsDisabled(infosetItemId, disabledObj);
			form.setFormStatus(infosetItemId, 'edit');
			form.setAllFormValue({ [infosetItemId]: { rows: res.data.formData[infosetItemId].rows } });
			let disabledFlag = form.getFormItemsValue('infosetform','main_table_flag') && form.getFormItemsValue('infosetform','main_table_flag').value;
			form.setFormItemsDisabled(infosetItemId,{
				'pk_main_item': disabledFlag
			})
		});
	};
	/* 子表修改/编辑 */
	editsubrow = (props, event) => {
		const { action } = this.comp;
		const { editTable, dispatch } = props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				editItemFrom: event
			}
		});
		// debugger;
		// let _record_ = editTable.getClickRowIndex('infosetitemgrid');
		action.TableAction.editSubItem();
	};
	/* 子表删除 */
	deletesubrow = (props, event) => {
		const { dispatch, editTable, infosetmgt } = props;
		const _record_ = editTable.getClickRowIndex('infosetitemgrid');
		const pk_org = 'GLOBLE00000000000000';
		dispatch({
			type: 'infosetmgt/deleteInfosetItem',
			payload: {
				postData: {
					pk_org,
					infosetitemgrid: {
						areacode: 'infosetitemgrid',
						rows: [ _record_.record ]
					}
				}
			}
		}).then((res) => {
			editTable.deleteTableRowsByIndex('infosetitemgrid', _record_.index);
			toast({
				color: res.data,
				content: `${infosetmgt.lang['hrpub-000077']}${infosetmgt.lang['hrpub-000108']}`
			});
		});
	};
	// 信息项-表单联动
	transferFormMeta = (props, moduleId, key, value, oldValue) => {
		const { form, infosetmgt, dispatch, meta } = props;
		const pk_org = 'GLOBLE00000000000000';
		let uistate = infosetmgt.editItemFrom === 'addsubrow' ? 1 : 2;
		if (key === 'data_type') {
			let params = {
				key,
				oldValue,
				pk_org,
				uistate,
				model: form.getAllFormValue(moduleId)
			};
			dispatch({
				type: 'infosetmgt/transferInfosetItem',
				payload: { postData: params }
			}).then((res) => {
				if (res.data.warningMsg) {
					toast({ color: 'danger', content: res.data.warningMsg });
					form.setFormItemsValue(moduleId, {
						[key]: oldValue
					});
				} else {
					let disabledObj = {},
						_meta_ = meta.getMeta();
					Object.assign(_meta_[res.data.formMeta.code], res.data.formMeta);
					meta.setMeta(_meta_);
					res.data.formMeta.items.forEach((element) => {
						disabledObj[element.attrcode] = element.disabled;
					});
					form.setFormItemsDisabled(moduleId, disabledObj);
					form.setAllFormValue({ [moduleId]: { rows: res.data.formData[moduleId].rows } });
				}
			});
		}
	};
	/* 信息项-公式编辑器回调函数 */
	saveCallback = (res) => {
		return new Promise((resolve, reject) => {
			// setTimeout(() => {
			const { form, infosetmgt } = this.comp.props;
			let infosetItemId = 'updinfosetitem';
			if (infosetmgt.editItemFrom === 'addsubrow') {
				infosetItemId = 'addinfosetitem';
			}
			let _data_ = JSON.parse(res.data),
				target = {};

			if (infosetmgt.formulaParams.datatype === 100) {
				target = {
					item_formula: {
						value: _data_.formulaStr,
						display: _data_.formulaStr
					},
					item_formula_sql: {
						value: _data_.formulaSql,
						display: _data_.formulaSql
					}
				};
			}
			if (infosetmgt.formulaParams.datatype === 101) {
				target = {
					sub_formula: {
						value: _data_.formulaStr,
						display: _data_.formulaStr
					},
					sub_formula_sql: {
						value: _data_.formulaSql,
						display: _data_.formulaSql
					}
				};
			}
			form.setFormItemsValue(infosetItemId, target);
			resolve('close');
			// }, 100);
		});
	};
}
