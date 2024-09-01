/*
 * @Author: zhangchangqing 
 * @PageInfo: 取消按钮事件
 * @Date: 2018-04-19 10:37:17 
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-09-28 11:02:21
 */
import { base } from 'nc-lightapp-front';
import { STOREREQ_CARD, STOREREQ_LIST, ATTRCODE } from '../../siconst';
import pageInfoClick from './pageInfoClick';
import { getCurrentLastId } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getParentURlParme } from '../btnClicks';
import { changeUrlParam, setDefData } from '../../../../../scmpub/scmpub/pub/cache';

const { NCMessage } = base;
let tableId = STOREREQ_CARD.tableId;
let formId = STOREREQ_CARD.formId;
export default function clickCancelBtn(props) {
	showWarningDialog(getLangByResId(this, '4004STOREREQ-000049'), getLangByResId(this, '4004STOREREQ-000003'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: backtotransfer.bind(this, props)
	});
}
function backtotransfer(props) {
	window.onbeforeunload = null; //关闭弹出框提示
	//自己的逻辑
	this.props.cardTable.selectAllRows(STOREREQ_CARD.tableId, false);
	let transfer = this.props.getUrlParam(STOREREQ_CARD.type);
	if (transfer) {
		let pk = this.props.getUrlParam(STOREREQ_CARD.id);
		if (pk == null || pk == 'undefined') {
			pk = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_storereq);
			pk = pk && pk.value;
		}
		pk = pk == 'undefined' ? null : pk;
		if (props.transferTable.getTransformFormCompleteStatus('leftarea', parseInt(this.state.index)) == true) {
			this.props.form.cancel(STOREREQ_CARD.formId);
			this.props.cardTable.resetTableData(STOREREQ_CARD.tableId);
			changeUrlParam(this.props, {
				status: STOREREQ_CARD.browse,
				id: pk
			});
			this.indexstatus[this.state.index] = 'browse';
			let data = { keyword: this.state.billId, pageid: this.pageId };
			if (transfer) {
				ajax({
					url: STOREREQ_CARD.queryCardInfoURL,
					data: data,
					success: (res) => {
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							props.dealFormulamsg(res.formulamsg);
						}

						if (data === undefined) {
							//订单编号
							this.setState({
								vbillcode: '',
								billId: ''
							});
							return;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
						}
						//渲染数据前先清空值，
						if (res.data.head) {
							this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
							this.setState(
								{
									lineShowType: [],
									status: STOREREQ_CARD.browse,
									vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
									billId: res.data.head[formId].rows[0].values.pk_storereq.value,
									billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
								},
								() => {
									this.toggleShow();
								}
							);
							//let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
							//设置按钮显示
							//setBtnShow(_this, fbillstatus);
						}
					}
				});
			}
		} else {
			if (props.transferTable.getTransformFormAmount('leftarea') == 1) {
				if (transfer) {
					//history.go(-1);
					let map = new Map();
					map.set(STOREREQ_CARD.transfer, STOREREQ_LIST.transferUrl);
					let _url = map.get(transfer);
					this.props.pushTo(_url, { pagecode: STOREREQ_LIST.transferList });
				}
			} else {
				props.transferTable.setTransformFormStatus('leftarea', {
					status: false,
					onChange: (current, next, currentIndex) => {
						showSuccessInfo(getLangByResId(this, '4004STOREREQ-000057')); /* 国际化处理： 取消成功*/
					}
				});
			}
		}
	} else {
		let option = this.props.getUrlParam('option');

		if (option == 'add') {
			//判断是新增总点击取消，从缓存中获取数据 ；修改点击取消，返回至浏览态
			let id = getCurrentLastId(STOREREQ_LIST.dataSource);
			this.props.pushTo(STOREREQ_CARD.cardUrl, {
				status: STOREREQ_CARD.browse,
				id: id,
				comeType: true,
				pagecode: STOREREQ_CARD.cardpageid
			});
			this.props.resMetaAfterPkorgEdit(); //恢复字段编辑性
			pageInfoClick.bind(this)();
		} else if (!option || option == 'edit' || option == 'copy') {
			let pk_praybill = this.props.getUrlParam(STOREREQ_CARD.id);
			let parentURL = getParentURlParme(STOREREQ_CARD.pageMsgType);
			if (parentURL) {
				this.props.pushTo(STOREREQ_CARD.cardUrl, {
					status: STOREREQ_CARD.browse,
					id: pk_praybill
				});
				this.toggleShow();
				props.form.cancel(STOREREQ_CARD.formId);
				// 表格返回上一次的值
				props.cardTable.resetTableData(STOREREQ_CARD.tableId);
			} else {
				this.props.pushTo(STOREREQ_CARD.cardUrl, {
					status: STOREREQ_CARD.browse,
					id: pk_praybill,
					comeType: true,
					pagecode: STOREREQ_CARD.cardpageid
				});
				pageInfoClick.bind(this)();
			}
		} else {
			this.props.pushTo(STOREREQ_CARD.cardUrl, {
				status: STOREREQ_CARD.browse,
				id: null,
				pagecode: STOREREQ_CARD.cardpageid
			});
			pageInfoClick.bind(this)();
		}
		this.forceUpdate();
	}
	setDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave', false);
}
