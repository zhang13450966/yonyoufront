/**
 * 删除按钮
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, COMMON, BUTTON, URL, STATUS, FIELD } from '../../constance';
import { changeUrlParam, deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { pageInfoClick } from './index';
import togglePageShow from '../viewController/buttonController';

export default function delBtnClick(props) {
	let datas = this.props.form.getAllFormValue(PAGECODE.cardhead).rows;
	let rows = this.props.cardTable.getAllRows(PAGECODE.cardbody);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			id: row.values[FIELD.pk_settlebill_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	let settleBillInfo = datas.map((item) => {
		return {
			id: item.values.pk_settlebill.value,
			ts: item.values.ts.value,
			bodys: bodys
		};
	});
	let data = { pagecode: PAGECODE.cardcode, settleBillInfo };

	showWarningDialog(
		getLangByResId(this, '4004SETTLEBILL-000001') /* 国际化处理： 删除*/,
		getLangByResId(this, '4004SETTLEBILL-000011') /* 国际化处理： 确定要删除吗？*/,
		{
			beSureBtnClick: () => {
				ajax({
					url: URL.delete,
					data: data,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							showSuccessInfo(getLangByResId(this, '4004SETTLEBILL-000003')); /* 国际化处理： 删除成功*/
							let nextId = getNextId(this.props, this.props.getUrlParam('id'), COMMON.settlebillCacheKey);
							deleteCacheData(
								this.props,
								'pk_settlebill',
								this.props.getUrlParam('id'),
								COMMON.settlebillCacheKey
							);
							if (nextId == null) {
								togglePageShow.call(this, props, null);
							} else {
								changeUrlParam(this.props, { status: STATUS.browse, id: nextId });
								pageInfoClick.call(this, this.props, nextId);
							}
						}
					}
				});
			}
		}
	);
	// props.modal.show(BUTTON.del, {
	// 	title: getLangByResId(this, '4004SETTLEBILL-000001') /* 国际化处理： 确认删除*/,
	// 	content: getLangByResId(this, '4004SETTLEBILL-000011') /* 国际化处理： 确定要删除吗？*/,
	// 	beSureBtnClick: () => {
	// 		ajax({
	// 			url: URL.delete,
	// 			data: data,
	// 			success: (res) => {
	// 				let { success, data } = res;
	// 				if (success) {
	// 					showSuccessInfo(getLangByResId(this, '4004SETTLEBILL-000003')); /* 国际化处理： 删除成功*/
	// 					let nextId = getNextId(this.props, this.props.getUrlParam('id'), COMMON.settlebillCacheKey);
	// 					deleteCacheData(
	// 						this.props,
	// 						'pk_settlebill',
	// 						this.props.getUrlParam('id'),
	// 						COMMON.settlebillCacheKey
	// 					);
	// 					if (nextId == null) {
	// 						togglePageShow.call(this, props, null);
	// 					} else {
	// 						changeUrlParam(this.props, { status: STATUS.browse, id: nextId });
	// 						pageInfoClick.call(this, this.props, nextId);
	// 					}
	// 				}
	// 			}
	// 		});
	// 	},
	// 	cancelBtnClick: () => {}
	// });
}
