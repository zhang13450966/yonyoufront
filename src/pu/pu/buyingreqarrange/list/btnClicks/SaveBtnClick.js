/*
 * @Author: zhangchangqing 
 * @PageInfo: 保存按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-12 14:33:50
 */
import { BUYINGREQ_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import refreshBtnClick from './refreshBtnClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

let formId = BUYINGREQ_LIST.formId; //'head';

export default function clickDelBtn(props) {
	// 获取选中行
	let checkData = props.editTable.getCheckedRows(formId);
	//慧晶确认 这里改成提示
	if (checkData.length <= 0 || checkData == undefined) {
		showWarningInfo(null, getLangByResId(this, '4004PRAYBILLARRANGE-000028')); /* 国际化处理： 请选择要确认安排的行!*/
		return;
	}
	// // let checkData = props.editTable.getChangedRows(formId);
	// if (checkData.length <= 0 || checkData == undefined) {
	// 	//refreshBtnClick.bind(this)();
	// 	this.setState({
	// 		showSearch: true
	// 	});
	// 	refreshBtnClick.bind(this)();
	// 	//点击取消重新查询数据
	// 	this.toggleShow(BUYINGREQ_LIST.browse);
	// 	return;
	// }
	let rows = [];
	checkData.map((item) => {
		rows.push(item.data);
	});
	let formData = {
		areacode: BUYINGREQ_LIST.formId,
		areaType: 'table',
		rows: rows
	};
	let data = {
		pageid: BUYINGREQ_LIST.listpageid,
		model: formData
	};
	// 发送请求
	ajax({
		url: BUYINGREQ_LIST.saveBatchURL,
		data: data,
		success: (res) => {
			if (res.success) {
				this.setState({
					showSearch: true
				});
				refreshBtnClick.bind(this, false)();
				//点击取消重新查询数据
				this.toggleShow(BUYINGREQ_LIST.browse);
				showSuccessInfo(getLangByResId(this, '4004PRAYBILLARRANGE-000009')); /* 国际化处理： 安排成功！*/
			} else {
			}
		}
	});
}
