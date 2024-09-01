import { toast, promptBox } from 'nc-lightapp-front'
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

    //获取穿梭框右侧key值
    getkey = (data, keysArr) =>{
        for (let j = 0, len = data.length; j < len; j++) {
            let tempdata = data[j];
            if (tempdata.key) {
                keysArr.push(tempdata.key)
            }
            if (tempdata.children) {
                this.getkey(tempdata.children, keysArr)
            }
        }
    }

    //分配校验
    assignCheckAction = ()=>{
        const { props } = this.comp;
        const { dispatch, main } = props;
        let { psnclValue, targetKeys, json } = main;
        let keysArr = [];
        this.getkey(targetKeys, keysArr); // 所有启用的组织id,右侧组织树所有节点的id,用逗号分隔  aaa,ddd,vvv,ccc
        dispatch({
            type: 'main/assignCheckAction',
            payload: {
                pk_psncl: psnclValue,
                pk_orgs: keysArr
            }
        }).then(( res )=>{
            let data = res.data;
            if( res.success && data ){
                if( data.code === '0' ){
                    promptBox({
                        color: 'warning',               
                        title: json['hrpub-000172'], 
                        content: data.msg,             
                        noFooter: false,              
                        noCancelBtn: false,            
                        beSureBtnName: json['hrpub-000113'],         
                        cancelBtnName: json['hrpub-000114'],         
                        hasCloseBtn:true,             
                        beSureBtnClick:  () => { this.assignAction(keysArr) } ,   // 确定按钮点击调用函数,非必输
                        cancelBtnClick:  () => { this.colseTransferModal() },  // 取消按钮点击调用函数,非必输
                        closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是true点击关闭，阻止关闭是false
                    })
                }else if(data.code === '1'){
                    this.assignAction(keysArr);
                }
            }
        })
    }

    //分配
    assignAction = ( targetKeysArr )=>{
        const { props } = this.comp;
        const { dispatch, main } = props;
        let { psnclValue, json } = main;
        dispatch({
            type: 'main/assignAction',
            payload: {
                pk_psncl: psnclValue,
                pk_orgs: targetKeysArr
            }
        }).then(( res )=>{
            if( res.success ){
                toast({color:'success',content: json['hrpub-000173']});
                this.colseTransferModal();
            }
        })
    }


    //关闭穿梭框
    colseTransferModal = ()=>{
        const {props} = this.comp;
        const {dispatch} = props;
        dispatch( {
            type:'main/update', 
            payload: {
                showTransferModal: false
            }
        })
    }
    
    // //
    // onTargetKeysChange = (targetKeys)=>{
    //     const {props} = this.comp;
    //     const {dispatch} = props;
    //     dispatch({
    //         type:'main/update', 
    //         payload: {
    //             targetKeys
    //         } 
    //     })
    // }
}