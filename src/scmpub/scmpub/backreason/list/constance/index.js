const UISTATE = {
	edit: 'edit',
	browse: 'browse'
}; //页面状态
const PAGECODE = '400100010_list'; //页面编码
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
	Cancel: 'Cancel',
	Print: 'Print', //打印
	Output: 'Output', //输出
	Refresh: 'Refresh',
	Save: 'Save' //保存
}; //按钮
const URL = {
	query: '/nccloud/scmpub/backreason/query.do',
	save: '/nccloud/scmpub/backreason/save.do',
	delete: '',
	print: '/nccloud/scmpub/backreason/print.do'
};
const FIELDS = {
	pk_backreason: 'pk_backreason', //主键
	pk_org: 'pk_org',
	pk_group: 'pk_group',
	vbackreasoncode: 'vbackreasoncode', //退货理由设置编码
	vbackreasonname: 'vbackreasonname', //退货理由设置编名称
	dinvalidate: 'dinvalidate', //失效日期
	benable: 'benable', //是否可用
	vmemo: 'vmemo', //备注
	vauthorg: 'vauthorg', //认证机构
	dvalidday: 'dvalidday', //认证有效期
	modifier: 'modifier', //最后修改人
	modifiedtime: 'modifiedtime', //最后修改时间
	ts: 'ts'
};
export { UISTATE, PAGECODE, BUTTONAREA, PAGEAREA, BUTTONS, URL, FIELDS };
