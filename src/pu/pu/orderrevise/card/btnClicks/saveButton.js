/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-04-20 10:11:59
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-06 10:33:53
 */
import { createPage, ajax, toast, base, high } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, STATUS, OrderReviseCache, BUTTON } from '../../constance';
import { changeUrlParam, addCacheData, updateCacheData, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updatePKCache } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { buttonController } from '../viewController/index';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

let bodyId = PAGECODE.cardbody;
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
export default function saveButton(props, skipCodes) {
	if (this) {
		_this = this;
	}
	//过滤空行
	// props.cardTable.filterEmptyRows(bodyId, materialFilterColumn);
	// 只有物料和来源信息同时为空，才认为是空行，来源为采购合同时物料可以为空，此时提示输入物料，而不能直接过滤掉 NCC-157475
	props.cardTable.filterEmptyRows(bodyId, [ 'csourceid', 'pk_material' ], 'include');

	let data = props.createMasterChildDataSimple(PAGECODE.cardcode, PAGECODE.cardhead, bodyId);
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
	let length = props.cardTable.getVisibleRows(PAGECODE.cardbody).length;
	if (!length || length == 0) {
		showWarningInfo(null, getLangByResId(this, '4004ORDERREVISE-000042')); /* 国际化处理： 表体为空*/
		return;
	}

	let _url = URL.cardinsert;
	let old_pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
	let forderstatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.forderstatus);
	let isAdd = false;
	if (forderstatus.value == '3') {
		isAdd = true;
	}
	if (skipCodes) {
		data['skipCodes'] = skipCodes;
	}
	let rowidPkMap = {};
	data.body[bodyId].rows.forEach((row, index) => {
		row.values.pseudocolumn = { value: index + '' };
		rowidPkMap[index] = row.rowid;
	});
	skipCodes = skipCodes ? skipCodes : new Array();
	props.validateToSave(data, () => {
		ajax({
			method: 'post',
			url: _url,
			data: data,
			success: function(res) {
				// 单据卡片界面，在浏览态时勾选行，点修改后去掉勾选，付款协议和物料
				props.cardTable.selectAllRows(bodyId, false);
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					//参数一：返回的公式对象
					props.dealFormulamsg(res.formulamsg);
				}
				// 交互式异常处理
				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.call(
						_this,
						props,
						'MessageDlg',
						skipCodes,
						res.data,
						saveButton.bind(_this, props, skipCodes),
						props
					);
					return;
				}
				props.beforeUpdatePage();
				props.form.setAllFormValue({ [PAGECODE.cardhead]: res.data.head[PAGECODE.cardhead] });
				// 填充子表数据
				res.data.body[bodyId].rows.forEach((element, index) => {
					element.rowid = rowidPkMap[element.rowid];
				});
				props.cardTable.updateDataByRowId(bodyId, res.data.body[bodyId], true);
				let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
				props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
				props.cardTable.setStatus(bodyId, STATUS.browse);
				changeUrlParam(props, { id: pk_order, status: STATUS.browse });
				props.updatePage(PAGECODE.cardhead, bodyId);
				refreshcache(props, isAdd, res.data, pk_order, OrderReviseCache.OrderReviseCacheKey, old_pk_order);
				/* 国际化处理： 保存成功！*/
				toast({ color: 'success', title: getLangByResId(_this, '4004ORDERREVISE-000010') });
				buttonController.togglePageShow.call(_this, props);
			}
		});
	});
}

function refreshcache(props, isAdd, cachedata, pkCache, DS_KEY, old_pk_order) {
	if (isAdd) {
		deleteCacheData(props, FIELD.pk_order, old_pk_order, DS_KEY);
		addCacheData(props, FIELD.pk_order, pkCache, cachedata, PAGECODE.cardhead, DS_KEY);
		// 更新翻页组件当前pk值
		props.cardPagination.setCardPaginationId({ id: pkCache, status: 1 });
	} else {
		updateCacheData(props, FIELD.pk_order, pkCache, cachedata, PAGECODE.cardhead, DS_KEY);
		// 替换主键，并替换主键对应的单据数据
		// updatePKCache(pkCache, pkCache, old_pk_order, PAGECODE.cardhead, cachedata);
	}
}
