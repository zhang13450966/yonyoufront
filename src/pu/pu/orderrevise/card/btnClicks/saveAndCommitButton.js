/*
 * @Author: CongKe
 * @PageInfo: 保存提交
 * @Date: 2018-04-20 10:11:59
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-12 17:18:07
 */
import { ajax, broadcast } from 'nc-lightapp-front';
import { buttonController } from '../viewController/index';
import { URL, PAGECODE, FIELD, STATUS, TRANSFER, OrderReviseCache, PUSHCONST } from '../../constance';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import {
	getDefData,
	changeUrlParam,
	addCacheData,
	updateCacheData,
	deleteCacheData,
	setDefData,
	rewriteTransferSrcBids
} from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo, showSaveAndCommitInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import {
	updateExtBillDataForCompareByPk,
	updateDtaForCompareByPk
} from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { pageInfoClick } from './index';
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
let _this;

export default function saveAndCommit(skipCodes, assign) {
	if (this) {
		_this = this;
	}
	let props = _this.props;
	props.cardTable.filterEmptyRows(PAGECODE.head_payment, paymentFilterColumn);

	// 物料表体必须这么过滤，以为当数据来源为采购合同时物料可以为空，此时提示输入物料，而不能直接过滤掉
	// props.cardTable.filterEmptyRows(PAGECODE.cardbody, materialFilterColumn);
	// 只有物料和来源信息同时为空，才认为是空行，来源为采购合同时物料可以为空，此时提示输入物料，而不能直接过滤掉 NCC-157475
	props.cardTable.filterEmptyRows(PAGECODE.cardbody, [ 'csourceid', 'pk_material' ], 'include');

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
	if (!props.cardTable.getVisibleRows(tableId).length) {
		showWarningInfo(null, getLangByResId(this, '4004ORDERREVISE-000042')); /* 国际化处理： 表体为空*/
		return;
	}
	let bodyids = PAGECODE.cardbody;
	//创建保存的聚合VO createExtCardDataSimple
	let data = props.createMasterChildDataSimple(PAGECODE.cardcode, PAGECODE.cardhead, bodyids);
	//判断页面状态是新增还是编辑
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	let rows = data.body[PAGECODE.cardbody].rows;
	rows.forEach((row, index) => {
		if (row.values && row.values.pseudocolumn) {
			row.values.pseudocolumn.value = index + '';
		}
	});
	let isAdd = true; //是否新增，缓存使用
	if (pk_order) {
		isAdd = false;
	} else {
		// 新增保存设置为2
		data.head.card_head.rows[0].status = '2';
	}
	if (skipCodes) {
		data['skipCodes'] = skipCodes;
	}
	skipCodes = skipCodes ? skipCodes : new Array();

	for (let i = 0; i < skipCodes.length; i++) {
		if (skipCodes[i] == 'PUBudgetControlCheckException') {
			skipCodes[i] = 'BudgetControlCheck';
		}
	}
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	//公式
	props.validateToSave(data, () => {
		ajax({
			method: 'post',
			url: URL.saveAndCommit,
			data: data,
			success: function(res) {
				if (
					res.data &&
					res.data.workflow &&
					(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
				) {
					_this.skipCodes = data['skipCodes'];
					_this.setState({
						compositedata: res.data,
						compositedisplay: true,
						saveAndCommit: true
					});
					return;
				}
				// 卡片界面，在浏览态时勾选行，点修改后去掉勾选，付款协议和物料
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
						saveAndCommit.bind(_this, skipCodes, assign),
						props
					);
					return;
				}
				if (res.data) {
					//开关开始
					props.beforeUpdatePage();
					//暂存成功后复位false
					let datas = res.data;
					let map = new Map();
					map.set('pk_order_b', PAGECODE.cardbody);
					let fbillstatus = res.data.head[PAGECODE.cardhead].rows[0].values.forderstatus.value;
					let datasource = OrderReviseCache.OrderReviseCacheKey;
					// datas.head[PAGECODE.cardhead].rows = props.form.getAllFormValue(PAGECODE.cardhead).rows;
					props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
					let pkid = res.data.head[PAGECODE.cardhead].rows[0].values.pk_order.value;
					_this.props.setUrlParam({
						status: STATUS.browse,
						id: pkid
					});
					if (fbillstatus == FIELD.approved) {
						deleteCacheData(_this.props, FIELD.pk_order, pk_order, datasource);
						addCacheData(_this.props, FIELD.pk_order, pkid, res.data, PAGECODE.cardhead, datasource);

						// updateCacheData(_this.props, FIELD.pk_order, pkid, res.data, PAGECODE.cardhead, datasource);
						_this.props.cardTable.setTableData(
							PAGECODE.cardbody,
							res.data.body[PAGECODE.cardbody],
							null,
							true,
							true
						);
					} else {
						_this.props.cardTable.updateTableData(
							_this.props,
							PAGECODE.cardbody,
							res.data.body[PAGECODE.cardbody]
						);
						updateCacheData(_this.props, FIELD.pk_order, pk_order, res.data, PAGECODE.cardhead, datasource);
					}
					pageInfoClick.call(_this, _this.props);
					//开关关闭
					props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
				}
				if (res.success) {
					_this.skipCodes = [];
					buttonController.materialPasteCancel.call(_this, props);
					showSaveAndCommitInfo(); /* 国际化处理： 保存提交成功*/
				}
				setTimeout(() => {
					buttonController.togglePageShow.call(_this, _this.props, null);
				}, 0);
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
