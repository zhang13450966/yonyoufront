const UISTATE = {
	edit: 'edit',
	browse: 'browse'
}; //页面状态
const PAGECODE = '400101400_list'; //页面编码
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
	query: '/nccloud/scmpub/packingtype/query.do',
	save: '/nccloud/scmpub/packingtype/save.do',
	delete: '',
	print: '/nccloud/scmpub/packingtype/print.do',
	uidata: '/nccloud/scmpub/packingtype/uidata.do'
};
const FIELDS = {
	pk_cpackingid: 'cpackingid', //包装分类主键
	pk_group: 'pk_group', //集团
	venname: 'venname', //英文名称
	pk_vpackingtypecode: 'vpackingtypecode', //包装分类编码
	pk_vpackingtypename: 'vpackingtypename', //包装分类名称
	nlength: 'nlength', //长
	nwidth: 'nwidth', //宽
	nheight: 'nheight', //高
	nvolumn: 'nvolumn', //体积
	vdef1: 'vdef1', //自定义项1
	vdef2: 'vdef2', //自定义项2
	vdef3: 'vdef3', //自定义项3
	vdef4: 'vdef4', //自定义项4
	vdef5: 'vdef5', //自定义项5
	vdef6: 'vdef6', //自定义项6
	vdef7: 'vdef7', //自定义项7
	vdef8: 'vdef8', //自定义项8
	vdef9: 'vdef9', //自定义项9
	vdef10: 'vdef10', //自定义项10
	vdef11: 'vdef11', //自定义项11
	vdef12: 'vdef12', //自定义项12
	vdef13: 'vdef13', //自定义项13
	vdef14: 'vdef14', //自定义项14
	vdef15: 'vdef15', //自定义项15
	vdef16: 'vdef16', //自定义项16
	vdef17: 'vdef17', //自定义项17
	vdef18: 'vdef18', //自定义项18
	vdef19: 'vdef19', //自定义项19
	vdef20: 'vdef20', //自定义项20
	ts: 'ts'
};

export { UISTATE, PAGECODE, BUTTONAREA, PAGEAREA, BUTTONS, URL, FIELDS };
