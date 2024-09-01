const UISTATE = {
	edit: 'edit',
	browse: 'browse'
}; //页面状态
const PAGECODE = '400101404_list'; //页面编码
const BUTTONAREA = {
	list_head: 'list_head',
	list_inner: 'list_inner'
}; //按钮区域
const PAGEAREA = {
	list: 'list_head'
}; //模板区域
const BUTTONS = {
	Add: 'Add',
	Edit: 'Edit',
	Delete: 'Delete',
	Save: 'Save',
	Cancel: 'Cancel',
	Print: 'Print',
	Output: 'Output',
	Refresh: 'Refresh'
};
const URL = {
	query: '/nccloud/scmpub/wholepack/query.do',
	save: '/nccloud/scmpub/wholepack/save.do',
	delete: '',
	print: '/nccloud/scmpub/wholepack/print.do',
	addbefore: '/nccloud/scmpub/wholepack/addbefore.do'
};
const FIELDS = {
	pk_cwholepackid: 'cwholepackid', //主键
	pk_org: 'pk_org_v', //公司
	pk_group: 'pk_group', //集团
	vmemo: 'vmemo', //备注
	vdef1: 'vdef1', //自定义项1
	vdef2: 'vdef2', //自定义项2
	vdef3: 'vdef3', //自定义项3
	vdef4: 'vdef4', //自定义项4
	vdef5: 'vdef5', //自定义项5
	ts: 'ts',
	cpacktypeid: 'cpacktypeid', // 包装箱类型
	cmaterialvid: 'cmaterialvid', //物料多版本
	cmaterialclass: 'cmaterialclass', //物料基本分类
	cmaterialoid: 'cmaterialoid',
	cpackageunit: 'cpackageunit' //内包装单位
};

export { UISTATE, PAGECODE, BUTTONAREA, PAGEAREA, BUTTONS, URL, FIELDS };
