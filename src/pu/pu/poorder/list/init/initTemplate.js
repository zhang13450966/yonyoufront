/*
 * @Author: CongKe
 * @PageInfo: 采购订单列表态初始化
 * @Date: 2018-04-19 10:12:36
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-02-19 16:30:43
 */
import { URL, PAGECODE, FIELD, STATUS, LIST_BUTTON, OrderCache, COMMON } from '../../constance';
import commonSerach from '../btnClicks/commonSearch';
import { ajax, cacheTools } from 'nc-lightapp-front';
import { setDefData, getDefData, hasListCache } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController, buttonClickController } from '../viewController/index';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil.js';
import { yycBtnInit } from '../../../yyc/ext/yycBtnInit';
import { listLinkQuery } from './linkInitData';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';
import ntpLinkList from '../../../pub/linkQuery/ntpLinkList';
import { pageInfoClick } from '../btnClicks';
import excelImportconfig from 'uap/common/components/excelImportconfig';

export default function() {
	//设置导入url  常量
	let excelimportconfig = excelImportconfig(
		this.props,
		FIELD.PURCHASEORG, //模块名称
		PAGECODE.billType, //单据类型
		true,
		URL.importUrl,
		{
			noTips: true,
			isSelfDefineImport: true
		}
	);
	this.props.createUIDom(
		{
			pagecode: PAGECODE.listcode
		},
		(templedata) => {
			if (templedata) {
				transtypeUtils.init.call(this, templedata.context);
				if (templedata.template) {
					let meta = templedata.template;
					meta = modifier.call(this, meta, this.props);
					transtypeUtils.initQuery.call(this, this.props, meta, PAGECODE.searchId, FIELD.ctrantypeid);
					this.props.meta.setMeta(meta);
				}
				if (templedata.button) {
					let button = templedata.button;
					// this.props.button.hideButtonsByAreas([ PAGECODE.tableId ]);
					this.props.button.setButtons(button);
					this.props.button.setPopContent(
						LIST_BUTTON.Delete,
						getLangByResId(this, '4004POORDER-000077')
					); /* 国际化处理： 确认删除？*/
					// 友云采按钮初始化
					yycBtnInit(this.props);
					//将导入组件注册到按钮中
					this.props.button.setUploadConfig(LIST_BUTTON.Import, excelimportconfig);
				}
				let refBillQueryData = { billType: '21' };
				if (templedata.context.paramMap && templedata.context.paramMap.transtype) {
					refBillQueryData.transType = templedata.context.paramMap.transtype;
					setDefData(OrderCache.OrderCardCache, 'transtype', templedata.context.paramMap.transtype);
				}
				toggleShow.call(this);
				ajax({
					url: URL.refbillqueryaction,
					data: refBillQueryData,
					success: (res) => {
						if (res.success) {
							let isshowselfmake = false;
							res.data &&
								res.data.forEach((element) => {
									if (element && element.makeflag) {
										// 可自制
										isshowselfmake = true;
									}
								});
							this.props.button.setButtonVisible([ LIST_BUTTON.selfmake ], isshowselfmake);
						}
					}
				});
			}
		}
	);
}
/**
 * 列表数据后处理修饰
 * @param  meta
 * @param {*} props
 */
function modifier(meta, props) {
	let listTableMeta = meta[PAGECODE.tableId];
	//修改编辑前参照过滤
	meta[PAGECODE.searchId].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		if (item.attrcode == FIELD.pk_org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode != 'pk_order_b.pk_reqstordoc' && item.attrcode != 'pk_order_b.pk_recvstordoc') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}

		if (item.attrcode == 'pk_reqdept_v') {
			//需求部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: FIELD.STOCKORG
				};
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//订单类型过滤交易类型
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				pk_org =
					pk_org != null ? (pk_org.value.firstvalue.includes(',') ? null : pk_org.value.firstvalue) : null;
				//订单类型过滤交易类型
				return {
					istransaction: 'Y',
					parentbilltype: '21',
					SCM_CONSIDERBUSITYPE: 'Y',
					pk_org: pk_org,
					SCM_BUSIORG: pk_org,
					// GridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
					UsualGridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
				};
			};
		} else if (item.attrcode == FIELD.pk_dept) {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: FIELD.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.cemployeeid) {
			// 采购员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_dept);
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: FIELD.PURCHASEORG
				};
			};
		} else if (item.attrcode == 'pk_order_b.pk_reqstoorg') {
			//需求库存组织
			item.isShowUnit = false;
		} else if (item.attrcode == 'pk_order_b.pk_arrvstoorg') {
			//收货库存组织
			item.isShowUnit = false;
		} else if (item.attrcode == 'pk_order_b.pk_reqstordoc') {
			//需求仓库
			item.isShowUnit = true;
			item.queryCondition = () => {
				let reqstoorg = props.search.getSearchValByField(PAGECODE.searchId, 'pk_order_b.pk_reqstoorg');
				reqstoorg =
					reqstoorg != null
						? reqstoorg.value.firstvalue.includes(',') ? null : reqstoorg.value.firstvalue
						: null;
				return {
					pk_org: reqstoorg,
					busifuncode: FIELD.STOCKORG
				};
			};
		} else if (item.attrcode == 'pk_order_b.pk_recvstordoc') {
			//收货仓库
			item.isShowUnit = true;
			item.queryCondition = () => {
				let arrvstoorg = props.search.getSearchValByField(PAGECODE.searchId, 'pk_order_b.pk_arrvstoorg');
				arrvstoorg =
					arrvstoorg != null
						? arrvstoorg.value.firstvalue.includes(',') ? null : arrvstoorg.value.firstvalue
						: null;
				return {
					pk_org: arrvstoorg,
					busifuncode: FIELD.STOCKORG
				};
			};
		}
	});
	//模板table的订单编号列加超链接
	listTableMeta.items = listTableMeta.items.map((item, key) => {
		if (item.attrcode == FIELD.vbillcode) {
			item.render = (text, record, index) => {
				//取值前需先判断record是否为空，避免没有数据的情况报错
				let pk_order = record && record.pk_order && record.pk_order.value;
				let scene = this.props.getUrlParam('scene');
				return (
					<BillCodeHyperLink
						value={record && record.vbillcode && record.vbillcode.value}
						onClick={() => {
							this.props.pushTo(URL.gotoCard, {
								status: STATUS.browse,
								id: pk_order,
								scene: scene,
								pagecode: PAGECODE.cardcode
							});
						}}
					/>
				);
			};
		}
		return item;
	});
	// 冻结不要操作列
	let scene = props.getUrlParam('scene');
	if (scene != 'freeze') {
		//添加表格操作列
		let event = {
			label: getLangByResId(this, '4004POORDER-000008') /* 国际化处理： 操作*/,
			attrcode: 'opr',
			itemtype: 'customer',
			fixed: 'right',
			width: '200px',
			visible: true,
			render: (text, record, index) => {
				let buttonAry = buttonController.getListOprRowButtons.call(this, record);
				return props.button.createErrorButton({
					record: record,
					showBack: false, // 是否显示回退按钮
					sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry, {
							area: PAGECODE.list_inner,
							ignoreHotkeyCode: getListDisableHotKeyBtn(),
							buttonLimit: 3,
							onButtonClick: (props, key) =>
								buttonClickController.call(this, props, key, text, record, index)
						});
					}
				});
			}
		};
		meta[PAGECODE.tableId].items.push(event);
	}
	return meta;
}

function toggleShow() {
	let _this = this;
	// 初始化按钮状态
	// buttonController.initButtons.call(this, this.props, null);
	let linkkey = _this.props.getUrlParam(COMMON.LINK_KEY);
	if (_this.props.getUrlParam('pk_ntbparadimvo')) {
		// 采购计划联查过来的
		ntpLinkList.call(
			_this,
			_this.props,
			{ cardUrl: URL.gotoCard, listFormId: PAGECODE.tableId },
			buttonController.initButtons.bind(_this)
		);
	} else if (_this.props.getUrlParam('ntpLinkIds')) {
		pageInfoClick.call(_this, _this.props, null, _this.props.getUrlParam('ntpLinkIds').split(','));
	} else {
		if (linkkey) {
			//更新当前页签编码
			this.setState({ currentTab: 3 });
			setDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode, {
				tabCode: 3
			});
			let config = { areacode: PAGECODE.tableId, pagecode: PAGECODE.listcode, url: URL.currentpage };
			listLinkQuery.call(this, this.props, config);
		} else if (!hasListCache(this.props, OrderCache.OrderCacheKey)) {
			// 看板跳转过来
			let srcpk = this.props.getUrlParam(FIELD.pk);
			if (srcpk) {
				let srcpks = [];
				srcpks.push(srcpk);
				//更新当前页签编码
				pageInfoClick.call(this, this.props, null, srcpks);
			} else {
				let queryInfo = cacheTools.get(OrderCache.Searchval);
				commonSerach.call(this, FIELD.tocommit, queryInfo, true); // 调用查询方法
			}
		} else {
			let totalnum = getDefData.call(this, OrderCache.OrderCacheKey, 'totalNum');
			if (totalnum) {
				this.setState({
					uncommitNum: totalnum.uncommitNum,
					approvingNum: totalnum.approvingNum,
					executNum: totalnum.executNum
				});
			}
		}
	}
}
