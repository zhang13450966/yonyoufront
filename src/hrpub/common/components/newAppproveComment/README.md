
## 审批流审批弹窗组件

  * 继承平台写的审批弹窗组件，目的是为了可以随意显示弹窗的按钮

  * 参数
    * billid: 单据主键
    * billtype： 单据类型
    * wokfowtype: 流程类型（审批流/工作流)
    * pk_detail: 审批详情主键
    * approveType: 是否是审批流类型
    * pagecode：节点编码
    * btns: 审批弹窗上需要展示的按钮
    * pk_checkflow ：审批详情主键
    * onHandleSuccess ： 按钮事件成功的回调

    ```
     <NewApproveComment
       billMessage={
        {
            billid: this.state.billid,
            billtype: '6301',
            wokfowtype: '2',
            pk_detail: this.state.pk_detail,
            pk_org: this.state.pk_org,
            approveType: this.state.approveType,
            pagecode: this.config.pagecode
        }}
       btns={this.state.btns}
       pk_checkflow={this.state.pk_detail}
       onHandleSuccess={this.handleSuccess.bind(this)}/>