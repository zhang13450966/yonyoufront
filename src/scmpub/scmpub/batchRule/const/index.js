/*
 * @Author: yechd5 
 * @Date: 2019-01-17 13:39:11 
 * @Last Modified by:   yechd5 
 * @Last Modified time: 2019-01-17 13:39:11
 */
const BATCHCODERULE_CONST = {
    APPCODE: '400100800',// 应用注册-应用编码
	PAGECODE: '400100800_list',// 应用注册-页面编码
    BROWSE: 'browse',
    EDIT: 'edit',
    LIST_HEAD: 'list_head',// 按钮区域
    QUERYURL: '/nccloud/scmpub/batchcoderule/query.do',// 查询物料分类具体规则设置
    QRYMARCLASSURL: '/nccloud/scmpub/batchcoderule/qryMaterialClass.do',// 查询物料分类
    QUERYBTNSURL: '/nccloud/platform/appregister/queryallbtns.do',// 查询按钮
    QUERYOBJLENGTHURL: '/nccloud/scmpub/batchcoderule/qryObjsLength.do',// 查询业务对象长度
    SAVEURL: '/nccloud/scmpub/batchcoderule/save.do'// 保存
};

export { BATCHCODERULE_CONST };