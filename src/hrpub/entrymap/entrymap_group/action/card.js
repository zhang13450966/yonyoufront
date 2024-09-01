import {getBusinessInfo} from 'nc-lightapp-front';
export default class CardAction {
    constructor(comp){
        this.comp = comp
    }
    // 入职地图查询操作
    queryEntryMapAction = async (pk_org) => {
        const {props} = this.comp
        const {dispatch, entrymapGroup, form, button} = props
        const {json} = entrymapGroup
        let pk_orgCopy = null
        if (entrymapGroup.isOrg) {
            pk_orgCopy = pk_org
        } else {
            let info = getBusinessInfo()
            pk_orgCopy = info&&info.groupId ? info.groupId : ''
        }
        dispatch({
            type: 'entrymapGroup/update',
            payload: {
                pk_org: pk_orgCopy
            }
        })
        let res = await dispatch({
            type: 'entrymapGroup/queryEntryMapAction',
            payload: {
                postData: {
                    pk_org: pk_orgCopy
                }
            }
        })
        if (res.success) {
            if (res.data) { 
                let entrymap = res.data.entrymap
                let enablestateObj = entrymap.rows[0].values.enablestate
                let enablestate = enablestateObj.value
                if (!enablestate) {
                    enablestateObj.value = '2'
                    enablestate = '2'
                    enablestateObj.display = json['orgmap-000282'] // 已启用 json['orgmap-000282']
                    button.setButtonDisabled({stop: true})
                } else {
                    button.setButtonDisabled({stop: false})
                }
                if (enablestate === '2') {
                    // 停用
                    button.setButtonTitle('stop', json['orgmap-000248'])
                } else if (enablestate === '3') {
                    // 启用
                    button.setButtonTitle('stop', json['orgmap-000249'])
                }
                form.setAllFormValue({entrymap})
            }
        }
    }
    didMount = () => {
        
    }
}