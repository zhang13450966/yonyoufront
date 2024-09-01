import { ajax, cacheTools, toast} from 'nc-lightapp-front';

/**
 * 凭证联查来源单据 add by suqc
 * @param {*} props
 * @param {*} tableId 列表表体编码
 * @param {*} pkField 单据主键字段
 * @param {*} pagecode 应用pagecode
 */
export function queryVoucherSrc(props, tableId, pkField, pagecode, customFunc) {
	//凭证联查单据
	let src = props.getUrlParam('scene'); //获取联查场景
	if (src) {
		if ('fip' == src) {
			//fip代表会计平台
			//执行第2步
			let checkedData = [];
			checkedData = cacheTools.get('checkedData');
			let data = {
				checkedData,
				pagecode
			};
			ajax({
				url: '/nccloud/hpf/pub/queryVoucherSrc.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							//如果只有一行,则在返回到列表界面之后再次跳转到卡片界面
							if (data[tableId].rows.length == 1) {
								let pk = data[tableId].rows[0].values[pkField].value;
								props.table.setAllTableData(tableId, data[tableId]);
								setTimeout(() => {
									props.pushTo('/card', {
										pagecode: pagecode.replace('LIST', 'CARD'),
										status: 'browse',
										id: pk ? pk : ''
									});  
								}, 1500);
							} else {
								props.table.setAllTableData(tableId, data[tableId]);
							}
						} else {
							props.table.setAllTableData(tableId, { rows: [] });
							toast({ color: 'warning', title: "未联查出数据" });/* 国际化处理： 下载成功*/
						}
					}
				}
			});
		}
	}
}
