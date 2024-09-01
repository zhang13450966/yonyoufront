/**
 * 布局结构
 * @constructor
 * @author neo   
*/
import React, { Fragment } from 'react';
import { render, connect } from 'src/hrpub/common/frame';
// import { toast, promptBox, ajax, cacheTools } from 'nc-lightapp-front';
import HRBack from 'src/hrpub/common/components/hr-back/index';
import HeaderAction from './action';
import './index.less';
const Wrapper = render({
	actions: {
		headerAct: HeaderAction
	}
})(({ props, action, state }) => {
	const { infosetmgt, button, cardPagination, cacheTools } = props;
	const { toList, handleButtonClick, handlePageInfoChange } = action.headerAct;
	const { showMode, selectedTreeData } = infosetmgt;
	let style = {
		visibility: showMode === 'card-browse' ? 'visible' : 'hidden'
	};

	return (
		<Fragment>
			<HRBack onClick={toList} style={style} />
			<Choose>
				<When condition={selectedTreeData !== 'ROOT'}>
					<div className="head-btns">
						<div className="buttons">
							{button.createButtonApp({
								area: 'header',
								onButtonClick: handleButtonClick,
								popContainer: document.querySelector('.buttons')
							})}
						</div>
						<If condition={showMode === 'card-browse'}>
							<div className="card-pagination">
								{cardPagination.createCardPagination({
									handlePageInfoChange: handlePageInfoChange
								})}
							</div>
						</If>
					</div>
				</When>
			</Choose>
		</Fragment>
	);
});

export default connect(Wrapper);
