/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，卡片页面查询
 * @Date: 2021-11-20 13:49:29 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-19 18:52:52
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA, CONSTFIELD, FIELD, OHTER, PAGECODE } from '../../constance';
import { getCacheDataByPk, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';

export default function queryCardBtnClick(props, pk, isrefresh) {
	props.setUrlParam({ pk }); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
	let scene = props.getUrlParam(OHTER.scene);
	let data = { pagecode: PAGECODE.card, pk: pk, scene };
	if (pk == undefined || !pk) {
		let billcode = '';
		this.props.form.EmptyAllFormValue(AREA.head);
		this.props.cardTable.setTableData(AREA.body, { rows: [] }, null, true, true);
		this.billcode = billcode;
		buttonController.call(this, props);
		return;
	}
	// 如果有缓存，先走缓存
	let cacheData = getCacheDataByPk(props, CONSTFIELD.dataSource, pk);
	if (cacheData && !isrefresh) {
		this.props.form.setAllFormValue({ [AREA.head]: cacheData.head[AREA.head] });
		this.props.cardTable.setTableData(AREA.body, cacheData.body[AREA.body], null, true, true);
		props.setUrlParam({
			id: pk
		});
		//跳转卡片弹出提示框
		showSagaErrorToasts(props, AREA.head, FIELD.hid);
		buttonController.call(this, props);
		return;
	}
	ajax({
		url: URL.cardquery,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			// 渲染数据
			props.beforeUpdatePage(AREA.head, AREA.body);
			this.props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
			this.props.cardTable.setTableData(AREA.body, res.data.body[AREA.body], null, true, true);
			props.updatePage(AREA.head, AREA.body);
			// 更新缓存
			updateCacheData(
				props,
				FIELD.hid,
				res.data.head[AREA.head].rows[0].values[FIELD.hid].value,
				res.data,
				AREA.head,
				CONSTFIELD.dataSource
			);
			// 刷新提示
			if (isrefresh) {
				showSuccessInfo(getLangByResId(this, '4004planconfirm-000008')); /* 国际化处理： 刷新成功！*/
			}
			// 按钮渲染
			//跳转卡片弹出提示框
			showSagaErrorToasts(props, AREA.head, FIELD.hid);
			buttonController.call(this, props);
		}
	});
}
