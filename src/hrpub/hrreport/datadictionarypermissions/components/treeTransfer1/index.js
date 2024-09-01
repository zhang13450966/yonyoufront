import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import { render, connect } from 'src/hrpub/common/frame';
import TreeTransferAction from './actions/index';
let { NCButton } = base;

import './index.less';
const TreeTransfer1 = render({
    actions: {
        tta: TreeTransferAction
    }
})(({ props, action, state }) => {
    const { button, editTable, ddp, syncTree } = props;
    let { createEditTable } = editTable;
    const leftRender = () => {
        return <div>
            {syncTree.createSyncTree({
                treeId: 'hrinfoTree', // 组件id
                onSelectEve: action.tta.onSelectEve,   //选择节点回调方法
                needEdit: false,
                searchType: 'filtration'
            })}
        </div>
    }
    const rightRender = () => {
        return (
            <div>
                <ul>
                    {ddp.rightList1.map((item, index) => {
                        return <li key={item.refpk}
                            style={{
                                height: '30px', lineHeight: '30px', paddingLeft: '10px'
                            }}
                            className={item.refpk === ddp.transData.refpk ? 'active' : ''}
                            onClick={() => action.tta.handleClick(item)}>
                            {item.refcode}  {item.refname}
                        </li>
                    })}
                </ul>
            </div>
        )
    }
    return (
        <div className='tree-transfer'>
            <div className='transfer-left-Wrapper'>
                {leftRender()}
            </div>
            <div className='transfer-button-wrapper'>
                <div className={'button-area-warp'}>
                    <div className="opr-botton">
                        <NCButton onClick={action.tta.toRight} className={`uf uf-arrow-right`}></NCButton>
                    </div>
                    {
                        !ddp.hiddenAllMoveBtns ?
                            <div>
                                <div className="opr-botton">
                                    <NCButton onClick={action.tta.allToRight} className={`uf uf-2arrow-right`}></NCButton>
                                </div>
                            </div> : ''
                    }

                    <div className="opr-botton">
                        <NCButton onClick={action.tta.toLeft} className={`uf uf-arrow-left`}></NCButton>
                    </div>
                    {
                        !ddp.hiddenAllMoveBtns ?
                            <div>
                                <div className="opr-botton">
                                    <NCButton onClick={action.tta.allToLeft} className={`uf uf-2arrow-left`}></NCButton>
                                </div>
                            </div> : ''
                    }
                </div>
            </div>

            <div className='transfer-right-wrapper'>
                {rightRender()}
            </div>
        </div>
    );

});

export default connect(TreeTransfer1)
