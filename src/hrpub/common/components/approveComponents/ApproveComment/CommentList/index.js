import React, { Component } from 'react';
import { base, ajax, deepClone, toast, getMultiLang } from 'nc-lightapp-front';

require('./index.less');
const { NCDropdown, NCMenu, NCModal, NCTextArea, NCRadio, NCCheckbox}  = base;
const { Item } = NCMenu;
const { Header, Title, Body, Footer } = NCModal;
const RadioGroup = NCRadio.NCRadioGroup;

export default class CommentList extends Component {
	constructor(props) {
        super(props);
        this.copyCommList = null;
        this.key = 0;
        this.request = false;
        this.state = {
            commentList: [],
            showModal: false,
            comment: '',
            commentType: null,
            addComment: '',
            isDefault: false,
            json: {},
            inlt: null
        }
        this.radioOptions = [];
    }
    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(status){
                this.setState({json, inlt}, () => {
                    this.radioOptions = [
                        { display: this.state.json['commentlist_000'], value: 0 },  // commentlist_000 批准
                        { display: this.state.json['commentlist_001'], value: 1 },   // commentlist_001 不批准
                        { display: this.state.json['commentlist_002'], value: 2 },  // commentlist_002 改派
                        { display: this.state.json['commentlist_003'], value: 3 },  // commentlist_003 驳回
                        { display: this.state.json['commentlist_004'], value: 4 },  // commentlist_004 加签
                    ];
                });
            }else{
                console.log('多语-containers_approvecomment.json 未加载');
            }
        }
        getMultiLang({moduleId: 'containers_approvecomment', damainName: 'uap', callback});
    }
    componentDidMount(){
        this.commentList = [
            {
                    "attributeNames": [
                            "isdefault",
                            "pk_checknote",
                            "notetype",
                            "note_index",
                            "pk_user",
                            "note"
                    ],
                    "dirty": false,
                    "isdefault": "false",
                    "note": `${this.state.json['commentlist_005']}`,  // commentlist_005 审批通过
                    "note_index": 0,
                    "notetype": 0,
                    "pKFieldName": "pk_checknote",
                    "pk_user": "10011210000000000NB0",
                    "status": 0,
                    "tableName": "pub_wf_checknote"
            },
            {
                    "attributeNames": [
                            "isdefault",
                            "pk_checknote",
                            "notetype",
                            "note_index",
                            "pk_user",
                            "note"
                    ],
                    "dirty": false,
                    "isdefault": "false",
                    "note": `${this.state.json['commentlist_001']}`, // commentlist_001 不批准
                    "note_index": 0,
                    "notetype": 1,
                    "pKFieldName": "pk_checknote",
                    "pk_user": "10011210000000000NB0",
                    "status": 0,
                    "tableName": "pub_wf_checknote"
            },
            {
                    "attributeNames": [
                            "isdefault",
                            "pk_checknote",
                            "notetype",
                            "note_index",
                            "pk_user",
                            "note"
                    ],
                    "dirty": false,
                    "isdefault": "false",
                    "note": `${this.state.json['commentlist_003']}`, // commentlist_003 驳回
                    "note_index": 0,
                    "notetype": 2,
                    "pKFieldName": "pk_checknote",
                    "pk_user": "10011210000000000NB0",
                    "status": 0,
                    "tableName": "pub_wf_checknote"
            },
            {
                    "attributeNames": [
                            "isdefault",
                            "pk_checknote",
                            "notetype",
                            "note_index",
                            "pk_user",
                            "note"
                    ],
                    "dirty": false,
                    "isdefault": "false",
                    "note": `${this.state.json['commentlist_002']}`, // commentlist_002 改派
                    "note_index": 0,
                    "notetype": 3,
                    "pKFieldName": "pk_checknote",
                    "pk_user": "10011210000000000NB0",
                    "status": 0,
                    "tableName": "pub_wf_checknote"
            },
            {
                    "attributeNames": [
                            "isdefault",
                            "pk_checknote",
                            "notetype",
                            "note_index",
                            "pk_user",
                            "note"
                    ],
                    "dirty": false,
                    "isdefault": "false",
                    "note": `${this.state.json['commentlist_004']}`,  // commentlist_004 加签
                    "note_index": 0,
                    "notetype": 4,
                    "pKFieldName": "pk_checknote",
                    "pk_user": "10011210000000000NB0",
                    "status": 0,
                    "tableName": "pub_wf_checknote"
            }
        ];
    }
    //--------------------------请求常用意见---------------//
    getData = ()=>{
      
        if(!this.request){
            // this.setState({
            //     commentList: this.toFormat(this.commentList)
            // })
            //this.request = true;
            ajax({
                url: '/nccloud/workflow/checknote/queryDefaultChecknote.do',
                method: 'post',
                success: (res) => { 
                  if (res.data) {
                    this.request = true;
                    this.setState({
                        commentList: this.toFormat(JSON.parse(res.data))
                    })
                  }
                }
            });
        }  
    }

    toFormat =(commentList)=>{
        return commentList.map((item,index)=>{
            item.key = ++ this.key;
            return item;
        })
    }

    //点击新增意见
    selectMenuItem = (obj) => {
		if (obj.key === 'last') {
			this.copyCommList = deepClone(this.state.commentList);
			this.setState({
				showModal: true
			})
		} else {
            if (this.props.onChange &&
                typeof this.props.onChange === 'function') {
                this.props.onChange(this.state.commentList[obj.key])
            }
		}
	}

    //获取常用意见列表
    getMenuItems = () => {
        const { commentList } = this.state;
        //console.log(commentList)
		return (
			<NCMenu
				className="comment-menu"
				onClick={this.selectMenuItem}
			>
				{
					commentList && commentList instanceof Array &&
					commentList.map((item, index) => {
						return <Item
                            fieldid={item.note}
							className="menu-item"
							key={index}
						>
							{(index + 1) + '.' + item.note}
						</Item>
					})
				}
				<Item
                    key="last"
                    fieldid="addNewComment"
					className="menu-item edit-item u-menu-item-selected"
				>
                    {/* 新增常用意见 */}
					{this.state.json['commentlist_009']}
				</Item>
			</NCMenu>
		)
    }
    
    //关闭新增意见弹窗
    closeOpinions = ()=>{
        this.setState({
			showModal: false,
			addComment: null,
			commentType: null,
			isDefault: false,
			commentList: this.copyCommList
		})
    }

    //新增意见
   	submitOpinions = () => {
        const { commentType, addComment, isDefault, commentList } = this.state;
        if(!addComment){
            toast({color:'warning',content:this.state.json['commentlist_006']}); // commentlist_006 审批意见不能为空
            return;
        }
        if(commentType===null){
            toast({color:'warning',content: this.state.json['commentlist_007']}); // commentlist_007 意见类型不能为空
            return;
        }
        let typeItems = commentList.filter((item)=>{
            return item.notetype == commentType;
        }) 
        let newData = {
            note: addComment,
            notetype: commentType,
            note_index: typeItems.length,   
            isdefault: isDefault
        }

        //-------------------请求后台保存----未调试-----------------//
        ajax({
            url: '/nccloud/workflow/checknote/updatePfChecknote.do',
            data: newData,
            method: 'post',
            async: false,
            success: (res) => {
                if (res.success) {
                    //将新增的意见输出
                    if (this.props.onChange &&
                        typeof this.props.onChange === 'function') {
                        this.props.onChange(newData);
                    }
                    let newList = this.state.commentList;
                    newList.push(newData);
                    this.copyCommList = deepClone(newList);
                    this.setState({
                        showModal: false,
                        addComment: null,
                        commentType: null,
                        isDefault: false,
                        commentList: this.toFormat(newList)
                    });
                    if (this.props.onChange &&typeof this.props.onChange === 'function') {
                        this.props.onChange(newData);
                    }
                }
            }
          });
	}

    render(){
        const {showModal, commentType, addComment, isDefault, json} = this.state;
        return <span>
            <NCDropdown
                fieldid="comment_dropdown"
                trigger={['click']}
                onClick = {this.getData}
                overlay={this.getMenuItems()}
                animation="slide-up"
                placement="bottomRight"
                overlayStyle={{right:0,left: 'auto'}}
                overlayClassName="change-pos-right"
            >
                <span className='iconfont comment-icon icon-goutong'></span>
            </NCDropdown>


            <NCModal
                fieldid="general-opinion"
                className="comment-modal"
                visible={showModal}
                onCancel={this.closeOpinions}
            >
                <Header className="comment-title" closeButton>
                    {/* commentlist_009 新增常用意见 */}
                    <Title fieldid={json['commentlist_009']}>{json['commentlist_009']}</Title>
                </Header>
                <Body className="comment-body" >
                    <div className="comment-use-content">
                        <div className="type">
                            {/* commentlist_010 意见类型 */}
                            <label className="type-label">{json['commentlist_010']}</label>
                            <RadioGroup
                                selectedValue={commentType}
                                onChange={(val) => {
                                    if (val != commentType) {
                                        this.setState({
                                            commentType: val
                                        })
                                    }
                                }}
                            >
                                {this.radioOptions.length && this.radioOptions[0].display &&
                                    this.radioOptions.map((e, i) => {
                                        return (
                                            <NCRadio
                                                color="info"
                                                value={e.value}
                                                key={i}
                                            >
                                                {e.display}
                                            </NCRadio>
                                        );
                                    })}
                            </RadioGroup>
                        </div>
                        <div className='comment'>
                            {/* commentlist_011 审批意见 */}
                            <label>{json['commentlist_011']}</label>
                            <NCTextArea
                                fieldid="comment_text"
                                className="comment-text"
                                value={addComment}
                                showMax={true}
                                max={200}
                                onChange={(val) => {
                                    if (val != addComment) {
                                        this.setState({
                                            addComment: val
                                        })
                                    }
                                }}
                            />
                        </div>
                        <div className='default'>
                            {/* commentlist_012 设为默认 */}
                            <label className="default-label">{json['commentlist_012']}</label>
                            <NCCheckbox
                                className="single-checkbox"
                                colors="primary"
                                checked={isDefault}
                                onChange={(val) => {
                                    if (val != isDefault) {
                                        this.setState({
                                            isDefault: val
                                        })
                                    }
                                }}
                            />
                        </div>
                    </div>
                </Body>

                <Footer className="comment-footer">
                    <NCButton fieldid="confirm" colors="primary" onClick={this.submitOpinions}>
                        {/* commentlist_013 确认 */}
                        {json['commentlist_013']}
                    </NCButton>
                    <NCButton style={{marginLeft: '8px'}} fieldid="cancel" bordered onClick={this.closeOpinions}>
                        {/* commentlist_014 取消 */}
                        {json['commentlist_014']}
                    </NCButton>
                </Footer>
            </NCModal>
        </span>
    }
}


{/* <ul className="comment-use">
    {commentList && commentList instanceof Array && 
        commentList.map((item,index)=>{
        return <li className="use-item">
            {item.flag=='browse' &&
                <span className="item">
                    <span>{(index+1)+'.'+item.note+';'}</span>
                    <span className="btns">
                        <span className="btn edit"
                            onClick={()=>{
                                commentList[index].flag = 'edit';
                                commentList[index].tempText = commentList[index].note;
                                this.setState({
                                    commentList:commentList	
                                })
                            }}
                            >修改</span> | 
                        <span className="btn delete"
                            onClick={()=>{
                                commentList.splice(index,1);
                                this.setState({
                                    commentList:commentList
                                })
                            }}
                        > 删除</span>
                    </span>
                </span>
            }
            {
                item.flag=='edit' &&
                <span className="item">
                    <NCInput
                        className="item-input"
                        value={commentList[index].tempText}
                        onChange={(val)=>{
                            if(val.trim()!=commentList[index].tempText){
                                commentList[index].tempText = val.trim();
                                this.setState({
                                    commentList: commentList
                                })
                            }
                            
                        }}
                    />	
                    <span className="btns">
                        <span className="btn ok"
                            onClick={()=>{
                                commentList[index].flag = 'browse';
                                commentList[index].note = commentList[index].tempText;
                                commentList[index].status = commentList[index].status === '2'?'2':'1';
                                this.setState({
                                    commentList: commentList
                                })	
                            }}
                            >确定</span> | 
                        <span className="btn candel"
                            onClick={()=>{
                                commentList[index].flag = 'browse';
                                commentList[index].tempText = commentList[index].note;
                                this.setState({
                                    commentList:commentList	
                                })
                            }}
                        > 取消</span>
                    </span>
                </span>
            }
        </li>
    })}
</ul>
{useDefineStatus==='browse' && 
    <div 
        className="use-item-define browse"
        onClick={()=>{
            this.setState({
                useDefineStatus: 'edit'
            })
        }}
    >
        +新增自定义审批意见
    </div>
}
{useDefineStatus==='edit' && 
    <div className="use-item-define edit">
        自定义：
        <NCTextArea
            className="comment-use-define"
            value={this.state.useContent}
            onChange={(val)=>{
                if(val != this.state.useContent){
                    this.setState({
                        useContent: val
                    })
                }
            }}
        />
        <div className="btns">
            <span 
                className="btn btn-ok"
                onClick={()=>{
                    let hashIndex = -1;
                    if(commentList && commentList instanceof Array){
                        hashIndex = commentList.findIndex((item)=>{
                            return item.note == this.state.useContent.trim();
                        })
                        if(hashIndex != -1){
                            console.log("该审批意见已存在！")
                        }else{
                            commentList.push({
                                note:this.state.useContent,
                                flag:'browse',
                                status: '2',
                                tempText: '',
                                key: this.key++
                            });
                            this.setState({
                                useDefineStatus: 'browse',
                                useContent: '',
                                commentList: commentList
                            })
                        }	
                    }else{
                        this.setState({
                            useDefineStatus: 'browse',
                            useContent: '',
                            commentList: [{
                                note:this.state.useContent,
                                flag:'browse',
                                status: '2',
                                tempText: '',
                                key: this.key++
                            }]
                        })
                    }
                    
                    
                }}
            >
                确定
            </span>
            <span 
                className="btn btn-cancel"
                onClick={()=>{
                    this.setState({
                        useDefineStatus: 'browse',
                        useContent: ''
                    })
                }}
            >
                取消
            </span>
        </div>
    </div>
} */}