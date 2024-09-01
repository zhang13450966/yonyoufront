import { base, toast, promptBox, getBusinessInfo } from 'nc-lightapp-front';
import CommonAction from '../../../actions/commonAction';
import deepCopy from 'src/hrpub/common/utils/deep-copy';
const { NCModal } = base;
export default class AddAction extends CommonAction {

    constructor(comp) {
        super();
        this.comp = comp;
        this.props = this.comp.props;
        this.dispatch = this.props.dispatch;
        this.state = {
            checked: false
        }
        this.origin = true
        this.originData = ''
        this.pk_org = 'GLOBLE00000000000000'; // 全局的
        if(this.comp.props.nodeType === 'group') {
            this.pk_org = getBusinessInfo() && getBusinessInfo().groupId || ''
        }
    }


    changeCheck = async(v) => {
        const { props } = this.comp;
        const { rsc, dispatch, editTable, form } = props;
        
        if (v === true) {
            let formData = form.getAllFormValue('cond');
            let code = formData.rows[0].values.code.value;
            let name = formData.rows[0].values.name.value;
            let pk_sort = formData.rows[0].values.pk_sort.value || '1001A91000000000YH6J'
            let postData = {
                saveDatas: {
                    model: rsc.conTableData
                },
                expresstion: rsc.areaValTotal,
                code: code,
                name: name,
                state: rsc.state,
                pk_sort: pk_sort,
                pk_report: '',
                pk_statcond: rsc.currentTreePk   //rsc.state === 'ADD' ? '' : '',
            }
          
            try{
                let res = await dispatch({
                    type: 'rsc/detailAction',
                    payload: {
                        postData
                    }
                })
                if (res.success) {
                    let areaVal = rsc.areaValTotal
                    this.update({
                        detailChecked: v,
                        saveAreaValue: areaVal,
                        areaValTotal: res.data.text,
                        readOnly: true
                    })
                } 
            }catch(e){
                console.log(e.message)
                this.update({
                    detailChecked: false,
                    saveAreaValue: '',
                    readOnly: false
                })
            }
            
        } else {
            let areaVal = rsc.saveAreaValue
            let areaValTotal = rsc.areaValTotal
            this.update({
                detailChecked: v,
                saveAreaValue: '',
                areaValTotal: areaVal? areaVal : areaValTotal,
                readOnly: false
            })
        }
    }

    onSelectEve = async (pk, item) => {
        const { props } = this.comp;
        const { rsc, dispatch, editTable } = props;
        if(rsc.parentNodes1.includes(pk)) {
            return;
        }
        let res = await dispatch({
            type: 'rsc/afterEditAction',
            payload: {
                postData: {
                    iufo_hr_datadic: item.nodeData.nodeValue.pk_datadic
                }
            }
        })
        if (res.success && res.data) {
            console.log(res.data)
            let conTableData = deepCopy(rsc.conTableData);
            let length = 0;
            let len = conTableData.rows.length
            console.log(len)
            if (len > 0) {
                length = conTableData.rows[len - 1].values.sequence.value
            }
            let sequence = length + 1;
            let tableData = {
                values: {
                    'fieldname': { display: item.refname, value: item.refname },
                    'fieldtype': { display: res.data['fieldType'].name, value: res.data['fieldType'].value },
                    'operator': { display: res.data['operator'].name, value: res.data['operator'].value },
                    'valuetype': { display: res.data['valueType'].name, value: res.data['valueType'].value },
                    'fieldvalue': {display: '', value: ''},
                    'pk_datadic': { value: item.nodeData.nodeValue.pk_datadic },
                    'sequence': { value: sequence, display: sequence },
                    'datatype1': {value: res.data.dataValue && res.data.dataValue.dataType || ''}
                }
            };
            conTableData.rows.push(tableData)
            editTable.setTableData('condTable', conTableData)
            editTable.setStatus('condTable', 'edit');
            this.update({
                pk_datadic: item.nodeData.nodeValue.pk_datadic,
                conTableData: conTableData
            })
            // if (res.data.dataValue) {
            //     let dataType = res.data.dataValue.dataType;
            //     let itemCond = res.data.dataValue.refpath || ''
            //     // moduleId, key, itemCond, itemtype
            //     this.setTableItemType('condTable', 'fieldvalue', itemCond, dataType)
            // }
            let areaValTotal = rsc.areaValTotal;
            let len1 = areaValTotal.length;
            if (conTableData.rows.length === 1) {
                areaValTotal = '1'
            } else if(areaValTotal.substring(len1 - 3)==='AND' || areaValTotal.substring(len1 - 2)==='OR'
            || areaValTotal.substring(len1 - 1)==='('
            ){
                areaValTotal = areaValTotal + sequence
            } else {
                areaValTotal = areaValTotal + 'AND' + sequence
            }
            this.update({
                areaValTotal,
                // sequence
            })

        }
    }
    
    /**
     * 表单编辑前
     */
    onFormBeforeEvent = (props, moduleId, key, value, index) => {
        let that = this;
        if(key === 'pk_sort') {
            let meta = this.comp.props.meta.getMeta()
            meta[moduleId].items.forEach((item) => {
            if (item.attrcode === key) {
                    item.queryCondition = {
                        pk_org: props.rsc.orgVal && props.rsc.orgVal.refpk || that.pk_org
                    }
                }
            })
            props.meta.setMeta(meta)
        }
        this.update({
            test: ''
        })
        return true;
    }
    /**
     * 表单编辑后
     * @returns 
     */
     onFormAfterEvent = (props, moduleId, key, value, oldValue) => {
        // if(key === 'pk_sort') {

        // }
     }
    /**
     * 表格编辑前事件
     */
    tableBeforeEvent = async (props, moduleId, item, index, value, record) => {
        const { dispatch, rsc } = this.comp.props;
        // if(item.attrcode !== 'fieldvalue') {
            let column;
            switch (item.attrcode) {
                case 'fieldtype':
                    column = 3;
                    break;
                case 'operator':
                    column = 4;
                    break;
                case 'valuetype':
                    column = 5;
                    break;
                case 'fieldvalue':
                    column = 6;
                    break;
                default:
                    break;
            }
            let postData = {
                pk_item: record.values.pk_item && record.values.pk_item.value || '',
                iufo_hr_datadic: record.values.pk_datadic.value || '',
                column: column,
                fieldname: record.values.fieldname.value,
                fieldtype: record.values.fieldtype.value,
                operator: record.values.operator.value,
                valueType: record.values.valuetype.value,
            }
            let res = await dispatch({
                type: 'rsc/beforeEditAction',
                payload: {
                    postData: postData
                }
            })
            if (res.success && res.data) {
                let itemCond = res.data;
                let itemtype = 'select'
                if (item.attrcode !== 'fieldvalue') {
                    itemCond.forEach((item) => {
                        item['display'] = item['name']
                        delete item['name']
                    })
                } else {
                    itemtype = res.data.dataType;
                    itemCond = res.data.refpath || res.data.dataValue || res.data.data
                    if (Array.isArray(itemCond)) {
                        itemCond.forEach((item) => {
                            item['display'] = item['name']
                            delete item['name']
                        })
                    }
                }
               
                this.setTableItemType('condTable', item.attrcode, itemCond, itemtype)
                // 更新一哈 不然不更
                this.update({
                    test: ''
                })
            }
        // }
       
        return true;
    }
    /**
     * 表格编辑后
     */
    tableAfterEventFn = async (props, moduleId, key, value, changedrows, index, record) => {
        const { dispatch, rsc, editTable } = this.comp.props;
        console.log(key, value)

        if (key === 'operator' || key === 'valuetype') {
            let column = key === 'operator'? 4 : 5;
            let postData = {
                pk_item: record.values.pk_item && record.values.pk_item.value || '',
                iufo_hr_datadic: record.values.pk_datadic.value || '',
                column: column,
                operator: record.values.operator.value,
                valueType: record.values.valuetype.value,
                expresstion: rsc.areaValTotal
            }
            let res = await dispatch({
                type: 'rsc/afterEditAction',
                payload: {
                    postData: postData
                }
            })
            if (res.success && res.data) {
                editTable.setValByKeyAndIndex(moduleId, 
                   index,
                   'fieldvalue', 
                   {'display': '', 'value': ''}, 
                );
                if(res.data.dataValue) {
                    let itemtype = res.data.dataValue.dataType;
                    let itemCond = res.data.dataValue.dataValue;
                    let data = []
                    if (res.data.dataValue.data) {
                        let data1 = res.data.dataValue.data;
                        data1.forEach(item => {
                            item['display'] = item.name
                            delete item['name']
                        })
                        data = data1;
                    }
                    this.setTableItemType('condTable', 'fieldvalue', itemCond, itemtype, data)
                }

            }
        }
        // if(key === 'fieldvalue' && typeof value!=='object') {
        //     editTable.setValByKeyAndIndex(moduleId,index, key, {value: value, display: value})
        // }

    }
    /**
     * 修改字段的类型
     * @param {*} moduleId 
     * @param {*} key 
     * @param {*} itemCond 修改的类型的 参数或者值
     * @param {*} itemtype 字段类型
     * @param {*} data 如果有这个参数  指日期表达式类型
     */
    setTableItemType = (moduleId, key, itemCond, itemtype, data) => {
        const { props } = this.comp
        const { rsc, modal } = props
        let meta = props.meta.getMeta()
        let that = this;
        meta[moduleId].items.forEach((item) => {
            if (item.attrcode === key) {
                if (itemtype === 'REF') {
                    item.datatype = 204
                    item.itemtype = 'refer'
                    item.refcode = itemCond,
                    item.isCacheable = false
                    item.fieldDisplayed = 'refname'
                    item.queryCondition = function () {
                        return {
                            pk_org: rsc.orgVal && rsc.orgVal.refpk || that.pk_org
                        }
                    }
                } else if (itemtype === 'select' || itemtype === 'Date' && Array.isArray(itemCond)) {
                    item.itemtype = 'select';
                    item.datatype = "203";
                    item.options = itemCond
                } else if(itemtype === 'Date'){
                    item.datatype = 34
                    item.itemtype = 'datePickerNoTimeZone'//
                    item.fieldDisplayed = 'refname'
                } else {
                    item.datatype = 1
                    item.itemtype = 'input'
                    delete item.refcode
                    delete item.queryCondition
                }
            }
        })
        this.comp.props.meta.setMeta(meta)
    }
    
    /**
     * 保存
     */
    makeSure = async(type) => {
        const { props, action } = this.comp;
        const { rsc, dispatch, editTable, form } = props;
        /*检验是否必填*/
        if (!form.isCheckNow('cond')) return;
        let formData = form.getAllFormValue('cond');
        let code = formData.rows[0].values.code.value;
        let name = formData.rows[0].values.name.value;
        let pk_sort = formData.rows[0].values.pk_sort.value || '1001A91000000000YH6J'
        let postData = {
            saveDatas: {
                model: rsc.conTableData
            },
            expresstion: rsc.saveAreaValue? rsc.saveAreaValue: rsc.areaValTotal,
            code: code,
            name: name,
            state: rsc.state,
            pk_sort: pk_sort,
            pk_report: '',
            pk_statcond: rsc.currentTreePk //rsc.state === 'ADD' ? '' : '',
        }
        let res = await dispatch({
            type: 'rsc/saveAction',
            payload: {
                postData
            }
        })
        if (res.success) {
            toast({
                color: 'success', 
                content: rsc.language["report-000035"] || '保存成功！'
            })
            if(type === 'go') {
                editTable.setTableData('condTable', 
                   {rows: []}
                );
              
                form.setFormItemsValue('cond', {'name':{display: '', value: ''}})
                this.update({
                    areaValTotal: '',
                    pk_datadic: '', // 弹窗左侧的树
                    conTableData: {
                        rows: []
                    },
                    detailChecked: false,
                    sqlContrl: '',
                    saveAreaValue: '', // 显示详情以后点击不显示 显示的值 保存显示之前的
                    sequence: 0, //序号控制
                    currentPosition: null, // 光标位置
                    state: 'ADD', // 增加 修改 复制
                    readOnly: false, // 文本只可读
                })
            }else {
                this.cancel();
                this.pubSub.publish('getTableData', rsc.currentTreePk);
            }
        }
    }

    cancel = () => {
        const {props} = this.comp;
        props.editTable.setTableData('condTable', {rows: []})
        props.form.EmptyAllFormValue('cond')
        this.update({
            addModalVisible: false,
            parentNodes1: [],
            pk_datadic: '', // 弹窗左侧的树
            conTableData: {
                rows: []
            }, //弹窗右侧树数据
            detailChecked: false,
            sqlContrl: '',
            saveAreaValue: '',
            areaValTotal: '',
            textareaRef: null,
            sequence: 0, //序号控制
            currentPosition: null, // 光标位置
            readOnly: false, // 文本只可读
        })
    }
    /**
     * 操作
     * @returns 
     */
    oper = (type) => {
        const { props } = this.comp;
        const { rsc } = props;
        let inputStr='';
        if (type === 'left') {
            inputStr = '('
        } else if (type === 'right') {
            inputStr = ')'
        } else {
            inputStr = type
        }
        this.addStrToVal(inputStr)
        this.update({
            sqlContrl: inputStr
        })
    }
    addStrToVal = async(val) => {
        const { props } = this.comp;
        const { rsc } = props;
        let currentArea = rsc.textareaRef
        let currentPos = currentArea.selectionStart
        let pos = rsc.currentPosition ? rsc.currentPosition : 0
        // let nowVal = rsc.areaValTotal + ''
        let str = this.insertStr(rsc.areaValTotal, pos, val)
        await this.update({
            sqlContrl: val, 
            areaValTotal: str
        })
        this.setCursorPosition(currentArea, currentPos + val.length)
        this.update({
            sqlContrl: '',
        })
    }
   
    insertStr = (soure, start, newStr) => {
        if (soure) {
            return soure.slice(0, start) + newStr + soure.slice(start)
        } else {
            return newStr
        }
    }
    /**
   *  设置输入域(input/textarea)光标的位置
   * @param elem
   * @param index
   */
    setCursorPosition = (elem, index) => {
        var val = elem.value;
        var len = val.length;
        // 超过文本长度直接返回
        if (len < index) return;
        setTimeout(function () {
            elem.focus();
            if (elem.setSelectionRange) {
                // 标准浏览器
                elem.setSelectionRange(index, index);
            } else {
                // IE9- 这个里面有问题在看
                var range = elem.createTextRange();
                range.moveStart('character', -len);
                range.moveEnd('character', -len);
                range.moveStart('character', index);
                range.moveEnd('character', 0);
                range.select();
            }
        }, 0);
    };
    onChange = () => {
        const { props } = this.comp;
        const { rsc } = props;
        let currentArea = rsc.textareaRef
        let textArea = currentArea.value;
        let flag = false
        if ((textArea && textArea.replace(/[\s\r\t]*/g, '')) !== (this.originData && this.originData.replace(/[\s\r\t]*/g, ''))) {
            flag = true
        }
        this.update({
            sqlContrl: '',
        })
    }
    changeData = (key, value) => {
        this.update({
            [key]: value
        })
    }
    onBlur = () => {
        const { props } = this.comp;
        const { rsc } = props;
        let currentArea = rsc.textareaRef
        let currentPos = currentArea.selectionStart
        this.update({
            currentPosition: currentPos
        })
    }
}
