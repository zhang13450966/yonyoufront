/*
 * @Author: yechd5 
 * @PageInfo: 取消按钮弹框实现 
 * @Date: 2018-07-13 21:24:43 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 15:01:34
 */
import { ajax, cacheTools } from 'nc-lightapp-front';
import { COOPSETUP_CONST } from '../../const';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import buttonController from '../viewController/buttonController';

export default function cancelBtnClick(props) {
	showCancelDialog({ beSureBtnClick: cancelOK.bind(this, props) });
}
function cancelOK(props) {
	if (props.getUrlParam('status') === COOPSETUP_CONST.EDIT || props.getUrlParam('status') === COOPSETUP_CONST.ADD) {
		// 说明卡片态没有数据的时候，此时需要清空由于编辑表头的“源单据类型”产生的表头页签数据
		if (props.getUrlParam('id') === undefined) {
			let tabLen_1 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID1);
			let tabLen_2 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID2);
			let tabLen_3 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID3);
			delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID1, tabLen_1);
			delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID2, tabLen_2);
			delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID3, tabLen_3);
		}
		// 获取操作来源
		let srcoperator = props.getUrlParam('srcoperator');
		// 取消按钮页面控制：
		// （1）来源于列表态新增，则取消时返回列表; --也留在卡片，获取最后一条数据
		// （2）来源于卡片新增，则取消时，留在卡片
		// （3）来源卡片或列表态的复制或修改，均留在卡片
		let id;
		if (srcoperator == COOPSETUP_CONST.LIST_ADD) {
			// props.form.setFormStatus(COOPSETUP_CONST.FORMID, COOPSETUP_CONST.BROWSE );
			// props.pushTo(COOPSETUP_CONST.TOLISTURL, {
			// 	status: COOPSETUP_CONST.BROWSE,
			// 	id: props.getUrlParam('id')
			// });
			let ids = cacheTools.get(COOPSETUP_CONST.CACHEPKS_KEY);
			if (ids) {
				id = ids[ids.length - 1];
			}
		} else if (
			srcoperator == COOPSETUP_CONST.LIST_EDIT ||
			srcoperator == COOPSETUP_CONST.CARD_ADD ||
			srcoperator == COOPSETUP_CONST.CARD_COPY ||
			srcoperator == COOPSETUP_CONST.CARD_EDIT
		) {
			id = props.getUrlParam('id');
		}
		props.pushTo(COOPSETUP_CONST.TOCARDURL, {
			status: COOPSETUP_CONST.BROWSE,
			id: id
		});
		let req = {
			pk: id,
			pageId: COOPSETUP_CONST.PAGEID_CARD
		};
		if (undefined == req.pk) {
			buttonController.call(this, props, COOPSETUP_CONST.BROWSE);
			return;
		}
		ajax({
			url: COOPSETUP_CONST.QUERYCARDURL,
			data: req,
			success: (res) => {
				if (res.data.head) {
					props.form.setAllFormValue({ head: res.data.head.head });
				}
				if (res.data && res.data.salepurchasecoop) {
					props.editTable.setTableData(
						COOPSETUP_CONST.CARD_TABLEID1,
						res.data.salepurchasecoop.salepurchasecoop
					);
				} else {
					this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID1, { rows: [] });
				}
				if (res.data && res.data.boundcoop) {
					props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, res.data.boundcoop.boundcoop);
				} else {
					this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, { rows: [] });
				}
				if (res.data && res.data.invoicecoop) {
					props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, res.data.invoicecoop.invoicecoop);
				} else {
					this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, { rows: [] });
				}
			}
		});
		buttonController.call(this, props, COOPSETUP_CONST.BROWSE);
		// }
	}
}

/**
* 删除editTable的所有行
* @param {} moduleId 
* @param {*} bodyRowsLen 
*/
function delBodyRows(props, moduleId, bodyRowsLen) {
	if (bodyRowsLen > 0) {
		let rows = [];
		for (let i = 0; i < bodyRowsLen; i++) {
			rows.push(i);
		}
		props.editTable.deleteTableRowsByIndex(moduleId, rows);
	}
}
