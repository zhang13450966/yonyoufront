import React, { Component } from 'react';
import { base, high, promptBox, ajax, toast, createPage } from 'nc-lightapp-front';

const { NCModal, NCButton, NCTable, NCRadio, NCStep, NCSelect, NCFormControl } = base;
const { Header: NCModalHeader, Body: NCModalBody, Footer: NCModalFooter } = NCModal;
const { NCSteps } = NCStep;
const { NCOption } = NCSelect;
import './index.less';

class PublishReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            language: {},
            currentStep: 0,
            publicMode: "0",
            reportModuleData: [],
            appTree: [], // 应用注册树
            menuTree: [], //菜单注册树
            orgType: [], // 组织类型
            enabledMenuPk: '', // 暂时没用
            appTreeSelected: '',
            menuTreeSelected: '',
            publicModuleSelectd: [],
            orgTypeSelectd: '',
            appNewCode: '',
            appNewName: '',
            menuNewCode: '',
            menuNewName: '',
            setPageUrl: ''
        }
    }
    
    getLauguage = () => {
        this.props.MultiInit.getMultiLang({
            moduleId: 'hr_report',
            domainName: 'hrpub',
            callback: (json, status, inlt) => {
                this.setState({
                    language: json
                }, () => {
                    this.insertCss();
                    this.getPublicModule();
                });
            }
        });
    }

    // 动态插入样式文件
    insertCss = () => {
        let link = document.createElement('link')
        link.setAttribute("rel", "stylesheet"); 
        link.setAttribute("type", "text/css"); 
        // 这里如果出补丁 记得把打包出来的css文件名里的hash去掉
        link.setAttribute("href", `../../../../hrpub/common/hrreport/index.css`);
   
        let heads = document.getElementsByTagName("head"); 
        if(heads.length) heads[heads.length-1].appendChild(link); 
    }
    onEnter = () => {
        const {
            syncTree
        } = this.props;
        this.getLauguage();
        ajax({
            url: '/nccloud/hr/rpt/QueryAppDataAction.do',
            data: {},
            success: (result) => {
                if (result.success && result.data) {
                    let data = JSON.parse(JSON.stringify(result.data));
                    let appTreeData = this.changeTreeData(data.appTree, 'app')
                    let menuTreeData = this.changeTreeData(data.menuTree, 'menu')
           
                    this.setState({
                        oriAppTreeData: data.appTree,
                        appTree: appTreeData,
                        menuTree: menuTreeData,
                        orgType: data.orgType,
                        enabledMenuPk: data.enabledMenuPk,
                        // publicModuleSelectd: ['hr'],
                        // reportModuleData: ['hr']
                    })
                    syncTree.setSyncTreeData('public-report-app', appTreeData)
                }
            },
            error: (err) => {
                toast({
                    color: 'danger',
                    content: err.message
                })
                throw err
            }
        })
    }

    getPublicModule = () => {
        ajax({
            url: '/nccloud/report/lightsmart/fetchScopeIdListAction.do',
            data: {},
            success: (result) => {
                if (result.success && result.data) {
                    let reportModuleData = result.data.scopes.map((item) => {
                        return {key: item.devModule, name: item.typeName}
                    })
                    this.setState({
                        publicModuleSelectd: reportModuleData[0].key,
                        reportModuleData: reportModuleData
                    })
                }
            },
            error: (err) => {
                toast({
                    color: 'danger',
                    content: err.message
                })
                throw err
            }
        })
    }
    changeTreeData = (data, type) => {
        let result = []
        if (!Array.isArray(data)) {
            return result
        }
        data.forEach(item => {
            delete item.children;
            item.key = item.pk;
            item.title = item.name;
            item.refname = item.name;
            item.refpk = item.pk;
            item.beforeName = item.code;
            item.id = item.pk;
            item.innercode = null;
            item.nodeData = item
        });
        let map = {};
        let pidType = type === "app" ? 'refpk' : 'code' // 菜单pid对应code
        data.forEach(item => {
            map[item[pidType]] = item;
        });
        data.forEach(item => {
            let parent = map[item.pid];
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                result.push(item);
            }
        });
        return result;
    }
   

    // 模块号
    publicModuleChange = (v) => {
        this.setState({
            publicModuleSelectd: v
        })
    }
    // 发布方式
    publicModeModeChange = (v) => {
        const { appTreeSelected, publicModuleSelectd } = this.state;
        if (v === publicModuleSelectd) return;  // 没有改变设计模式

        if (v !== '0' && (appTreeSelected && appTreeSelected.code.length > 6)) {
            this.setState({
                publicMode: v,
                orgTypeSelectd: appTreeSelected.def1,
                appNewName: appTreeSelected.name,
                appNewCode: appTreeSelected.code
            })
        } else {
            this.setState({
                publicMode: v,
                orgTypeSelectd: '',
                appNewName: '',
                appNewCode: ''
            })
        }
    }

    // 选择一棵树
    onSelectAppEve = (refpk, item, registerMode) => {
        console.log(item)
        if (registerMode === 'app') {
            this.setState({
                appTreeSelected: item,
            })
            if (this.state.publicMode !== '0' && item.code.length > 6) {
                this.setState({
                    orgTypeSelectd: item.def1,
                    appNewName: item.name,
                    appNewCode: item.code
                })
                return;
            }
            // 判断是不是第三层
            if (item.code.length === 6) {
                const { orgType } = this.state;
                this.setState({
                    orgTypeSelectd: orgType[0].pk_orgtype,
                    // appNewName: this.props.reportName,
                    appNewCode: ''
                })
            }
        } else {
            // 判断是不是第三层
            if (item.code.length === 6) {
                const { orgType } = this.state;
                this.setState({
                    menuNewCode: '',
                    // menuNewName: this.props.reportName,
                })
            }
            this.setState({
                menuTreeSelected: item
            })
        }
    }

    orgTypeChange = (v) => {
        this.setState({
            orgTypeSelectd: v
        })
    }
    publishReport = () => {
        const { publicMode, enabledMenuPk, appTreeSelected,
            menuTreeSelected, orgTypeSelectd,
            publicModuleSelectd,
            appNewCode,
            appNewName,
            menuNewCode,
            menuNewName,
            setPageUrl,
            language
        } = this.state;
        if (publicMode === '0') {
            let checkResult = this.beforeReport(); 
            if (!checkResult) {
                return false
            }
        }
        
        let publishMethod;
        switch (publicMode) {
            case "0":
                publishMethod = "new"
                break;
            case "1":
                publishMethod = "overwrite"
                break;
            case "2":
                publishMethod = "delete"
                break;
            case "3":
                publishMethod = "append"  // 
                break;
        } 
        // 两种 HRORGTYPE00000000000 和 GROUPORGTYPE00000000
        let defaultPageUrl = orgTypeSelectd === 'GROUPORGTYPE00000000'? "/nccloud/resources/hrhi/reportquery/group/main/index.html"
        : "/nccloud/resources/hrhi/reportquery/organization/main/index.html"
        let postData = {
            "publishType": "1", // 小应用
            "publishMethod": publishMethod, // "new", // "delete" , "overwrite"
            "enabledMenuPk": enabledMenuPk,
            // "pk_report": "1001A910000000008930",  // id
            "aryRepIds": [this.props.pk_dir['pk_dir']], // || ["1001A91000000000892Z"], // dirid
            "fieldCodes": [],
            "selAppPk": appTreeSelected.refpk,
            "selAppCode": appTreeSelected.code, //
            "pk_appregister": appTreeSelected.pk,
            "appCode": appNewCode,
            "appName": appNewName,
            "orgTypeCode": orgTypeSelectd,
            "width": "1",
            "height": "1",
            "scopeid": publicModuleSelectd,
            "pageUrl": setPageUrl || defaultPageUrl
        }
        if (publicMode === '0') {
            postData["selMenuCode"] = menuTreeSelected.code;
            postData["menuCode"] = menuNewCode;
            postData["menuName"] = menuNewName;
        }
        ajax({
            url: '/nccloud/hr/rpt/ReportPublishAction.do', // editColumn
            data: postData,
            success: (result) => {
                if (result.success) {
                    let successMessage = {
                        '0': language["report-000030"] || '新增成功！',
                        '1': language["report-000031"] || '覆盖成功！',
                        '2': language["report-000032"] || '删除成功！',
                        '3': language["report-000033"] || '追加成功！',
                    }
                    toast({
                        color: 'success',
                        content: successMessage[publicMode]
                    })
                    this.closeModal()
                }
            },
            error: (err) => {
                toast({
                    color: 'danger',
                    content: err.message
                })
            }
        })
    }

    // 发布前前端校验
    beforeReport = () => {
        const { publicMode, 
            menuTreeSelected, 
            menuNewCode,
            menuNewName,
            language
        } = this.state;
        if (!menuNewCode) {
            toast({
                color: 'warning',
                content: language["report-000001"] || '请输入菜单编码'
            })
            return false;
        }
        if (!menuNewName) {
            toast({
                color: 'warning',
                content: language["report-000002"] || '请输入菜单名称'
            })
            return false;
        }
        if ((!menuTreeSelected || menuTreeSelected.code.length !== 6)) {
            toast({
                color: 'warning',
                content: language["report-000003"] || '请选择目录树三级节点'
            })
            return false;
        }
        if((menuNewCode.length <= 6 || menuNewCode.slice(0, 6) !== menuTreeSelected.code)) {
            toast({
                color: 'warning',
                content: language["report-000004"] || '请以所选目录树编码子集的编码规则正确填写编码'
            })
            return false;
        }
        let checkoutCodeOnly = (menuTreeSelected.children && 
            menuTreeSelected.children.filter(item => item.code === menuNewCode))
            || [];
       
        if(checkoutCodeOnly.length > 0) {
            toast({
                color: 'warning',
                content: language["report-000006"] || '编码已存在，请以所选目录树编码子集的编码规则正确填写编码'
            })
            return false;
        }
        return true;
    }
    nextStep = () => {
        const {
            syncTree
        } = this.props;
        const { menuTree } = this.state;
        let isGoing = this.beforeNextStep();
        if (isGoing) {
            this.setState({
                currentStep: 1
            }, () => {
                syncTree.setSyncTreeData('public-report-menu', menuTree)
            })
        }
    }

    // 下一步之前校验
    beforeNextStep = () => {
        const { appTreeSelected,
            orgTypeSelectd,
            appNewCode,
            appNewName,
            publicMode,
            language
        } = this.state;

        if (!appNewCode) {
            toast({
                color: 'warning',
                content: language["report-000008"] || '请输入节点编码'
            })
            return false;
        }
        if (!appNewName) {
            toast({
                color: 'warning',
                content: language["report-000009"] || '请输入节点名称'
            })
            return false;
        }
        if (!orgTypeSelectd) {
            toast({
                color: 'warning',
                content: language["report-0000028"] || '选择组织类型'
            })
            return false;
        }
        if (!appTreeSelected || appTreeSelected.code.length !== 6) {
            toast({
                color: 'warning',
                content: language["report-000003"] || '请选择目录树三级节点'
            })
            return false;
        }

        if(appNewCode.length <= 6 || appNewCode.slice(0, 6) !== appTreeSelected.code) {
            toast({
                color: 'warning',
                content: language["report-000004"] || '请以所选目录树编码子集的编码规则正确填写编码'
            })
            return false;
        }
        let checkoutCodeOnly = (appTreeSelected.children && 
            appTreeSelected.children.filter(item => item.code === appNewCode)) 
            || [];
        // if(publicMode !== '0' && checkoutCodeOnly.length === 0) {
        //     toast({
        //         color: 'warning',
        //         content: language["report-000005"] || '所选目录树下无此子集，请正确填写所选目录下的子集编码'
        //     })
        //     return false;
        // }
       
        if(publicMode === '0' && checkoutCodeOnly.length > 0) {
            toast({
                color: 'warning',
                content: language["report-000006"] || '编码已存在，请以所选目录树编码子集的编码规则正确填写编码'
            })
            return false;
        }
       
        return true;
    }
    preStep = () => {
        this.setState({
            currentStep: 0
        }, () => {
            // syncTree.setSyncTreeData('public-report-app', )
        })
    }

    onChange = (v, type) => {
        this.setState({
            [type]: v
        })
    }
    closeModal = () => {
        // 卸载样式
        let links = document.getElementsByTagName("link");
        links[0].parentNode.removeChild(links[links.length-1]);
        this.props.handleHrzzModal(false)
    }

    render() {
        const { currentStep, publicMode, reportModuleData, orgType,
            orgTypeSelectd, publicModuleSelectd, language } = this.state;
        const { syncTree } = this.props;
        let { createSyncTree } = syncTree;
        
        return (
            <div className='hr-public-report-modal'>
                <NCModal
                    visible={true}
                    onCancel={this.closeModal}
                    mask={'static'}
                    size='lg'
                    min-height={520}
                    onEnter={this.onEnter}
                >
                    <NCModalHeader closeButton={true}>
                        {language["report-000010"] || '发布'}
                    </NCModalHeader>
                    <NCModalBody style={{ height: '353px' }}>
                        <div className="public-report-body-hr-wrap">
                            <div className="public-report-step-hr-wrap">
                                <NCSteps
                                    current={currentStep}
                                // size="small"
                                >
                                    <NCStep title={language["report-000011"] || "应用注册"} />
                                    <NCStep title={language["report-000012"] || "菜单注册"} />
                                </NCSteps>
                            </div>
                            <div className="public-report-modal-hr-wrapper">
                                <If condition={currentStep === 0}>
                                    {/* 发布方式 */}
                                    <div className="public-report-hr-style">
                                        <div className="public-report-style">
                                            <span style={{ marginRight: '10px', marginTop: '-5px' }}>{language["report-000013"] || '发布方式 :'}</span>{/* 国际化处理： 发布方式*/}
                                            <NCRadio.NCRadioGroup
                                                name="range"
                                                selectedValue={publicMode}
                                                onChange={this.publicModeModeChange}
                                            >
                                                <NCRadio value="0">{language["report-000014"] || '新增'}</NCRadio>{/* 国际化处理： 新增*/}
                                                <NCRadio value="1">{language["report-000015"] || '覆盖'}</NCRadio>{/* 国际化处理： 覆盖*/}
                                                <NCRadio value="2">{language["report-000016"] || '删除'}</NCRadio>{/* 国际化处理： 删除*/}
                                                <NCRadio value="3">{language['report-000029'] || '追加'}</NCRadio>{/* 国际化处理： 删除*/}
                                            </NCRadio.NCRadioGroup>
                                        </div>
                                        <div className="public-report-module">
                                            <span style={{ marginRight: '10px', width: '60px' }}>{language["report-000017"] || '模块号:'}</span>
                                            <NCSelect
                                                // className="header-select"
                                                value={publicModuleSelectd}
                                                // onChange={}
                                                onSelect={value => this.publicModuleChange(value)}
                                            >
                                                {!!reportModuleData && reportModuleData.map((item) => {
                                                    return (
                                                        <NCOption
                                                            key={item.key}
                                                        >
                                                            {item.name}
                                                        </NCOption>
                                                    )
                                                })}
                                            </NCSelect>
                                        </div>

                                    </div>
                                    {/* 树 */}
                                    <div className="public-report-hr-app-tree">
                                        {createSyncTree({
                                            treeId: 'public-report-app', // 组件id
                                            needEdit: false,
                                            searchType: 'filtration',
                                            onSelectEve: (refpk, item) => this.onSelectAppEve(refpk, item, 'app'),   //选择节点回调方法
                                            // getSearchVal: this.getSearchAppVal //获取搜索框值

                                        })}
                                    </div>
                                </If>
                                <If condition={currentStep === 1}>
                                    <div className='public-report-hr-menu-tree'>
                                        {createSyncTree({
                                            treeId: 'public-report-menu', // 组件id
                                            needEdit: false,
                                            searchType: 'filtration',
                                            onSelectEve: (refpk, item) => this.onSelectAppEve(refpk, item, 'menu'),  //选择节点回调方法
                                            // getSearchVal: this.getMenuSearchVal //获取搜索框值

                                        })}
                                    </div>

                                </If>

                            </div>
                        </div>
                    </NCModalBody>
                    <NCModalFooter className="hr-madal-footer">
                        {currentStep === 0 &&
                            <div className='public-report-footer1-hr'>
                                <div className="footer1-item">
                                    <span>
                                        <i className="required">*</i>
                                    {language["report-000018"] || '新增应用编码'}
                                    </span>
                                    <NCFormControl
                                        disabled={publicMode !== '0'}
                                        value={this.state.appNewCode}
                                        onChange={(v) => this.onChange(v, 'appNewCode')}
                                        size="sm"
                                    />
                                </div>
                                <div className="footer1-item">
                                    <span>
                                        <i className="required">*</i>
                                    {language["report-000019"] || '新增应用名称'}
                                    </span>
                                    <NCFormControl
                                        value={this.state.appNewName}
                                        disabled={publicMode !== '0'}
                                        onChange={(v) => this.onChange(v, 'appNewName')}
                                        size="sm"
                                    />
                                </div>
                                <div className="footer1-item">
                                    <span>
                                        <i className="required">*</i>
                                    {language["report-000020"] || '组织类型'}
                                    </span>
                                    <NCSelect
                                        value={orgTypeSelectd}
                                        // onChange={}
                                        disabled={publicMode !== '0'}
                                        onSelect={value => this.orgTypeChange(value)}
                                    >
                                        {!!orgType && orgType.map((item) => {
                                            return (
                                                <NCOption
                                                    key={item.pk_orgtype}
                                                >
                                                    {item.name}
                                                </NCOption>
                                            )
                                        })}
                                    </NCSelect>
                                </div>
                                <div className="footer1-item">
                                    <span>
                                        {language["report-000021"] || '页面跳转路径'}
                                    </span>
                                    <NCFormControl
                                        value={this.state.setPageUrl}
                                        onChange={(v) => this.onChange(v, 'setPageUrl')}
                                        size="sm"
                                    />
                                </div>

                            </div>}
                        {currentStep === 1 &&
                            <div className='public-report-footer1-hr'>
                                <div className="footer1-item">
                                    <span>
                                        <i className="required">*</i>
                                    {language["report-000022"] || '新菜单编码'}
                                    </span>
                                    <NCFormControl
                                        value={this.state.menuNewCode}
                                        onChange={(v) => this.onChange(v, 'menuNewCode')}
                                        size="sm"
                                    />
                                </div>
                                <div className="footer1-item">
                                    <span>
                                        <i className="required">*</i>
                                    {language["report-000023"] || '新菜单名称'}
                                    </span>
                                    <NCFormControl
                                        value={this.state.menuNewName}
                                        onChange={(v) => this.onChange(v, 'menuNewName')}
                                        size="sm"
                                    />
                                </div>


                            </div>}
                        {currentStep === 0 && publicMode === '0' && <NCButton colors="primary" onClick={() => this.nextStep()}>
                            {language["report-000024"] || '下一步'}
                        </NCButton>}
                        {currentStep === 1 &&
                            <NCButton colors="primary" onClick={() => this.preStep()}>
                                {language["report-000025"] || '上一步'}
                            </NCButton>}
                        {(currentStep === 1 || publicMode !== '0') &&
                            <NCButton colors="primary" onClick={this.publishReport}>
                                {language["report-000026"] || '完成'}
                            </NCButton>}
                        {/* <NCButton onClick={this.closeModal}>
                                    {'完成并设置模板'}
                                </NCButton> */}
                        <NCButton onClick={this.closeModal}>
                            {language["report-000027"] || '取消'}
                        </NCButton>
                    </NCModalFooter>
                </NCModal>
            </div>
        )
    }
}

export default createPage({})(PublishReport)