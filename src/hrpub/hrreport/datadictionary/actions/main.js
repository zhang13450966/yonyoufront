import { base, toast, promptBox } from 'nc-lightapp-front';
import CommonAction from './commonAction';
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
export default class MainAction extends CommonAction {

    constructor(comp) {
        super();
        this.comp = comp;
        this.props = this.comp.props
        this.dispatch = this.props.dispatch

        if (comp.props.use) {
            comp.props.use.editTable('grid')
        }
        this.appConfig = getAppPageConfig();
        // this.appConfig = {
        //     appcode: '18209010',
        //     pagecode: '18209010p'
        // }
    }
    didMount = () => {
        // window.location.hash = '#ifr?page=c=18209010&p=18209010p'
        let callback = (json, status, inlt) => {
            if (status) {
                this.update({
                    language: json
                })
            }
        }
        this.setBtnMap()
        this.buttonSetting()
        // let height = document.documentElement.clientHeight - 100;
        this.props.MultiInit.getMultiLang({ moduleId: 'hr_report', domainName: 'hrpub', callback })
        this.getTemplateData()
        this.getTreeData()
        // this.initTableDate()
        //     this.props.setState({pageHeight:height})
    }

    getTemplateData = () => {
        const { createUIDom, meta, button } = this.props;
        createUIDom(this.appConfig, (data = {}) => {
            meta.setMeta(data.template || {});
            button.setButtons(data.button || {});
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
        const { dd } = this.props;
        this.buttonMap = {
            'setting': this.setting,
            'refresh': this.refresh,
            'save': this.saveSettingData,
            'cancel': this.cancel
        }
    }
    /**
     * 获取左树数据
     */
    getTreeData = async () => {
        const {
            syncTree: { setSyncTreeData, openNodeByPk }, dd: {language}} = this.props

        let res = await this.dispatch({
            type: 'dd/getTreeData',
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
                let root = [{
                    code: 'root',
                    id: 'root',
                    key: 'root',
                    name: language["report-000034"] || 'HR信息集', // ''HR信息集'',
                    refname: language["report-000034"] || 'HR信息集', //''HR信息集'',
                    refpk: 'root',
                    children: res.data.HRDataDicSort
                }]
                setSyncTreeData('ddTree', root)
                openNodeByPk('ddTree', 'root');
                this.buttonStatus['onlyTree']()
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
        const {dd, editTable} = props;
        if(refpk === 'root' || dd.parentNodes.includes(refpk)) {
            editTable.setTableData(dd.tableId, {rows: []})
            this.buttonStatus['onlyTree']()
            return
        }
        this.getTableData(refpk)
        this.dispatch({
            type: 'dd/update',
            payload: {
                currentTreePk: refpk
            }
        })
    }
    /**
     * 获取表格数据
     */
    getTableData = async(refpk) => {
        const {
            editTable: { setTableData },
            dd } = this.props
        let postData = {
            refpk: refpk
        }
        let res = await this.dispatch({
            type: 'dd/getTableData',
            payload: {
                postData: postData
            }
        })
        if (res.success && res.data) {
            // 表格
            if (res.data.HRDataDictionary) {
                setTableData(dd.tableId, res.data.HRDataDictionary.grid)
                // 按钮
                this.buttonStatus['mainTable']()
            } else {
                setTableData(dd.tableId, {rows: []})
                this.buttonStatus['onlyTree']()
            }
        }
    }
    /**
     * 设置
     */
    setting = () => {
        const { editTable, dd } = this.props
        // 单独设置 是否显示这列不好使
        editTable.setStatus(dd.tableId, 'edit')
        editTable.setColEditableByKey(dd.tableId, ['code', 'name'], true)
        this.buttonStatus['settingStatus']()
    }
    /**
     * 保存
     */
    saveSettingData = async() => {
        const { editTable, dd } = this.props
   
        let tableDate = editTable.getAllData(dd.tableId)
        let postData = {
            saveDatas: {
                model: tableDate
            }
        }
        let res = await this.dispatch({
            type: 'dd/saveSettingData',
            payload: {
                postData: postData
            }
        })
        if (res.success) {
            editTable.setStatus(dd.tableId, 'browse')
            editTable.setColEditableByKey(dd.tableId, 'show_control', false)
            this.getTableData(this.comp.props.dd.currentTreePk)
            toast({
                color: 'success', 
                content: dd.language["report-000035"] || '保存成功！'
            })
        }
        this.buttonStatus['mainTable']()
    }
    /**
     * 刷新
     */
     refresh = () => {
        const { editTable, dd } = this.props
        let currentTreePk = this.comp.props.dd.currentTreePk;
        if(currentTreePk && !dd.parentNodes.includes(currentTreePk) && currentTreePk !== 'root') {
            this.getTableData(currentTreePk)
        } else {
            this.getTreeData()
        }
     }
    /**
     * 取消
     */
    cancel = () => {
        const {editTable, dd} = this.comp.props;
        let that = this;
        promptBox({
            color: "warning",
            title: dd.language["report-000036"] ||'确认取消', /* 国际化处理： 提示*/
            content: dd.language["report-000037"] ||'是否确认要取消？', /* 国际化处理： 是否确认要取消？*/
            beSureBtnClick:  () => {
                that.getTableData(dd.currentTreePk)
                editTable.setStatus(dd.tableId, 'browse')
                editTable.setColEditableByKey(dd.tableId, 'show_control', false)
                that.buttonStatus['mainTable']()
            }
        })
        
    }
    /**
     * 按钮
     */
    buttonSetting = () => {
        const { button: { setButtonDisabled, setButtonVisible } } = this.props;
        this.buttonStatus = {
            'onlyTree': () => {
                setButtonDisabled({
                    'setting': true,
                    'refresh': false
                });
                setButtonVisible({
                    'setting': true,
                    'refresh': true,
                    'save': false,
                    'cancel': false
                })
            },
            'mainTable': () => {
                setButtonDisabled({
                    'setting': false,
                    'refresh': false
                });
                setButtonVisible({
                    'setting': true,
                    'refresh': true,
                    'save': false,
                    'cancel': false
                })
            },
            'settingStatus': () => {
                setButtonVisible({
                    'setting': false,
                    'refresh': false,
                    'save': true,
                    'cancel': true
                })
            }
        }
    }
}