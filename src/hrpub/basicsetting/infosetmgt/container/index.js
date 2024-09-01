import { createPage, base } from 'nc-lightapp-front';
import { render } from 'src/hrpub/common/frame';
/* 公共组件 */
import Pagination from 'src/hrpub/common/components/Pagination/index';
import Layout from 'src/hrpub/basicsetting/infosetmgt/components/layout';
import ReferSearch from 'src/hrpub/common/components/referSearch/org';
import HRBack from 'src/hrpub/common/components/hr-back/index';
import Formulaeditor from 'src/hrpub/common/components/hrformulaeditor';
/* actions */
import TreeAction from 'src/hrpub/basicsetting/infosetmgt/actions/treeaction';
import ViewAction from 'src/hrpub/basicsetting/infosetmgt/actions/viewaction';
import TableAction from 'src/hrpub/basicsetting/infosetmgt/actions/tableaction';
import PaginationAction from 'src/hrpub/basicsetting/infosetmgt/actions/paginationaction';
import CardAction from 'src/hrpub/basicsetting/infosetmgt/actions/cardaction';
import HeaderAction from 'src/hrpub/basicsetting/infosetmgt/actions/headeraction';
import ExchangeAction from 'src/hrpub/basicsetting/infosetmgt/actions/exchangeaction';
/* 组件 */
import ExConfirm from '../components/exconfirm';
import EmptyData from 'src/hrpub/common/components/emptyImg';
/* 公共css */
// import 'src/hrpub/common/static/fonts/iconfont.css';
import './index.less';
const { Header, Main } = Layout;
const { Left, Content } = Main;
const { NCModal, NCButton } = base;
const HomePage = render({
	actions: {
		ViewAction,
		TreeAction,
		TableAction,
		PaginationAction,
		CardAction,
		HeaderAction,
		ExchangeAction
	}
})(({ props, action, state }) => {
	const { syncTree, editTable, form, button, cardPagination, infosetmgt } = props;
	const {
		showMode,
		treeid,
		selectedTreeData,
		selectedTreePid,
		pageInfo,
		pkOrg,
		bShowOrderModal,
		lang,
		bShowInfosetItemModal,
		bShowExchangeModal,
		exShowMode,
		hrorgobj,
		editItemFrom,
		formulaParams,
		defaultFormulaStr,
		formulaUrl,
		saveFormulaUrl,
		hasMainTableData,
		tempPageId,
		tempPageCode
	} = infosetmgt;
	let H = action.TableAction.getHeight();
	let infosetItemId = 'updinfosetitem';
	if (editItemFrom === 'addsubrow') {
		infosetItemId = 'addinfosetitem';
	}
	let topClassName = showMode !== 'list-browse' ? 'nc-bill-card' : 'nc-bill-tree-table';
	return (
		<Layout className={topClassName}>
			<Header className="nc-bill-header-area">
				<div>
					<Choose>
						<When condition={pkOrg}>
							<HRBack
								onClick={action.HeaderAction.toList}
								style={{ visibility: showMode === 'card-browse' ? 'visible' : 'hidden' }}
							/>
							<Choose>
								<When condition={selectedTreeData !== 'ROOT'}>
									<div className="head-btns">
										<div className="buttons">
											{button.createButtonApp({
												area: 'header',
												onButtonClick: action.HeaderAction.handleButtonClick,
												popContainer: document.querySelector('.buttons')
											})}
										</div>
										<If condition={showMode === 'card-browse'}>
											<div className="card-pagination header-cardPagination-area">
												{cardPagination.createCardPagination({
													handlePageInfoChange: action.HeaderAction.handlePageInfoChange
												})}
											</div>
										</If>
									</div>
								</When>
							</Choose>
						</When>
					</Choose>
				</div>
			</Header>
			<Main className="tree-table">
				<Left>
					<If condition={showMode === 'list-browse'}>
						<div className="tree-area">
							{syncTree.createSyncTree({
								treeId: treeid,
								needSearch: true, //是否需要搜索框
								needEdit: false, //不启用编辑
								showLine: false, //显示连线
								defaultSelectedKeys: [ 'ROOT' ],
								onSelectEve: action.TreeAction.selectTree, //选择
								// onSelectedChange: action.TreeAction.selectedChange,
								showModal: false //是否使用弹出式编辑
							})}
						</div>
					</If>
				</Left>
				<Content className={showMode === 'list-browse' ? 'mod-vline' : ''}>
					<Choose>
						<When condition={showMode === 'list-browse'}>
							<div className="list-view table-area">
								<If condition={selectedTreePid}>
									{editTable.createEditTable('infosetgrid', {
										showIndex: true,
										height: H,
										colsSettingParam: {
											pageid: tempPageId,
											code: tempPageCode,
											appcode: infosetmgt.appcode,
											areaCode: 'infosetgrid',
											pagecode: infosetmgt.pagecode,
										},
										adaptionHeight: false,
										cancelCustomRightMenu: true,
										onRowClick: action.TableAction.setSelectRow,
										onRowDoubleClick: action.TableAction.doubleClick
									})}
									{
										<Pagination
											style={{ marginTop: '20px' }}
											{...pageInfo}
											hideOnSinglePage={!hasMainTableData}
											showQuickJumper={true}
											showSizeChanger={true}
											onChange={action.PaginationAction.changePageNum}
											onShowSizeChange={action.PaginationAction.changePageSize}
										/>
									}
								</If>
								<If condition={!selectedTreePid}>
									<EmptyData text={lang['hrpub-000116']} />
								</If>
							</div>
						</When>
						<When condition={selectedTreeData !== 'ROOT' && showMode !== 'list-browse'}>
							<div className="card-view nc-bill-form-area">
								{[
									form.createForm('infosetform'),
									button.createButtonApp({
										area: 'subtable',
										onButtonClick: action.CardAction.handleButtonClick,
										popContainer: document.querySelector('.buttons')
									}),
									<div className='flex-container' style={{height: '320px'}}>
										{
											editTable.createEditTable('infosetitemgrid', {
												showIndex: true,
												cancelCustomRightMenu: true,
												adaptionHeight: true,
												onRowClick: action.TableAction.setSubTableSelectRow,
												onRowDoubleClick: action.TableAction.editSubItem
											})
										}
									</div>
								]}
							</div>
						</When>
					</Choose>
				</Content>
			</Main>
			{/* 排序模态框 */}
			<NCModal
				visible={bShowOrderModal}
				onCancel={action.TableAction.closeOrderModal}
				size="lg"
				className="order-modal"
			>
				<NCModal.Header closeButton>
					<NCModal.Title>{lang['hrpub-000090']}</NCModal.Title>
				</NCModal.Header>

				<NCModal.Body>
					<div className='flex-container' style={{height: '100%'}}>
						{editTable.createEditTable('setdisplayorder', {
							showIndex: true,
							showCheck: true,
							adaptionHeight: true,
							cancelCustomRightMenu: true,
							onRowDoubleClick: action.TableAction.doubleClickOrderTable
						})}
					</div>

				</NCModal.Body>

				<NCModal.Footer>
					<NCButton onClick={action.TableAction.orderToFirst} disabled={!infosetmgt.hasOrderData}>
						{lang['hrpub-000091']}
					</NCButton>
					<NCButton onClick={action.TableAction.orderUp} disabled={!infosetmgt.hasOrderData}>
						{lang['hrpub-000092']}
					</NCButton>
					<NCButton onClick={action.TableAction.orderDown} disabled={!infosetmgt.hasOrderData}>
						{lang['hrpub-000093']}
					</NCButton>
					<NCButton onClick={action.TableAction.orderToLast} disabled={!infosetmgt.hasOrderData}>
						{lang['hrpub-000094']}
					</NCButton>
					<NCButton onClick={action.TableAction.saveOrderData} colors="primary">
						{lang['hrpub-000055']}
					</NCButton>
					<NCButton onClick={action.TableAction.closeOrderModal}>{lang['hrpub-000056']}</NCButton>
				</NCModal.Footer>
			</NCModal>
			{/* 信息项调整模态框 */}
			<NCModal
				visible={bShowInfosetItemModal}
				onCancel={action.TableAction.closeInfosetItemModal}
				size="lg"
				className="infoset-item-modal"
                onShow={action.ViewAction.updateView}
			>
				<NCModal.Header closeButton>
					<NCModal.Title>{lang['hrpub-000095']}</NCModal.Title>
				</NCModal.Header>

				<NCModal.Body>
					{form.createForm(infosetItemId, {
						onAfterEvent: action.CardAction.transferFormMeta
					})}
				</NCModal.Body>

				<NCModal.Footer>
					<NCButton onClick={action.TableAction.updateInfosetItemTable} colors="primary">
						{lang['hrpub-000055']}
					</NCButton>
					<NCButton onClick={action.TableAction.closeInfosetItemModal}>{lang['hrpub-000056']}</NCButton>
				</NCModal.Footer>
			</NCModal>
			{/* 信息项交换模态框 */}
			<NCModal
				visible={bShowExchangeModal}
				onCancel={action.ExchangeAction.closeModal}
				size="lg"
				className="exchange-modal"
				maskClosable={false}
			>
				<NCModal.Header closeButton>
					<NCModal.Title>{lang['hrpub-000107']}</NCModal.Title>
				</NCModal.Header>

				<NCModal.Body>
					<header className="ex-head">
						<div style={{ display: 'flex' }}>
							<Choose>
								<When condition={exShowMode !== 'card-edit'}>
									<ReferSearch
										orgVal={hrorgobj}
										getOrgData={action.ExchangeAction.searchChange}
										queryCondition={() => {
											return {
												controlType: 1
											};
										}}
									/>
									<If condition={exShowMode === 'card-browse'}>
										<HRBack
											onClick={action.ExchangeAction.toExList}
											style={{ lineHeight: '30px', marginLeft: '20px', cursor: 'pointer' }}
										/>
									</If>
								</When>
								{/* <When condition={exShowMode === 'card-browse'}>
									<HRBack onClick={action.ExchangeAction.toExList} />
								</When> */}
							</Choose>
						</div>
						<div className="buttons">
							<Choose>
								<When condition={exShowMode !== 'card-edit'}>
									{button.createButtonApp({
										area: 'exheader',
										onButtonClick: action.ExchangeAction.handleButtonClick,
										popContainer: document.querySelector('.exchange-modal .ex-head')
									})}
								</When>
								<When condition={exShowMode === 'card-edit'}>
									{button.createButtonApp({
										area: 'exedit',
										onButtonClick: action.ExchangeAction.handleButtonClick,
										popContainer: document.querySelector('.exchange-modal .ex-head')
									})}
								</When>
							</Choose>
						</div>
					</header>
					<section className="ex-table">
						<Choose>
							<When condition={exShowMode === 'list-browse'}>
								<div className='flex-container' style={{height: '100%'}}>
									{editTable.createEditTable('list', {
										showIndex: true,
										adaptionHeight: true,
										cancelCustomRightMenu: true,
										onRowClick: action.ExchangeAction.setSelectRow,
										onRowDoubleClick: action.ExchangeAction.doubleClick
									})}
								</div>
							</When>
							<When condition={exShowMode !== 'list-browse'}>
								{[
									form.createForm('card', {
										onBeforeEvent: action.ExchangeAction.exchangeBeforeEvent
										// onAfterEvent: action.ExchangeAction.exchangeAfterEvent
									}),
									button.createButtonApp({
										area: 'exsubtable',
										onButtonClick: action.ExchangeAction.handleButtonClick,
										popContainer: document.querySelector('.exchange-modal .ex-table')
									}),
									<div className='flex-container' style={{height: "calc(100% - 128px)"}}>
										{
												editTable.createEditTable('sub', {
													showIndex: true,
													adaptionHeight: true,
													cancelCustomRightMenu: true,
													onBeforeEvent: action.ExchangeAction.setSubRowBeforeEvent
												})
										}
									</div>
								]}
							</When>
						</Choose>
					</section>
				</NCModal.Body>

				{/* <NCModal.Footer>
					<NCButton onClick={action.ExchangeAction.addExchangeItems} colors="primary">
						{lang['hrpub-000055']}
					</NCButton>
					<NCButton onClick={action.ExchangeAction.closeModal}>{lang['hrpub-000056']}</NCButton>
				</NCModal.Footer> */}
			</NCModal>
			{/* 公式编辑器 */}
			<div className="formula-editor">
				<Formulaeditor
					ref={(ref) => (state.formula = ref)}
					searchParam={formulaParams}
					formulaUrl={formulaUrl}
					saveFormulaUrl={saveFormulaUrl}
					defaultFormulaStr={defaultFormulaStr}
					saveCallback={action.CardAction.saveCallback}
					showRecall={'none'}
				/>
			</div>
			{/* exconfirm */}
			<div className="ex-confirm">
				<ExConfirm ref={(modal) => (state.exconfirm = modal)} {...props} />
			</div>
		</Layout>
	);
});

export default createPage({})(HomePage);
