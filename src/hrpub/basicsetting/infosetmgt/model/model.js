import proFetch from 'src/hrpub/common/utils/project-fetch';
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const { appcode, pagecode } = getAppPageConfig();
const path = '/nccloud/hrpub/infoset/';
const exPath = '/nccloud/hrpub/infosetmap/';
export default {
	name: 'infosetmgt',
	data: {
		appcode,
		pagecode,
		pageInfo: {
			pageIndex: 1,
			pageSize: 10,
			total: 1,
			totalPage: 1
		},
		showMode: 'list-browse',
		exShowMode: 'list-browse',
		editFrom: null, // 编辑信息集状态 新增:add 修改:edit
		editItemFrom: null, //编辑信息项状态 新增:addsubrow  修改: editsubrow
		treeid: 'infosetmgt_tree',
		selectedTreeData: 'ROOT',
		selectedTreePid: null,
		hasMainTableData: false,
		bShowOrderModal: false,
		bShowInfosetItemModal: false,
		bShowExchangeModal: false,
		hasOrderData: false,
		rowpk: null, // 默认选择行 - 信息集列表
		rowindex: 0, // 默认行index - 信息集列表
		exrowpk: '', // 默认选择行 - 信息项交换列表
		exrowindex: 0, // 默认行index - 信息项交换列表
		pkOrg: null,
		lang: {},
		hrorgobj: {},
		formulaUrl: `${path}InfoItemFormulaTypeAction.do`,
		saveFormulaUrl: `${path}InfoItemFormulaCheckAction.do`,
		formulaParams: {},
		defaultFormulaStr: '',
		exconfirmShow: false,
		tempPageId: '',
		tempPageCode: ''
	},
	sync: {
		update(state, payload) {
			return {
				...state,
				...payload
			};
		}
	},
	async: {
		/* 获取树数据 */
		getTreeData(dispatch, getState, payload) {
			return proFetch({
				url: `${path}QueryInfosetTreeAction.do`,
				body: payload.postData
			});
		},
		/* 获取信息集表格数据 -- list browse视图 */
		getMainTableData(dispatch, getState, payload) {
			return proFetch({
				url: `${path}QueryInfosetGridByConAction.do`,
				body: payload.postData
			});
		},
		/* 获取信息集form meta信息 */
		getFormMeta(dispatch, getState, payload) {
			return proFetch({
				url: `${path}EditInfosetAction.do`,
				body: payload.postData
			});
		},
		/* 获取信息集详情数据 -- card browse视图*/
		getSelectedViewData(dispatch, getState, payload) {
			return proFetch({
				url: `${path}QueryInfosetFormAndItemsAction.do`,
				body: payload.postData
			});
		},
		/* 保存编辑的信息集数据 */
		saveFormData(dispatch, getState, payload) {
			return proFetch({
				url: `${path}SaveInfosetFormAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-信息项显示顺序查询 */
		setDisplayOrder(dispatch, getState, payload) {
			return proFetch({
				url: `${path}SetDisplayOrderAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-信息项显示顺序调整保存 */
		saveOrderData(dispatch, getState, payload) {
			return proFetch({
				url: `${path}UpdateDisplayOrderAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-新增 */
		addInfoset(dispatch, getState, payload) {
			return proFetch({
				url: `${path}AddInfosetAction.do`,
				body: payload.postData
			});
		},
		/* 信息项-新增 */
		addInfosetItem(dispatch, getState, payload) {
			return proFetch({
				url: `${path}AddInfosetItemsAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-删除 */
		deleteInfoset(dispatch, getState, payload) {
			return proFetch({
				url: `${path}DeleteInfosetAction.do`,
				body: payload.postData
			});
		},
		/* 信息项-删除 */
		deleteInfosetItem(dispatch, getState, payload) {
			return proFetch({
				url: `${path}DeleteInfosetItemAction.do`,
				body: payload.postData
			});
		},
		/* 信息项-修改 */
		editInfosetItem(dispatch, getState, payload) {
			return proFetch({
				url: `${path}EditInfosetItemAction.do`,
				body: payload.postData
			});
		},
		/* 信息项-修改-字段联动 */
		transferInfosetItem(dispatch, getState, payload) {
			return proFetch({
				url: `${path}InfoItemAfterEditAction.do`,
				body: payload.postData
			});
		},
		/* 信息项-公式编辑器接口 */
		getFxData(dispatch, getState, payload) {
			return proFetch({
				url: `${path}InfoItemFormulaTypeAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-同步元数据 */
		syncMetaData(dispatch, getState, payload) {
			return proFetch({
				url: `${path}SynchrMetaDataAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-同步模板 */
		syncTemplet(dispatch, getState, payload) {
			return proFetch({
				url: `${path}SynchrTempletAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-交换设置-弹窗是否打开确认 */
		exchangeData(dispatch, getState, payload) {
			return proFetch({
				url: `${path}SetInfoSetMapAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-交换设置-获取列表数据 */
		exchangeListData(dispatch, getState, payload) {
			return proFetch({
				url: `${exPath}InfosetMapQueryAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-交换设置-获取卡片数据-单条 */
		exchangeCardData(dispatch, getState, payload) {
			return proFetch({
				url: `${exPath}InfosetMapQueryOneAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-交换设置-保存 */
		exchangeSaveData(dispatch, getState, payload) {
			return proFetch({
				url: `${exPath}SaveInfoSetMapAction.do`,
				body: payload.postData
			});
		},
		/* 信息集-交换设置-删除 */
		exchangeDeleteData(dispatch, getState, payload) {
			return proFetch({
				url: `${exPath}DeleteInfoSetMapAction.do`,
				body: payload.postData
			});
		},
		/* 信息项-新增/编辑确定前后端验证 */
		checkInfoItemDataOnServer(dispatch, getState, payload) {
			return proFetch({
				url: `${path}InfoItemOKValidateAction.do`,
				body: payload.postData
			});
		}
	}
};
