import React, { PureComponent } from 'react';
import { base, getMultiLang, promptBox, toast, ajax } from 'nc-lightapp-front';
import ApprovalRevocation from '../ApprovalRevocation';
import ApproveDetail from '../../../../common/components/ApproveDetail';
import SingleTargetTransferModal from './SingleTargetTransferModal';
import { is } from 'immutable';
require('./index.less');
const { NCModal, NCButton, NCDropdown, NCInput, NCMenu, NCTextArea, NCRadio, NCIcon, NCTooltip } = base;

const NCItem = NCMenu.Item;
// const NCFormItem = NCForm.NCFormItem;
const NCDivider = NCMenu.NCDivider;
// const Option = NCSelect.NCOption;
export default class ApprovalOpinions extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false, // 正常批复弹框显示状态
            showMenu: false, // 正常批复弹框显示状态
            menuVisible: false, // 按钮选择列表显示状态
            showApproveDetail: false, // 工作流程显示状态
            showShuttle: false, // 改派状态框显示状态
            menu: [], // 按钮选择列表
            data: {
                chosen: 0,
                assginuser: ['任亚军'],
                des: ''
            },
            isAssgin: true,
            assignData: null,
            assignDisplay: false,
            isApproveAssign: false,
            skipCodes: {},
            assginuser: '',
            billid: '',
            billtype: '',
            pk_checkflow: '',
            checknote: this.props.comment || '',
            assginuserKey: [],
            dataSource: [],
            json: {},
            inlt: null
        };
    }
    static defaultProps = {
        loadingMenu: true
    }
    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(status){
                this.setState({json, inlt});
            }else{
                console.log('未加载 containers_approvalopinions.json 多语文件')
            }
        }
        getMultiLang({moduleId: 'containers_approvalopinions', domainName: 'uap', callback});
    }
    componentWillReceiveProps(nextProps, oldProps) {
        let billMessage = nextProps.billMessage;
        if (nextProps.loadingMenu) {
            this.setState({
                billid: nextProps.data.billid,
                billtype: nextProps.data.billtype,
                pk_checkflow: nextProps.data.pk_checkflow,
            })
            let data = Object.assign({}, nextProps.data);
            if(billMessage && billMessage.isread != 'Y'){
                ajax({
                    url: '/nccloud/workflow/approvalcenter/workflowSingalEnableQueryAction.do',
                    data,
                    success: (res) => {
                        let menu = res.data
                        let isAssgin = false
                        if (res.data.length) {
                            for (let i = 0; i < menu.length; i++) {
                                if (menu[i]['choiced']) {
                                    isAssgin = menu[i]['isAssgin']
                                    let arr = isAssgin ? menu[i]['assginUsers'].map((item, index) => {
                                        return {
                                            key: item.pk,
                                            user_name: { value: item.name },
                                            user_code: { value: item.code },

                                        }
                                    }) : []
                                    let obj = Object.assign({}, this.state.data, { chosen: i })
                                    this.setState({ dataSource: arr, data: obj })
                                    break
                                }
                            }
                            this.setState({ menu: menu, isAssgin: isAssgin })
                        }
                    },
                    error: (res) => {
                        toast({ color: 'danger', content: res.message });
                    }
                });
            }
        } else {
            let menu = nextProps.menu
            let isAssgin = false
            if (menu.length) {
                for (let i = 0; i < menu.length; i++) {
                    if (menu[i]['choiced']) {
                        isAssgin = menu[i]['isAssgin']
                        let arr = isAssgin ? menu[i]['assginUsers'].map((item, index) => {
                            return {
                                key: item.pk,
                                user_name: { value: item.name },
                                user_code: { value: item.code },

                            }
                        }) : []
                        let obj = Object.assign({}, this.state.data, { chosen: i })
                        this.setState({ dataSource: arr, data: obj })
                        break
                    }
                }
                this.setState({ menu: menu, isAssgin: isAssgin })
            }
        }
    }

    shouldComponentUpdate = (nextProps = {}, nextState = {}) => {
        const thisProps = this.props || {},
            thisState = this.state || {};
        if (
            Object.keys(thisProps).length !== Object.keys(nextProps).length ||
            Object.keys(thisState).length !== Object.keys(nextState).length
        ) {
            return true;
        }
        for (const key in nextProps) {
            if (!is(thisProps[key], nextProps[key])) {
                return true;
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    };

    // 下游分支确定事件
    submit = (key) => {
        if (this.state.isAssgin) {
            if (!this.state.assginuserKey.length) {
                // index_001 请选择指派人
                return toast({ color: 'warning', content: this.state.json['index_001'] });
            }
        }
        if (!this.state.checknote) {
            // index_002 请填写工作批语
            return toast({ color: 'warning', content:  this.state.json['index_002'] });
        }
        promptBox({
            color: 'warning',
            content: this.state.json['index_003'], //'index_003 确定要提交审批内容吗？'
            noCancelBtn: true,
            beSureBtnClick: () => {
                this.pushApprovalContent(this.state.checknote);
            }
        })
    };

    // 刷新消息通知
    changeBenchNote = () => {
        let storage = window.localStorage;
        storage.newMessage = 'workBenchMessage';
    }

    pushApprovalContent = (checknote) => {
        let hideDropDown = this.props.hideDropDown;
        if(!hideDropDown){
            let data = Object.assign({}, this.props.data, {
                afteractivity: this.state.menu,
                assginuser: this.state.assginuserKey,
                check_note: checknote,
            });
            let submitData = {
                url: this.props.url || '/nccloud/workflow/approvalcenter/workflowSingalPassAction.do',
                method: this.props.method || 'post',
                data,
                async: true,
                success: (res) => {
                    this.changeBenchNote();
                    if (typeof this.props.success === 'function') {
                        this.props.success(res);
                    }
                    toast({ color: 'success', content: res.message });
                    this.close();
                },
                error: (res) => {
                    if (typeof this.props.error === 'function') {
                        this.props.error(res);
                    }
                    toast({ color: 'danger', content: res.message });
                },
                mode: '',
                params: {},
                headers: { 'Content-Type': 'application/json;charset:UTF-8' }
            };
            ajax(submitData);
        }else{

            // let submitData = {
            //     url: '/nccloud/workflow/approvalcenter/workflowSingalEnableQueryAction.do',
            //     method: 'post',
            //     data: this.props.data,
            //     async: true,
            //     success: (res) => {
            //         if(res.data && res.data.content){
            //             this.setState({
            //                 isApproveAssign: true,
            //                 assignData: res.data,
            //                 assignDisplay: true
            //             });
            //         }else if(res.data && (res.data == "500" || res.data.code == "500")){
            //             toast({ color: 'danger', content: res.data.error });
            //         }else{
            //             this.approvePass([], checknote);
            //         }
            //     }
            // }
            this.props.onPass();
        }
    }
    //关闭下游分支模态框
    close = () => {
        this.setState({ checknote: '', assginuserKey: [], assginuser: '', show: false });
    };
    //切换下拉框列表显示隐藏事件
    onSwitchMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };
    onMenuVisibleChange = (value) => {
        // console.log(value);
        // this.setState({menuVisible: value})
    };
    // 选择批复下拉列表触发事件
    onSelect = ({ key }) => {
        if (key !== 'revocation') {
            if (key === 'downstream') {    // 下游环节
                this.setState({ show: true });
            } else if (key === 'reassignment') { // 改派
                this.setState({ showReassignment: true })
                this.refs.reassignmentModal.open()
            }
        } else {
            this.refs.approvalRevocation.open();
        }
    };
    onSelectBranch = ({ key }) => {
        this.handleBranchChange(key)
        // checknote: this.props.checknote || '',
            this.setState({ show: true, checknote: this.props.checknote || '' });
    };
    // 批复模态框内change事件
    handleBranchChange = (value) => {

        let itemIndex = Number(value)
        let obj = Object.assign({}, this.state.data, { chosen: itemIndex })
        this.setState({ data: obj });
        this.state.menu.forEach((item, index) => {
            if (value != index) {
                item.isChoice = false
            } else {
                item.isChoice = true
            }
        })
        let { isAssgin, assginUsers } = this.state.menu[itemIndex];
        let arr = isAssgin ? assginUsers.map((item, index) => {
            return {
                key: item.pk,
                user_name: { value: item.name },
                user_code: { value: item.code },

            }
        }) : []
        this.setState({ isAssgin, dataSource: arr })
    }
    handleDesChange = (value) => {
        this.setState({ checknote: value });
    };
    // 显示工作流程触发事件
    goWorkflow = (e) => {
        this.setState({
            showApproveDetail: true
        })
    }
    // 模态框内改派事件
    showShuttle = (e) => {
        this.refs.SingleTargetTransferModal.open()
    }
    // 关闭工作流程触发事件
    closeApproveDetail = () => {
        this.setState({
            showApproveDetail: false
        })
    }

    // 模态框内改派change事件
    onSingleTargetTransferChange = (targetKeys) => {
        let userNameArr = targetKeys.map(item => {
            return item.user_name.value
        })
        let userKeyArr = targetKeys.map(item => {
            return item.key
        })
        let userName = userNameArr.join(',')
        this.setState({
            assginuser: userName,
            assginuserKey: userKeyArr

        })
    }
    // 下拉框改派btn显示modal后确定事件
    onReassignmentSubmit = (targetKeys) => {
        let key = targetKeys.map((item)=>{
            return item['key']
        })
        let user = targetKeys.map((item)=>{
            return item['user_name']['value']
        })
        this.setState({
            assginuserKey: key,
            assginuser: user.join(','),
        }, () => {
            promptBox({
                color: 'warning',
                content: `${this.state.json['index_008']}${this.state.assginuser}？`, // index_008 确定要将任务改派给
                noCancelBtn: true,
                beSureBtnClick: () => {
                    let data = {
                        pk_checkflow: this.state.pk_checkflow,
                        billtype: this.state.billtype,
                        billid: this.state.billid,
                        trans_user: this.state.assginuserKey,
                    }
                    this.submitTransfer(data);
                }
            })
        })
    }
    // 改派提交事件
    submitTransfer = (data) => {
        ajax({
            url: '/nccloud/workflow/approvalcenter/approveTransfer.do',
            data: data,
            method: 'post',
            success: (res) => {
                this.changeBenchNote();
                if (res.data) {
                    if (res.data && (res.data == "200" || res.data.code == "200")) {
                        toast({content: this.state.json['index_004'] ,color: 'success'}); // index_004 操作成功
                    }
                }
            }
        });
    }
    changeAssginuser = () => {
    }
    clearAssginuser = (e) => {
        e.stopPropagation()
        this.setState({
            assginuser: ''
        })
    }
    onSubmitApprove = () => {

        // if (!this.props.checknote) {
        //     return toast({ color: 'warning', content: '请输入工作批语' });
        // }
        // promptBox({
        //     color: 'warning',
        //     content: '确定要提交审批内容吗？',
        //     noCancelBtn: true,
        //     beSureBtnClick: () => {
        //         this.pushApprovalContent(this.props.checknote);
        //     }
        // })
        this.pushApprovalContent(this.props.checknote);
    }

    render() {
        let menu = null
        let {json} = this.state;
        let { hideDropDown } = this.props
        if (!this.props.hideList) {
            menu = (
                <NCMenu
                    className={`${this.state.showMenu
                        ? 'approval-opinions-menu-wrapper'
                        : 'approval-opinions-menu-wrapper hide-menu'}`}
                    onClick={this.onSelect}
                >
                    <NCItem fieldid="downstream" className="approval-opinions-menu-item" key="downstream">
                        {/* index_009 下游环节 */}
                        {json['index_009']}
                    </NCItem>

                    {!this.props.hideReassignment ? (
                        <NCItem fieldid="reassignment" className="approval-opinions-menu-item" key="reassignment">
                            {/* index_010 改派 */}
                            {json['index_010']}
                        </NCItem>
                    ) : (
                        ''
                    )}
                    {!this.props.hideRevocation ? <NCDivider /> : ''}
                    {!this.props.hideRevocation ? (
                        <NCItem fieldid="revocation" className="approval-opinions-menu-item" key="revocation">
                            {/* index_011 撤销 */}
                            {json['index_011']}
                        </NCItem>
                    ) : ''}
                </NCMenu>
            );
        } else {
            menu = (
                <NCMenu
                    className={`${this.state.showMenu
                        ? 'approval-opinions-menu-wrapper'
                        : 'approval-opinions-menu-wrapper hide-menu'}`}
                    onClick={this.onSelectBranch}
                >
                    {this.state.menu.map((item, index) => {
                        return (
                            <NCItem fieldid={`reply-item-${index}`} className="approval-opinions-menu-item" key={index}>
                                {item.desc}
                            </NCItem>
                        );
                    })}

                </NCMenu>
            );
        }
        const tipC = (
            <div>
                {/* index_012 点击清除 */}
                {json['index_012']}
            </div>
        )
        const tipO = (
            <div>
                {/* index_013 点击查看用户 */}
                {json['index_013']}
            </div>
        )
        return (
            <div className="approval-opinions-wrapper">
                {!hideDropDown && (<NCDropdown
                    fieldid="dropdown"
                    className={this.props.dropdownClass}
                    trigger={['click']}
                    overlay={menu}
                    animation="slide-up"
                    onVisibleChange={this.onMenuVisibleChange}
                    overlayClassName="fieldid_reply_list"
                >
                    <div className="approval-opinions-btn-wrapper">
                        <div className="btn-left-output clearfix">
                            <NCButton fieldid="reply" className="btn-left" onClick={this.onSwitchMenu}>
                                {/* index_005 批复 */}
                                {this.props.dropDownBtnTxt || json['index_005']}
                            </NCButton>
                            <NCButton fieldid="reply-arrow" className="btn-right" onClick={this.onSwitchMenu}>
                                <NCIcon className="btn-right-icon" type="uf-treearrow-down" />
                            </NCButton>
                        </div>
                    </div>
                </NCDropdown>)}
                {
                    hideDropDown && (<NCButton fieldid="reply" className="btn-left" colors={'primary'} onClick={this.onSubmitApprove}>
                        {/* index_005 批复 */}
                        {this.props.dropDownBtnTxt || json['index_005']}
                    </NCButton>)
                }
                <NCModal fieldid="business-process" className='approval-opinions-modal-wrapper' key="officialModal" visible={this.state.show}>
                    <NCModal.Header className="approval-opinions-header">
                        {/* index_006 业务处理 */}
                        <NCModal.Title fieldid={this.props.modalTitle || json['index_006']}>{this.props.modalTitle || json['index_006']}</NCModal.Title>
                        <NCIcon type="uf-close-bold" className="modal-header-close-btn dnd-cancel" onClick={this.close} />
                    </NCModal.Header>

                    <NCModal.Body>
                        <div className="modal-body-wrapper">
                            <div className="form-wrapper clearfix">
                                {/* index_014 选择后继分支 */}
                                <div className="label-wrapper">{json['index_014'] + ':'}</div>
                                <div className="form-item-wrapper">
                                    <NCRadio.NCRadioGroup
                                        name="fruit"
                                        selectedValue={this.state.data.chosen}
                                        onChange={this.handleBranchChange.bind(this)}
                                    >
                                        {this.state.menu.map((item, index) => {
                                            return (
                                                <NCRadio className="nc-radio-wrapper" value={index}>
                                                    {item.desc}
                                                </NCRadio>
                                            );
                                        })}
                                    </NCRadio.NCRadioGroup>
                                </div>
                            </div>
                            {this.state.isAssgin && (<div className="form-wrapper clearfix">
                                {/* index_015 指派给 */}
                                <div className="label-wrapper">{json['index_015'] + ':'}</div>
                                <div className="form-item-wrapper">
                                    <div className="designate-input-wrapper " onClick={this.showShuttle}>
                                        {/*{`${this.state.assginuser.join()}`}*/}
                                        {/* index_007 点击选择指派人员*/}
                                        <NCInput value={this.state.assginuser} onChange={this.changeAssginuser}
                                                 placeholder={json['index_007']}></NCInput>
                                        <span className={'designate-input-icon-wrapper'}>
                                            {this.state.assginuser ? (
                                                <NCTooltip inverse overlay={tipC}><NCIcon
                                                    className={'designate-icon'} type={'uf-close-c'}
                                                    onClick={this.clearAssginuser}></NCIcon></NCTooltip>) : (
                                                <NCTooltip inverse overlay={tipO}
                                                         onClick={this.showShuttle}><NCIcon className={'designate-icon'}
                                                                                          type={'uf-eye-c-o'}></NCIcon></NCTooltip>)}
                                        </span>
                                    </div>
                                </div>
                            </div>)}
                            <div className="form-wrapper clearfix" style={{ marginBottom: '40px' }}>
                                {/* index_016 批示内容 */}
                                <div className="label-wrapper">{json['index_016'] + ':'}</div>
                                <div className="form-item-wrapper">
                                    <NCTextArea
                                        fieldid="comment"
                                        name="des"
                                        className="des-wrapper"
                                        value={this.state.checknote}
                                        max={200}
                                        showMax={true}
                                        onChange={this.handleDesChange}
                                    />
                                    <a className="work-flow" onClick={this.goWorkflow} href="javascript:;">
                                        {/* index_017 工作流程 */}
                                        {json['index_017']}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </NCModal.Body>

                    <NCModal.Footer>
                        <NCButton fieldid="confirm" onClick={this.submit} colors="primary">
                            {/* index_018 确认 */}
                            {json['index_018']}
                        </NCButton>
                        <NCButton fieldid="cancel" onClick={this.close} colors="info">
                            {/* index_019 取消 */}
                            {json['index_019']}
                        </NCButton>
                    </NCModal.Footer>
                </NCModal>
                <ApprovalRevocation ref="approvalRevocation" data={Object.assign({}, this.props.data, ...this.props.billMessage)} />
                <ApproveDetail
                    show={this.state.showApproveDetail}
                    close={this.closeApproveDetail}
                    billtype={this.props.data.billtype}
                    billid={this.props.data.billid}
                />
                <SingleTargetTransferModal ref={'SingleTargetTransferModal'}
                                           dataSource={this.state.dataSource}
                                           changeCallback={this.onSingleTargetTransferChange}
                />
                <SingleTargetTransferModal ref={'reassignmentModal'}
                                           changeCallback={this.onReassignmentSubmit}
                />
            </div>
        );
    }
}
