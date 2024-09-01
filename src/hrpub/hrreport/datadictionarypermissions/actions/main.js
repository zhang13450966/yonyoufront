import { base, toast, promptBox } from 'nc-lightapp-front';
import CommonAction from './commonAction';
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
export default class Mainction extends CommonAction {

    constructor(comp) {
        super();
        this.comp = comp;

        if (comp.props.use) {
            comp.props.use.form('org')
            comp.props.use.editTable('grid')
        }
        this.appConfig = getAppPageConfig();
        // this.appConfig = {
        //     appcode: '18209020',
        //     pagecode: '18209020p'
        // }
    }

    didMount = () => {
        const {props} = this.comp;
        // // window.location.hash = '#ifr?page=c=18209020&p=18209020p'
        let callback = (json, status, inlt) => {
            if (status) {
                this.update({
                    language: json
                })
            }
        }
        // let height = document.documentElement.clientHeight - 100;
        props.MultiInit.getMultiLang({ moduleId: 'hr_report', domainName: 'hrpub', callback })
        this.getTemplateData()
        this.getTreeData()
        // this.initTableDate()
        // this.props.setState({pageHeight:height})
        this.subscribe()
    }
    didAllInstance = () => {
        this.setBtnMap();
    }
    getTemplateData = () => {
        const {props} = this.comp;
        const { createUIDom, meta, button } = props;
        createUIDom(this.appConfig, (data = {}) => {
            meta.setMeta(data.template || {});
            button.setButtons(data.button || {});
            button.setButtonDisabled({ //初始化按钮
                delete: true
            })
        });
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
        const { ddp } = props;
        this.buttonMap = {
            addNew: this.addNew,
            delete: this.delete,
            refresh: this.refresh
        }
    }
    /**
    * 获取左树数据
    */
    getTreeData = async () => {
        const {props} = this.comp;
        const { syncTree: { setSyncTreeData, openNodeByPk }, dispatch, ddp } = props

        let res = await dispatch({
            type: 'ddp/getTreeData',
            payload: {
                postData: {}
            }
        })
        if (res.success) {
            // 左树
            if (res.data.HRDataDicSort) {
                let parentNodes = res.data.HRDataDicSort.map(item => {
                    if(item.children.length > 0) return item.refpk
                })
                parentNodes.push('root')
                let root = [{
                    code: 'root',
                    id: 'root',
                    key: 'root',
                    name: ddp.language["report-000034"] || 'HR信息集', // ''HR信息集'',
                    refname: ddp.language["report-000034"] || 'HR信息集', //''HR信息集'',
                    refpk: 'root',
                    children: res.data.HRDataDicSort
                }]
                setSyncTreeData('ddpTree', root)
                openNodeByPk('ddpTree', 'root');
                this.update({
                    parentNodes: parentNodes
                })
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
        const {ddp, editTable} = props;
        if(ddp.parentNodes.includes(refpk)) {
            editTable.setTableData(ddp.tableId, {rows: []})
            return
        }
        this.getTableData(refpk)
        this.update({
            currentTreePk: refpk
        })
    }
    /**
     * 获取表格数据
     */
     getTableData = async(refpk) => {
        const {props} = this.comp;
        const {
            editTable: { setTableData },
            ddp, dispatch, button } = props
        let postData = {
            refpk: refpk
        }
        let res = await dispatch({
            type: 'ddp/getTableData',
            payload: {
                postData: postData
            }
        })
        if (res.success && res.data) {
            // 表格
            if (res.data.HRDataDictionary) {
                setTableData(ddp.tableId, res.data.HRDataDictionary.grid)
                // 按钮
                button.setButtonDisabled({
                    delete: false
                })
            } else {
                setTableData(ddp.tableId, {rows: []})
                button.setButtonDisabled({
                    delete: true
                })
            }
        }
    }
    /**
     * 新增
     */
    addNew = async() => {
        const {props, action} = this.comp;
        await action.aa.getAddTreeData()
        this.update({
            activeKey: 'role'
        })
    }

   
    /**
     * 删除
     */
     delete = async() => {
        const {props} = this.comp;
         const {editTable, ddp, dispatch} = props;
         let tableData = editTable.getCheckedRows(ddp.tableId)
         let pk_datadicpowers = tableData.map(item => {
             return item.data.values.pk_datadicpower.value;
         })
      
         if (tableData.length === 0) {
             toast({
                color: 'warning',
                content: ddp.language["请选择需要删除的数据！"] || '请选择需要删除的数据！'
             })
             return;
         }
         let postData = {
            pk_datadicpowers: pk_datadicpowers.join(',')
         }
         let res = await dispatch({
             type: 'ddp/delAction',
             payload: {
                postData: postData
             }
         })
         if (res.success) {
            this.refresh()
            toast({
                color: 'success', 
                content: ddp.language["report-000039"] || '删除成功！'
            })
         }
     }
    /**
     * 刷新
     */
     refresh = () => {
        const {props} = this.comp;
        const {ddp} = props;
        let currentTreePk = this.comp.props.ddp.currentTreePk;
        if(currentTreePk && !ddp.parentNodes.includes(currentTreePk) && currentTreePk !== 'root') {
            this.getTableData(currentTreePk)
        } else {
            this.getTreeData()
        }
     }
     subscribe = () => {
        const { comp: { action }, pubSub } = this;
        this.pubSub.subscribe('refresh', (...args) => {
            this.refresh(...args)
        });
    }

    willUnMount = () => {
        this.pubSub.unSubscribe('refresh');

    }
}