
export let CONSTANT = {
  twoTableId: "set_calculation_index_table_meta",
  set_calculation_index_table_meta: function () {
    return {
      "items": [
        {
          "hyperlinkflag": false,
          "islock": false,
          "istotal": false,
          "width": "200px",
          "attrcode": "name",
          "color": "#555555",
          "containlower": false,
          "datatype": "1",
          "disabled": false,
          "editAfterFlag": false,
          "fieldDisplayed": "refname",
          "fieldValued": "refpk",
          "isDataPowerEnable": true,
          "isnotmeta": false,
          "isResLabel": false,
          "isrevise": false,
          "isShowUnit": false,
          "itemtype": "input",
          "label": $appRoot && $appRoot.state.json['public_lang-000002'],/* 国际化处理： 计算指标名称*/
          "maxlength": "20",
          "onlyLeafCanSelect": false,
          "position": "1",
          "required": false,
          "scale": "0",
          "visible": true
        },
        {
          "hyperlinkflag": false,
          "islock": false,
          "istotal": false,
          "width": "600px",
          "attrcode": "content",
          "color": "#555555",
          "containlower": false,
          "datatype": "1",
          "disabled": false,
          "editAfterFlag": false,
          "fieldDisplayed": "refname",
          "fieldValued": "refpk",
          "isDataPowerEnable": true,
          "isnotmeta": false,
          "isResLabel": false,
          "isrevise": false,
          "isShowUnit": false,
          "itemtype": "input",
          "label": $appRoot && $appRoot.state.json['public_lang-000003'],/* 国际化处理： 计算指标公式内容*/
          "maxlength": "20",
          "onlyLeafCanSelect": false,
          "position": "2",
          "required": false,
          "scale": "0",
          "visible": true
        },
        {
          attrcode: 'operation',
          label: $appRoot && $appRoot.state.json['public_lang-000004'],/* 国际化处理： 操作*/
          fixed: "right",
          visible: true,
          width: 200,
          render: (text, record, index) => {
            return (
                <div className="opr-line">
                   <a onClick = {()=>{
                     console.log($appRoot && $appRoot.state.json['public_lang-000005'],this,text, record, index);/* 国际化处理： 点击确定回调*/
                      // 设置表格数据
                      let contentConfig = [];
                      contentConfig[0] = {
                          key:"key1",
                          content:record.values.content.value,//如果有值  在切换或者初始化进入以后会渲染该值
                      };
                      let getParms = (key)=>{
                            switch(key){
                              case "Mselect.target":
                                return {
                                  pk_org:(()=>{
                                    if(this.props.that.getListDef){
                                        return this.props.that.getListDef("pageConfig").org.refpk;
                                    }
                                  })(),
                                  // pk_busiprop:"0001Z0100000000005CQ",
                                  busi_prop:(()=>{
                                    if(this.props.that.getListDef){
                                        return this.props.that.getListDef("pageConfig").busiattr.refpk;
                                    }
                                  })(),
                                };
                                break;
                              default:
                                return {};
                            }
                          
                      }
                     this.props.unitFormula.showModel({
                      contentConfig:contentConfig,
                      getParms:getParms,
                      beSureBtnClick:(data)=>{
                        console.log($appRoot && $appRoot.state.json['public_lang-000005'],data,"set_calculation_index_table_meta",);/* 国际化处理： 点击确定回调*/
                        this.props.editTable.setValByKeyAndIndex(
                          "set_calculation_index_table_meta",
                          index,
                          "content",
                          {display:data,value:data}
                          )
                        this.props.unitFormula.closeModel()
                      }
                     },{
                          
                     });
                   }}>{$appRoot && $appRoot.state.json['public_lang-000007']}</a>{/* 国际化处理： 设置*/}
                </div>
            )
          }
          ,
          itemtype: 'customer'
          // refcode:'pk_org'
        }
      ],
      "moduletype": "table",
      "pagination": false,
      "position": "5",
      "code": "set_calculation_index_table_meta",
      "name": $appRoot && $appRoot.state.json['public_lang-000006'],/* 国际化处理： 虚拟大区*/
      "oid": "1001ZE1000000000RQGQ",
      "areaVisible": true,
      "isunfold": true,
      "isnotmeta": false,
      "appcode": "182001016A",
      "pagecode": "182001016A_list",
      "templateCode": "182001016A_list",
      "pageid": "1001ZE1000000000OZJ4"
    }
  }

}
