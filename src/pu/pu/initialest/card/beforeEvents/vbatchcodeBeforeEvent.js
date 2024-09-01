/*
 * @Author: zhaochyu 
 * @PageInfo:批次号编辑前事件 
 * @Date: 2018-09-26 19:51:20 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 16:58:47
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL } from '../../constance';
/**
 *
 * @param {参数：点击字段key，表头区域id，表体区域id，组织主键，物料主键，对应入库单id，行索引} constance
 */
export default function(props, constance) {
	return new Promise(function(resolve, reject) {
		let { key, headareaid, bodyareaid, pk_org_field, cmaterialid_field, ccorrespondhid_field, index } = constance;
		//组织为空，不可编辑
		let pk_org = props.form.getFormItemsValue(headareaid, pk_org_field);
		if (!pk_org) {
			resolve(false);
		}
		//物料为空，不可编辑
		let cmaterialvid = props.cardTable.getValByKeyAndIndex(bodyareaid, index, cmaterialid_field);
		if (!cmaterialvid) {
			resolve(false);
		}
		//对应库存组织为空，不可编辑
		let ccorrespondhid = props.form.getFormItemsValue(headareaid, ccorrespondhid_field);
		if (ccorrespondhid && !ccorrespondhid.value) {
			resolve(false);
		}
		let data = {
			key: key,
			params: {
				cmaterialvid: cmaterialvid.value,
				pk_org: pk_org.value
			}
		};

		ajax({
			url: URL.beforeEdit,
			data: data,
			async: false,
			success: (res) => {
				if (res.data) {
					let isedit = res.data.isedit;
					if (isedit) {
						resolve(isedit);
					} else if (res.data.message) {
						toast({
							color: 'warning',
							content: res.data.message
						});
					}
					resolve(false);
				}
			},
			error: (error) => {
				toast({
					color: 'warning',
					content: error.message
				});
				resolve(false);
			}
		});
	});
}
