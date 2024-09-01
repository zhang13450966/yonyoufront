/**
 * 页面初始化，inittemplate返回结果的处理，将交易类型信息缓存到state中
 * @param {res.context} context
 */
import { setDefData , getDefData} from '../../pub/cache';


const SCM_TRANSTYPEDATA = 'scm_transtypedata';
const TRANSTYP_CODE='transtype_code';
const TRANSTYPE_PK='pk_transtype';
const TRANSTYPE_NAME = 'transtype_name';

function init(context) {
	if (context && context.paramMap && context.paramMap.transtype) {
		this.transtypeData = {
			transtype: context.paramMap.transtype,
			transtype_name: context.paramMap.transtype_name,
			pk_transtype: context.paramMap.pk_transtype
		};
		
		setDefData(SCM_TRANSTYPEDATA, TRANSTYP_CODE,context.paramMap.transtype);
		setDefData(SCM_TRANSTYPEDATA, TRANSTYPE_NAME,context.paramMap.transtype_name);
		setDefData(SCM_TRANSTYPEDATA, TRANSTYPE_PK,context.paramMap.pk_transtype);
		
	}
}

/**
 * 获取交易类型pk
 */
function getTranstypeID() {
	let pk_transtype = getDefData(SCM_TRANSTYPEDATA,TRANSTYPE_PK);
	return pk_transtype;
	// return (this.transtypeData || {}).pk_transtype;
}

/**
 * 获取交易类型code
 */
function getTranstypeCode() {
	let transtype = getDefData(SCM_TRANSTYPEDATA,TRANSTYP_CODE);
	return transtype;
	// return (this.transtypeData || {}).transtype;
}

/**
 * 获取交易类型name
 */
function getTranstypeName() {
	let transtype_name = getDefData(SCM_TRANSTYPEDATA, TRANSTYPE_NAME);
	return transtype_name;
	// return (this.transtypeData || {}).transtype_name;
}

/**
 * 交易类型和交易类型编码编辑前判断，如果是交易类型发布的节点，则返回false不可编辑
 * @param {*} key 
 * @param {*} idField 
 * @param {*} codeField 
 */
function beforeEdit(key, idField, codeField) {
	if (key == idField || key == codeField) {
		if (this.transtypeData && this.transtypeData.transtype) {
			return false;
		}
	}
	return true;
}
/**
 * 设置默认值
 * @param {form的区域编码} formArea 
 * @param {交易类型id字段} idField 
 * @param {交易类型code字段} codeField 
 */
function setValue(formArea, idField, codeField) {
	if (this.transtypeData) {
		this.props.form.setFormItemsValue(formArea, {
			[idField]: { value: this.transtypeData.pk_transtype, display: this.transtypeData.transtype_name },
			[codeField]: { value: this.transtypeData.transtype, display: this.transtypeData.transtype }
		});
	}
}

/**
 * 查询前处理查询条件，如果是交易类型发布的节点，需要添加交易类型条件
 * @param {查询信息} queryInfo 
 * @param {查询区交易类型id字段} idField 
 */
function beforeSearch(queryInfo, idField, codeField) {
	if (queryInfo) {
		if (this.transtypeData && this.transtypeData.pk_transtype) {
			if (!queryInfo.querycondition) {
				queryInfo.querycondition = {};
			}
			if (!queryInfo.querycondition.conditions) {
				queryInfo.querycondition.conditions = [];
			}
			if (!queryInfo.querycondition.logic) {
				queryInfo.querycondition.logic = 'and';
			}
			let condition = {
				field: idField,
				datatype: '204',
				oprtype: '=',
				value: { firstvalue: this.transtypeData.pk_transtype }
			};
			queryInfo.querycondition.conditions.push(condition);
		}
	}
	return queryInfo;
}

/**
 * 列表查询区交易类型处理，如果为交易类型发布的小应用，交易类型的查询条件不可修改，不可移除。注意此方法要再setmeta前调用
 * @param {*} props 
 * @param {*} meta 
 * @param {*} queryarea 
 * @param {*} idField 
 */
function initQuery(props, meta, queryarea, idField) {
	let item = meta[queryarea].items.find((item) => item.attrcode == idField);
	if (item && this.transtypeData) {
		item.disabled = true;
		item.isfixedcondition = true;
		item.visible = true;
		// item.initalvalue = { display: getTranstypeName.call(this), value: getTranstypeID.call(this) };
	}
}

/**
 * 设置查询区交易类型字段的默认值
 * @param {*} props 
 * @param {*} queryarea 
 * @param {*} idField 
 */
function setQueryDefaultValue(props, queryarea, idField) {
	if (this.transtypeData) {
		props.search.setSearchValByField(queryarea, idField, {
			display: getTranstypeName.call(this),
			value: getTranstypeID.call(this)
		});
	}
}
export default {
	init,
	getTranstypeID,
	getTranstypeCode,
	getTranstypeName,
	beforeEdit,
	setValue,
	beforeSearch,
	initQuery,
	setQueryDefaultValue
};
