/*
 * @Author: zhaochyu 
 * @PageInfo: 卡片态审批
 * @Date: 2018-06-30 11:27:46 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 16:15:12
 */
import { URL, PAGECODE, FIELD, AREA, BODY_FIELD, DATASOURCE } from '../../constance';
import { addCacheData, getCacheDataByPk, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { ajax, toast } from 'nc-lightapp-front';
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
		url: URL.approve,
		data: rows,
		success: (res) => {
			if (res && res.success) {
				// 审批成功
				showSuccessInfo(getLangByResId(this, '4004INITIALEST-000002')); /* 国际化处理：审批成功*/
				if (type === FIELD.transfer) {
					if (res.data.data.head && res.data.data.body) {
						let config = {
							headAreaId: PAGECODE.cardhead,
							bodyAreaId: PAGECODE.cardbody,
							bodyPKfield: BODY_FIELD.pk_initialest_b
						};
						updateDtaForCompareByPk(this.props, res.data.data, config);
					}
					// 转单保存
					//rewriteTransferSrcBids(props, BODY_FIELD.csourcebid, res.data.data.body[FIELD.cardTable].rows); //来源单据明细
					buttonController.setCardAproveButtonVisiable.call(this, true, true);
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
					// this.props.button.setButtonVisible(["Approve"], false);
				} else {
					buttonController.setCardAproveButtonVisiable.call(this, false, true);
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
				}
			}
		}
	});
}
