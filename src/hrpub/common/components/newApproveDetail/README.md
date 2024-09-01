
## 单据审批详情组件
   * 继承平台写的审批详情组件
   [http://git.yonyou.com/nc-pub/Public_Document/blob/master/%E5%89%8D%E7%AB%AF/%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/%E6%89%93%E5%8D%B0%E3%80%81%E5%8D%95%E6%8D%AE%E8%BF%BD%E6%BA%AF%E3%80%81%E5%B7%A5%E4%BD%9C%E6%B5%81%E3%80%81%E5%AE%A1%E6%89%B9%E6%B5%81/%E5%8D%95%E6%8D%AE%E5%AE%A1%E6%89%B9%E8%AF%A6%E6%83%85%E6%8C%89%E9%92%AE.md]

   * 参数
    * billid: 单据主键
    * billtype： 单据类型

   ```
    <NewApproveDetail
      show={this.state.approveDetailShow}
      close={this.closeApprove.bind(this)}
      billtype='6301'
      billid={this.state.billid}
     />