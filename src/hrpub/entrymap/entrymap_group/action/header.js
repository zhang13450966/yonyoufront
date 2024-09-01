import {promptBox, toast} from 'nc-lightapp-front';
export default class HeaderAction {
    constructor(comp){
        this.comp = comp
    }
    // 对按钮进行管理
    setBtnDisabledAndVisible = (str) => {
        const {props} = this.comp
        const {button} = props
        switch (str) {
            // 只显示设置和停用按钮
            case 'showSetAndStop':
                button.setButtonVisible({
                    set: true,
                    stop: true,
                    save: false,
                    cancel: false
                })
                break;
            // 只显示保存和取消按钮
            case 'showSaveAndCancel':
                button.setButtonVisible({
                    set: false,
                    stop: false,
                    save: true,
                    cancel: true
                })
                break;
            default:break;
        }
    }
    onButtonClick = (props, btnCode) => {
        switch (btnCode) {
            case 'set':
                this.setBtnOpreation()
                break;
            case 'stop':
                this.stopBtnOpreation()
                break;
            case 'save':
                this.saveBtnOpreation()
                break;
            case 'cancel':
                this.cancelBtnOpreation()
                break;
            default: break;
        }
    }
    // 点击设置按钮执行函数
    setBtnOpreation = () => {
        const {props} = this.comp
        const {form, dispatch} = props
        this.setBtnDisabledAndVisible('showSaveAndCancel')
        form.setFormStatus('entrymap', 'edit')
        let formDataSave = form.getAllFormValue('entrymap')
        dispatch({
            type: 'entrymapGroup/update',
            payload: {
                formDataSave,
                orgDisabled: true
            }
        })
    }
    // 点击停用按钮执行函数
    stopBtnOpreation = async () => {
        const {props, action} = this.comp
        const {dispatch, form, entrymapGroup} = props
        const {json} = entrymapGroup
        let keyValues = form.getFormItemsValue('entrymap', ['enablestate', 'pk_entrymap'])
        let enablestate = keyValues[0].value
        let pk_entrymap = keyValues[1].value
        let enable = true
        if (enablestate === '2') {
            enable = false
        }
        let res = await dispatch({
            type: 'entrymapGroup/entryMapEnableAction',
            payload: {
                postData: {
                    enable,
                    pk_entrymap
                }
            }
        })
        if (res.success) {
            toast({
                colors: 'success',
                content: json['orgmap-000052'] // 操作成功！
            })
            action.cardAction.queryEntryMapAction(entrymapGroup.pk_org)
        }
    }
    // 点击保存执行函数
    saveBtnOpreation = async () => {
        const {props} = this.comp
        const {dispatch, form, entrymapGroup, button} = props
        const {json} = entrymapGroup
        if (!form.isCheckNow('entrymap', 'warning')) {
            return false
        }
        let formData = form.getAllFormValue('entrymap')
        let mapurl = formData.rows[0].values.mapurl.value
        var urlRege = new RegExp(`(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?`);
        if (!urlRege.test(mapurl)) {
            toast({
                color: 'warning',
                content: json['orgmap-000250'] // 请输入正确的url地址！
            })
            return false
        }
        let pk_org = entrymapGroup.pk_org
        let res  = await dispatch({
            type: 'entrymapGroup/entryMapSaveAction',
            payload: {
                postData: {
                    model: formData,
                    pk_org
                }
            }
        })
        if (res.success) {
            toast({
                colors: 'success',
                content: json['orgmap-000030'] // 保存成功！
            })
            let entrymap = res.data.entrymap
            form.setAllFormValue({entrymap})
            form.setFormStatus('entrymap', 'browse')
            this.setBtnDisabledAndVisible('showSetAndStop')
            dispatch({
                type: 'entrymapGroup/update',
                payload: {
                    orgDisabled: false
                }
            })
            button.setButtonDisabled({stop: false})
        }
    }
    // 点击取消按钮执行函数
    cancelBtnOpreation = () => {
        const {props} = this.comp
        const {entrymapGroup} = props
        const {json} = entrymapGroup
        promptBox({
            color: "warning",
            title: entrymapGroup.json['orgmap-000018'], /* 国际化处理： 提示*/
            content: json['orgmap-000260'], /* 国际化处理： 确定取消吗？*/
            beSureBtnClick: this.beSureBtnClick.bind(this)
        })
    }
    beSureBtnClick = () => {
        const {props} = this.comp
        const {form, entrymapGroup, dispatch} = props
        form.setFormStatus('entrymap', 'browse')
        let entrymap = entrymapGroup.formDataSave
        form.setAllFormValue({entrymap})
        this.setBtnDisabledAndVisible('showSetAndStop')
        dispatch({
            type: 'entrymapGroup/update',
            payload: {
                orgDisabled: false
            }
        })
    }
    // 改变组织
    handleTreeChange = (value) => {
        const {props, action} = this.comp
        const {dispatch} = props
        dispatch({
            type: 'entrymapGroup/update',
            payload: {
                orgValue: value,
                pk_org: value.refpk
            }
        })
        if (value.refpk) {
            action.cardAction.queryEntryMapAction(value.refpk)
        }
    }
    didMount = () => {
        this.setBtnDisabledAndVisible('showSetAndStop')
    }
}