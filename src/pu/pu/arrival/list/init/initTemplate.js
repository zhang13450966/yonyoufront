/*
 * @Author: ligangt
 * @PageInfo: 到货单元数据加载
 * @Date: 2018-04-17 15:47:30
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-02-19 16:30:55
 */
import { ajax, base, cacheTools } from 'nc-lightapp-front';
import { APPID, PAGECODE, AREA, URL, BUTTONAREA, COMMON, FIELD } from '../../constance';
import { commonSearch, buttonClick, pageInfoClick } from '../btnClicks';
import { getDefData, hasListCache } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { refBillQueryCache } from '../../../pub/refBillQueryCache/refBillQueryCache';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';
import ntpLinkList from '../../../pub/linkQuery/ntpLinkList';

let { NCPopconfirm, NCIcon } = base;

export default function() {
	this.props.createUIDom(
		{
			pagecode: PAGECODE.head //页面id
			//appid: APPID //注册按钮的id
		},
		(templedata) => {
			if (templedata) {
				transtypeUtils.init.call(this, templedata.context);
				if (templedata.template) {
					let meta = templedata.template;
					transtypeUtils.initQuery.call(this, this.props, meta, AREA.searchArea, 'ctrantypeid');
					modifierMeta.call(this, this.props, meta);
					this.props.meta.setMeta(meta, initQueryData.bind(this, this.props));
					// commonSearch.bind(this, 'toCommit')(); // 调用查询方法
				}
				if (templedata.button) {
					let button = templedata.button;
					this.props.button.setButtons(button);
					this.props.button.setPopContent(
						'Delete',
						getLangByResId(this, '4004ARRIVAL-000050')
					); /* 国际化处理： 确认删除？*/
					this.onSelect();
				}
				let refBillQueryData = { billType: '23' };
				if (templedata.context.paramMap && templedata.context.paramMap.transtype) {
					refBillQueryData.transType = templedata.context.paramMap.transtype;
				}
				// refBillQueryCache(refBillQueryData, COMMON.arrivalRefBillCachekey, 'refBillDataCach');
				if (templedata.context.paramMap && templedata.context.paramMap.transtype) {
					setDefData(COMMON.arrivalRefBillCachekey, 'cbilltypecode', templedata.context.paramMap.transtype);
					setDefData(COMMON.arrivalRefBillCachekey, 'cbilltypeid', templedata.context.paramMap.pk_transtype);
					setDefData(
						COMMON.arrivalRefBillCachekey,
						'cbilltypename',
						templedata.context.paramMap.transtype_name
					);
					ajax({
						url: '/nccloud/pu/pub/refbillqueryaction.do',
						data: refBillQueryData,
						success: (res) => {
							if (res.success) {
								if (res.data) {
									setDefData(
										COMMON.arrivalRefBillCachekey,
										'refBillDataCach',
										refBillQueryData.transType
									);

									let billtypes = res.data.map((item) => {
										return item.src_billtype;
									});
									setDefData(COMMON.arrivalRefBillCachekey, 'refBilltypesCach', billtypes);
									if (billtypes.indexOf('61') < 0) {
										this.props.button.setButtonVisible('RefSubcont', false);
									}
									if (billtypes.indexOf('21') < 0) {
										this.props.button.setButtonVisible('RefOrder', false);
									}
								} else {
									this.props.button.setButtonVisible([ 'RefOrder', 'RefSubcont' ], false);
								}
							}
						}
					});
				}
			}
		}
	);
}

function initQueryData(props) {
	if (props.getUrlParam('pk_ntbparadimvo')) {
		// 采购计划联查过来的
		ntpLinkList.call(this, props, { cardUrl: URL.card, listFormId: AREA.form }, () => {
			let butArray = [
				'ReturnArrival',
				'Delete',
				'Commit',
				'UnCommit',
				'AccessoryManage',
				'QueryAboutBusiness',
				'Print',
				'OutPrint',
				'CombinPrint',
				'SplitPrint',
				'UrgentLetGo'
			];
			this.props.button.setButtonDisabled(butArray, true);
		});
	} else {
		if (!hasListCache(props, COMMON.arrivalCacheKey)) {
			let srcpk = this.props.getUrlParam(FIELD.pk);
			if (srcpk) {
				let srcpks = [];
				srcpks.push(srcpk);
				//更新当前页签编码
				pageInfoClick.call(this, this.props, null, srcpks);
			}
			let queryInfo = cacheTools.get(COMMON.arrivalServal);
			commonSearch.bind(this, 'toCommit', queryInfo, false, true)();
		} else {
			let totalnum = getDefData.call(this, COMMON.arrivalCacheKey, 'totalNum');
			if (totalnum) {
				this.setState({
					currentTab: totalnum.currentTab,
					toCommitNum: totalnum.toCommitNum,
					approvingNum: totalnum.approvingNum,
					exeNum: totalnum.processingNum
				});
			}
			// btn_Controller.call(this, this.props);
		}
	}
}

/**
 * 自定义元数据样式
 * @param {*} props
 * @param {*} meta
 */
function modifierMeta(props, meta) {
	meta[AREA.searchArea].items.map((item, key) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == 'ctrantypeid') {
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(AREA.searchArea, 'pk_org') != null
						? props.search.getSearchValByField(AREA.searchArea, 'pk_org').value.firstvalue
						: null;
				return {
					parentbilltype: '23',
					SCM_CONSIDERBUSITYPE: 'Y',
					SCM_BUSIORG: data
				};
			};
		} else if (item.attrcode == 'pk_org') {
			//主组织过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (
			item.attrcode == 'billmaker' ||
			item.attrcode == 'approver' ||
			item.attrcode == 'pk_freecust' ||
			item.attrcode == 'pk_transporttype' ||
			item.attrcode == 'pk_arriveorder_b.creporterid'
		) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(AREA.searchArea, 'pk_org') != null
						? props.search.getSearchValByField(AREA.searchArea, 'pk_org').value.firstvalue
						: null;
				return {
					pk_org: data
				};
			};
		} else if (item.attrcode != 'pk_org') {
			if (item.attrcode == 'pk_pupsndoc') {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data =
						props.search.getSearchValByField(AREA.searchArea, 'pk_purchaseorg') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_purchaseorg').value.firstvalue
							: null;
					return { pk_org: data, busifuncode: 'pu' }; // 根据pk_org过滤
				};
			} else if (item.attrcode == 'pk_dept') {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data =
						props.search.getSearchValByField(AREA.searchArea, 'pk_purchaseorg') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_purchaseorg').value.firstvalue
							: null;
					return { pk_org: data, busifuncode: 'pu' }; // 根据pk_org过滤
				};
			} else {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data =
						props.search.getSearchValByField(AREA.searchArea, 'pk_org') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_org').value.firstvalue
							: null;
					return {
						pk_org: data
					};
				};
			}
		}
	});
	let listTable = meta.head;
	meta[AREA.head].items = meta[AREA.head].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				if (record !== undefined) {
					return (
						<BillCodeHyperLink
							value={record && record.vbillcode && record.vbillcode.value}
							onClick={() => {
								props.pushTo('/card', {
									status: 'browse',
									id: record.pk_arriveorder.value,
									pagecode: PAGECODE.card
								});
							}}
						/>
					);
				}
			};
		}
		return item;
	});
	//添加操作列
	meta[AREA.head].items.push({
		itemtype: 'customer',
		attrcode: 'opr',
		label: getLangByResId(this, '4004ARRIVAL-000038') /* 国际化处理： 操作*/,
		width: 200,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			if (record !== undefined) {
				let status = record.fbillstatus.value;
				let buttonAry = [ 'Commit', 'Edit', 'Delete', 'CopyLine', 'ApproveInfo' ];
				if (status == 0) {
					// 自由
					buttonAry = [ 'Commit', 'Edit', 'Delete', 'ApproveInfo' ];
				} else if (status == 1 || status == 2) {
					// 审批中
					buttonAry = [ 'UnCommit', 'ApproveInfo' ];
				} else if (status == 3) {
					// 审批通过
					buttonAry = [ 'ApproveInfo' ];
				} else if (status == 4) {
					// 审批不通过
					buttonAry = [ 'Edit', 'ApproveInfo' ];
				}
				return props.button.createErrorButton({
					record: record,
					showBack: false, // 是否显示回退按钮
					sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry, {
							area: BUTTONAREA.listinner,
							ignoreHotkeyCode: getListDisableHotKeyBtn(),
							buttonLimit: 3,
							onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index)
						});
					}
				});
			}
		}
	});
	return meta;
}
