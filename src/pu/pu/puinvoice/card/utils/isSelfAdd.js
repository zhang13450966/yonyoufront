/*
 * @Author: jiangfw 
 * @PageInfo: 是否自制
 * @Date: 2018-09-03 22:48:39 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-10-19 14:34:02
 */
export default function isSelfAdd(rows) {
	if (rows) {
		for (let i = 0; i < rows.length; i++) {
			let csourcetypecode = rows[i].values.csourcetypecode;
			if (csourcetypecode && csourcetypecode.value) {
				return false;
			}
		}
	}
	return true;
}
