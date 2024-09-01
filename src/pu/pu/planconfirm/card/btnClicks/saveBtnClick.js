/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，保存按钮
 * @Date: 2021-11-20 14:32:46 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-11 15:06:58
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELD, PAGECODE, UISTATE, CONSTFIELD, URL } from '../../constance';
import { buttonController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { addCacheData, updateCacheData, rewriteTransferSrcBids } from '../../../../../scmpub/scmpub/pub/cache';

export default function saveBtnClick(props, isCommit) {
	// 表头表体必输项，一起校验
	let flag = props.validatePageToToast([ { name: AREA.head, type: 'form' }, { name: AREA.body, type: 'cardTable' } ]);
	if (!flag.allPassed) {
		return;
	}
	// 无表体不能保存
	if (!props.cardTable.getVisibleRows(AREA.body).length) {
		showWarningInfo(null, getLangByResId(this, '4004planconfirm-000004')); /* 国际化处理： 无表体行，无法保存！*/
		return;
	}
	let data = props.createMasterChildDataSimple(PAGECODE.card, AREA.head, AREA.body);
	// 自定义参数：isCommit是否保存提交操作
	data.userjson = `{isCommit:${isCommit}}`;
	//用于判断是修改保存还是新增保存
	let pk = props.form.getFormItemsValue(AREA.head, FIELD.hid);

	//去掉主键为空且状态为3(删除)的行 begin
	let bodyrows = data.body[AREA.body].rows;
	let rows = [];
	bodyrows.forEach((item) => {
		if (!(item.status == '3' && !(item.values[FIELD.bid] || {}).value)) {
			rows.push(item);
		}
	});
	data.body[AREA.body].rows = rows;
	//end

	props.validateToSave(data, () => {
		ajax({
			method: 'post',
			data: data,
			url: URL.save,
			success: (res) => {
				// 处理公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				// 保存成功，设置页面为浏览态
				this.status = UISTATE.browse;
				if (res.success && res.data) {
					// 设置页面数据 begin
					props.beforeUpdatePage(AREA.head, AREA.body);
					let id = res.data.retcard.head[AREA.head].rows[0].values[FIELD.hid].value;
					this.props.form.setAllFormValue({
						[AREA.head]: res.data.retcard.head[AREA.head]
					});

					this.props.cardTable.updateDataByRowId(AREA.body, res.data.retcard.body[AREA.body], true);
					props.updatePage(AREA.head, AREA.body);
					// 设置页面数据 end

					// 处理缓存 begin
					let data = props.createMasterChildData(PAGECODE.card, AREA.head, AREA.body);
					if (pk && pk.value) {
						// 修改更新缓存
						updateCacheData(props, FIELD.hid, pk.value, data, AREA.head, CONSTFIELD.dataSource);
					} else {
						// 新增更新缓存
						addCacheData(props, FIELD.hid, id, data, AREA.head, CONSTFIELD.dataSource);
					}
					// 处理缓存 end

					// 设置URL参数
					props.setUrlParam({ id: id });
					// 设置取消表体选中状态
					this.props.cardTable.selectAllRows(AREA.body, false);
					// 提示
					buttonController.call(this, props);
					showSuccessInfo(getLangByResId(this, '4004planconfirm-000005')); /* 国际化处理： 保存成功！*/
					let channelType = props.getUrlParam('channelType');
					//转单
					if (channelType) {
						res.data = res.data.retcard;
						rewriteTransferSrcBids(props, FIELD.csourcebid, res.data.body[AREA.body].rows);

						props.transferTable.setTransformFormStatus(AREA.leftarea, {
							status: true,
							onChange: (current, next, currentIndex) => {
								props.transferTable.setTransferListValueByIndex(AREA.leftarea, res.data, currentIndex);
								let cacheDataBody = props.transferTable.updateTransferListValueByIndex(
									AREA.leftarea,
									res.data,
									currentIndex
								);
								this.indexstatus[currentIndex] = UISTATE.browse;
							}
						});
					}
				}
			}
		});
	});
}
