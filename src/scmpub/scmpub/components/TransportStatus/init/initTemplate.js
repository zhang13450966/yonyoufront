/*
 * @Author: wangceb 
 * @PageInfo: 单据模板js 
 * @Date: 2018-04-12 10:55:42 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-27 20:31:29
 */
import { ajax } from 'nc-lightapp-front';
import { TRANSPORTSTATUS_CONST } from '../const';
import { btn_Controller } from '../btnClicks';

export default function(props) {
	props.createUIDom(
		{
			appcode: TRANSPORTSTATUS_CONST.APPCODE,
			pagecode: TRANSPORTSTATUS_CONST.PAGECODE //卡片页面编码
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta, initData.bind(this));
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}

//请求列表数据
function initData() {
	setTimeout(() => {
		let showdata = null;
		if (this.props.transportData == undefined || this.props.transportData == null) {
			showdata = { rows: [] };
		} else {
			showdata = this.props.transportData[TRANSPORTSTATUS_CONST.TABLEID];
		}
		this.props.table.setAllTableData(TRANSPORTSTATUS_CONST.TABLEID, showdata);
		btn_Controller.call(this, this.props);
	}, 0);
}
