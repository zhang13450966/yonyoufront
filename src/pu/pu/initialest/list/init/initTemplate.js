/*
 * @Author: zhaochyu
 * @PageInfo: 列表态初始化
 * @Date: 2018-05-03 14:10:51
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 14:29:27
 */
import excelImportconfig from 'uap/common/components/excelImportconfig';
import {
	PAGECODE,
	FIELD,
	URL,
	UISTATE,
	AREA,
	LIST_BUTTON,
	SEARCH_FIELD,
	DATASOURCE,
	HEAD_FIELD
} from '../../constance';
import { initSearch } from '../btnClicks'; //需要修改成列表的删除按钮
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { setDefData, getDefData, hasListCache } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { btnClickController, buttonController } from '../viewControl';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';

export default function(props) {
	let excelimportconfig = excelImportconfig(props, 'pu', '4T', true, URL.import, {
		noTips: true,
		isSelfDefineImport: true
	});
	this.props.createUIDom({ pagecode: PAGECODE.listpagecode }, (data) => {
		if (data) {
			if (data.template) {
				//交易类型引用
				transtypeUtils.init.call(this, data.context);
				let meta = data.template;
				transtypeUtils.initQuery.call(this, props, meta, FIELD.searchArea, HEAD_FIELD.ctrantypeid);
				meta = modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta);
				initFreeNum.call(this);
			}
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button);
				props.button.setPopContent(
					'Delete',
					getLangByResId(this, '4004INITIALEST-000033')
				); /* 国际化处理： 确认要删除该信息吗？*/
				props.button.setUploadConfig(LIST_BUTTON.Import, excelimportconfig);
				this.toggleshow.call(this);
				buttonController.lineSelected.call(this, this.props, this.state.currentTab);
			}
			let refBillQueryData = { billType: PAGECODE.billType };
			if (data.context.paramMap && data.context.paramMap.transtype) {
				refBillQueryData.transType = data.context.paramMap.transtype;
				setDefData(DATASOURCE.dataSource, 'transtype', data.context.paramMap.transtype);
			}
			this.queryAddTab.call(this, refBillQueryData);
		}
	});
}
function getFieldValue2Arr(props, code) {
	let data = props.search.getSearchValByField(PAGECODE.searchId, code);
	data = ((data && data.value && data.value.firstvalue) || '').split(',');
	let length = data.length;
	if (length > 1) {
		return {};
	}
	return data;
}
function initFreeNum() {
	if (!hasListCache(this.props, DATASOURCE.dataSource)) {
		initSearch.bind(this, this.props, FIELD.free)();
	} else {
		let freenum = getDefData(DATASOURCE.dataSource, FIELD.freeNum);
		this.setState({
			freeNum: freenum ? freenum : 0
		});
	}
}
function modifierMeta(props, meta) {
	meta[PAGECODE.searchId].items.map((item) => {
		let code = item.attrcode;
		item.col = 4;
		// item.width = 120;
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (
			code == SEARCH_FIELD.pk_srcmaterial ||
			code == SEARCH_FIELD.pk_supplier ||
			code == SEARCH_FIELD.pk_srcmaterial ||
			code == SEARCH_FIELD.pk_srcmaterialCode ||
			code == SEARCH_FIELD.pk_srcmaterialName ||
			code == SEARCH_FIELD.pk_marbasclass ||
			code == SEARCH_FIELD.casscustid
		) {
			item.isShowUnit = true;
			item.isMultiSelectedEnabled = true;
			item.queryCondition = () => {
				let data = getFieldValue2Arr(props, SEARCH_FIELD.pk_org);
				return { pk_org: data[0] };
			};
		} else if (code == SEARCH_FIELD.pk_org) {
			item.queryCondition = () => {
				return {
					TreeRefActionExt: URL.org_permissions
				};
			};
		} else if (code == SEARCH_FIELD.pk_stordoc) {
			item.isShowUnit = true;
			item.isMultiSelectedEnabled = true;
			item.queryCondition = () => {
				let data = getFieldValue2Arr(props, SEARCH_FIELD.pk_stockorg);
				return { pk_org: data[0] };
			};
		} else if (code == SEARCH_FIELD.ctrantypeid) {
			//期初暂估类型过滤
			item.queryCondition = () => {
				let data = getFieldValue2Arr(props, SEARCH_FIELD.pk_org);
				return {
					parentbilltype: PAGECODE.billType,
					SCM_CONSIDERBUSITYPE: 'Y',
					SCM_BUSIORG: data[0],
					GridRefActionExt: URL.extrefsqlbuilder
				};
			};
		}
	});
	// 从meta中可以获取上面方法中获取的“搜索域”和“表格域”的元素，这里需要在表格中添加操作列，所以取tableArea
	let tableAreaTemp = meta.list_head;
	//设置单据号超链接
	tableAreaTemp.items = tableAreaTemp.items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				if (text) {
					return (
						<BillCodeHyperLink
							value={record && record.vbillcode && record.vbillcode.value}
							onClick={() => {
								props.pushTo(URL.cardurl, {
									status: UISTATE.browse,
									billStatus: record.fbillstatus.value,
									id: record.pk_initialest.value,
									pagecode: PAGECODE.cardpagecode
								});
							}}
						/>
						// <a
						// 	style={{ cursor: 'pointer' }}
						// 	onClick={() => {
						// 		props.pushTo(URL.cardurl, {
						// 			status: UISTATE.browse,
						// 			billStatus: record.fbillstatus.value,
						// 			id: record.pk_initialest.value,
						// 			pagecode: PAGECODE.cardpagecode
						// 		});
						// 	}}
						// >
						// 	{record.vbillcode.value}
						// </a>
					);
				}
			};
		}
		return item;
	});

	let operation = {
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		label: getLangByResId(this, '4004INITIALEST-000018') /* 国际化处理： 操作*/,
		width: '200px',
		visible: true,
		// render: (text, record, index) => {
		// 	let buttonAry = buttonController.setRowButtons.call(this, props, record);
		// 	return props.button.createOprationButton(buttonAry, {
		// 		area: AREA.list_inner,
		// 		buttonLimit: 3,
		// 		ignoreHotkeyCode: [LIST_BUTTON.Approve, LIST_BUTTON.UnApprove, LIST_BUTTON.Delete],
		// 		onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index),
		// 	});
		// },
		render: (text, record, index) => {
			let state = record.fbillstatus.value;
			let buttonAry = buttonController.setRowButtons(state);
			return props.button.createErrorButton({
				record: record,
				showBack: false, // 是否显示回退按钮
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: AREA.list_inner,
						ignoreHotkeyCode: getListDisableHotKeyBtn(),
						buttonLimit: 3,
						onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
					});
				}
			});
		}
	};
	tableAreaTemp.items.push(operation); // 将操作列添加到列表态的table中

	return meta;
}
