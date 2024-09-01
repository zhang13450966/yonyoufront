/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-04-20 10:11:59
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-04-21 20:44:17
 */
import { ajax, broadcast } from 'nc-lightapp-front';
import { buttonController } from '../viewController/index';
import { URL, PAGECODE, FIELD, STATUS, TRANSFER, OrderCache, PUSHCONST } from '../../constance';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import {
	getDefData,
	addCacheData,
	updateCacheData,
	setDefData,
	rewriteTransferSrcBids
} from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
let _this;
let materialFilterColumn = [
	'numberindex', //非元数据字段平台业务字段
	'pseudocolumn',
	'crowno',
	'dbilldate',
	'dr',
	'pk_org',
	'pk_org_v',
	'fbuysellflag',
	'casscustid',
	'btriatradeflag',
	'btransclosed',
	'bstockclose',
	'breceiveplan',
	'bpayclose',
	'blargess',
	'binvoiceclose',
	'bborrowpur',
	'barriveclose',
	'nitemdiscountrate'
];
let paymentFilterColumn = [ 'isdeposit', 'numberindex', 'prepayment', 'pseudocolumn', 'showorder' ];
let tableId = PAGECODE.cardbody; //body
export default function saveButton(props, skipCodes, callback) {
	if (this) {
		_this = this;
	}
	props.cardTable.filterEmptyRows(PAGECODE.head_payment, paymentFilterColumn);
	//暂存保存
	let tempsave = getDefData(OrderCache.OrderCardCache, 'tempsave');
	// 物料表体必须这么过滤，以为当数据来源为采购合同时物料可以为空，此时提示输入物料，而不能直接过滤掉
	// props.cardTable.filterEmptyRows(PAGECODE.cardbody, materialFilterColumn);
	// 只有物料和来源信息同时为空，才认为是空行，来源为采购合同时物料可以为空，此时提示输入物料，而不能直接过滤掉 NCC-157475
	props.cardTable.filterEmptyRows(PAGECODE.cardbody, [ 'csourceid', 'pk_material' ], 'include');
	if (!props.cardTable.getAllRows(tableId).length) {
		showWarningInfo(null, getLangByResId(this, '4004POORDER-000128')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ PAGECODE.cardhead ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: PAGECODE.cardbody,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	if (props.cardTable.getAllRows(PAGECODE.head_payment).length > 0) {
		let tablepay = props.validatePageToToast([
			{
				// createCardTable的areaCode，多页签区域填主表就行
				name: PAGECODE.head_payment,
				type: 'cardTable'
			}
		]); //表格必输项校验
		if (!tablepay.allPassed) {
			return;
		}
	}
	let bodyids = [ PAGECODE.cardbody, PAGECODE.head_payment ];
	//创建保存的聚合VO createExtCardDataSimple
	let data = props.createExtCardDataSimple(PAGECODE.cardcode, PAGECODE.cardhead, bodyids);
	//判断页面状态是新增还是编辑
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
	pk_order = pk_order == '' || pk_order == 'undefined' || pk_order == 'null' ? null : pk_order;
	let rows = data.bodys[PAGECODE.cardbody].rows;
	rows.forEach((row, index) => {
		if (row.values && row.values.pseudocolumn) {
			row.values.pseudocolumn.value = index + '';
		}
	});
	let isAdd = true; //是否新增，缓存使用
	if (pk_order && !tempsave) {
		isAdd = false;
	} else {
		// 新增保存设置为2,包含新增后直接点暂存
		data.head.card_head.rows[0].status = '2';
	}
	if (skipCodes) {
		data['skipCodes'] = skipCodes;
	}
	skipCodes = skipCodes ? skipCodes : new Array();
	//公式
	props.validateToSave(data, () => {
		ajax({
			method: 'post',
			url: URL.save,
			data: data,
			success: function(res) {
				// 卡片界面，在浏览态时勾选行，点修改后去掉勾选，付款协议和物料
				props.cardTable.selectAllRows(PAGECODE.head_payment, false);
				props.cardTable.selectAllRows(PAGECODE.cardbody, false);
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					//参数一：返回的公式对象
					props.dealFormulamsg(res.formulamsg);
				}
				// 交互式异常处理
				if (res.data && res.data.isResume && res.data.isResume == true) {
					showResumeModal.call(
						_this,
						props,
						'MessageDlg',
						skipCodes,
						res.data,
						saveButton.bind(this, props, skipCodes, callback),
						props
					);
					return;
				}
				if (res.data) {
					//开关开始
					props.beforeUpdatePage();
					//暂存成功后复位false
					setDefData(OrderCache.OrderCardCache, 'tempsave', false);
					let datas = res.data;
					let pkCache = datas.head.card_head.rows[0].values.pk_order.value;
					if (datas.head) {
						props.form.setAllFormValue({
							[PAGECODE.cardhead]: datas.head[PAGECODE.cardhead]
						});
					}
					let cards = datas.bodys;
					if (cards && cards[PAGECODE.head_payment]) {
						let card_pay = props.cardTable.updateDataByRowId(
							PAGECODE.head_payment,
							cards[PAGECODE.head_payment],
							true
						);
						card_pay.areacode = PAGECODE.head_payment;
						res.data.bodys[PAGECODE.head_payment] = card_pay;
					}
					if (cards && cards[PAGECODE.cardbody]) {
						let card_mater = props.cardTable.updateDataByRowId(
							PAGECODE.cardbody,
							cards[PAGECODE.cardbody],
							true
						);
						card_mater.areacode = PAGECODE.cardbody;
						res.data.bodys[PAGECODE.cardbody] = card_mater;
					}
					props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
					//开关关闭
					props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
					let transfer = props.getUrlParam(TRANSFER.transfer);
					let channelType = props.getUrlParam(TRANSFER.channelType);
					if (transfer || channelType) {
						if (channelType) {
							// 推单回写
							pushSaveWriteBack.call(this, res, channelType);
						} else {
							if (transfer == '20') {
								//单独处理请购单 伪列处理
								let bids = getDefData(OrderCache.OrderTransferCache, '20to21bids');
								props.transferTable.setSavedTransferTableDataPk(bids);
							}
							rewriteTransferSrcBids(props, 'csourcebid', datas.bodys[PAGECODE.cardbody].rows);
						}
						// 转单编辑界面保存
						let DS_KEY = OrderCache.OrderCacheKey;
						//转单--多单编辑情况要注意保存提交进入就不走缓存
						let datass = {};
						datass.head = res.data.head;
						datass.body = res.data.bodys;
						datass.pageid = res.data.pageid;
						let cachedata = datass;
						if (callback == null) {
							props.setUrlParam({ status: STATUS.browse });
							props.transferTable.setTransformFormStatus('leftarea', {
								status: true,
								onChange: (current, next, currentIndex) => {
									_this.indexstatus[currentIndex] = STATUS.browse;
									cachedata = props.transferTable.updateTransferListValueByIndex(
										'leftarea',
										datass,
										currentIndex
									);
								}
							});
						}
						refreshcache(props, isAdd, cachedata, pkCache, DS_KEY);
					} else {
						let scene = getDefData(OrderCache.OrderCardCache, 'scene');
						props.setUrlParam({ status: STATUS.browse });
						if (scene == null || scene == 'ADD' || scene == 'linksce') {
							//应用场景
							props.setUrlParam({ id: pkCache });
							refreshcache(props, isAdd, datas, pkCache, OrderCache.OrderCacheKey);
						}
					}
				}
				if (res.success) {
					buttonController.materialPasteCancel.call(_this, props);
					buttonController.togglePageShow.call(_this, props, props.getUrlParam(TRANSFER.transfer));
					//2018-11-1;需求（刘兰娇、王丽平）再次变更保存提交给两个提示
					showSuccessInfo(getLangByResId(_this, '4004POORDER-000005')); /* 国际化处理： 保存成功！*/
					if (callback) {
						callback.call(this, skipCodes);
					}
				}
			}
		});
	});
}

function refreshcache(props, isAdd, cachedata, pkCache, DS_KEY) {
	if (isAdd) {
		addCacheData(props, FIELD.pk_order, pkCache, cachedata, PAGECODE.cardhead, DS_KEY);
		// 更新翻页组件当前pk值
		props.cardPagination.setCardPaginationId({ id: pkCache, status: 1 });
	} else {
		updateCacheData(props, FIELD.pk_order, pkCache, cachedata, PAGECODE.cardhead, DS_KEY);
	}
}

/**
 * 推单回写
 * @param {*} res
 */
function pushSaveWriteBack(res, channelType) {
	let srcbids = [];
	res.data.bodys[PAGECODE.cardbody].rows.forEach((row) => {
		srcbids.push(row.values.csourcebid.value);
	});
	let data = {
		srcbids: srcbids,
		ts: new Date()
	};
	let key;
	if (channelType == TRANSFER.replenishmentarrange) {
		// 补货
		key = PUSHCONST.replenishmentArrangeIds;
	} else if (channelType == TRANSFER.directarrange) {
		// 直运
		key = PUSHCONST.directArrangeIds;
	} else if (channelType == TRANSFER.priceaudit) {
		// 价格审批单
		key = PUSHCONST.pushId;
	}
	broadcast.broadcast(key, data);
}
