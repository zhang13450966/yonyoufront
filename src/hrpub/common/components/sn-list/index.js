/**
 * Created by wanghongxiang on 2018/6/21.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';

const {NCTable, NCCheckbox} = base;
import './index.less'

const propTypes = {
    config: PropTypes.object
};
const defaultProps = {
    closeLabel: 'Close alert',
};

class SnList extends Component {
    constructor() {
        super();
        this.state = {
            leftList: [],//左侧数据
            rightList: [],//右侧数据
            checkedArray: [],//右侧checkbox状态数组
            tableCheckedAll: false,//table全选flag
            checkedAllFlag: false,//右侧全选flag
            tableCheckedArray: [],//table中checkbox选中状态数组
            leftSelectedData: [],//左侧选中的数据
            index: '',//左侧选中的index
            tableColumnsFirst: []
        };
        this.onAllCheckboxChange = this.onAllCheckboxChange.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
    }

    componentWillReceiveProps(props) {
        this.state.leftList = props.config;
        this.state.josn = props.json
        if (props.isClear) {
            // if( this.state.tableCheckedArray.length === 0 && this.state.tableCheckedAll ===false){
            //
            // }
            this.state.checkedArray = []
            this.state.tableCheckedAll = props.tableCheckedAll
            this.state.tableCheckedArray = props.tableCheckedArray
            this.state.checkedAllFlag = false
            this.state.leftSelectedData = []
            this.state.rightList = []
        }
        this.setState(this.state, function () {
            this.creatState(this.state.josn)
        })

    }

    creatState(json) {
        if (JSON.stringify(json) !== '{}') {
            let tableColumnsFirst = [
                {
                    title: json['i6013-000224'],
                    dataIndex: "orgname",
                    key: "orgname",
                    width: 85
                },
                {
                    title: json['i6013-000225'],
                    dataIndex: "code",
                    key: "code",
                    width: 85
                },
                {
                    title: json['i6013-000226'],
                    dataIndex: "name",
                    key: "name",
                    width: 85
                },
                {
                    title: json['i6013-000227'],
                    dataIndex: "cyear",
                    key: "cyear",
                    width: 85
                },
                {
                    title: json['i6013-000228'],
                    dataIndex: "cperiod",
                    key: "cperiod",
                    width: 85
                },
                {
                    title: json['i6013-000229'],
                    dataIndex: "mutipleflag",
                    key: "mutipleflag",
                    width: 85
                }
            ];
            this.setState({
                tableColumnsFirst: tableColumnsFirst,
                rightName: json['i6013-000671']
            })
        }
    }

    componentDidMount(props) {

    }

    onAllCheckboxChange(checkedArr, checkedAll) {
        let self = this;
        let length = '';
        let leftSelectedData = self.state.leftSelectedData.concat()//左侧选中的数据
        if (checkedArr == 'tableCheckedArray') {//如果是点击左边列表的checkbox
            length = self.state.leftList.length
            if (!self.state[checkedAll]) {
                // self.setState({
                //     leftSelectedData:self.state.leftList
                // })
                self.state.leftSelectedData = self.state.leftList
            }//如果左侧全选则leftSelectedData为self.state.leftList
            else {
                // self.setState({
                //     leftSelectedData:[]
                // })
                self.state.leftSelectedData = []
            }//否则leftSelectedData为空
        }
        else {//sn-list的右侧checkbox被选中时
            length = self.state.rightList.length;
            let data = self.state.leftSelectedData
            if (!self.state[checkedAll]) {
                //由于后台需要的请求参数字符串为
                // "dataJson":[
                //  {"":'',
                //"zeroClassItemVOs":[{
                //'':'',
                //'':''
                //  }]
                //}]
                //这种形式，因此此处需要封装对象
                data[self.state.index].zeroClassItemVOs = self.state.rightList//全选则将右侧全部数据赋值给封装好的数组对象
                // self.setState({
                //     leftSelectedData:data
                // })
                self.state.leftSelectedData = data
            }
            else {
                data[self.state.index] = [];
                // self.setState({
                //     leftSelectedData:data
                // })
                self.state.leftSelectedData = []
            }
        }
        let checkedArray = [];


        if (checkedArr == 'tableCheckedArray') {
            for (var i = 0; i < length; i++) {
                checkedArray[i] = !self.state[checkedAll];
            }
            self.state[checkedArr] = checkedArray
            self.state[checkedAll] = !self.state[checkedAll]
        } else {
            for (var i = 0; i < length; i++) {
                checkedArray[i] = !self.state[checkedAll + self.state.index];
            }
            self.state[checkedArr + self.state.index] = checkedArray
            self.state[checkedAll + self.state.index] = !self.state[checkedAll + self.state.index]
        }
        self.setState(self.state, function () {
            self.props.getData(self.state.leftSelectedData)
        })
    }

    onCheckboxChange(index, checkedArr, checkedAll, type) {
        let self = this;
        let allFlag = false;
        let checkedArray = checkedArr == 'tableCheckedArray' ? self.state[checkedArr].concat() : self.state['checkedArray' + self.state.index].concat();
        checkedArray[index] = checkedArr == 'tableCheckedArray' ? !self.state[checkedArr][index] : !self.state['checkedArray' + self.state.index][index];
        let length = '';
        let leftSelectedData = self.state.leftSelectedData.concat()//左侧选中的数据
        if (checkedArr == 'tableCheckedArray') {
            self.setState({
                index: index
            })
            length = self.state.leftList.length
            if (checkedArray[index]) {
                leftSelectedData[index] = self.state.leftList[index]
            }
            else {
                leftSelectedData[index] = []
            }

        }
        else {
            length = self.state.rightList.length;
            if (self.state.leftSelectedData[self.state.index].zeroClassItemVOs) {
                //如果leftSelectedData已经有了zeroClassItemVOs属性，则需要此次选中与之前数据合并
                leftSelectedData[self.state.index].zeroClassItemVOs = self.state.leftSelectedData[self.state.index].zeroClassItemVOs.concat()
            } else {
                leftSelectedData[self.state.index].zeroClassItemVOs = [];//没有属性则定义此属性 且为空
            }
            if (checkedArray[index]) {
                leftSelectedData[self.state.index].zeroClassItemVOs.push(self.state.rightList[index])
                //选中则将当前右侧选中数据push到他对应的左侧项目中，self.state.index为当前左侧所选中的index
            }
            else {
                leftSelectedData[self.state.index].zeroClassItemVOs.pop(self.state.rightList[index])
            }
        }
        for (var i = 0; i < length; i++) {
            if (!checkedArray[i]) {
                allFlag = false;
                break;
            } else {
                allFlag = true;
            }
        }
        if (checkedArr === 'tableCheckedArray') {
            self.state[checkedArr] = checkedArray
            self.state[checkedAll] = allFlag
        } else {
            self.state['checkedArray' + self.state.index] = checkedArray
            self.state[checkedAll + self.state.index] = allFlag
            self.state.indeterminate_bool = !allFlag
        }
        self.state.leftSelectedData = leftSelectedData
        self.setState(self.state, function () {
            self.props.getData(leftSelectedData)
        })
        // self.setState({
        //     self.stat},function(){
        //     self.props.getData(self.state.leftSelectedData)//通过getData进行父子组件通信，将sn-list选中的数据传给父组件
        // });
    }

    renderColumnsMultiSelect(columns, checkedArr, checkedAllFlag) {
        let checkedArray = this.state[checkedArr];
        let checkedAll = this.state[checkedAllFlag];
        const multiSelect = {
            type: "checkbox",
            param: "key"
        };
        let indeterminate_bool = false;
        if (multiSelect && multiSelect.type === "checkbox") {
            let i = checkedArray.length;
            while (i--) {
                if (checkedArray[i]) {
                    indeterminate_bool = true;
                    break;
                }
            }
            let defaultColumns = [
                {
                    title: (
                        <NCCheckbox
                            className="table-checkbox"
                            checked={checkedAll}
                            indeterminate={indeterminate_bool && !checkedAll}
                            onChange={this.onAllCheckboxChange.bind(this, checkedArr, checkedAllFlag)}
                        />
                    ),
                    key: "checkbox",
                    dataIndex: "checkbox",
                    width: "5%",
                    render: (text, record, index) => {
                        return (
                            <NCCheckbox
                                className="table-checkbox"
                                checked={checkedArray[index]}
                                onChange={this.onCheckboxChange.bind(this, index, checkedArr, checkedAllFlag, 'left')}
                            />
                        );
                    }
                }
            ];
            columns = defaultColumns.concat(columns);
        }
        return columns;
    }

    onRowClick(record, index) {
        ajax({
            url: '/nccloud/hrwa/end/QueryItemAction.do',
            data: {
                "pk_org": record.pk_org,
                "pk_wa_class_arrays": record.pk_wa_class,
                "node_type": "ORG_NODE"
            },
            success: (result) => {
                let data = JSON.parse(result.data);
                this.state.index = index
                this.state.rightList = data[0].unsetZeroclassItemVOs
                this.state['checkedArray' + index] = this.state['checkedArray' + index] || []
                this.setState(this.state)
            }
        })
    }

    render() {
        let columnsFirst = this.renderColumnsMultiSelect(this.state.tableColumnsFirst, 'tableCheckedArray', 'tableCheckedAll');
        return (
            <div className="sn-list">
                <div className="sn-left-list">
                    <div>
                        <NCTable columns={columnsFirst} data={this.state.leftList}
                                 onRowClick={this.onRowClick.bind(this)}/>
                    </div>
                </div>
                <div className="sn-right-list">
                    <div className="sn-right-list-header">
                        <NCCheckbox onChange={this.onAllCheckboxChange.bind(this, 'checkedArray', 'checkedAllFlag')}
                                    checked={this.state['checkedAllFlag' + this.state.index]}
                                    className='header-checkbox'
                                    disabled={!this.state.tableCheckedArray[this.state.index]}
                                    indeterminate={this.state.indeterminate_bool}
                        ></NCCheckbox>
                        {/*{this.state.json['i6013-000671']}*/}
                        {this.state.rightName}
                    </div>
                    <ul className="sn-right-list-content">
                        {
                            this.state.rightList ? this.state.rightList.map((item, index) => {
                                    return (
                                        <li key={item.value}>
                                            <div>
                                                <NCCheckbox
                                                    onChange={this.onCheckboxChange.bind(this, index, 'checkedArray', 'checkedAllFlag', 'right')}
                                                    checked={this.state['checkedArray' + this.state.index][index]}
                                                    disabled={!this.state.tableCheckedArray[this.state.index]}></NCCheckbox>
                                                {/*//disabled={this.state.tableCheckedArray[this.state.index]}*/}
                                                <span>{item.name}</span>
                                            </div>
                                        </li>
                                    )
                                })
                                : ''
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

SnList.propTypes = propTypes;
SnList.defaultProps = defaultProps;

export default SnList;
