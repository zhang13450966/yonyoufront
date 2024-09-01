import React from 'react';
import { base, toast } from 'nc-lightapp-front';
const { NCModal, NCTable, NCButton, NCTextArea, NCCheckbox } = base;
const { Header, Body, Footer, Title } = NCModal;

export class EditModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showAddCommon: false,  // 是否显示添加意见弹框
            show: props.showEdit, // 是否显示本弹框
            list: [...props.commonList],
            editValue: '', // 编辑的条目
            editIndex: null, // 编辑条目的索引 null 为新增
            title: '', // 新增弹框标题
        };
        this.close = this.close.bind(this);
        this.editItem = this.editItem.bind(this);
        this.delItem = this.delItem.bind(this);
        // this.moveUp = this.moveUp.bind(this);
        // this.moveDown = this.moveUp.bind(this);
        this.closeAddCommon = this.closeAddCommon.bind(this);
        this.setItemValue = this.setItemValue.bind(this);
        this.onDropRow = this.onDropRow.bind(this);
        this.finishEdit = this.finishEdit.bind(this);

        this.columns = [
            {
                title: props.json['commonlist_014'], // commonlist_014 序号
                width: 50,
                render(text, record, index){
                    return index + 1;
                }
            },
            {
                title: props.json['commonlist_015'], // commonlist_015 常用审批意见
                width: 400,
                dataIndex: 'con',
            },{
                title: props.json['commonlist_013'], // commonlist_013 操作
                width: 100,
                render: (text, record, index) => {
                    return (
                        <div className="operation-btn">
                            {/* commonlist_002 删除 */}
                            <a href="javascript:;" onClick={() => this.delItem(index)}>{props.json['commonlist_002']}</a>
                            {/* commonlist_003 修改 */}
                            <a href="javascript:;" onClick={() => this.editItem(index)}>{props.json['commonlist_003']}</a>
                            {/* <a href="javascript:;" onClick={this.moveUp}>上移</a>
                            <a href="javascript:;" onClick={this.moveDown}>下移</a> */}
                        </div>
                    );
                }
            }
        ];
    }


    componentDidMount(){
        window.document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = e => {
        if(e.altKey){
            if(e.keyCode == 89){ //y
                // e.nativeEvent.stopImmediatePropagation();
                e.stopPropagation();
                this.finishEdit(e);
            }else if(e.keyCode == 78){// n
                // e.nativeEvent.stopImmediatePropagation();
                e.stopPropagation();
                this.close(e);
            }
        }
    }

    close(e){
        this.props.showEditModal();
    }

    closeAddCommon(){
        this.setState({ showAddCommon: false });
    }

    delItem(index){
        this.setState(prevState => ({
            list: prevState.list.filter((item, idx) => idx != index )
        }));
    }

    editItem(index){
        if(index == undefined){
            // 新增
            this.setState({
                showAddCommon: true,
                editValue: '',
                editIndex: null,
                title: this.props.json['commonlist_004'] // commonlist_004 新增常用审批意见
            });
        }else{
            // 编辑
            this.setState({
                showAddCommon: true,
                editValue: this.state.list[index],
                editIndex: index,
                title: this.props.json['commonlist_005'] // commonlist_005 编辑常用审批意见
            });
        }
    }

    // 添加弹框返回数据
    setItemValue = (value, index, isTop) =>{
        if(index == undefined){
            // 新增
            let list = this.state.list;
            if(isTop){
                list.unshift(value);
            }else{
                list.push(value);
            }
            this.setState({list});
        }else{
            // 编辑
            this.setState(prevState => {
                let list = prevState.list;
                    list[index] = value;
                if(isTop){
                    // 置顶
                    list.unshift(list.splice(index, 1)[0]);
                }
                return {list};
            });
        }
    }

    onDropRow = (data, record, targetIndex) => {
        console.log('onDrop', this.state.list, data, targetIndex);
        this.setState({
            list: data.map(item => item.con)
        });
    }

    onDragRowStart = (record, index) => {
        console.log('start', index, record);
    }

    finishEdit= (e) =>{
        let data = { checknotes: this.state.list};
        this.props.finishEdit(data);
    }

    stopPropagation = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    render(){
        let { showAddCommon, show, list, editValue, editIndex, title } = this.state;
        let json = this.props.json;
        let listData = list.map((item,index) => ({con: item, key: index}));
        // console.log('listData', listData)
        return(
            <React.Fragment>
            <NCModal fieldid="commonlist" width={680} visible={show} onCancel={this.close}>
                <Header closeButton>
                    {/* commonlist_006 自定义常用批语 */}
                    <Title fieldid={json['commonlist_006']}>{json['commonlist_006']}</Title>
                </Header>
                <Body className="editModal">
                    <div className="editModalBody" onClick={this.stopPropagation}>
                        {/*  commonlist_007 新增 */}
                        <div className="addNewBtn"><NCButton fieldid="addNewComment" colors="primary" onClick={() => this.editItem()}>{json['commonlist_007']}</NCButton></div>
                        <NCTable 
                            columns={this.columns} 
                            data={listData}
                            height={28}
                            rowDraggAble={true}
                            onDragRowStart={this.onDragRowStart}
                            onDropRow={this.onDropRow}
                            scroll={{y: 300}}
                            bordered
                        />
                    </div>
                </Body>
                <Footer>
                    {/* commonlist_008 确认 */}
                    <NCButton fieldid="commonlist-confirm" colors="primary" onClick={this.finishEdit}>{json['commonlist_008']}</NCButton>
                    {/* commonlist_009 取消 */}
                    <NCButton fieldid="commonlist-cancel" onClick={this.close}>{json['commonlist_009']}</NCButton>
                </Footer>
            </NCModal>
            {showAddCommon && <AddCommon 
                editValue={editValue} 
                editIndex={editIndex}
                title={title}
                showAddCommon={showAddCommon} 
                setItemValue={this.setItemValue}
                closeAddCommon={this.closeAddCommon}
                json={json}
            />}
            </React.Fragment>
        )
    }
}

export class AddCommon extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show: props.showAddCommon,
            content: props.editValue,
            isTop: false // 是否置顶
        };
        this.close = this.close.bind(this);
        this.confirmAdd = this.confirmAdd.bind(this);
        this.changeContent = this.changeContent.bind(this);
        this.setTop = this.setTop.bind(this);
    }

    close(e){
        // e.nativeEvent.stopImmediatePropagation();
        this.props.closeAddCommon();
    }
    componentDidMount(){
        window.document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = e => {
        if(e.altKey){
            if(e.keyCode == 89){ //y
                this.confirmAdd(e);
                e.stopPropagation();
            }else if(e.keyCode == 78){// n
                this.close(e);
                e.stopPropagation();
            }
        }
    }

    changeContent(value){
        this.setState({
            content: value
        });
    }

    confirmAdd(e){
        // e.nativeEvent.stopImmediatePropagation();
        if(this.state.content == ''){
            // commonlist_010 请输入要添加的审批意见
            toast({color: 'warning', content: this.props.json['commonlist_010']});
            return;
        }
        this.props.setItemValue(this.state.content, this.props.editIndex, this.state.isTop);
        this.props.closeAddCommon();
    }

    setTop(value){
        this.setState({ isTop: value});
    }

    render(){
        let { content, show, isTop } = this.state, json = this.props.json;
        return (
            <NCModal 
            fieldid="edit-commonlist" 
            visible={show}
            size="md"
            onCancel={this.close} 
            onShow={()=>{
                if(this.text && this.text.refs && this.text.refs.rootTextArea){
                    console.log(this.text.refs)
                    this.text.refs.rootTextArea.focus();
                    this.text.refs.rootTextArea.selectionStart = this.text.refs.rootTextArea.value.length;
                    this.text.refs.rootTextArea.selectionEnd = this.text.refs.rootTextArea.value.length;
                }
            }}>                
            <Header closeButton>
                    <Title fieldid={this.props.title}>{this.props.title}</Title>
                </Header>
                <Body className="editModal">
                    <div className="addCommonBody">
                        <div className="flexWrapper">
                            {/* commonlist_001 审批意见 */}
                            <span>{json['commonlist_001']}:</span>
                            <NCTextArea ref={dom => this.text = dom} fieldid="input-newcomment" autoFocus={true} onChange={this.changeContent} value={content}/>
                        </div>
                        <div className="flexWrapper">
                            {/* commonlist_011 置顶 */}
                            <span>{json['commonlist_011']}:</span>
                            <div className="checkbox"><NCCheckbox checked={isTop} onChange={this.setTop}/></div>
                        </div>
                    </div>
                </Body>
                <Footer>
                    {/* commonlist_008 确认 */}
                    <NCButton fieldid="edit-confirm" colors="primary" onClick={this.confirmAdd}>{json['commonlist_008']}</NCButton>
                    {/* commonlist_009 取消 */}
                    <NCButton fieldid="edit-cancel" onClick={this.close}>{json['commonlist_009']}</NCButton>
                </Footer>
            </NCModal>
        );
    }
}