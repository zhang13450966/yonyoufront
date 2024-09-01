/*
 * @PageInfo: 页面初始化
 * @Author: nieqianc 
 * @Date: 2019-04-6 13:13:16 
 */
import { PAGECODE, AREA, FIELD, URL, UISTATE } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import buttonControl from '../viewControl/buttonControl';
import linkClick from '../btnClicks/linkClick';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

export default function initTemplate(props) {
	//页面初始化
	props.createUIDom(
		{
			pagecode: PAGECODE.LIST
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					// 记录模板ID
					this.templetid = meta.pageid;
					// 处理分页
					meta[AREA.LIST_HEAD].pagination = true;
					modifier.call(this, meta, this.props);
					props.meta.setMeta(meta, () => {
						buttonControl.call(this, this.props);
					});
				}
			}
		}
	);

	function modifier(meta, props) {
		//修改编辑前参照过滤
		meta[AREA.LIST_SEARCH].items.map((item) => {
			setRefShowDisabledData(item);
			setPsndocShowLeavePower(item);
			if (item.attrcode == FIELD.PK_ORG) {
				//主组织权限过滤
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
				};
			} else if (item.attrcode == FIELD.PK_SRCMATERIAL || item.attrcode == FIELD.PK_SUPPLIER_V) {
				item.isShowUnit = true;
				// 根据pk_org过滤
				item.queryCondition = () => {
					let data = props.search.getSearchValByField(AREA.LIST_SEARCH, FIELD.PK_ORG);
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return { pk_org: data };
				};
			} else if (item.attrcode == FIELD.CTRANTYPEID) {
				//订单类型过滤交易类型
				item.queryCondition = () => {
					let pk_org = props.search.getSearchValByField(AREA.LIST_SEARCH, FIELD.PK_ORG);
					pk_org =
						pk_org != null
							? pk_org.value.firstvalue.includes(',') ? null : pk_org.value.firstvalue
							: null;
					//订单类型过滤交易类型
					return {
						istransaction: 'Y',
						parentbilltype: '21',
						SCM_CONSIDERBUSITYPE: 'Y',
						pk_org: pk_org,
						SCM_BUSIORG: pk_org,
						UsualGridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
					};
				};
			} else if (item.attrcode == FIELD.PK_DEPT) {
				item.isShowUnit = true;
				// 部门
				item.queryCondition = () => {
					let data = props.search.getSearchValByField(AREA.LIST_SEARCH, FIELD.PK_ORG);
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return {
						pk_org: data,
						busifuncode: FIELD.PURCHASEORG
					};
				};
			} else if (item.attrcode == FIELD.CEMPLOYEEID) {
				item.isShowUnit = true;
				// 采购员
				item.queryCondition = () => {
					let data = props.search.getSearchValByField(AREA.LIST_SEARCH, FIELD.PK_ORG);
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					let pk_dept = props.search.getSearchValByField(AREA.LIST_SEARCH, FIELD.pk_dept);
					pk_dept =
						pk_dept != null
							? pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue
							: null;
					return {
						pk_org: data,
						pk_dept: pk_dept,
						busifuncode: FIELD.PURCHASEORG
					};
				};
			} else {
				item.isShowUnit = true;
				// 根据pk_org过滤
				item.queryCondition = () => {
					let data = props.search.getSearchValByField(AREA.LIST_SEARCH, FIELD.PK_ORG);
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return { pk_org: data };
				};
			}
		});

		//模板table的订单编号列加超链接
		meta[AREA.LIST_HEAD].items.map((item, key) => {
			if (item.attrcode == FIELD.VBILLCODE) {
				item.render = (text, record, index) => {
					if (record && record.vbillcode) {
						// return (
						// 	<span className="code-detail-link" onClick={linkClick.bind(this, props, record)}>
						// 		{record && record.vbillcode && record.vbillcode.value}
						// 	</span>
						// );
						return (
							<a
								style={{ cursor: 'pointer' }}
								onClick={() => {
									props.pushTo(URL.CARD, {
										status: 'browse',
										id: record[FIELD.PK_ORDER].value,
										pagecode: PAGECODE.CARD
									});
								}}
							>
								{record[FIELD.VBILLCODE].value}
							</a>
						);
					}
				};
			}
			return item;
		});
	}
}
