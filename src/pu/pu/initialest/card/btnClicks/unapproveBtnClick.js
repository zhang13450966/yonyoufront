/*
 * @Author: zhaochyu 
 * @PageInfo: 取消审批 
 * @Date: 2018-07-05 22:24:15 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 16:15:21
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, AREA, DATASOURCE, BODY_FIELD } from '../../constance';
import { addCacheData, getCacheDataByPk, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { buttonController } from '../viewControl';
export default function(props) {
	let id = ''; // 表头主键
	let ts = ''; // 时间戳
	let type = props.getUrlParam(FIELD.cardStatus);
	let rows = { rows: [], pagecode: PAGECODE.cardpagecode, card: 'card' }; // 上送数据集合
	id = props.form.getFormItemsValue(AREA.cardFormArea, FIELD.pk_initialest).value;
	ts = props.form.getFormItemsValue(AREA.cardFormArea, FIELD.ts).value;
	let allrows = props.cardTable.getAllRows(AREA.cardTableArea);
	let bodys = [];
	allrows.forEach((row) => {
		bodys.push({
			id: row.values[BODY_FIELD.pk_initialest_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	rows.rows.push({
		id,
		ts,
		bodys: bodys
	});
	// 调用后台，执行审批操作
	ajax({
		url: URL.unapprove,
		data: rows,
		success: (res) => {
			if (res && res.success) {
				// 取消审批成功
				showSuccessInfo(getLangByResId(this, '4004INITIALEST-000014')); /* 国际化处理：取消审批成功*/
				if (type === FIELD.transfer) {
					if (res.data.data.head && res.data.data.body) {
						let config = {
							headAreaId: PAGECODE.cardhead,
							bodyAreaId: PAGECODE.cardbody,
							bodyPKfield: BODY_FIELD.pk_initialest_b
						};
						updateDtaForCompareByPk(this.props, res.data.data, config);
					}
					//控制按钮的显示隐藏
					buttonController.setCardAproveButtonVisiable.call(this, true, false);
					// this.props.transferTable.setTransformFormStatus(AREA.leftarea, {
					// 	status: true,
					// 	onChange: (current, next, currentIndex) => {
					// 		this.props.transferTable.setTransferListValueByIndex(
					// 			AREA.leftarea,
					// 			res.data.data,
					// 			currentIndex
					// 		);
					// 	}
					// });
				} else {
					if (res.data.data.head && res.data.data.body) {
						let config = {
							headAreaId: PAGECODE.cardhead,
							bodyAreaId: PAGECODE.cardbody,
							bodyPKfield: BODY_FIELD.pk_initialest_b
						};
						updateDtaForCompareByPk(this.props, res.data.data, config);
						let pk = res.data.data.head[PAGECODE.cardhead].rows[0].values.pk_initialest.value;
						//判断缓冲中是否有该pk对应的数据
						let cachedata = getCacheDataByPk(this.props, DATASOURCE.dataSource, pk);
						if (cachedata == null) {
							//将新收据放入缓冲中
							addCacheData(
								props,
								FIELD.pk_initialest,
								pk,
								res.data.data,
								FIELD.formArea,
								DATASOURCE.dataSource
							);
						} else {
							updateCacheData(
								this.props,
								FIELD.pk_initialest,
								pk,
								res.data.data,
								FIELD.formArea,
								DATASOURCE.dataSource
							);
						}
					}
					//控制按钮的显示隐藏
					buttonController.setCardAproveButtonVisiable.call(this, false, false);
				}
			}
		}
	});
}
