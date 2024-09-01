/*
 * @Author: chaiwx 
 * @PageInfo: 查询区编辑后 
 * @Date: 2018-07-21 18:46:07 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-12 16:01:37
 */
import { AREA, FIELDS } from '../../constance';
// import { orgMultiSelectHandler } from '../../../pub/util/referUtil';

export default function(field, val) {
	if (field === FIELDS.pk_org) {
		// orgMultiSelectHandler(
		// 	this.props,
		// 	AREA.searchId,
		// 	FIELDS.pk_org,
		// 	[ FIELDS.cdeptid, FIELDS.cpsnid, FIELDS.cbillbid_ccostsubjid ],
		// 	[ 'vdef', 'cbill_bid.vbdef' ],
		// 	[ 'cbill_bid.vfree' ]
		// );
	}
}
