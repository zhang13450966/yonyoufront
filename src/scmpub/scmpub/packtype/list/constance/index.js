const UISTATE = {
	edit: 'edit',
	browse: 'browse'
}; //页面状态
const PAGECODE = '400101402_list'; //页面编码
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
	query: '/nccloud/scmpub/packtype/query.do',
	save: '/nccloud/scmpub/packtype/save.do',
	delete: '',
	print: '/nccloud/scmpub/packtype/print.do',
	addbefore: '/nccloud/scmpub/packtype/addbefore.do',
	uidata: '/nccloud/scmpub/packingtype/uidata.do'
};
const FIELDS = {
	pk_cpacktypeid: 'cpacktypeid', //主键
	pk_org: 'pk_org', //公司
	pk_group: 'pk_group', //集团
	vcode: 'vcode', //包装箱类型编码
	vname: 'vname', //包装箱类型名称
	venname: 'venname', //英文名称
	pk_packsort: 'pk_packsort', //包装分类编码
	pk_vpackingtypename: 'pk_packsort.vpackingtypename', //包装分类名称
	vspec: 'vspec', //规格
	nlength: 'nlength', //长
	nwidth: 'nwidth', //宽
	nheight: 'nheight', //高
	nvolumn: 'nvolumn', //容积
	nmaxweight: 'nmaxweight', //限重
	vmemo: 'vmemo', //备注
	vdef1: 'vdef1', //自定义项1
	vdef2: 'vdef2', //自定义项2
	vdef3: 'vdef3', //自定义项3
	vdef4: 'vdef4', //自定义项4
	vdef5: 'vdef5', //自定义项5
	ts: 'ts'
};

export { UISTATE, PAGECODE, BUTTONAREA, PAGEAREA, BUTTONS, URL, FIELDS };
