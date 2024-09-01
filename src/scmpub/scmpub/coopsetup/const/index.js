const COOPSETUP_CONST = {
	ADD: 'add',
	COPY: 'copy',
	BROWSE: 'browse',
	EDIT: 'edit',
	QUERYALLURL: '/nccloud/scmpub/coopsetup/queryAll.do', // 查询所有数据url
	QUERYURL: '/nccloud/scmpub/coopsetup/qryByCondition.do', // 根据条件查询url
	QUERYCARDURL: '/nccloud/scmpub/coopsetup/querycard.do', // 查询卡片url
	SAVEURL: '/nccloud/scmpub/coopsetup/save.do', // 保存url
	DELLISTURL: '/nccloud/scmpub/coopsetup/delList.do', // 列表删除url
	DELCARDURL: '/nccloud/scmpub/coopsetup/delCard.do', // 卡片删除url
	COPYANDEDITURL: '/nccloud/scmpub/coopsetup/copyAndEdit.do', // 复制和修改url
	EDITTRANSTYPEURL: '/nccloud/scmpub/coopsetup/edittranstype.do', // 编辑交易类型处理url
	EDITSRCBILLTYPEURL: '/nccloud/scmpub/coopsetup/afterevent.do', // 编辑源单据类型处理url
	VVALUEEDITURL: '/nccloud/scmpub/coopsetup/vvalueeditevent.do', // 取值内容编辑事件url
	FORMID: 'head', // 卡片表头id
	TOCARDURL: '/card', // 跳转到卡片页面url
	TOLISTURL: '/list', // 跳转到列表页面url
	CARD_TABLEID1: 'salepurchasecoop', // 购销协同页签区id
	CARD_TABLEID2: 'boundcoop', // 出入库协同页签区id
	CARD_TABLEID3: 'invoicecoop', // 发票协同
	SEARCHID: 'coopinit_search', // 查询区id
	LIST_HEAD: 'list_head', // 列表头按钮区
	LIST_INNER: 'list_inner', // 列表行按钮区
	CARD_HEAD: 'card_head', // 卡片表头区id
	PAGEID_LIST: '400100400_list', // 列表页面编码
	LIST_DATAAREAID: 'head', // 列表区数据区id
	LIST_SEARCHAREAID: 'coopinit_search', // 查询区id
	PAGEID_CARD: '400100400_card', // 卡片页面编码
	CACHEPKS_KEY: 'allpks', // 缓存主键
	LIST_ADD: 'listAdd', // 操作来源-列表新增
	LIST_EDIT: 'listEdit', // 操作来源-列表修改
	CARD_ADD: 'cardAdd', // 操作来源-卡片新增
	CARD_COPY: 'cardCopy', // 操作来源-卡片复制
	CARD_EDIT: 'cardEdit', // 操作来源-卡片修改
	dataSource: 'scmpub.scmpub.coopsetup.coopsetupDataSource',
	pk_coopsetup: 'pk_coopsetup',
	queryFlag: 'QueryFlag'
};

const ROWBTNS = [ 'Edit', 'Delete', 'Show' ]; // 列表行按钮

export { COOPSETUP_CONST, ROWBTNS };
