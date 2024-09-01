/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片通用查询信息
 * @Date: 2018-04-19 10:09:24
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-19 17:33:46
 */
import { ajax } from 'nc-lightapp-front';
import { backButton } from './index';
import { URL, PAGECODE, TRANSFER2C, OHTER, AREA, CONSTFIELD, UISTATE, FIELD } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';

export default function(props, pk) {
	let status = this.props.getUrlParam(OHTER.status);
	let sourcetype = this.props.getUrlParam(OHTER.id);
	if (sourcetype && sourcetype == OHTER.source21P) {
		// 拉单
		getTransferValue.call(this, this.props);
	}
}

function getTransferValue(props) {
	let org = props.getUrlParam('org');
	let ref21pdata = getDefData(CONSTFIELD.PlanconfirmTransferCache, '21Pto2C');

	let userObject = { pk_org: org };
	let url = URL.orderpayplanToplanconfirm;
	let templetid = getDefData(CONSTFIELD.PlanconfirmTransferCache, 'templetid');

	let data = {
		pagecode: PAGECODE.card,
		templetid: templetid,
		queryAreaCode: TRANSFER2C.SEARCHID,
		oid: org,
		userObject: userObject,
		queryType: PAGECODE.tree,
		key: TRANSFER2C.PK_ORDER_PAYPLAN_B,
		data: ref21pdata
	};
	this.refsourcdata = data;

	ajax({
		method: 'POST',
		url: url,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}

			props.beforeUpdatePage();
			if (res && res.data) {
				//跳转卡片弹出提示框
				showSagaErrorToasts(this.props, AREA.head, FIELD.hid);
				props.transferTable.setTransferListValue(AREA.leftarea, res.data);
				// 设置单据来源类型以及缓存数据
				let listdata = new Array();
				let channelType = this.props.getUrlParam('channelType');
				for (let i = 0; i < res.data.length; i++) {
					if (!channelType) {
						props.form.setAllFormValue({ [AREA.head]: res.data[i].head[AREA.head] });
						props.cardTable.setTableData(AREA.body, res.data[i].body[AREA.body]);
						props.form.setFormStatus(AREA.head, UISTATE.edit);
						props.cardTable.setStatus(AREA.body, UISTATE.edit);
						buttonController.call(this, props);
					}

					let element = {};
					element.head = res.data[i].head;
					element.body = res.data[i].body;
					element.pageid = res.data[i].pageid;
					listdata.push(element);
				}
				this.listdata = listdata;
			}
		},
		error: (error) => {
			backButton.call(this, error);
			showErrorInfo(getLangByResId(this, '4004planconfirm-000014'), error.message); /* 国际化处理： 注意*/
		}
	});
}
