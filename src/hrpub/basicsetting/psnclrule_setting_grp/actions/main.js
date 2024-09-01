import {getAppPageConfig,handleHash} from 'src/hrpub/common/utils/utils'
import {getBusinessInfo,base} from 'nc-lightapp-front'
const {NCCheckbox} = base;
export default class MainAction{
    constructor(comp){
        this.comp = comp
        this.comp.props.use.form('psnclrule')
        this.data = []
        for(let i = 0;i<=31;i++) {
            let a = 'psnclinfoset'+i
            this.data.push(a)
        }
        this.comp.props.use.editTable(...this.data)
        
    }
    appConfig = getAppPageConfig()

    langConfig = {
        moduleId: 'hrpub',
        domainName: 'hrpub',
    }

    languageCreateUIDOM = () => {
        const { props } = this.comp
        const { dispatch } = props
        const appConfig = this.appConfig
        const langConfig = this.langConfig
        dispatch({
            type: 'main/getTempAndLange',
            payload: {
                ...props,
                appConfig,
                langConfig,
                callback: this.initMeta
            }
        })
    }

    initMeta = (data, json) => {
        const { props, action } = this.comp
        const { dispatch, button, meta } = props
        meta.setMeta(data.template || [])
        button.setButtons(data.button || [])
        let height = document.documentElement.clientHeight - 64
        dispatch({
            type: 'main/update',
            payload: {
                json: json,
                businessInfo:  getBusinessInfo() || {groupId: '0001A210000000000JEC',groupName: '联合国总部'},
                pageHeight: height
            }
        })
        action.pubAct.initButton();
    }
    

    didMount =()=>{
        const { props } = this.comp
        if (/^localhost|127\.0\.0\.1/.test(window.location.hostname)){
            // window.location.hash = '/?&c=60023090&p=60023090p'
            window.location.hash = '#/ifr?page=201981519'
        }
        
        this.languageCreateUIDOM()
    }    

}