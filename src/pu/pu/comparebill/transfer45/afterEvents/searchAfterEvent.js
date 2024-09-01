/*
 * @Author: qishy
 * @PageInfo: 查询区编辑后 
 * @Date: 2018-07-21 18:46:07 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-03 17:36:08
 */
import { AREA, MAIN_ORG_FIELD } from '../../constance';
import { orgMultiSelectHandler } from '../../utils/referUtil';
export default function(key) {
	//根据财务结算组织过滤
	if (key == MAIN_ORG_FIELD.search45Org) {
		orgMultiSelectHandler(
			this.props,
			AREA.searchId,
			key,
			[
				'ccustomerid', //收货客户
				'cvendorid', //供应商
				'cgeneralbid.cmaterialoid', //物料
				'cgeneralbid.cmaterialoid.pk_marbasclass' //物料基本分类
			],
			[ 'vdef', 'cgeneralbid.vbdef' ],
			[ 'cgeneralbid.vfree' ]
		);
	}
}
