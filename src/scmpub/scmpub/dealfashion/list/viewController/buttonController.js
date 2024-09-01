/*
 * @Author: lichao 
 * @PageInfo:  按钮控制 
 * @Date: 2019-03-12 15:58:43 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-11-24 15:22:04
 */
import { STATUS, BUTTONS, BROWSEBUTTONS, EDITBUTTONS, AREACODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props, status) {
	// 1.设置按钮的显示隐藏
	setButtonVisiable.call(this, props, status);
	//设置按钮可用性
	setButtonDisabled.call(this, props, status);
	// 2.设置主按钮
	//setMainButton.call(this, props, status);
}
/**
 * 设置按钮的显示隐藏
 * @param {*} props 
 * @param {*} status 
 */
function setButtonVisiable(props, status) {
	if (status == STATUS.browse) {
		//浏览态
		props.button.setButtonVisible(EDITBUTTONS, false);
		props.button.setButtonVisible(BROWSEBUTTONS, true);
		props.button.setPopContent(BUTTONS.Delete, getLangByResId(this, '4001DEALFASHION-000006')); /* 国际化处理： 确定要删除吗？*/
	} else {
		//编辑态
		props.button.setButtonVisible(BROWSEBUTTONS, false);
		props.button.setButtonVisible(EDITBUTTONS, true);
		props.button.setPopContent(BUTTONS.Delete);
	}
}

function setButtonDisabled(props, status) {
	const { getAllRows, getCheckedRows } = props.editTable;
	const allRows = getAllRows(AREACODE);
	const selectRows = getCheckedRows(AREACODE);
	if (!allRows || allRows.length == 0) {
		// NCC-83286，没有数据时，打印和输入按钮置为不可用
		props.button.setButtonDisabled([ BUTTONS.Edit, BUTTONS.Delete, BUTTONS.Print, BUTTONS.Output ], true);
	} else {
		props.button.setButtonDisabled([ BUTTONS.Edit, BUTTONS.Delete, BUTTONS.Print, BUTTONS.Output ], false);
	}
	if (!selectRows || selectRows.length == 0) {
		props.button.setButtonDisabled([ BUTTONS.Delete ], true);
	} else {
		props.button.setButtonDisabled([ BUTTONS.Delete ], false);
	}
}
