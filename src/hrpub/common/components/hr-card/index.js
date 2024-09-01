import React from 'react';
import Action from './cardAction.js'
import './index.less';
import {base} from 'nc-lightapp-front';
const {NCIcon} = base;

export default class SmallCardButton extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let {reflashClick,Description,style} = this.props;
        const classname = Description.numberArr.length == 1?'':'Double';
        return(
            <div className = {`ncc-card-content clear-fx  ${classname}`}
                style={style || {}}>
                <Choose>
                    <When condition = {Description.title}>
                        <div className = "card-head margin-fix">
                            <span className="card-head-title">{Description.title}</span>
                            <div className = "card-headest-title"> 
                                <If condition={Description.titleDes&&Description.numberArr.length !== 1}>
                                <NCIcon type="uf-bell" className = "card-head-icon"
                                // onClick={(e) => {console.log('图标')}}
                                >
                                </NCIcon>
                                    {/* <span className = "card-head-icon"></span> */}
                                    <span className = "card-head-descript">{Description.titleDes}</span>
                                </If>
                            </div>
                        </div>
                        <div className = "roll margin-fix padding-rile">
                            {console.log(Description.numberArr)}
                            {console.log((100/Description.numberArr.length)+'%')}
                            {console.log(typeof Description.numberArr[0].onClick === 'function')}
                            {/* <If condition = {Description.numberArr.length !== 1}>
                            </If> */}
                            {Description.numberArr.map((item,index) => {
                                return (
                                    <div className = "roll-contain" style ={{width:(100/Description.numberArr.length)+'%',
                                                                             color:(Description.numberArr[index].state?'#555555':'#E14C46') }}
                                         onClick={() => {
                                            if (item.onClick && typeof item.onClick === 'function') {
                                                    item.onClick();
                                         }}}>
                                        <div className = "card-number">{Description.numberArr[index].number}</div>
                                        <div className = "card-descripse">{Description.numberArr[index].numberDes}</div>
                                    </div>
                                );
                             })}
                        </div>
                        <div className = "card-foot margin-fix clear-fx">
                            <NCIcon type="uf-sync-c-o" className = "lt"
                                onClick={reflashClick}
                                >
                            </NCIcon>
                            {/* <span className = "lt">reflash</span> */}
                            <span className = "rt"><img src ={Description.img}/></span>
                        </div>
                    </When>
                </Choose>
            </div>
        )
    }

}
