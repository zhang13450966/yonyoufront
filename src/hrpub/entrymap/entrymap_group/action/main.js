import {getAppPageConfig} from 'src/hrpub/common/utils/utils'
export default class MainAction {
    constructor(comp){
        this.comp = comp
        this.comp.props.use.form('entrymap')
    }
    appConfig = {
        appcode: '60025010',
        pagecode: '6008A005p'
    }
    //获取模版
    getTemplate = ()=> {
        const {props} = this.comp
        const {createUIDom,button,meta} = props
        createUIDom(this.appConfig,(data)=>{
            meta.setMeta(data.template || [])
            button.setButtons(data.button || [])
            this.getMulitiLange()
        })
    }
    //获取多语
    getMulitiLange = () =>{
        const {props, action} = this.comp
        const {MultiInit,dispatch} = props
        MultiInit.getMultiLang({
            moduleId: 'orgmap',
            domainName: 'hrpub',
            callback: (json,status,init) =>{
                dispatch({
                    type: 'entrymapGroup/update',
                    payload: {
                        json : json
                    } 
                })
                let href = window.location.href
                if (!href.match('entrymap_org')) {
                    action.cardAction.queryEntryMapAction()
                }
            }
        })
    }
    didMount = () => {
        const {props} = this.comp
        const {dispatch} = props
        let href = window.location.href
        if (href.match('localhost:3006')) {
            window.location.hash = '#/ifr?page=201981516135101'
            this.appConfig = getAppPageConfig()
        }
        if (href.match('entrymap_org')) {
            dispatch({
                type: 'entrymapGroup/update',
                payload: {
                    isOrg: true
                }
            })
        }
        this.getTemplate()
    }
}