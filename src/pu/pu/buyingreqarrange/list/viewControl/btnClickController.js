/*
 * @Author: zhangchangqing 
 * @PageInfo: 按钮事件
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-07-26 15:27:58
 */
import { BUYINGREQ_LIST_BUTTON, BUYINGREQ_LIST } from '../../siconst';
import editBtnClick from '../btnClicks/editBtnClick';
import cancelBtnClick from '../btnClicks/cancelBtnClick';
import cancelBatchBtnClick from '../btnClicks/cancelBatchBtnClick';
import saveBtnClick from '../btnClicks/SaveBtnClick';
import refreshBtnClick from '../btnClicks/refreshBtnClick';

import { YYC_BUTTON_ARRAY } from '../../../yyc/constance';
import { reqYYCBtnClick } from '../../../yyc/ext/yycBtnClick';

export default function clickBtn(props, id, text, record, index) {
	switch (id) {
		//安排，修改
		case BUYINGREQ_LIST_BUTTON.BatchArrange:
			//this.props.modal.show('BatchArrange');
			this.setState({
				showModal: true
			});
			//let batch = batchBtnClick.bind(this);
			return;
		//安排，修改
		case BUYINGREQ_LIST_BUTTON.Edit:
			let edit = editBtnClick.bind(this);
			return edit(props);
		//取消
		case BUYINGREQ_LIST_BUTTON.Cancel:
			let cancel = cancelBtnClick.bind(this);
			return cancel(props);
		//取消安排
		case BUYINGREQ_LIST_BUTTON.CancelArrange:
			let cancelBatch = cancelBatchBtnClick.bind(this);
			return cancelBatch(props);
		//保存
		case BUYINGREQ_LIST_BUTTON.Save:
			let save = saveBtnClick.bind(this);
			return save(props);
		//刷新
		case BUYINGREQ_LIST_BUTTON.Refresh:
			let refresh = refreshBtnClick.bind(this, true);
			return refresh(props);
	}
	// 友云采扩展 add by guozhq
	if (YYC_BUTTON_ARRAY.includes(id)) {
		reqYYCBtnClick.call(this, props, id, {
			isSingleTable: true,
			listArea: 'list_head',
			billidField: 'pk_praybill',
			billbidField: 'pk_praybill_b',
			pageCode: BUYINGREQ_LIST.listpageid
		});
	}
}
