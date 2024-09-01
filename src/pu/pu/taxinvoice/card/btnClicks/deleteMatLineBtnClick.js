/*
 * @Author: chaiwx 
 * @PageInfo: 表体删行  
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-21 16:40:35
 */
import { AREA, BUTTONID, FIELDS } from '../../constance';

export default function(props, record, index) {
	if (index >= 0 && record) {
		// 操作列删行
		let rowcount = props.cardTable.getNumberOfRows(AREA.cardTableId); //获得所有行数
		let crowno = null;
		crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, index, FIELDS.crowno);
		//判断本行是否是费用行删除物料
		if (crowno && crowno.value) {
			//是费用行
			if (index < rowcount - 1) {
				crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, index + 1, FIELDS.crowno);
				if (crowno && crowno.value) {
				} else {
					setFeeFieldsValue.call(this, props, index);
				}
			}
		}

		props.cardTable.delRowsByIndex(AREA.cardTableId, index);
		if (this.props.cardTable.getNumberOfRows(AREA.cardTableId) > 0) {
			let checkArr = this.props.cardTable.getCheckedRows(AREA.cardTableId);
			if (!checkArr || checkArr.length < 1) {
				this.props.button.setDisabled({
					[BUTTONID.DeleteFeeLine]: true,
					[BUTTONID.DeleteMatLine]: true
				});
			} else {
				this.props.button.setDisabled({
					[BUTTONID.DeleteMatLine]: false,
					[BUTTONID.DeleteFeeLine]: false
				});
			}
		}
	} else {
		let checkArr = props.cardTable.getCheckedRows(AREA.cardTableId);
		let rowIndexes = [];
		let rowcount = props.cardTable.getNumberOfRows(AREA.cardTableId); //获得所有行数
		let crowno = null;
		if (checkArr && checkArr.length > 0) {
			checkArr.forEach((row) => {
				crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, row.index, FIELDS.crowno);
				//判断本行是否是费用行删除物料
				if (crowno && crowno.value) {
					//是费用行
					if (row.index < rowcount - 1) {
						crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, row.index + 1, FIELDS.crowno);
						if (crowno && crowno.value) {
						} else {
							setFeeFieldsValue.call(this, props, row.index);
						}
					}
				}
				rowIndexes.push(row.index);
			});
			props.cardTable.delRowsByIndex(AREA.cardTableId, rowIndexes);

			// 按钮可用性
			props.button.setDisabled({
				[BUTTONID.DeleteFeeLine]: true,
				[BUTTONID.DeleteMatLine]: true
			});
		}
	}
}

//补充费用行数据
function setFeeFieldsValue(props, rowIndex) {
	let promtApplyFeeFields = [
		FIELDS.pk_group,
		FIELDS.pk_org,
		FIELDS.crowno,
		FIELDS.cassumeorgid,
		FIELDS.cassumeorgvid,
		FIELDS.cassumedeptid,
		FIELDS.cassumedeptvid,
		FIELDS.ccostsubjid,
		FIELDS.cprodlineid,
		FIELDS.cbrandid,
		FIELDS.cprofitcenterid,
		FIELDS.cprofitcentervid,
		FIELDS.ccostcenterid,
		FIELDS.cfactorid,
		FIELDS.cfeeprojectid,
		FIELDS.cfeecustomerid,
		FIELDS.norigmny,
		FIELDS.nmny,
		FIELDS.nglobalmny,
		FIELDS.ngroupmny,
		FIELDS.ntotalexemny,
		FIELDS.bfeecloseflag,
		FIELDS.ccloserid,
		FIELDS.dclosedate,
		FIELDS.VBNOTE
	];
	promtApplyFeeFields.forEach((field) => {
		let fieldValue = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, rowIndex, field);
		if (fieldValue && fieldValue.value) {
			props.cardTable.setValByKeyAndIndex(AREA.cardTableId, rowIndex + 1, field, fieldValue);
		}
	});
}
