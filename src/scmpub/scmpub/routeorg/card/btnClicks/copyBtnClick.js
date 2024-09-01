/*
 * @Author: 王勇 
 * @PageInfo: 卡片-复制运输路线  
 * @Date: 2020-01-17 09:35:24 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-05 11:12:48
 */
import { VIEWINFO, CARDTEMPLATEINFO, ROUTEVOINFO } from '../../const/index';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewController/buttonController';

export default function copyBtnClick(props) {
	let routeInfo = props.createMasterChildData(
		CARDTEMPLATEINFO.templateCode,
		CARDTEMPLATEINFO.headAreaCode,
		CARDTEMPLATEINFO.bodyAreaCode
	);
	routeInfo.head['head'].rows[0].values.crouteid = null;
	routeInfo.body['address'].rows.forEach((element) => {
		element.values.crouteaddrid = {};
		element.values.crouteid = {};
	});
	let tempData = routeInfo;

	props.beforeUpdatePage(CARDTEMPLATEINFO.headAreaCode, CARDTEMPLATEINFO.bodyAreaCode);
	props.form.setAllFormValue({ head: tempData.head[CARDTEMPLATEINFO.headAreaCode] });
	props.cardTable.setTableData(CARDTEMPLATEINFO.bodyAreaCode, tempData.body[CARDTEMPLATEINFO.bodyAreaCode], false);

	// props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode,{'croutid':{value:'',}});

	props.form.setFormStatus(CARDTEMPLATEINFO.headAreaCode, VIEWINFO.EDIT_STATUS);
	props.cardTable.setStatus(CARDTEMPLATEINFO.bodyAreaCode, VIEWINFO.EDIT_STATUS);
	buttonController.call(this, props, VIEWINFO.EDIT_STATUS);

	//清空路线编码、路线名称
	props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
		[ROUTEVOINFO.vroutecode]: {
			value: '',
			display: null
		},
		[ROUTEVOINFO.vroutename]: {
			value: '',
			display: null
		}
	});
	props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
		[ROUTEVOINFO.bsealflag]: { value: false, display: null }
	});
	props.updatePage(CARDTEMPLATEINFO.headAreaCode, CARDTEMPLATEINFO.bodyAreaCode);
	showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000016') /*复制成功！*/);
}
