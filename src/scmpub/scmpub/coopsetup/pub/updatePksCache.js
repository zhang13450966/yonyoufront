/*
 * @Author: yechd5 
 * @PageInfo: 更新缓存的主键
 * @Date: 2018-12-12 11:00:22 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-12-12 11:00:22
 */

export function updatePksCache(srcpks, addpk, delpks) {
    // 第一次新增的时候，srcpks可能传入的是undefined
	if (srcpks == undefined) {
		srcpks = new Array();
	}
    if (addpk) {
        srcpks.push(addpk);
    }
    if (delpks && delpks.length > 0) {
        for (var i = 0; i < delpks.length; i++) {
            for (var j = 0; j < srcpks.length; j++) {
                if (srcpks[j] == delpks[i]) {
                    srcpks.splice(j, 1);
                    j = j - 1;
                }
            }
        }
    }
    return srcpks
}