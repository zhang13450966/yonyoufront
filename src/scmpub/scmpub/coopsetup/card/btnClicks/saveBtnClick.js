/*
 * @Author: yechd5 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-04-23 17:09:58 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-03 11:06:54
 */
import { COOPSETUP_CONST } from '../../const';
import { ajax, cacheTools } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updatePksCache } from '../../pub/updatePksCache';
import buttonController from '../viewController/buttonController';

export default function saveBtnClick(props) {
	// 过滤表格空行,排除“目标单据项”,“目标协同项”,"取值方式"
	props.editTable.filterEmptyRows(COOPSETUP_CONST.CARD_TABLEID1, [
		'vchinaname',
		'ctargetfieldnameid',
		'fvaluemodule'
	]);
	props.editTable.filterEmptyRows(COOPSETUP_CONST.CARD_TABLEID2, [
		'vchinaname',
		'ctargetfieldnameid',
		'fvaluemodule'
	]);
	props.editTable.filterEmptyRows(COOPSETUP_CONST.CARD_TABLEID3, [
		'vchinaname',
		'ctargetfieldnameid',
		'fvaluemodule'
	]);
	let validateflag = props.validatePageToToast([ { name: COOPSETUP_CONST.FORMID, type: 'form' } ]);
	if (!validateflag.allPassed) {
		return;
	}
	let saveData = {
		pageid: COOPSETUP_CONST.PAGEID_CARD,
		head: {},
		body: {}
	};
	let headData = props.form.getAllFormValue(COOPSETUP_CONST.FORMID);
	let hid = headData.rows[0].values.pk_coopsetup.value;
	let flag = false;
	if (hid == null) {
		// 新增保存时，需更新缓存;修改保存，无需更新缓存
		flag = true;
	}

	let srcType = headData.rows[0].values.vbilltype_src.value;
	if (srcType == '21') {
		headData.rows[0].values.vbilltype_dest.value = '30';
	} else if (srcType == '30') {
		headData.rows[0].values.vbilltype_dest.value = '21';
	} else if (srcType == '32') {
		headData.rows[0].values.vbilltype_dest.value = '25';
	}
	saveData.head['head'] = headData;
	saveData.head['head'].areacode = 'head';

	let body1 = props.editTable.getAllData(COOPSETUP_CONST.CARD_TABLEID1);
	let body2 = props.editTable.getAllData(COOPSETUP_CONST.CARD_TABLEID2);
	let body3 = props.editTable.getAllData(COOPSETUP_CONST.CARD_TABLEID3);
	let rows_1 = body1.rows;
	let rows_2 = body2.rows;
	let rows_3 = body3.rows;
	rows_1.push(...rows_2); // 合并两个页签的数据
	rows_1.push(...rows_3); // 合并两个页签的数据

	// 过滤“vvalueref”值为空的数据  rows_1[0].values.vvalueref.value
	// 添加逻辑：只过滤新增的时候，若修改的时候清空“取值内容”则需要传给后台
	for (let i = 0; i < rows_1.length; i++) {
		if (rows_1[i].values.vvalueref != undefined) {
			let vvalueref = rows_1[i].values.vvalueref.value;
			let bid = rows_1[i].values.pk_coopsetup_b.value;
			if (vvalueref == undefined && bid == null) {
				rows_1.splice(i, 1);
				i--;
			}
		}
	}
	body1.areacode = 'body';
	saveData.body['coopsetbody'] = body1;
	saveData.body['coopsetbody'].areacode = 'body';

	props.validateToSave(saveData, () => {
		ajax({
			url: COOPSETUP_CONST.SAVEURL,
			pageid: COOPSETUP_CONST.PAGEID_CARD,
			data: saveData,
			success: (res) => {
				let pk_coopsetup = null;
				if (res.success) {
					if (res.data) {
						if (res.data.head) {
							pk_coopsetup = res.data.head[COOPSETUP_CONST.FORMID].rows[0].values.pk_coopsetup.value;
							// 更新缓存
							if (flag) {
								let newpks = updatePksCache(
									cacheTools.get(COOPSETUP_CONST.CACHEPKS_KEY),
									pk_coopsetup,
									null
								);
								cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, newpks);
							}
						}
					}
				}

				props.pushTo(COOPSETUP_CONST.TOCARDURL, {
					status: COOPSETUP_CONST.BROWSE,
					id: pk_coopsetup
				});
				buttonController.call(this, props, COOPSETUP_CONST.BROWSE);
				this.getData();
				showSuccessInfo(getLangByResId(this, '4001COOPSETUP-000003')); /* 国际化处理： 保存成功！*/
			}
		});
	});
}
