/*
 * @Author: zhaochyu 
 * @PageInfo: 车型定义常量类 
 * @Date: 2020-01-15 15:10:47 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-01-16 11:01:32
 */
/*
 * @Author: zhaochyu 
 * @PageInfo: 车型定义常量类
 * @Date: 2020-01-14 16:35:09 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-01-15 11:26:47
 */
/**
 * 请求地址
 */
const URL = {
    save: '/nccloud/scmpub/vehicletype/save.do',
    edit: '/nccloud/scmpub/vehicletype/edit.do',
    delete: '/nccloud/scmpub/vehicletype/delete.do',
    query: '/nccloud/scmpub/vehicletype/query.do',
    afterEdit: '/nccloud/scmpub/vehicletype/afterEdit.do',
    orgChange: '/nccloud/scmpub/vehicletype/orgChange.do',
    startuse: '/nccloud/scmpub/vehicletype/startuse.do',
    stopuse: '/nccloud/scmpub/vehicletype/stopuse.do',

};

const ROOT = '#app';
/**
 * 区域编码
 */
const AREA = {
    listTable: 'listhead'
};

/**
 * 页面状态
 */
const STATUS = {
    edit: 'edit',
    browse: 'browse'
};

const PAGEID = '400101620_list';

const COMMON = {
    oid: '1001Z81000000000AJRY'
};

const BUTTONAREA = {
    listhead: 'list_head',
    listinner: 'list_inner'
}

const ALLBUTTONS = ['Add', 'Edit', 'StartUse', 'StopUse', 'Delete', 'Save', 'Cancel', 'Print', 'Output', 'Refresh', 'PrintPop']
const BROWSEBUTTONS = ['Add', 'Edit', 'Delete', 'StartUse', 'StopUse', 'Assign', 'ExportImport', 'Refresh', 'PrintPop', 'Print', 'Output'];
const EDITBUTTONS = ['Add', 'Save', 'Delete', 'Cancel']
const APPID = '0001Z810000000030YVU';
export { URL, STATUS, AREA, ROOT, PAGEID, APPID, COMMON, BUTTONAREA, EDITBUTTONS, ALLBUTTONS, BROWSEBUTTONS }