/*
 * @Author: jiangfw
 * @PageInfo: 列表界面初始化
 * @Date: 2018-04-24 16:04:02
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-01-27 14:54:08
 */
import { URL, AREA, BILLSTATUS, BUTTONID, FIELD, UISTATE, PAGECODE, COMMON, BILLTYPE } from '../../constance';
import commonSerach from '../btnClicks/commonSearch';
import addSearchRefFilter from '../../refFilter/searchRefFilter';
import { hasListCache, getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { refBillQueryCache } from '../../../pub/refBillQueryCache/refBillQueryCache';
import { btnController, btnClickController } from '../viewControl';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import from2507 from '../btnClicks/from2507';
import { listLinkQuery } from './linkInitData';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';
let refBillQueryData = null;
import ntpLinkList from '../../../pub/linkQuery/ntpLinkList';
import pageInfoClick from '../btnClicks/pageInfoClick';

export default function() {
	let props = this.props;
	let _this = this;
	let channelType = props.getUrlParam('channelType');
	let linkkey = props.getUrlParam(COMMON.LINK_KEY);
	props.createUIDom(
		{
			pagecode: PAGECODE.invoiceList //列表页面编码
		},
		(templedata) => {
			if (templedata) {
				// 交易类型添加逻辑,将交易类型缓存到state中
				transtypeUtils.init.call(_this, templedata.context);
				// 交易类型发布的小应用新增按钮可用性
				refBillQueryData = { billType: BILLTYPE.invoice, includeUnCloud: true };
				if (templedata.context.paramMap && templedata.context.paramMap.transtype) {
					_this.transType = templedata.context.paramMap.transtype;
					refBillQueryData.transType = templedata.context.paramMap.transtype;
				}
				loadBillQueryCache.call(this, refBillQueryData);
				if (templedata.button) {
					let button = templedata.button;
					props.button.setPopContent(
						BUTTONID.Delete,
						getLangByResId(_this, '4004PUINVOICE-000056')
					); /* 国际化处理： 确认删除？*/
					props.button.setButtons(button);
				}
				if (templedata.template) {
					let meta = templedata.template;
					meta = modifierMeta.call(_this, props, meta);
					transtypeUtils.initQuery.call(_this, props, meta, AREA.queryArea, FIELD.ctrantypeid);
					props.meta.setMeta(meta, initQueryData.bind(_this, props, channelType, linkkey));
				}
			}
		}
	);
}

function initQueryData(props, channelType, linkkey) {
	if (props.getUrlParam('pk_ntbparadimvo')) {
		ntpLinkList.call(this, props, { cardUrl: URL.card, listFormId: AREA.list_head }, btnController.bind(this));
	} else {
		if (!hasListCache(props, COMMON.PuinvoiceCacheKey)) {
			if (channelType && channelType == 'from2507') {
				from2507.call(this);
			} else if (linkkey) {
				let config = { areacode: AREA.list_head, pagecode: PAGECODE.invoiceList, url: URL.pageQueryByPKs };
				listLinkQuery.call(this, this.props, config);
			} else {
				// 里程碑看板跳转
				let srcpk = this.props.getUrlParam(FIELD.pk);
				if (srcpk) {
					let srcpks = [];
					srcpks.push(srcpk);
					pageInfoClick.call(this, this.props, null, srcpks);
				} else {
					let queryInfo = getDefData(COMMON.PuinvoiceCacheKey, AREA.queryArea);
					commonSerach.call(this, AREA.toCommit, queryInfo, '0', refBillQueryData);
				}
			}
		} else {
			let totalnum = getDefData.call(this, COMMON.PuinvoiceCacheKey, 'totalNum');
			if (totalnum) {
				this.setState({
					currentTab: totalnum.currentTab,
					toCommitNum: totalnum.toCommitNum,
					approvingNum: totalnum.approvingNum
				});
			}
			setTimeout(() => {
				btnController.call(this, this.props);
			}, 0);
		}
	}
}

function modifierMeta(props, meta) {
	let _this = this;
	//添加超链接
	meta[AREA.list_head].items = meta[AREA.list_head].items.map((item, key) => {
		if (item.attrcode == FIELD.vbillcode) {
			item.render = (text, record, index) => {
				if (record && record.pk_invoice) {
					return (
						<BillCodeHyperLink
							value={record && record.vbillcode && record.vbillcode.value}
							onClick={() => {
								// 清除缓存
								setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, null);
								props.pushTo(URL.card, {
									status: UISTATE.browse,
									id: record.pk_invoice.value,
									pagecode: PAGECODE.invoiceCard
								});
							}}
						/>
					);
				}
			};
		}
		return item;
	});

	// 添加操作列
	let porCol = {
		attrcode: 'opr',
		label: getLangByResId(_this, '4004PUINVOICE-000032') /* 国际化处理： 操作*/,
		visible: true,
		width: '185px',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		render: (text, record, index) => {
			let status = record.fbillstatus.value;
			let buttonAry = new Array();
			if (status === BILLSTATUS.free) {
				// 自由态单据
				buttonAry = [ BUTTONID.Commit, BUTTONID.Edit, BUTTONID.Delete, BUTTONID.Copy, BUTTONID.ApproveInfo ];
			} else if (status === BILLSTATUS.nopass) {
				// 审批不通过
				buttonAry = [ BUTTONID.Edit, BUTTONID.Copy, BUTTONID.ApproveInfo ];
			} else if (status === BILLSTATUS.approving || status === BILLSTATUS.approve) {
				// 审批中
				buttonAry = [ BUTTONID.Copy, BUTTONID.ApproveInfo ];
			}

			// return props.button.createOprationButton(buttonAry, {
			//     area: AREA.list_inner,
			//     ignoreHotkeyCode: getListDisableHotKeyBtn(),
			//     buttonLimit: 3,
			//     onButtonClick: (props, key) => btnClickController.call(_this, props, key, text, record, index)
			// });
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
	meta[AREA.list_head].items.push(porCol);
	// 添加参照过滤
	addSearchRefFilter.call(_this, props, meta);
	// 行号排序处理
	// columnSortUtils.numberSort(meta, AREA.list_head, FIELD.crowno);
	return meta;
}

function loadBillQueryCache(refBillQueryData) {
	refBillQueryCache(refBillQueryData, COMMON.PuinvoiceCacheKey, COMMON.RefBillTypeInfo);
}
