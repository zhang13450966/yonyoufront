/*
 * @Author: zhangchangqing 
 * @PageInfo: 按钮事件
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:01:32
 */
import { BUYINGREQ_LIST_BUTTON, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import reviseHistory_BtnClick from '../btnClicks/reviseHistory_BtnClick';

import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import linkBtnClick from '../btnClicks/linkBtnClick'; //单据追溯
import fileBtnClick from '../btnClicks/fileBtnClick'; //附件管理
import print_BtnClick from '../btnClicks/print_BtnClick'; //打印n
import output_BtnClick from '../btnClicks/output_BtnClick'; //打印n
import commonSerach from '../btnClicks/commonSearch'; //刷新
import commitBtnClick from '../btnClicks/commitBtnClick'; //行提交
import commitBatchBtnClick from '../btnClicks/commitBatchBtnClick'; //肩头提交
import unCommitBatchBtnClick from '../btnClicks/unCommitBatchBtnClick'; //收回
import reviseDeleteBtnClick from '../btnClicks/reviseDeleteBtnClick'; //修订删除
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
export default function clickBtn(props, id, text, record, index) {
	switch (id) {
		//刷新
		case BUYINGREQ_LIST_BUTTON.Refresh:
			if (getDefData(BUYINGREQ_LIST.dataSource, 'searchVal')) {
				let commonSer = commonSerach.bind(
					this,
					this.state.currentTab,
					getDefData(BUYINGREQ_LIST.dataSource, 'searchVal'),
					true
				);
				return commonSer(props);
			}
			return;
		//修订
		case BUYINGREQ_LIST_BUTTON.Revise:
			props.pushTo(BUYINGREQ_LIST.cardUrl, {
				status: BUYINGREQ_LIST.edit,
				id: record.pk_praybill.value,
				pagecode: BUYINGREQ_LIST.cardpageid
			});
			return;
		//查看修订详情
		case BUYINGREQ_LIST_BUTTON.ReviseHistory:
			return reviseHistory_BtnClick.bind(this)(props, record, index);
		//打印
		case BUYINGREQ_LIST_BUTTON.Print:
			let print = print_BtnClick.bind(this, props);
			return print(props);
		//输出
		case BUYINGREQ_LIST_BUTTON.output:
			let output = output_BtnClick.bind(this, props);
			return output(props);
		//单据追溯
		case BUYINGREQ_LIST_BUTTON.QueryAboutBusiness:
			let linkQuery = linkBtnClick.bind(this);
			return linkQuery(props);
		//附件管理
		case BUYINGREQ_LIST_BUTTON.File:
			let file = fileBtnClick.bind(this);
			return file(props);
		//提交
		case BUYINGREQ_LIST_BUTTON.commit:
			if (record) {
				let comR = commitBtnClick.bind(this, props, record);
				return comR(props);
			} else {
				let com = commitBatchBtnClick.bind(this);
				return com(props);
			}
		//收回
		case BUYINGREQ_LIST_BUTTON.uncommit:
			return unCommitBatchBtnClick.call(this, props);
		//审批详情
		case BUYINGREQ_LIST_BUTTON.ApproveInfo:
			this.setState({
				show: true,
				billId: record.pk_praybill.value,
				billtype: record.vtrantypecode.value
			});
			break;
		//修订删除
		case BUYINGREQ_LIST_BUTTON.ReviseDelete:
			return reviseDeleteBtnClick.call(this, props, record, index);
		case BUYINGREQ_LIST_BUTTON.PrintCountQuery: //打印次数查询
			let CONST = { hid: ATTRCODE.pk_praybill, area: BUYINGREQ_LIST.formId };
			printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
			break;
	}
}
