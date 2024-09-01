import { base, toast, promptBox, getBusinessInfo} from 'nc-lightapp-front';
import deepCopy from '../../../common/utils/deep-copy';
import CommonAction from './commonAction';
import {getQueryCondition} from 'src/hrpub/common/utils/utils';
export default class MainAction extends CommonAction{

    constructor(comp) {
        super();
        this.comp = comp;
        if (comp.props.use) {
            comp.props.use.editTable('grid', 'condTable')
            comp.props.use.form('sort', 'cond')

        }
    
        this.appConfig = this.comp.props.appConfig
        // this.appConfig = {
        //     appcode: '18209030',
        //     pagecode: '18209030p'
        // }
        this.pk_org = 'GLOBLE00000000000000'; // 全局的
        if(this.comp.props.nodeType === 'group') {
            this.pk_org = getBusinessInfo() && getBusinessInfo().groupId || ''
        }
    }

    didMount = () => {
        const {props} = this.comp;
        const {rsc, syncTree: { setSyncTreeData, setNodeSelected}} = props;
        // // window.location.hash = '#ifr?page='
        this.buttonSetting()
        this.subscribe();
        let callback = (json, status, inlt) => {
            if (status) {
                this.update({
                    language: json
                })
            }
        }
        // let height = document.documentElement.clientHeight - 100;
        props.MultiInit.getMultiLang({moduleId: 'hr_report', domainName: 'hrpub', callback})
        this.getTemplateData()
        this.setBtnMap()
        if(props.nodeType !== 'org') {
            this.getTreeData()
        } else if(props.nodeType === 'org' && !rsc.orgVal){
            setSyncTreeData('rscTree', [{
                code: 'root',
                id: 'root',
                key: 'root',
                name: rsc.language["report-000049"] || '统计条件分类', // ''统计条件分类'',
                refname: rsc.language["report-000049"] || '统计条件分类', //''统计条件分类'',
                refpk: 'root',
            }])
            this.buttonStatus['treeButtonNoChecked']()
            this.buttonStatus['onlyTree']()
            setNodeSelected('rscTree', 'root')
        }
        // this.props.setState({pageHeight:height})
    }
    /**
     * 组织变化
     */
    orgChange = async(val) => {
        const {props} = this.comp;
        const {rsc, editTable, syncTree: { setSyncTreeData, setNodeSelected}} = props;
        this.update({
            orgVal: val
        })
        if(!val.refpk) {
            setSyncTreeData('rscTree', [{
                code: 'root',
                id: 'root',
                key: 'root',
                name: rsc.language["report-000049"] || '统计条件分类', // ''统计条件分类'',
                refname: rsc.language["report-000049"] || '统计条件分类', //''统计条件分类'',
                refpk: 'root',
            }])
            this.buttonStatus['treeButtonNoChecked']()
            this.buttonStatus['onlyTree']()
            setNodeSelected('rscTree', 'root')
        } 
        editTable.setTableData(rsc.tableId, {rows: []})
        this.getTreeData(val.refpk)
        
    }
    getTemplateData = () => {
        const {props} = this.comp;
        const {createUIDom, meta, button} = props;
        createUIDom(this.appConfig, (data = {}) => {
            let template = deepCopy(data.template)
            template = this.tableBodyOpr(template)
            meta.setMeta(template || {});
            button.setButtons(data.button || {});
        });
    }
    /**
     * 处理模板
     */
     tableBodyOpr = (template) => {
        const { props, action } = this.comp;
        const { rsc } = props;
        let that = this;
        let data = template.condTable.items;
        // 改成枚举类型
        data.forEach((item) => {
            if (item.attrcode === 'valuetype' || item.attrcode === 'fieldtype' || item.attrcode === 'operator') {
                item.itemtype = 'select';
                item.datatype = "203";
                item.options = []
            }
        })
        data.forEach((item) => {
            if(item.attrcode === 'fieldvalue') {
                // item.whichKeyToDisplay = 'auto';
                item.renderStatus = 'editBrowse'
                item.render = (value, record, rowIndex, store) => {
                    return <i>{value.display || value.value}</i>
                }
            }
        })
        //添加操作列
        data.push({
            attrcode: 'opr',  // 
            itemtype: 'customer',
            hyperlinkflag: false,
            label: rsc.language["report-000050"] || '操作',
            textAlign: 'center',
            visible: true,
            fixed: 'right',
            render(index, record) {
                return (
                    <div>
                        <span onClick={() => that.deleteRow(index, record)} style={{ cursor: 'pointer', color: '#0073E1', paddingLeft: '5px' }}>{'删除'}</span>
                    </div>
                )
            }
        });
        return template;
    }
    /**
     * 删除表格行
     */
     deleteRow = async(index, record) => {
         const {props} = this.comp;
         const {rsc: {conTableData, sequence, areaValTotal, language}, editTable, dispatch} = props
         let res = await dispatch({
            type: 'rsc/afterEditAction',
            payload: {
                postData: {
                    deleteFlag: true,
                    expresstion: areaValTotal,
                    deleteData: {
                        model: {rows: [record]}
                    }
                }
            }
         })
         if (res.success) {
            let tableData = deepCopy(conTableData.rows);
            let pk_datadic = record.values.pk_datadic.value;
            let tableData1 = tableData.filter(item => item.values.pk_datadic.value !== pk_datadic)
            let conTableData1 = {rows: tableData1}
            editTable.setTableData('condTable', 
               conTableData1
            );
            toast({
                color: 'success',
                content: language["report-000039"] || '删除成功！'
            })
             this.update({
                areaValTotal: res.data.detailEx,
                conTableData: conTableData1,
             })
         }
     }
     /**
    * 获取左树数据
    */
      getTreeData = async (pk_org) => {
        const {props} = this.comp;
        const { syncTree: { setSyncTreeData, openNodeByPk, setNodeSelected }, dispatch, button, rsc } = props

        let res = await dispatch({
            type: 'rsc/getTreeData',
            payload: {
                postData: {
                    pk_org: pk_org || (rsc.orgVal && rsc.orgVal.refpk) || this.pk_org
                }
            }
        })
        if (res.success) {
            // 左树
            if (res.data.HRStatCondSort.length > 0) {
                let parentNodes = res.data.HRStatCondSort.map(item => {
                    if(item.children.length > 0) return item.refpk
                })
                parentNodes.push('root')
                let root = [{
                    code: 'root',
                    id: 'root',
                    key: 'root',
                    name: rsc.language["report-000049"] || '统计条件分类', // ''统计条件分类'',
                    refname: rsc.language["report-000049"] || '统计条件分类', //''统计条件分类'',
                    refpk: 'root',
                    children: res.data.HRStatCondSort
                }]
                setSyncTreeData('rscTree', root)
                openNodeByPk('rscTree', 'root');
                setNodeSelected('rscTree', 'root')
                this.buttonStatus['onlyTree']()
                this.buttonStatus['treeButtonNoChecked']()
                this.update({
                    parentNodes: parentNodes
                })
            } else{
                setSyncTreeData('rscTree', [{
                    code: 'root',
                    id: 'root',
                    key: 'root',
                    name: rsc.language["report-000049"] || '统计条件分类', // ''统计条件分类'',
                    refname: rsc.language["report-000049"] || '统计条件分类', //''统计条件分类'',
                    refpk: 'root',
                }])
                button.setButtonDisabled({'addNew': true})
                setNodeSelected('rscTree', 'root')
            }
        }
    }
     /**
     * 点击树
     * @param {*} pk 
     * @param {*} item 
     */
      onSelectEve = (refpk, item) => {
        const {props} = this.comp;
        const {rsc, editTable, button} = props;
        if(refpk === 'root') {
            editTable.setTableData(rsc.tableId, {rows: []})
            this.update({
                currentTreePk: refpk,
                allCurrentTreeItem: item
            })
            button.setButtonDisabled({
                'addNew': true,
                'editCf': true,
                'delCf': true,
            })
            this.buttonStatus['onlyTree']()
            return
        }
        this.getTableData(refpk)
        this.update({
            currentTreePk: refpk,
            allCurrentTreeItem: item  // 选择树节点全部得信息
        })
        this.buttonStatus['treeButtonChecked']()
        button.setButtonDisabled({
            'editCf': false,
            'delCf': false,
        })
    }
    /**
     * 获取表格数据
     */
     getTableData = async(refpk) => {
        const {props} = this.comp;
        const {
            editTable: { setTableData },
            rsc, dispatch, button } = props
        let postData = {
            pk_sort: refpk,
            pk_org: rsc.orgVal && rsc.orgVal.refpk || this.pk_org, // 全局和组织,
        }
        let res = await dispatch({
            type: 'rsc/getTableData',
            payload: {
                postData: postData
            }
        })
        if (res.success) {
            // 表格
            if (res.data && res.data.HRDataDictionary && res.data.HRDataDictionary.grid) {
                setTableData(rsc.tableId, res.data.HRDataDictionary.grid)
                // 按钮
                button.setButtonDisabled({
                    delete: false,
                    edit: false,
                    copy: false
                })
                this.buttonStatus['mainTable']()
            } else {
                setTableData(rsc.tableId, {rows: []})
                this.buttonStatus['onlyTree']()
                button.setButtonDisabled({
                    delete: true,
                    edit: true,
                    copy: true
                })
            }
        }
    }
    /**
     * 全查询
     */
    getAllData = async() => {
        const {props} = this.comp;
        const {rsc, dispatch, editTable, button} = props;
        let postData = {
            pk_org: rsc.orgVal && rsc.orgVal.refpk || this.pk_org, // 全局和组织,
            querycondition: {
                logic: 'and',
                conditions: []
            },
            ...rsc.serchCondition,
            queryAreaCode: "query",
            querytype: "tree",
        }
        let res = await dispatch({
            type: 'rsc/getAllData',
            payload: {
                postData
            }
        })
        if (res.success && res.data) {
            // 表格
            if (res.data.HRStatCond) {
                editTable.setTableData(rsc.tableId, res.data.HRStatCond.grid)
                this.buttonStatus['mainTable']()
                 // 按钮
                 button.setButtonDisabled({
                    location: false
                })
            } else {
                editTable.setTableData(rsc.tableId, {rows: []})
                this.buttonStatus['mainTable']()
                button.setButtonDisabled({
                    location: true
                })
            }
        }
    }
    goSearch = async() => {
        let condition = getQueryCondition(this.comp.props, 'query');
        await this.update({
            serchCondition: condition
        })
        this.getAllData()
        this.comp.props.search.openAdvSearch('query', false);
    }
    onHeaderClick = (props, btnCode) => {
        
        if (typeof this.buttonMap[btnCode] === 'function') {
            this.buttonMap[btnCode]();
        }
    }

    /**
     * 按钮操作
     */
     setBtnMap = () => {
        const {props} = this.comp;
        const { rsc } = props;
        this.buttonMap = {
            addNew: this.addNew,
            edit: this.edit,
            delete: this.delete,
            copy: this.copy,
            search: this.search,
            location: this.location,
            refresh: this.refresh
        }
    }

    /**
     * 新增
     */
    addNew = async() => {
        const {props} = this.comp;
        const {rsc, dispatch, form, syncTree: { setSyncTreeData, openNodeByPk }} = props;
        
        let postData = {
            pk_org: rsc.orgVal && rsc.orgVal.refpk || this.pk_org, // 全局和组织
        }
        let res = await dispatch({
            type: 'rsc/addAction',
            payload: {
                postData: postData
            }
        })
       
        if(res.success) {
            this.update({
                addModalVisible: true
            })
            /*设置表单编辑状态*/
            form.setFormStatus('cond', "edit");
            form.setFormItemsValue('cond', {
                'code': {display: res.data.code, value: res.data.code},
                'pk_sort': {display: rsc.allCurrentTreeItem.refname, value: rsc.allCurrentTreeItem.refpk}
            })
            let HRDataDictionary = deepCopy(res.data.HRDataDictionary);
            let parentNodes1 = this.getShowTreeData(HRDataDictionary)
            // let parentNodes1 = HRDataDictionary.map(item => {
            //     if(item.children.length > 0) return item.refpk
            // })
            parentNodes1.push('root')

            let HRroot = [{
                code: 'root',
                id: 'root',
                key: 'root',
                name: rsc.language["report-000051"] || 'HR报表数据字典', // ''HR报表数据字典'',
                refname: rsc.language["report-000051"] || 'HR报表数据字典', //''HR报表数据字典'',
                refpk: 'root',
                children: HRDataDictionary
            }]
            setSyncTreeData('HRTree', HRroot)
            openNodeByPk('HRTree', 'root');
            this.update({
                parentNodes1,
                state: 'ADD'
            })
        }
    }
    /**
     * 修改
     */
     edit = async() => {
        const {props} = this.comp;
        const {rsc, dispatch, form, syncTree: { setSyncTreeData, openNodeByPk }, editTable} = props;
        let tableData = editTable.getCheckedRows(rsc.tableId)
   
         if (tableData.length === 0) {
             toast({
                color: 'warning',
                content: rsc.language["report-000052"] || '请选择需要修改的数据！'
             })
             return;
         }
         if (tableData.length > 1) {
            toast({
               color: 'warning',
               content: rsc.language["report-000053"] || '只支持修改单条数据！'
            })
            return;
        }
        let pk_statcond = tableData[0].data.values.pk_statcond.value;
        let postData = {
            pk_org: rsc.orgVal && rsc.orgVal.refpk || this.pk_org,
            pk_sort: rsc.currentTreePk,
            pk_statcond: pk_statcond
        }
        let res = await dispatch({
            type: 'rsc/editAction',
            payload: {
                postData: postData
            }
        })
       
        if(res.success) {
            this.update({
                addModalVisible: true
            })
            /*设置表单编辑状态*/
            form.setFormStatus('cond', "edit");
            form.setFormItemsValue('cond', {
                'code': {display: res.data.code, value: res.data.code},
                'name': {display: res.data.name, value: res.data.name},
                'pk_sort': {display: rsc.allCurrentTreeItem.refname, value: rsc.allCurrentTreeItem.refpk}
            })
            /*设置表格数据*/
            editTable.setTableData('condTable', res.data.HRStatItem.condTable);
            let HRDataDictionary = deepCopy(res.data.HRDataDictionary);
            let parentNodes1 = this.getShowTreeData(HRDataDictionary)
            parentNodes1.push('root')

            let HRroot = [{
                code: 'root',
                id: 'root',
                key: 'root',
                name: rsc.language["report-000051"] || 'HR报表数据字典', // ''HR报表数据字典'',
                refname: rsc.language["report-000051"] || 'HR报表数据字典', //''HR报表数据字典'',
                refpk: 'root',
                children: HRDataDictionary
            }]
            setSyncTreeData('HRTree', HRroot)
            openNodeByPk('HRTree', 'root');
            this.update({
                parentNodes1,
                state: 'EDIT'
            })
        }
    }
    /**
     * 复制
     */
     copy = async() => {
        const {props} = this.comp;
        const {rsc, dispatch, form, syncTree: { setSyncTreeData, openNodeByPk },editTable} = props;
        let tableData = editTable.getCheckedRows(rsc.tableId)
      
         if (tableData.length === 0) {
             toast({
                color: 'warning',
                content: rsc.language["report-000054"] || '请选择需要复制的数据！'
             })
             return;
         }
         if (tableData.length > 1) {
            toast({
               color: 'warning',
               content: rsc.language["report-000055"] || '只支持复制单条数据！'
            })
            return;
        }
        let pk_statcond = tableData[0].data.values.pk_statcond.value;
    
        let postData = {
            pk_org: rsc.orgVal && rsc.orgVal.refpk || this.pk_org, // 全局和组织
            pk_sort: rsc.currentTreePk,
            pk_statcond: pk_statcond
        }
        let res = await dispatch({
            type: 'rsc/copyAction',
            payload: {
                postData: postData
            }
        })
       
        if(res.success) {
            this.update({
                addModalVisible: true
            })
            /*设置表单编辑状态*/
            form.setFormStatus('cond', "edit");
            form.setFormItemsValue('cond', {
                'code': {display: res.data.code, value: res.data.code},
                'name': {display: res.data.name, value: res.data.name},
                'pk_sort': {display: rsc.allCurrentTreeItem.refname, value: rsc.allCurrentTreeItem.refpk}
            })
            /*设置表格数据*/
            editTable.setTableData('condTable', res.data.HRStatItem.condTable);
            let HRDataDictionary = deepCopy(res.data.HRDataDictionary);
            let parentNodes1 = this.getShowTreeData(HRDataDictionary)
            parentNodes1.push('root')

            let HRroot = [{
                code: 'root',
                id: 'root',
                key: 'root',
                name: rsc.language["report-000051"] || 'HR报表数据字典', // ''HR报表数据字典'',
                refname: rsc.language["report-000051"] || 'HR报表数据字典', //''HR报表数据字典'',
                refpk: 'root',
                children: HRDataDictionary
            }]
            setSyncTreeData('HRTree', HRroot)
            openNodeByPk('HRTree', 'root');
            this.update({
                parentNodes1,
                state: 'COPY'
            })
        }
    }

    /**
     * 删除
     */
    delete = async() => {
        const {props} = this.comp;
        const {rsc, dispatch, editTable} = props;
        let tableData = editTable.getCheckedRows(rsc.tableId)
        let pk_statconds = tableData.map(item => {
             return item.data.values.pk_statcond.value;
         })
      
         if (tableData.length === 0) {
             toast({
                color: 'warning',
                content: rsc.language["report-000038"] || '请选择需要删除的数据！'
             })
             return;
         }
        let postData = {
            pk_org: rsc.orgVal && rsc.orgVal.refpk || this.pk_org, // 全局和组织
            pk_statconds: pk_statconds.join(',')
        }
        let res = await dispatch({
            type: 'rsc/delAction',
            payload: {
                postData: postData
            }
        })
       
        if(res.success) {
            this.getTableData(rsc.currentTreePk)
            toast({
                color: 'success', 
                content: rsc.language["report-000039"] || '删除成功！'
            })
        }
    }
    /**
     * 过滤HR报表数据字典的显示
     */
    getShowTreeData = (HRDataDictionary) => {
        let parentNodes1 = []
        HRDataDictionary.forEach(item => {
            if(item.children.length > 0) {
                let children = item.children.filter(subI => {
                    return !!subI.nodeData.nodeValue.show_control
                })
                item.children = children;
                parentNodes1.push(item.refpk)
            }
        })
        return parentNodes1
    } 
    /**
     * 刷新
     */
     refresh = () => {
        const { editTable, rsc } = this.comp.props
        let currentTreePk = rsc.currentTreePk;
        if(currentTreePk && currentTreePk !== 'root') {
            this.getTableData(currentTreePk)
        } else if(!currentTreePk){
            this.getTreeData()
        }
     }
    /**
     * 查询
     */
    search = () => {
        const {props} = this.comp;
        props.search.openAdvSearch('query', true);
        props.syncTree.setNodeDisable('rscTree', true)
        props.button.setButtonDisabled({'location': false})
    }

    /**
     * 定位
     */
    location = () => {
        const {props} = this.comp;
        const {button, editTable, rsc,syncTree} = props;

        let checkedData = editTable.getCheckedRows(rsc.tableId)
        if (checkedData.length === 0){
            toast({
                color: 'warning',
                content: rsc.language["report-000056"] || '请选择需要定位的数据！'
            })
        }
        let pk = checkedData[0].data.values.pk_sort.value;
        syncTree.setNodeSelected('rscTree', pk)
        this.getTableData(pk)
        props.syncTree.setNodeDisable('rscTree', false)
        button.setButtonDisabled({'location': true})
    }

  /**
     * 按钮
     */
    buttonSetting = () => {
        const { button: { setButtonDisabled } } = this.comp.props;
        this.buttonStatus = {
            'onlyTree': () => {
                setButtonDisabled({
                    'addNew': true,
                    'edit': true,
                    'delete': true,
                    'copy': true,
                    'location': true,
                    'search': false,
                    'refresh': false
                });
            },
            'mainTable': () => {
                setButtonDisabled({
                    'addNew': false,
                    'edit': false,
                    'delete': false,
                    'copy': false,
                    'location': true,
                    'search': false,
                    'refresh': false
                });
            },
            'treeButtonNoChecked': () => {
                setButtonDisabled({
                    'addCf': false,
                    'editCf': true,
                    'delCf': true,
                    'refreshCf': false
                })
            },
            'treeButtonChecked': () => {
                setButtonDisabled({
                    'addCf': false,
                    'editCf': false,
                    'delCf': false,
                    'refreshCf': false
                })
            },
            'treeButtonAllDisabled': () => {
                setButtonDisabled({
                    'addCf': true,
                    'editCf': true,
                    'delCf': true,
                    'refreshCf': true
                })
            }
        }
    }
    subscribe = () => {
        this.pubSub.subscribe('getTableData', (...args) => {
            this.getTableData(...args)
        });
        this.pubSub.subscribe('getTreeData', (...args) => {
            this.getTreeData(...args)
        });
    }
    willUnMount() {
        this.buttonStatus = null;
        this.pubSub.unSubscribe('getTableData');
        this.pubSub.unSubscribe('getTreeData');

    }
}