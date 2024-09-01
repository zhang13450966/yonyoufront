import React, {Component} from 'react';
import {high,ajax} from 'nc-lightapp-front';
import ApproveDetail from 'uap/common/components/ApproveDetail';
// const { ApproveDetail } = high;
class NewApproveDetail extends ApproveDetail {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
		if (this.props.show && this.props.billtype && this.props.billid) {
			this.getLangMulti(this.props.billtype, this.props.billid);
		}
	}
    componentWillReceiveProps(nextProps) {
        let { show = false, billtype, billid } = nextProps;
		// console.log(show, this.props.show,this.props.billtype, billtype, this.props.billid, billid)
		if (show && billtype && billid) {
			//请求审批详情图片
			this.getLangMulti(billtype, billid);
		}
    }

    getLangMulti = (billtype, billid) => {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({ json, inlt,
					colorList:[
						{ display: json["ApproveDetail_013"], value: 'has-approve' },//已审
						{ display: json["ApproveDetail_014"], value: 'not-approve' },//未审
						{ display: json["ApproveDetail_015"], value: 'curr-link' },//当前环节
						{ display: json["ApproveDetail_016"], value: 'forecast-link' }//预测环节
					] 
				}, () => {
					this.getData(billtype, billid);
				});
			} else {
				console.log('未加载到 containers_Process_Revocation_Detail.json 多语资源');
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: 'containers_Process_Revocation_Detail', callback });
	}

    
    //请求流程数据，表格数据及模板
    getData = (billtype, billid) => {
        this.getTableColumns()
        this.getStatus(billtype, billid)
        // this.getActivityInfoData(billtype, billid);

        //请求审批记录数据和列信息
        ajax({
            url: '/nccloud/workflow/approvalcenter/worklownoteHistoryQuery.do',
            data: {
                billtype: billtype,
                billid: billid,
                workflow_type:'0'
            },
            method: 'post',
            loading: false,
            success: (res) => {
                if (res.data && res.data.historymsg) {
                    let oids = []
                    for (let item of res.data.historymsg.rows) {
                        oids.push(item.values.pk_historymsg.value)
                    }
                    this.setState({
                        oids: oids,
                        tableData: res.data.historymsg
                    })
                }else{
                    this.setState({
                        oids: [],
                        tableData: []
                    })
                }
            }
        })

    }
}
export  default  NewApproveDetail;