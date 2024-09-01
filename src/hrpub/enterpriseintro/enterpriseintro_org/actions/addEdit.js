import {toast} from 'nc-lightapp-front';
let isNoticeOne = false, isNoticeTwo = false
export default class AddEditAction {
    constructor(comp){
        this.comp = comp   
    }
    // 新增打开弹出层
    openModel = () => {
        const {props} = this.comp
        const {dispatch, enterpriseOrg} = props
        const {json} = enterpriseOrg
        dispatch({
            type: 'enterpriseOrg/update',
            payload: {
                modelTitle: json['orgmap-000049'], // 新增
                showModel: true
            }
        })
    }
    // 关闭弹出层
    closeModel = () => {
        const {props} = this.comp
        const {dispatch} = props
        dispatch({
            type: 'enterpriseOrg/update',
            payload: {
                profile: '',
                proname: '',
                imgBase64: '',
                pk_orgprofile: '',
                showModel: false
            }
        })
    }
    // 点击上传按钮触发函数
    uploadChange = (e) => {
        const {props} = this.comp
        const {dispatch, enterpriseOrg} = props
        const {json} = enterpriseOrg
        let file = e.target.files[0]
        if (file.type !== 'image/jpeg') {
            toast({
                color: 'warning',
                content: json['orgmap-000280'] // 上传图片只能是JPEG格式
            })
            return false
        }
        if (file.size / 1024 > 200) {
            toast({
                color: 'warning',
                content: json['orgmap-000283'] // 最大只能上传200KB
            })
            return false
        }
        if(FileReader && file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                dispatch({
                    type: 'enterpriseOrg/update',
                    payload: {
                        imgBase64: e.target.result
                    }
                })
            };
            reader.readAsDataURL(file)
        }
    }
    getLength = (val) => {  
        var str = new String(val);  
        var bytesCount = 0;  
        for (var i = 0 ,n = str.length; i < n; i++) {  
            var c = str.charCodeAt(i);  
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
                bytesCount += 2;  
            } else {  
                bytesCount += 4;  
            }  
        }  
        return bytesCount;  
    } 
    // 企业名称输入框赋值
    pronameChange = (e) => {
        const {props} = this.comp
        const {dispatch} = props
        let value = e.target.value
        let valueLen = this.getLength(value)
        if (valueLen > 200) {
            isNoticeOne = true
        } else {
            isNoticeOne = false
        }
        dispatch({
            type: 'enterpriseOrg/update',
            payload: {
                proname: value
            }
        })
    } 
    // URL地址输入框赋值 
    profileChange = (e) => {
        const {props} = this.comp
        const {dispatch} = props
        let value = e.target.value
        let valueLen = this.getLength(value)
        if (valueLen > 200) {
            isNoticeTwo = true
        } else {
            isNoticeTwo = false
        }
        dispatch({
            type: 'enterpriseOrg/update',
            payload: {
                profile: value
            }
        })
    }
    // 点击保存按钮触发函数
    saveFun = async () => {
        const {props,action} = this.comp
        const {dispatch, enterpriseOrg} = props
        const {json, imgBase64, profile, proname, pk_orgprofile, enablestate, pk_org} = enterpriseOrg
        var urlRege = new RegExp(`(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?`);
        if (!urlRege.test(profile)) {
            toast({
                color: 'warning',
                content: json['orgmap-000250'] // 请输入正确的url地址！
            })
            return false
        }
        if (isNoticeOne) {
            toast({
                color: 'warning',
                content: json['orgmap-000267'] // 输入的企业名称长度不能超过66，清重新输入!
            })
            return false
        }
        if (isNoticeTwo) {
            toast({
                color: 'warning',
                content: json['orgmap-000268'] // 输入的url长度不能超过60，清重新输入!
            })
            return false
        }
        if (imgBase64 === '') {
            toast({
                color: 'warning',
                content: json['orgmap-000329'] // 请上传公司logo
            })
            return false
        }
        try {
            let res = await dispatch({
                type: 'enterpriseOrg/orgProFileSaveAction',
                payload: {
                    postData: {
                        model: {
                            areaType: 'form',
                            rows: [
                                {
                                    status: '0',
                                    values: {
                                        logo: {value: imgBase64},
                                        profile: {value: profile},
                                        proname: {value: proname},
                                        pk_orgprofile: {value: pk_orgprofile},
                                        enablestate: {value: enablestate},
                                    }
                                }
                            ]
                        },
                        pk_org: pk_org
                    }
                }
            })
            if (res.success) {
                toast({
                    color: 'success',
                    content: json['orgmap-000030'] // 保存成功
                })
                dispatch({
                    type: 'enterpriseOrg/update',
                    payload: {
                        profile: '',
                        proname: '',
                        imgBase64: '',
                        pk_orgprofile: '',
                        showModel: false
                    }
                })
                action.tableAction.getMainTableData(enterpriseOrg.isApply, enterpriseOrg.pageInfo, enterpriseOrg.pk_org)
            }
        } catch (e) {
            throw e
        }
    }
    // 打开弹窗 企业名称、url地址输入框赋值
    setPronameAndProfile = async (record) => {
        const {props} = this.comp
        const {dispatch, enterpriseOrg} = props
        const {json} = enterpriseOrg
        let pk_orgprofile = record.values.pk_orgprofile.value
        let res = await dispatch({
            type: 'enterpriseOrg/orgProFileQueryOneAction',
            payload: {
                postData: {
                    pk_orgprofile
                }
            }
        })
        if (res.success) {
            let values = res.data.orgproinf.rows[0].values
            dispatch({
                type: 'enterpriseOrg/update',
                payload: {
                    showModel: true,
                    modelTitle: json['orgmap-000215'], // 编辑
                    imgBase64: values.logo.value,
                    profile: values.profile.value,
                    proname: values.proname.value,
                    pk_orgprofile: values.pk_orgprofile.value,
                    enablestate: values.enablestate.value
                }
            })
        }
    }
    didMount = () => {
        
    }
}