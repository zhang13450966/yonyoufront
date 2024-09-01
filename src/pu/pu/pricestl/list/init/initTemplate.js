import { PAGECODE, URL, LIST_BUTTON, FIELD, STATUS, TRANSFER, OrderCache } from '../../constance';
import { initButtons } from '../afterEvents';
import { btnClick } from '../btnClicks';
import { ajax, cacheTools } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController';
import { getDefData, hasListCache } from '../../../../../scmpub/scmpub/pub/cache';
import commonSerach from '../btnClicks/commonSearch';
export default function() {
	this.props.createUIDom(
		{
			pagecode: PAGECODE.listcode
		},
		(templedata) => {
			if (templedata) {
				let meta = templedata.template;
				meta = modifier.call(this, meta, this.props);
				this.props.meta.setMeta(meta, toggleShow.call(this));
				this.props.meta.setMeta(meta, initQueryData.bind(this, this.props)); // 调用查询方法
			}
			if (templedata.button) {
				let button = templedata.button;
				this.props.button.setButtons(button);
				this.props.button.setPopContent(
					LIST_BUTTON.List_Inner_Delete,
					getLangByResId(this, '4004PRICESTL-000008')
				); /* 国际化处理： 确定要删除吗？*/
			}
		}
	);
}
/**
 * 列表数据后处理修饰
 * @param {*} meta 
 * @param {*} props 
 */
function modifier(meta, props) {
	let listTableMeta = meta[PAGECODE.tableId];
	//修改编辑前参照过滤
	meta[PAGECODE.searchId].items.map((item) => {
		if (item.attrcode == FIELD.pk_org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		if (item.attrcode == 'pk_dept') {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == 'pk_employee') {
			// 采购员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(PAGECODE.searchId, 'pk_dept');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu'
				};
			};
		}
	});
	//模板table的订单编号列加超链接
	listTableMeta.items = listTableMeta.items.map((item, key) => {
		if (item.attrcode == FIELD.vbillcode) {
			item.render = (text, record, index) => {
				//取值前需先判断record是否为空，避免没有数据的情况报错
				let pk_pricesettle = record && record.pk_pricesettle && record.pk_pricesettle.value;
				let billStatus = record && record.billStatus;
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							this.props.pushTo(URL.gotoCard, {
								status: STATUS.browse,
								id: pk_pricesettle,
								pagecode: PAGECODE.cardcode
								// billStatus: billStatus
							});
						}}
					>
						{record && record.vbillcode && record.vbillcode.value}
					</a>
				);
			};
		}
		return item;
	});
	let event = {
		label: getLangByResId(this, '4004PRICESTL-000017') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '150px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			// let fbillstatus = record && record.fbillstatus && record.fbillstatus.value;
			// let buttonAry = [
			// 	LIST_BUTTON.List_Inner_Commit, //行提交
			// 	LIST_BUTTON.List_Inner_Edit, //行修改
			// 	LIST_BUTTON.List_Inner_Delete, //行删除
			// 	LIST_BUTTON.List_Inner_UnCommit, //行收回
			// 	LIST_BUTTON.List_Inner_ApproveInfo //行查看审批意见
			// ];
			// if (FIELD.free == fbillstatus) {
			// 	//自由-->可以提交、修改、删除、查看审批意见
			// 	buttonAry = [
			// 		LIST_BUTTON.List_Inner_Commit, //提交
			// 		LIST_BUTTON.List_Inner_Edit, //行修改
			// 		LIST_BUTTON.List_Inner_Delete, //行删除
			// 		LIST_BUTTON.List_Inner_ApproveInfo //行查看审批意见
			// 	];
			// } else if (FIELD.unapproved == fbillstatus) {
			// 	//审批不通过-->修改、审批详情
			// 	buttonAry = [ LIST_BUTTON.List_Inner_Edit, LIST_BUTTON.List_Inner_ApproveInfo ];
			// } else if (FIELD.approve == fbillstatus) {
			// 	//审批中-->审批详情
			// 	buttonAry = [ LIST_BUTTON.List_Inner_ApproveInfo ];
			// } else if (FIELD.approved == fbillstatus) {
			// 	//审批通过-->收回、审批详情
			// 	buttonAry = [ LIST_BUTTON.List_Inner_UnCommit, LIST_BUTTON.List_Inner_ApproveInfo ];
			// }
			// buttonAry = [ LIST_BUTTON.List_Inner_UnCommit, LIST_BUTTON.List_Inner_ApproveInfo ];
			let buttonAry = buttonController.getListOprRowButtons.call(this, record);
			return this.props.button.createOprationButton(buttonAry, {
				area: PAGECODE.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClick.call(this, props, key, text, record, index)
			});
		}
	};
	meta[PAGECODE.tableId].items.push(event);
	return meta;
}
function toggleShow() {
	// 初始化按钮状态
	// initButtons.call(this, this.props, null);
	buttonController.initButtons.call(this, this.props, null);
	let transfer = this.props.getUrlParam(TRANSFER.transfer);
	let datas = this.props.getUrlParam('ids');
	if (transfer != null) {
		if (datas && datas['ids']) {
			let data = {
				pks: datas['ids'],
				pageid: PAGECODE.listcode
			};
			let _this = this;
			//得到数据渲染到页面
			ajax({
				url: URL.currentpage,
				data: data,
				method: 'POST',
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							_this.props.table.setAllTableData(PAGECODE.tableId, data[PAGECODE.tableId]);
						} else {
							_this.props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
						}
					}
				}
			});
		}
		if (datas && datas['error']) {
			let errors = datas['error'];
			let mess = '';
			for (let i in errors) {
				mess = errors[i] + ',';
			}
			if (mess) {
				let lastIndex = mess.lastIndexOf(',');
				if (lastIndex > -1) {
					mess = mess.substring(0, lastIndex - 1);
				}
			}
			showErrorInfo(mess);
		}
	} else {
		if (hasListCache(this.props, OrderCache.OrderCacheKey)) {
			let totalnum = getDefData.call(this, OrderCache.OrderCacheKey, 'totalNum');
			if (totalnum) {
				this.setState({
					uncommitNum: totalnum.uncommitNum,
					approvingNum: totalnum.approvingNum
					// executNum: totalnum.executNum
				});
			}
		}
	}
}
function initQueryData(props) {
	if (!hasListCache(props, OrderCache.OrderCacheKey)) {
		let queryInfo = cacheTools.get(OrderCache.Searchval);
		commonSerach.bind(this, 'toCommit', queryInfo, false, true)();
	} else {
		let totalnum = getDefData.call(this, OrderCache.OrderCacheKey, 'totalNum');
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
