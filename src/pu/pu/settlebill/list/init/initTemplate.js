import { ajax, base, toast } from 'nc-lightapp-front';
const { NCPopconfirm, NCIcon } = base;
import { PAGECODE, URL, FIELD, BUTTON } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { searchBtnClick } from '../btnClicks';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.pagecode //模板pageid
		},
		callbackFun.bind(this)
	);
	function callbackFun(templedata) {
		if (templedata) {
			if (templedata.template) {
				let meta = templedata.template;
				meta = modifier.call(this, meta, props);
				props.meta.setMeta(meta);
			}
			if (templedata.button) {
				let butArray = [
					BUTTON.cancelToIA,
					BUTTON.del,
					BUTTON.file,
					BUTTON.linkQuery,
					BUTTON.print,
					BUTTON.sendToIA,
					BUTTON.review,
					BUTTON.output,
					BUTTON.refreash
				];
				let button = templedata.button;
				props.button.setButtons(button);
				props.button.setPopContent(BUTTON.del, getLangByResId(this, '4004SETTLEBILL-000009')); /* 国际化处理： 确认删除？*/
				setTimeout(() => {
					this.toggleShow();
				}, 0);

				// props.button.setButtonDisabled(butArray, true);
			}
		}
	}
}

function modifier(meta, props) {
	meta[PAGECODE.searchId].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == FIELD.pk_org) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'po_settlebill_b.pk_psndoc') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org).value.firstvalue
						: null;
				return { busifuncode: 'pu' }; // 根据pk_org过滤
			};
		} else if (item.attrcode == 'po_settlebill_b.pk_dept') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org).value.firstvalue
						: null;
				return { busifuncode: 'pu' }; // 根据pk_org过滤
			};
		} else if (item.attrcode == 'billmaker') {
			item.isShowUnit = false;
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data1 = props.search.getSearchValByField(PAGECODE.searchId, 'pk_org');
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, 'pk_org') != null
						? props.search.getSearchValByField(PAGECODE.searchId, 'pk_org').value.firstvalue
						: null;
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	let listTableMeta = meta[PAGECODE.tableId];
	//模板table的结算单编号列加超链接
	listTableMeta.items = listTableMeta.items.map((item, key) => {
		if (item.attrcode == FIELD.vbillcode) {
			item.render = (text, record, index) => {
				//取值前需先判断record是否为空，避免没有数据的情况报错
				let pk_settlebill = record && record.pk_settlebill && record.pk_settlebill.value;
				return (
					<a
						className="opr-col"
						style={{ cursor: 'pointer' }}
						onClick={() => {
							this.props.pushTo(URL.gotoCard, {
								status: 'browse',
								id: pk_settlebill,
								pagecode: PAGECODE.cardcode
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

	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4004SETTLEBILL-000010') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '150px',
		visible: true,
		render: (text, record, index) => {
			if (record) {
				let buttonAry;
				if (record.btoia) {
					let btoia = record.btoia.value;
					if (btoia) {
						buttonAry = [ 'Delete', 'CancelSendToIA' ];
					} else {
						buttonAry = [ 'Delete', 'SendToIA' ];
					}
				}
				return props.button.createErrorButton({
					record: record,
					showBack: false, // 是否显示回退按钮
					sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry, {
							area: 'list_inner',
							buttonLimit: 3,
							onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
						});
					}
				});
			}
		}
	};
	meta[PAGECODE.tableId].items.push(event);
	return meta;
}

function tableButtonClick(props, key, text, record, index) {
	let settleBillInfo = [ { id: record.pk_settlebill.value, ts: record.ts.value } ];
	let data = { pagecode: PAGECODE.pagecode, settleBillInfo };
	if (key === 'Delete') {
		ajax({
			url: '/nccloud/pu/settlebill/del.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.props.table.deleteTableRowsByIndex(this.tableID, index);
					this.onSelect();
				}
			}
		});
	} else if (key === 'CancelSendToIA') {
		ajax({
			url: '/nccloud/pu/settlebill/cancelToIA.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					// let sarchval = this.state.searchVal;
					// setTimeout(() => {
					// 	searchBtnClick.call(this, sarchval);
					// }, 0);

					updateCacheDataForList(this.props, PAGECODE.tableId, 'pk_settlebill', res.data, index);
					showSuccessInfo(getLangByResId(this, '4004SETTLEBILL-000000')); /* 国际化处理： 取消传成本成功！*/
				}
			}
		});
	} else if (key === 'SendToIA') {
		ajax({
			url: '/nccloud/pu/settlebill/sendToIA.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					// let sarchval = this.state.searchVal;
					// setTimeout(() => {
					// 	searchBtnClick.call(this, sarchval);
					// }, 0);
					updateCacheDataForList(this.props, PAGECODE.tableId, 'pk_settlebill', res.data, index);
					// toast({
					// 	color: 'success',
					// 	content: getLangByResId(this, '4004SETTLEBILL-000005')
					// }); /* 国际化处理： 传成本成功！*/
					showSuccessInfo(getLangByResId(this, '4004SETTLEBILL-000005')); /* 国际化处理： 传成本成功！*/
				}
			}
		});
	} else if (key === 'LinkQuery') {
		let id = record.pk_settlebill.value;
		this.setState({ pk: id, showTrack: true });
	}
}
