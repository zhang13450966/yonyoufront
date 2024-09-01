/*
 * @Author: gaoxiaoqiang 
 * @PageInfo: 列表页新增后，卡片页面保存按钮事件 
 * @Date: 2019-04-18 10:25:15 
 * @Last Modified by: qishy
 * @Last Modified time: 2020-06-24 10:25:34
 */
import editBtnClick from './edit_BtnClick';
import addRowBtnClick from './addRow_BtnClick';
import saveBtnClick from './save_BtnClick';
import cancleBtnClick from './cancel_BtnClick';
import { BUTTONS } from '../../const';
import exportBtnClick from './export_BtnClick';
import imxportBtnClick from './import_BtnClick';
import file_btnClick from './file_btnClick';
export default function clickBtn(props, id) {
	switch (id) {
		// 修改
		case BUTTONS.EDIT:
			let add = editBtnClick.bind(this);
			return add(props);
		//附件
		case BUTTONS.File:
			let file = file_btnClick.bind(this);
			return file(props);
		// 取消
		case BUTTONS.CANCEL:
			let cancel = cancleBtnClick.bind(this);
			return cancel(props);
		// 增行
		case BUTTONS.ADDLINE:
			let addrow = addRowBtnClick.bind(this);
			return addrow(props);
		// 保存
		case BUTTONS.SAVE:
			let save = saveBtnClick.bind(this);
			return save(props, id);
		//导出
		case BUTTONS.EXPORTEXCEL:
			let exp = exportBtnClick.bind(this);
			return exp(props, id);
		//导入
		case BUTTONS.IMPORTEXCEL:
			let imp = imxportBtnClick.bind(this);
			return imp(props, id);
	}
}
