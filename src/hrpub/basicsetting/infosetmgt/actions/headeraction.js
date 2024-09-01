/**
 * 头部按钮action
 * @constructor
 * @author neo   
*/
import { cacheTools, promptBox, toast } from 'nc-lightapp-front';
export default class HeaderAction {
	constructor(comp) {
		this.comp = comp;
	}
	/* 返回按钮动作处理 */
	toList = () => {
		const { props } = this.comp;
		const { dispatch } = props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				showMode: 'list-browse'
			}
		});
		this.pubSub.publish('setMainTableData');
	};
	/* 头部按钮点击事件代理 */
	handleButtonClick = (props, event) => {
		this[event].call(this, props, event);
	};
	/* 信息项交换设置 */
	exchange = (_props_, event) => {
		const { action, props } = this.comp;
		const { infosetmgt, dispatch } = props;
		let hasPkOrg = JSON.stringify(infosetmgt.hrorgobj) === '{}' ? false : true;
		dispatch({
			type: 'infosetmgt/exchangeData',
			payload: {
				postData: {
					pk_org: 'GLOBLE00000000000000',
					strTypePk: infosetmgt.selectedTreePid
				}
			}
		}).then((res) => {
			if (res.data) {
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						bShowExchangeModal: true,
						exShowMode: 'list-browse'
					}
				});
				if (hasPkOrg) {
					action.ExchangeAction.setTableData();
				}
			} else {
				toast({ color: 'error', content: infosetmgt.lang['hrpub-000138'] });
			}
		});
	};
	/* 设置显示顺序 */
	setorder = (props, event) => {
		const { infosetmgt, dispatch, editTable } = props;
		dispatch({
			type: 'infosetmgt/setDisplayOrder',
			payload: {
				postData: { pkInfoset: infosetmgt.rowpk }
			}
		}).then((res) => {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					bShowOrderModal: true,
					hasOrderData: true
				}
			});
			let tbData = res.data.setdisplayorder;
			tbData.rows.sort((a, b) => a.values.showorder.value - b.values.showorder.value);
			editTable.setTableData('setdisplayorder', tbData);
		});
	};
	/* 信息集保存 */
	save = (props, event) => {
		// const { action } = this.comp;
		const { form, editTable, dispatch, infosetmgt, cardPagination } = props;
		const { lang } = infosetmgt;
		// 校验必输项
		if (!form.isCheckNow('infosetform')) return;
		let params = {
			infosetform: form.getAllFormValue('infosetform'),
			infosetitemgrid: {
				areacode: 'infosetitemgrid',
				rows: editTable.getChangedRows('infosetitemgrid')
			},
			infosetitemgrid_all: {
				areacode: 'infosetitemgrid',
				rows: editTable.getVisibleRows('infosetitemgrid')
			},
			pk_org: 'GLOBLE00000000000000' // infosetmgt.pkOrg
		};
		// 只能匹配 ("scale":-1234) 或 ("scale":qwer),前后可能有逗号
		let paramsStr = JSON.stringify(params);
		paramsStr = paramsStr.replace(/,"scale":[-\d\w]*/g, '');
		paramsStr = paramsStr.replace(/"scale":[-\d\w]*,/g, '');
		// 不能同时去掉前后的逗号，否则会破坏json结构
		//params = JSON.parse(JSON.stringify(params).replace(/(,)?"scale":[-\d\w]*(,)?/g, ''));
		params = JSON.parse(paramsStr);

		dispatch({
			type: 'infosetmgt/saveFormData',
			payload: {
				postData: params
			}
		}).then((res) => {
			let curPk = res.data.infoSetForm.infosetform.rows[0].values.pk_infoset.value;
			if (infosetmgt.editFrom === 'add') {
				let allpks = cacheTools.get('allpks');
				allpks.push(curPk);
				cacheTools.set('allpks', allpks);
			}

			toast({ color: 'success', content: lang['hrpub-000096'] });
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					rowpk: curPk,
					showMode: 'card-browse',
					editFrom: null
				}
			});
			form.setFormStatus('infosetform', 'browse');
			form.setAllFormValue({ infosetform: { rows: res.data.infoSetForm['infosetform'].rows } });
			editTable.setTableData('infosetitemgrid', res.data.itemGrid['infosetitemgrid']);
			cardPagination.setCardPaginationId({ id: curPk, status: 1 });
		});
	};
	/* 信息集取消编辑 */
	cancel = (props, event) => {
		const { infosetmgt, dispatch } = props;
		promptBox({
			color: 'warning',
			title: infosetmgt.lang['hrpub-000089'] /* 国际化处理 '提示' */,
			content: infosetmgt.lang['hrpub-000088'] /* 国际化处理 '是否确认要取消？' */,
			beSureBtnClick: () => {
				if (infosetmgt.editFrom === 'add') {
					dispatch({
						type: 'infosetmgt/update',
						payload: {
							showMode: 'list-browse',
							editFrom: null
						}
					});
					this.pubSub.publish('setMainTableData');
				} else {
					dispatch({
						type: 'infosetmgt/update',
						payload: {
							showMode: 'card-browse',
							editFrom: null
						}
					});
					setTimeout(() => {
						this.pubSub.publish('setFormData');
					}, 100);
				}
			},
			cancelBtnClick: () => {}
		});
	};
	/* 信息集新增 */
	add = (props, event) => {
		const { dispatch } = props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				editFrom: event
			}
		});
		this.pubSub.publish('setFormData', event);
	};
	/* 修改/编辑信息集 */
	edit = (props, event) => {
		const { infosetmgt, dispatch } = props;
		// if (infosetmgt.rowpk !== null) {
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				editFrom: event
			}
		});
		this.pubSub.publish('setFormData', event);
		// }
	};
	/* 删除信息集 */
	delete = (props, event) => {
		const { dispatch, infosetmgt, cardPagination } = props;
		// let _allpks_ = cacheTools.get('allpks');
		promptBox({
			color: 'danger',
			title: infosetmgt.lang['hrpub-000098'] /* 国际化处理 
            '确认删除' */,
			content: infosetmgt.lang['hrpub-000097'] /* 国际化处理 '您确定要删除所选数据吗?' */,
			beSureBtnClick: () => {
				dispatch({
					type: 'infosetmgt/deleteInfoset',
					payload: {
						postData: {
							pkInfoset: infosetmgt.rowpk
						}
					}
				}).then((res) => {
					/* 需要判断showMode
                         * list-browse模式下更新table数据
                         * card-browse模式下更新card pagination
                        */
					let msg =
						res && res.data && res.data.msg
							? res.data.msg
							: infosetmgt.lang['hrpub-000077'] + infosetmgt.lang['hrpub-000108'];
					toast({ color: 'success', content: msg });
					if (infosetmgt.showMode === 'list-browse') {
						// toast({ color: 'success', content: res.data.msg });
						this.pubSub.publish('setMainTableData');
					}
					if (infosetmgt.showMode === 'card-browse') {
						// toast({ color: 'success', content: res.data.msg });
						const nextpg = cardPagination.getNextCardPaginationId({ id: infosetmgt.rowpk });
						cardPagination.setCardPaginationId({ id: infosetmgt.rowpk, status: 3 });
						this.handlePageInfoChange(props, nextpg, 1);
					}
				});
			},
			cancelBtnClick: () => {}
		});
	};
	/* 同步元数据 */
	syncdata = (props, event) => {
		const { dispatch, infosetmgt } = props;
		promptBox({
			color: 'info',
			title: '',
			content:
				infosetmgt.lang[
					'hrpub-000099'
				] /*国际化处理 '1、自定义信息集和自定义信息项在同步成功之后将不能删除；<br>2、同步成功并重新登录系统后，相关业务节点才能正常使用；<br>是否继续？' */,
			beSureBtnClick: () => {
				dispatch({
					type: 'infosetmgt/syncMetaData',
					payload: {
						postData: {
							pkInfosetSort: infosetmgt.selectedTreePid,
							pk_org: 'GLOBLE00000000000000'
						}
					}
				}).then((res) => {
					toast({
						color: res.data,
						content: infosetmgt.lang['hrpub-000110']
					});
				});
			},
			cancelBtnClick: () => {}
		});
	};
	/* 同步模板 */
	synctemp = (props, event) => {
		const { dispatch, infosetmgt } = props;
		promptBox({
			color: 'info',
			title: '',
			content: infosetmgt.lang['hrpub-000100'] /*国际化处理 '将要同步“单据模板”和“查询模板”，同步成功并重新登录系统后，相关业务节点才能正常使用。\n\r是否继续？' */,
			beSureBtnClick: () => {
				dispatch({
					type: 'infosetmgt/syncTemplet',
					payload: {
						postData: {
							pk_org: 'GLOBLE00000000000000',
							strPk_sort: infosetmgt.selectedTreePid
						}
					}
				}).then((res) => {
					toast({ color: res.data, content: infosetmgt.lang['hrpub-000117'] });
				});
			},
			cancelBtnClick: () => {}
		});
	};
	/* 刷新 */
	refresh = (props, event) => {
		const { infosetmgt } = props;
		if (infosetmgt.showMode === 'list-browse') {
			this.pubSub.publish('setMainTableData');
		}
		if (infosetmgt.showMode === 'card-browse') {
			this.pubSub.publish('setFormData');
		}
	};
	/* 卡片模式翻页功能 */
	handlePageInfoChange = (prop, flag, status = 1) => {
		const { pubSub } = this;
		const { props } = this.comp;
		const { dispatch } = props;
		if (flag) {
			props.cardPagination.setCardPaginationId({ id: flag, status: status });
		} else {
			return props.form.EmptyAllFormValue(this.props.areaCode.card);
		}
		if (status === 3) {
			return false;
		}
		var allpks = cacheTools.get('allpks');
		if (!allpks.length) {
			props.form.EmptyAllFormValue('infosetform');
			props.editTable.setTableData('infosetitemgrid', []);
		} else {
			allpks.forEach((item, index) => {
				if (item === flag) {
					dispatch({
						type: 'infosetmgt/update',
						payload: {
							rowpk: item,
							rowindex: index
						}
					});
					setTimeout(() => {
						pubSub.publish('setFormData');
					}, 100);
				}
			});
		}
	};
}
