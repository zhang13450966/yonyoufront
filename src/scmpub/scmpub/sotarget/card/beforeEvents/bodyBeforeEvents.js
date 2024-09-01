/* 
* @Author: lichaoah  
* @PageInfo:返利指标设置表体编辑前   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-27 16:40:00
*/
import { TARGET_CARD } from '../../siconst';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import isRef from './isRef';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import onRowClick from '../btnClicks/onRowClick';
import { getLangCode } from 'nc-lightapp-front';

export default async function bodyBeforeEvents(props, moduleId, key, value, index, record) {
	let meta = props.meta.getMeta();
	switch (moduleId) {
		case TARGET_CARD.target_ratio:
			switch (key) {
				case TARGET_CARD.clinkyearitemid: //关联年指标
					let rows = props.cardTable.getVisibleRows(TARGET_CARD.target_item);
					let namesoptions = [ { value: '00001', display: ' ' } ];
					let langCode = getLangCode();
					let nameField =
						langCode == 'simpchn'
							? TARGET_CARD.vtargetname
							: langCode == 'tradchn' ? TARGET_CARD.vtargetname2 : TARGET_CARD.vtargetname3;
					rows.map((row, i) => {
						if (
							row.values[TARGET_CARD.fitemtypeflag].value == 3 &&
							row.values[TARGET_CARD.vtargetname].value != null
						) {
							namesoptions.push({
								//value必须有值
								value: row.values[TARGET_CARD.pk_target_item].value
									? row.values[TARGET_CARD.pk_target_item].value
									: 'temp' + row.values['citemrowno'].value, //行号
								display: row.values[nameField].value //指标项名称
							});
						}
					});
					meta[TARGET_CARD.target_ratio].items.map((item) => {
						if (item.attrcode == TARGET_CARD.clinkyearitemid) {
							item.datatype = '203';
							item.itemtype = 'select';
							item.options = namesoptions;
						}
					});
					props.meta.setMeta(meta);
					break;
				default:
					let clinkyearitemid = props.cardTable.getColValue(moduleId, TARGET_CARD.clinkyearitemid);
					debugger;
					if (!clinkyearitemid[0].value || clinkyearitemid[0].value == '00001') {
						showWarningInfo(
							undefined,
							getLangByResId(this, '4001TARGET-000011')
						); /* 国际化处理： 必须先录入关联年指标项，才能录入对应各期间的比例值*/
						return false;
					}
					break;
			}
			break;
	}
	switch (key) {
		case TARGET_CARD.csaleorgid:
			if (props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.blowsetflag).value) return false;
			let flag = await isRef.call(this, props, moduleId, key, value);
			if (flag) {
				showWarningInfo(
					undefined,
					getLangByResId(this, '4001TARGET-000012')
				); /* 国际化处理： 销售指标表已维护销售指标或者已被销售返利政策引用后，不可以修改销售组织范围*/
				return false;
			} else {
				let pk_org = (props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org) || {}).value;
				props.cardTable.setQueryCondition(moduleId, {
					[key]: () => {
						return {
							pk_org: pk_org,
							TreeRefActionExt: 'nccloud.web.sr.policy.refilter.BodySaleOrgRefFilter'
						};
					}
				});
			}
			break;
		case TARGET_CARD.vperiod:
		case TARGET_CARD.dprdbegindate:
		case TARGET_CARD.dprdenddate:
			let marRows = props.cardTable.getVisibleRows(TARGET_CARD.target_item);
			if (marRows && marRows.length > 0) {
				showWarningInfo(undefined, getLangByResId(this, '4001TARGET-000013')); /* 国际化处理： 指标项已维护，不允许编辑*/
				return false;
			}
			break;
		case TARGET_CARD.cmaterialid:
			let pk_targetmar = record.values[TARGET_CARD.pk_target_mar].value;
			let flag1 = await isRef.call(this, props, moduleId, key, value);
			if (pk_targetmar && flag1) {
				showWarningInfo(
					undefined,
					getLangByResId(this, '4001TARGET-000014')
				); /* 国际化处理： 此指标表已经被引用，当前物料维度行不允许编辑*/
				return false;
			}
			let pk_org = (props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org) || {}).value;
			let cprodlineid = record.values[TARGET_CARD.cprodlineid].value;
			let cbrandid = record.values[TARGET_CARD.cbrandid].value;
			props.cardTable.setQueryCondition(moduleId, {
				[key]: () => {
					return {
						pk_org: pk_org,
						cbrandid: cbrandid,
						cprodlineid: cprodlineid,
						GridRefActionExt: 'nccloud.web.scmpub.target.reffilter.MaterialRefFilter'
					};
				}
			});
			break;
		case TARGET_CARD.cbrandid:
		case TARGET_CARD.cprodlineid:
			if (props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.fmarsetflag).value == 0) {
				return false;
			}
			let cprolineflag = await isRef.call(this, props, moduleId, key, value);
			if (record.values[TARGET_CARD.pk_target_mar].value && cprolineflag) {
				showWarningInfo(
					undefined,
					getLangByResId(this, '4001TARGET-000014')
				); /* 国际化处理： 此指标表已经被引用，当前物料维度行不允许编辑*/
				return false;
			}
			break;
		case TARGET_CARD.cmarbaseclassid:
		case TARGET_CARD.cmarsaleclassid:
		case TARGET_CARD.cmarcombineid:
		case TARGET_CARD.crmvmarcomid:
			let flag2 = await isRef.call(this, props, moduleId, key, value);
			if (record.values[TARGET_CARD.pk_target_mar].value && flag2) {
				showWarningInfo(
					undefined,
					getLangByResId(this, '4001TARGET-000015')
				); /* 国际化处理： 此指标表已经被引用，当前物料维度行不允许编辑*/
				return false;
			}
			break;
		case TARGET_CARD.clinkyearitemid:
			//TODO
			break;
		case TARGET_CARD.binclowflag:
			if (props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.blowsetflag).value) return false;
			break;
		case TARGET_CARD.fitemtypeflag:
			onRowClick.call(this, props, moduleId, record, index);
			let flag3 = await isRef.call(this, props, moduleId, key, value);
			if (record.values[TARGET_CARD.pk_target_item].value && flag3) {
				showWarningInfo(
					undefined,
					getLangByResId(this, '4001TARGET-000015')
				); /* 国际化处理： 此指标表已经被引用，当前指标项类别不允许编辑*/
				return false;
			}
			// 更新指标项类别可选项
			let fcyclesetflag = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.fcyclesetflag);
			meta[TARGET_CARD.target_item].items.map((item) => {
				if (item.attrcode == TARGET_CARD.fitemtypeflag) {
					switch (fcyclesetflag.value) {
						case '3':
							item.options = [
								{ value: '3', display: getLangByResId(this, '4001TARGET-000016') }
							]; /* 国际化处理： 年指标*/
							break;
						case '2':
							item.options = [
								{ value: '3', display: getLangByResId(this, '4001TARGET-000016') },
								{ value: '2', display: getLangByResId(this, '4001TARGET-000017') }
							]; /* 国际化处理： 年指标,半年指标*/
							break;
						case '1':
							item.options = [
								{ value: '3', display: getLangByResId(this, '4001TARGET-000016') },
								{ value: '1', display: getLangByResId(this, '4001TARGET-000018') }
							]; /* 国际化处理： 年指标,季指标*/
							break;
						case '0':
							item.options = [
								{ value: '3', display: getLangByResId(this, '4001TARGET-000016') },
								{ value: '0', display: getLangByResId(this, '4001TARGET-000019') }
							]; /* 国际化处理： 年指标,月指标*/
							break;
						default:
							break;
					}
				}
			});
			props.meta.setMeta(meta);
			break;
		case TARGET_CARD.vtargetname:
		case TARGET_CARD.citemrowno:
		case TARGET_CARD.vrownote:
			onRowClick.call(this, props, moduleId, record, index);
			break;
	}
	return true;
}
