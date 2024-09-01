/**
 * 布局结构--Tree
 * @constructor
 * @author neo   
*/
import React, { Fragment } from 'react';
import { render, connect } from 'src/hrpub/common/frame';
// import { toast, promptBox, ajax, cacheTools } from 'nc-lightapp-front';
import TreeAction from './action';
const Wrapper = render({
	actions: {
		treeAct: TreeAction
	}
})(({ props, action, state }) => {
	const { infosetmgt, syncTree } = props;
	const { test, selectTree, selectedChange } = action.treeAct;
	const { showMode, hrorgobj, treeid } = infosetmgt;
	// let style = {
	// 	display: showMode === 'card-browse' ? 'inline-block' : 'none'
	// };
	return (
		<div>
			{syncTree.createSyncTree({
				treeId: treeid,
				needSearch: false, //是否需要搜索框
				needEdit: false, //不启用编辑
				showLine: false, //显示连线
				defaultSelectedKeys: [ 'ROOT' ],
				onSelectEve: selectTree, //选择
				onSelectedChange: selectedChange,
				// onMouseEnterEve: this.onMouseEnterEve.bind(this), // 鼠标滑过事件
				showModal: false //是否使用弹出式编辑
			})}
		</div>
	);
});

export default connect(Wrapper);
