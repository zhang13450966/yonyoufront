import { toast } from 'nc-lightapp-front'
export default class ModalAction {
    constructor(comp) {
        this.comp = comp
    }

    sureClick = () =>  {
        const {props} = this.comp
        const {dispatch,main} = props
        let orgArray = []
        let modalOrgValue = main.modalOrgValue
        let modalPsnclValue = main.modalPsnclValue
        if(!(modalOrgValue && modalOrgValue.length>0)){
            toast({color:'warning',content: main.json['hrpub-000162']})
            return 
        }
        if(!(modalPsnclValue && modalPsnclValue.length>0)){
            toast({color:'warning',content: main.json['hrpub-000163']})
            return 
        }
        modalOrgValue && modalOrgValue.map((org)=>{
            orgArray.push(org.refpk)
        })
        let psnArray = []
        
        modalPsnclValue && modalPsnclValue.map((psncl)=>{
            psnArray.push(psncl.refpk)
        })
        if(orgArray.length === 0 || psnArray.length === 0){
            toast({color: 'warning',content: main.json['hrpub-000152']})
        }
        dispatch( {
            type:'main/copyData', 
            payload: {
                pk_org: main.orgValue.refpk, 
                target_org: orgArray, 
                target_psncl: psnArray, 
                tree_node_id: main.psnclValue
            }
        }).then((res) =>  {
            dispatch( {
                type:'main/update', 
                payload: {
                    modalShow:false
                }
            })
        })

    }

    cancelClick = () =>  {
        const {props} = this.comp
        const {main, dispatch} = props
        dispatch( {
            type:'main/update', 
            payload: {
                modalShow:false
            }
        })
    }

    orgChange = (value) =>  {
        const {props} = this.comp
        const {dispatch} = props
        dispatch( {
            type:'main/update', 
            payload: {
                modalOrgValue: value
            }
        })
    }

    psnclChange = (value) =>  {
        const {props} = this.comp
        const {dispatch} = props
        dispatch( {
            type:'main/update', 
            payload: {
                modalPsnclValue:value
            }
        })
    }

    yesClick = () =>  {
        const {props, action} = this.comp
        const {dispatch} = props
        let data = action.headAct.getSaveData()
        action.headAct.saveAction(Object.assign(data,  {'isallsubinherit':'Y'}))
    }

    noClick = () =>  {
        const {props, action} = this.comp
        const {dispatch} = props
        let data = action.headAct.getSaveData()
        action.headAct.saveAction(Object.assign(data,  {'isallsubinherit':'N'}))
    }

    colseClick = () =>  {
        const {props} = this.comp
        const {dispatch} = props
        dispatch( {
            type:'main/update', 
            payload: {
                promptModalShow:false
            }
        })
    }



    
}