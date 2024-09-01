/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义编辑前
 * @Date: 2020-02-12 16:51:00
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-07-07 15:28:53
 */
import { AREA } from '../../constance';
export default function beforeEvent(props, moduleId, item, index, value, record) {
	let flag = true;
	let bcarrierflag = record.values.bcarrierflag.value;
	let meta = props.meta.getMeta();
	let tableId = AREA.listTable;
	if (item.attrcode == 'ccarrierid') {
		flag = bcarrierflag;
		meta[tableId].items.map((item) => {
			if (item.attrcode == 'ccarrierid') {
				item.queryCondition = () => {
					return {
						pk_org: this.state.pk_org
					};
				};
			}
		});
		props.meta.setMeta(meta);
	} else if (item.attrcode == 'vdrivername') {
		flag = bcarrierflag;
	} else if (item.attrcode == 'cpsndocid' || item.attrcode == 'cdeptid_v') {
		if (bcarrierflag == true) {
			flag = false;
		} else {
			flag = true;
		}
	} else if (item.attrcode == 'cvehicleid') {
		let cvehicletypeid = (props.editTable.getValByKeyAndIndex(moduleId, index, 'cvehicletypeid') || {}).value;
		let ccarrierid = (props.editTable.getValByKeyAndIndex(moduleId, index, 'ccarrierid') || {}).value;
		meta[tableId].items.map((item) => {
			if (item.attrcode == 'cvehicleid') {
				item.queryCondition = () => {
					return {
						pk_org: this.state.pk_org,
						cvehicletypeid: cvehicletypeid,
						ccarrierid: ccarrierid,
						GridRefActionExt: 'nccloud.web.scmpub.driver.ref.DriverVehicleReferAction'
					};
				};
			}
		});
		props.meta.setMeta(meta);
	} else if (item.attrcode == 'bsealflag') {
		flag = false;
	}
	return flag;
}
