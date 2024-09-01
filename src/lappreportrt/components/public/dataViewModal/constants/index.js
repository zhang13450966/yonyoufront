// import Utils from '@public/utils';
// const { langCheck } = Utils;

export const TREE_ID = "areaTree";
export const BASE = "base";
export const SECTION = "SECTION";
export const HIDE_CONFIG = "hideConfig";
export const GRADE = "GRADE";

export const TYPE_INT = [2, 3, 4, 5, 6, 7, 10];
export const TableMinHeight = 114;

export const NAME_MAP_BY_LANG = {
    1: "name",
    2: "name2",
    3: "name3",
};

// console.log(langCheck('reportMultiLang', 'dataView-100301-000243')); // 数据视图
export const INITIAL_DATA = {
    treeData: [], //语义模型
    referValue: {}, //参照值
    showfold: false, //分组列表初始化展示方式，true为折叠展示，相反为不折叠显
    isShowCount: false, //是否显示合计信息
    listType: 1, //列表类型 1->列表 2->交叉表
    showType: 0, //分组列表小计在前 1 在后0
    groupFldNames: [], // 分组列表
    detailFldNames: [], // 明细列表
    areaFieldSet: [], //统计字段列表
    sectionList: [], //分节列表
    hideList: [], //隐藏列表
    innerCode: {}, // 编码字段
    parentCode: {}, //父子级次时上级编码字段
    fieldNames: {}, //显示字段
    initLvl: 0, //默认展开级次 (按级次汇总为1)
    isEnable: false, //是否启用
    cascadeFieldType: 0, //级次种类（父子为1，编码为0）
    gradeCheck: false, //按级次汇总
    gradeInput: 1, //默认级次展示
    lvlCode: "4-4-4-4", //编码规则
    showSectionTotal: false, //是否显示总计
    sectionTotalBefore: false, //是否总计在前
    sectionSubtotalBefore: false, //是否小计在前
    printPageBySection: false, //是否按分节分页
    columnFldNames: [], //列维度字段
    rowFldNames: [], // 行维度字段
    measureSet: [], // 交叉指标设置
    measureDirection: 1, //0->行 1->列
    rowSubType: 0, //行维度小计类型（小计在前、小计在后）,默认小计在后:0   在前：1
    columnSubType: 0, //列维度小计类型（小计在前、小计在后），默认小计在后:0   在前：1
};
export const DATE_VIEW_REFER_CONFIG = {
    attrcode: "pk_org_v.pk_data_view_org",
    checkStrictly: false,
    col: "3",
    colnum: "1",
    containlower: false,
    datatype: "204",
    define1: "1003Z810000000002J1T#this.pk_org_v.pk_data_view_org",
    disabled: false,
    editAfterFlag: false,
    fieldDisplayed: "refname",
    fieldValued: "refpk",
    hyperlinkflag: false,
    isDataPowerEnable: false,
    isResLabel: false,
    isShowUnit: false,
    isdrag: true,
    isfixedcondition: false,
    isnextrow: false,
    isnotmeta: true,
    itemtype: "refer",
    // label: '数据视图',
    leftspace: "0",
    maxlength: "20",
    onlyLeafCanSelect: false,
    // placeholder: '数据视图',
    position: "5",
    queryOperateType: "=@",
    refcode: "lightbq/formatDesign/refer/dataViewRef/index",
    required: false,
    rightspace: "0",
    rows: "0",
    scale: "0",
    usefunc: false,
    visible: false,
    visibleposition: 100004,
    onlyOne: true, // 只能有一个查询区
};
