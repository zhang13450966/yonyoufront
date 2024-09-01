export default class MainAction {
    constructor(comp){
        this.comp = comp
        this.comp.props.use.editTable('orgprolist')
    }
    //获取多语
    getMulitiLange = () =>{
        const {props} = this.comp
        const {MultiInit, dispatch} = props
        MultiInit.getMultiLang({
            moduleId: 'orgmap',
            domainName: 'hrpub',
            callback: (json,status,init) =>{
                dispatch({
                    type: 'enterpriseOrg/update',
                    payload: {
                        json : json
                    } 
                })
            }
        })
    }
    didMount = () => {
        this.getMulitiLange()
    }
}