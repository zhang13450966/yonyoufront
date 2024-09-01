/*
 * @Author: zhangchangqing 
 * @PageInfo: 按钮事件
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:03:01
 */
import { TARGETADJ_LIST_BUTTON, TARGETADJ_LIST, TARGETADJ_CARD } from '../../siconst';
import addBtnClick from '../btnClicks/addBtnClick';
import delBatchBtnClick from '../btnClicks/delBatchBtnClick';
import { ajax } from 'nc-lightapp-front';
import comBtnClick from '../btnClicks/commitBtnClick';
import uncomBtnClick from '../btnClicks/uncommitBtnClick';
import commitBatchBtnClick from '../btnClicks/commitBatchBtnClick';
import unCommitBatchBtnClick from '../btnClicks/unCommitBatchBtnClick';
import delBtnClick from '../btnClicks/delBtnClick';
import fileBtnClick from '../btnClicks/fileBtnClick'; //附件管理
import commonSerach from '../btnClicks/commonSearch'; //刷新
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';

export default function clickBtn(props, id, text, record, index) {
	switch (id) {
		//刷新
		case TARGETADJ_LIST_BUTTON.Refresh:
			let refresh = true;
			let commonSer = commonSerach.bind(
				this,
				getDefData(TARGETADJ_LIST.dataSource, 'currentTab'),
				getDefData(TARGETADJ_LIST.dataSource, 'searchVal'),
				refresh
			);
			return commonSer(props);
		//新增
		case TARGETADJ_LIST_BUTTON.add:
			return addBtnClick(props);
		// 删除 record有值走行删除逻辑，没有值走批量处理逻辑
		case TARGETADJ_LIST_BUTTON.delete:
			if (record) {
				let del = delBtnClick.bind(this, props, record);
				return del(props);
			} else {
				let delB = delBatchBtnClick.bind(this, props);
				return delB(props);
			}
		//提交  record有值走行提交逻辑，没有值走批量处理逻辑
		case TARGETADJ_LIST_BUTTON.commit:
			if (record) {
				let comR = comBtnClick.bind(this, props, record);
				return comR(props);
			} else {
				let com = commitBatchBtnClick.bind(this);
				return com(props);
			}
		//收回
		case TARGETADJ_LIST_BUTTON.uncommit:
			if (record) {
				let uncomR = uncomBtnClick.bind(this, props, record);
				return uncomR(props);
			} else {
				let uncom = unCommitBatchBtnClick.bind(this, props);
				return uncom(props);
			}
		//修改
		case TARGETADJ_LIST_BUTTON.EditRow:
			let data = { keyword: record.pk_targetadj.value, pageid: TARGETADJ_LIST.cardpageid };
			ajax({
				url: TARGETADJ_CARD.editCardInfoURL,
				data: data,
				success: (res) => {
					props.pushTo(TARGETADJ_LIST.cardUrl, {
						status: TARGETADJ_LIST.edit,
						id: record.pk_targetadj.value,
						pagecode: TARGETADJ_LIST.cardpageid
					});
				}
			});
			return;
		//附件管理
		case TARGETADJ_LIST_BUTTON.File:
			let file = fileBtnClick.bind(this);
			return file(props);
		//审批详情
		case TARGETADJ_LIST_BUTTON.ApproveInfo:
			this.setState({
				show: true,
				billId: record.pk_targetadj.value
			});
			break;
	}
}
