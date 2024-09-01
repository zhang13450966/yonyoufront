import { toast, promptBox } from 'nc-lightapp-front'
export default class HeaderAction {
    constructor(comp) {
        this.comp = comp

    }

    orgChange = async (value) => {
        const { props, action } = this.comp
        const { dispatch, editTable, main } = props
        await dispatch({
            type: 'main/update',
            payload: {
                orgValue: value
            }
        })
        try {
            if (value.refpk) {
                action.pubAct.getTreeData()
            } else {
                dispatch({
                    type: 'main/update',
                    payload: {
                        treeData: [],
                        mustEntryFlag: false,
                        isneedfile: false
                    }
                })
                editTable.setTableData('psnclinfoset' + main.selectedIndex, { rows: [] })
            }
            action.pubAct.initButton()
        } catch (e) {
            console.log(e)
        }

    }

    psnclChange = async (value) => {
        const { props, action } = this.comp
        const { dispatch, main, editTable } = props
        await dispatch({
            type: 'main/update',
            payload: {
                psnclValue: value.refpk,
                psnclName: value.refname
            }
        })
        try {
            if (value.refpk) {
                action.pubAct.getTableData()
            } else {
                dispatch({
                    type: 'main/update',
                    payload: {
                        treeData: [],
                        mustEntryFlag: false,
                        isneedfile: false
                    }
                })
                editTable.setTableData('psnclinfoset' + main.selectedIndex, { rows: [] })
            }
            action.pubAct.initButton()
        } catch (e) {
            console.log(e)
        }
    }

    checkChange = (value) => {
        const { props } = this.comp
        const { form, dispatch } = props
        dispatch({
            type: 'main/update',
            payload: {
                checkValue: value
            }
        })
        form.setFormItemsValue('psnclrule', { 'inheritflag': { value: value } })
    }

    onBtnClick = (props, btn) => {
        switch (btn) {
            case 'Edit':
                this.editAction()
                break;
            case 'Copy':
                this.copyAction()
                break;
            case 'Refresh':
                this.refreshAction()
                break;
            case 'Save':
                this.saveCheckAction()
                break;
            case 'Cancel':
                this.cancelAction()
                break;
            default:
                break;
        }

    }

    editAction = async () => {
        const { props, action } = this.comp
        const { main, dispatch, editTable, form } = props
        action.pubAct.modifyMeta('edit')
        form.setFormStatus('psnclrule', 'edit')
        //设置表格行的编辑性
        this.setTableEditOfIndex()
        //如果名称都不显示时 自己必录不可选
        let tableName = 'psnclinfoset' + main.selectedIndex
        editTable.setStatus(tableName, 'edit')
        let number = editTable.getNumberOfRows(tableName)
        let mustCheckDisable = true
        let needCheckDisable = true
        for (let i = 0; i < number; i++) {
            let usedflag = editTable.getValByKeyAndIndex(tableName, i, 'usedflag').value
            if (usedflag) {
                mustCheckDisable = false
                needCheckDisable = false
                break
            }
        }
        await dispatch({
            type: 'main/update',
            payload: {
                status: 'edit',
                checkDisable: false,
                mustCheckDisable: mustCheckDisable,
                needCheckDisable: needCheckDisable
            }
        })
        try {

            action.pubAct.initButton()
        } catch (e) {
            console.log(e)
        }

    }

    copyAction = async () => {
        const { props } = this.comp
        const { main, dispatch } = props
        //复制之前进行校验
        dispatch({
            type: 'main/validateCopy',
            payload: {
                pk_org: main.orgValue.refpk,
                pk_psncl: main.psnclValue
            }
        }).then((res) => {
            if (res.data) {
                if( res.data.code === '1' ){
                    dispatch({
                        type: 'main/update',
                        payload: {
                            modalShow: true,
                            modalOrgValue: null
                        }
                    })
                }else{
                    !!res.data.msg && toast({color: 'warning', content: `${res.data.msg}`});
                }
            }
        })
    }


    getSaveData = () => {
        const { props } = this.comp
        const { main, editTable, dispatch, form } = props
        let tableInfo = main.tableInfo
        let tableData = JSON.parse(JSON.stringify(main.tableData))
        let formData = form.getAllFormValue('psnclrule')
        let singleTableData = editTable.getAllRows('psnclinfoset' + main.selectedIndex)
        tableData[main.selectedKeys].psnclinfoset.rows = singleTableData
        let data = {
            psnclinfoitems: tableData,
            psnclinfosets: tableInfo,
            psnclrule: formData,
            pk_org: main.orgValue.refpk,
            tree_node_id: main.psnclValue
        }
        return data
    }

    saveCheckAction = () => {
        const { props } = this.comp
        const { dispatch, main } = props
        let data = this.getSaveData()
        dispatch({
            type: 'main/saveCheck',
            payload: JSON.stringify(data)
        }).then((res) => {
            let msg = res.data.confirmMsg
            msg = msg.replace(/\n/g,"<br/>")
            if (msg === "") {
                this.saveAction(Object.assign(data, { 'isallsubinherit': main.mustEntryFlag ? 'Y' : 'N', 'isallneedfile': main.isneedfile? 'Y' : 'N' }))
            } else {
                dispatch({
                    type: 'main/update',
                    payload: {
                        promptModalShow: true,
                        promptInfo: msg
                    }
                })
            }
        })
    }

    saveAction = (data) => {
        const { props, action } = this.comp
        const { dispatch, main,editTable } = props
        dispatch({
            type: 'main/saveData',
            payload: data
        }).then(async (res) => {
            if (res.data) {
                action.pubAct.getTableData()
                action.pubAct.modifyMeta('browse')
                let tableName = 'psnclinfoset' + main.selectedIndex
                editTable.setStatus(tableName, 'browse')
                await dispatch({
                    type: 'main/update',
                    payload: {
                        promptModalShow: false,
                        status: 'browse',
                        checkDisable: true
                    }
                })
                action.pubAct.initButton()
            }
        })
    }

    cancelAction = () => {
        const { props, action } = this.comp
        const { dispatch, main,editTable } = props
        promptBox({
            color: 'warning',
            title: main.json['hrpub-000089'],
            content: main.json['hrpub-000151'],
            beSureBtnClick: async () => {
                action.pubAct.modifyMeta('browse')
                let tableName = 'psnclinfoset' + main.selectedIndex
                editTable.setStatus(tableName, 'browse')
                await dispatch({
                    type: 'main/update',
                    payload: {
                        status: 'browse',
                        checkDisable: true
                    }
                })
                try {
                    action.pubAct.getTreeData()
                    action.pubAct.initButton()
                } catch (e) {
                    console.log(e)
                }
            }
        })

    }

    refreshAction = () => {
        const { action, props } = this.comp
        action.pubAct.getTreeData()
    }

    backAction = () => {
        const { props, action } = this.comp
        const { dispatch, main } = props
        promptBox({
            color: 'warning',
            title: main.json['hrpub-000089'],
            content: main.json['hrpub-000151'],
            beSureBtnClick: async () => {
                action.pubAct.modifyMeta('browse')
                await dispatch({
                    type: 'main/update',
                    payload: {
                        status: 'browse',
                        checkDisable: true
                    }
                })
                try {
                    action.pubAct.getTreeData()
                    action.pubAct.initButton()
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }


    setTableEditOfIndex = () => {
        const { props } = this.comp
        const { editTable, main, form } = props
        //如果是否继承上级人员类别的信息配置被勾选中时，则整张表格不可编辑
        //或者如果是系统项 则系统项行不可编辑
        let tableName = 'psnclinfoset' + main.selectedIndex
        editTable.setStatus(tableName, 'edit')
        let number = editTable.getNumberOfRows(tableName)
        let inheritflag = form.getFormItemsValue('psnclrule', 'inheritflag').value
        for (let i = 0; i < number; i++) {
            if (inheritflag) {
                editTable.setEditableRowByIndex(tableName, i, false)
            } else {
                let metadata = editTable.getValByKeyAndIndex(tableName, i, 'metadata').value
                let mustflag = editTable.getValByKeyAndIndex(tableName, i, 'mustflag').value
                let disabledRow = main.sysData
                if (disabledRow.includes(metadata)) {
                    editTable.setEditableRowByIndex(tableName, i, false)
                } else {
                    editTable.setEditableRowByIndex(tableName, i, true)
                }
                if (mustflag) {
                    editTable.setEditableRowKeyByIndex(tableName, i, 'usedflag', false)
                } else {

                    
                    editTable.setEditableRowKeyByIndex(tableName, i, 'usedflag', true)
                }
            }
        }
    }
}