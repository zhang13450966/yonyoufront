/*
 * @Author: 王勇 
 * @PageInfo: 列表-运输路线删除  
 * @Date: 2020-01-17 09:46:39 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-03-26 11:52:39
 */
import { ajax } from 'nc-lightapp-front';
import commonSearch from './commonSearch';
import { ROUTEVOINFO,TEMPLATEINFO,REFERFIELD,REQUESTURL,VIEWINFO } from '../../const/index';
import { showSuccessInfo, showDeleteDialog,showWarningInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../../list/viewController/buttonController'

export default function deleteBtnClick(props) {
	
		let pks = [];
		let selIndex = [];
		const seldatas = props.table.getCheckedRows(TEMPLATEINFO.listAreaCode);
		if (seldatas == null || seldatas.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4001ROUTE-000007')); /* 国际化处理： 请选择要操作的单据！*/
			return;
		}
		seldatas.forEach((row) => {
			let pk_org = row.data.values['pk_org'].value;
            let pk_group = row.data.values[ROUTEVOINFO.pk_group].value;
            if(pk_org !== pk_group){
                let id = row.data.values[REFERFIELD.crouteid].value;
                pks.push(id);
                selIndex.push(row.index);
            }
		});
		showDeleteDialog({
			beSureBtnClick: beSureBtnClick.bind(this, props, pks,selIndex)
		});
	
}
function beSureBtnClick( props,indexArr,selIndex){
	let data = {
		pk_routes: indexArr,
		node: 'org',	
	};
	ajax({
		url: REQUESTURL.delRouteUrl,
		data: data,
		success: (res) => {
			let { success} = res.data;
			if (success) {		
				props.table.deleteTableRowsByIndex(TEMPLATEINFO.listAreaCode, selIndex, true);
				buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
				showSuccessInfo(getLangByResId(this, '4001ROUTE-000008')); /* 国际化处理： 删除成功*/
				commonSearch.call(this,props);
			}
		}
	});
}
