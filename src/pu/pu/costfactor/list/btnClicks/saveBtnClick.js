/*
 * @Author: zhaochyu
 * @PageInfo: 保存
 * @Date: 2018-05-31 14:49:38 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-03 13:29:18
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, UISTATE } from '../../constance';
import getData from '../../utils';
import { getUpdata, setSaveDateState, AddLineSwithcUpdate } from '../../utils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function(props) {
	let flag = this.props.validatePageToToast([ { name: [ PAGECODE.headId, PAGECODE.bodyId ], type: 'editTable' } ]);
	if (!flag.allPassed) {
		return;
	}
	//校验表体显示顺序是否重复
	let bodydata = props.editTable.getAllRows(PAGECODE.bodyId, false);
	let bodydatarow = [];
	bodydata.forEach((element) => {
		if (element.status != '3') {
			bodydatarow.push(element);
		}
	});
	let rowsflag = rowsCheckedNumber(bodydatarow);
	if (!rowsflag) {
		showWarningInfo('表体显示顺序不允许重复！');
		return;
	}
	// 拼接主子表json方法，参数分别为：pageid（模板id），form区id，table区id，调用此方法即可自动拼接向后台传的json（data）
	let index = this.state.editNum;
	let saveData = {
		pageid: PAGECODE.listpagecode,
		head: {
			[PAGECODE.headId]: {
				areaType: 'form',
				rows: [],
				areacode: PAGECODE.headId
			}
		},
		body: {
			[PAGECODE.bodyId]: {
				areaType: 'table',
				rows: [],
				areacode: PAGECODE.bodyId
			}
		}
	};
	let adddata = getData(props);
	let pk_costfactor = adddata.head.list_head.rows[0].values.pk_costfactor;
	let pk_org = adddata.head.list_head.rows[0].values.pk_org;
	this.setState({
		pk_org: pk_org.value
	});
	if (pk_costfactor == undefined || pk_costfactor.value == '' || pk_costfactor.value == null) {
		this.props.validateToSave(adddata, () => {
			ajax({
				method: 'post',
				data: adddata,
				url: URL.save,
				success: (res) => {
					showSuccessInfo(getLangByResId(this, '4004COSTFACTOR-000013')); /* 国际化处理： 保存成功！*/
					ajax({
						url: URL.listHeadQuery,
						data: { pagecode: PAGECODE.listpagecode },
						success: (res) => {
							if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
								props.dealFormulamsg(
									res.formulamsg //参数一：返回的公式对象
								);
							}
							let { success, data } = res;
							if (success) {
								this.props.editTable.setTableData(PAGECODE.headId, data.list_head.list_head);
								this.setState({ status: UISTATE.browse }, () => {
									this.toggleShow();
								});
								setSaveDateState(this.props);
								//去掉增行删行，加上修改删除
								AddLineSwithcUpdate.call(this, this.props);
							}
						}
					});
				}
			});
		});
	} else {
		let bodyUpdata = getUpdata(props, true);
		let bodypk_costfactor = bodyUpdata.body.list_body.rows[0].values.pk_costfactor.value;
		let headUpdata = props.editTable.getAllRows(PAGECODE.headId, false);
		let head_length = props.editTable.getNumberOfRows(PAGECODE.headId);
		for (let i = 0; i < head_length; i++) {
			let headpk_costfactor = headUpdata[i].values.pk_costfactor.value;
			if (headpk_costfactor == bodypk_costfactor) {
				let metaObj = props.meta.getMeta();
				if (metaObj[PAGECODE.headId] && metaObj[PAGECODE.headId].moduletype === 'table') {
					let headrow = {
						status: headUpdata[i].status,
						values: headUpdata[i].values
					};
					saveData.head[PAGECODE.headId].rows.push(headrow);
				}
				if (metaObj[PAGECODE.bodyId] && metaObj[PAGECODE.bodyId].moduletype === 'table') {
					saveData.body[PAGECODE.bodyId].rows = bodyUpdata.body.list_body.rows;
				}
			}
		}
		this.props.validateToSave(saveData, () => {
			//原来的 ajax 请求
			ajax({
				method: 'post',
				data: saveData,
				url: URL.update,
				success: (res) => {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(res.formulamsg); //参数一：返回的公式对象
					}
					showSuccessInfo(getLangByResId(this, '4004COSTFACTOR-000013')); /* 国际化处理： 保存成功！*/
					ajax({
						url: URL.listHeadQuery,
						data: { pagecode: PAGECODE.listpagecode },
						success: (res) => {
							let { success, data } = res;
							if (success) {
								this.props.editTable.setTableData(PAGECODE.headId, data.list_head.list_head);
								this.props.editTable.focusRowByIndex(PAGECODE.headId, index);
								querybody.call(this, bodypk_costfactor);
								this.setState({ status: UISTATE.browse }, () => {
									this.toggleShow();
								});
								AddLineSwithcUpdate.call(this, this.props);
							}
						}
					});
				}
			});
		});
	}
}
//查询表体
function querybody(pk) {
	ajax({
		url: URL.listBodyQuery,
		data: { pk: pk, pagecode: PAGECODE.listpagecode },
		success: (res) => {
			let { success, data } = res;
			if (data == undefined) {
				this.props.editTable.setTableData(PAGECODE.bodyId, { rows: [] });
			} else {
				this.props.editTable.setTableData(PAGECODE.bodyId, data.list_body);
			}
		}
	});
}
//显示顺序不能重复
function rowsCheckedNumber(data) {
	let arr = [];
	for (let i = 0; i < data.length; i++) {
		let rownumber = data[i].values.ishoworder.value;
		arr.push(rownumber);
	}
	let oldlength = arr.length;
	let newLength = [ ...new Set(arr) ].length;
	if (oldlength != newLength) {
		return false;
	}
	return true;
}
