/*
 * @Author: sunxxf 
 * @PageInfo: 页面功能描述 
 * @Date: 2020-03-18 10:13:43 
 * @Last Modified by: sunxxf
 * @Last Modified time: 2020-03-18 18:07:01
 */

/**
 * 
 * @param {*} props      
 * @param {*} headArea   表头ID
 * @param {*} bodyArea   表体ID
 * @param {*} tableType  Table类型   0.editTable 1.cardTable
 */
function constructExcel(props, headArea, bodyArea, tableType) {
	let titleMeta = constructExcelMeta(props, headArea, bodyArea);
	let data = constructExcelData(props, headArea, bodyArea, titleMeta, tableType);
	return data;
}
/**
 * 处理数据
 * @param {*} props 
 * @param {*} headArea 
 * @param {*} bodyArea 
 * @param {*} titleMeta 
 */
function constructExcelData(props, headArea, bodyArea, titleMeta, tableType) {
	let meta = props.meta.getMeta();

	let headData = props.form.getAllFormValue(headArea);
	let bodyData = null;
	if (tableType == 0) {
		bodyData = props.editTable.getAllRows(bodyArea, true);
	} else if (tableType == 1) {
		bodyData = props.cardTable.getAllRows(bodyArea);
	}

	let headTitleAry = titleMeta.head;
	let bodyTitleAry = titleMeta.body;
	let head = [];
	let body = [];
	//处理表头
	if (headData) {
		headData.rows.forEach((row) => {
			let headAry = [];
			let { values } = row;
			if (values) {
				for (let i = 0; i < headTitleAry.length; i++) {
					let excelcell = {};
					let codeValue = values[headTitleAry[i].code];
					excelcell.code = headTitleAry[i].code;

					if (codeValue.hasOwnProperty('display')) {
						if (codeValue.display) {
							excelcell.value = codeValue.display;
						} else {
							excelcell.value = codeValue.value;
						}
					} else {
						excelcell.value = codeValue.value;
					}
					headAry.push(excelcell);
				}
				head.push(headAry);
			}
		});
	} else {
		head.push([]);
	}
	//处理表体
	if (bodyData) {
		bodyData.forEach((item) => {
			//过滤掉删除的数据
			if (item && item.status != '3') {
				let bodyAry = [];
				let { values } = item;
				if (values) {
					for (let i = 0; i < bodyTitleAry.length; i++) {
						let excelcell = {};
						let codeValue = values[bodyTitleAry[i].code];

						excelcell.code = bodyTitleAry[i].code;
						if (codeValue == undefined) {
							excelcell.value = '';
						} else {
							if (Object.keys(codeValue).length === 0) {
								excelcell.value = '';
							} else {
								if (codeValue.hasOwnProperty('display')) {
									if (codeValue.display) {
										excelcell.value = codeValue.display;
									} else {
										excelcell.value = codeValue.value;
									}
								} else if (codeValue.value != undefined) {
									excelcell.value = codeValue.value;
								} else {
									excelcell.value = '';
								}
							}
						}
						if (excelcell.code != 'opr' && excelcell.code != '') {
							bodyAry.push(excelcell);
						}
					}
					body.push(bodyAry);
				}
			}
		});
	} else {
		head.push([]);
	}
	return { head: head, body: body };
}

/**
 * 处理模板
 * @param {*} props 
 * @param {*} headArea 
 * @param {*} bodyArea 
 */
function constructExcelMeta(props, headArea, bodyArea) {
	let meta = props.meta.getMeta();
	let headTitleAry = [];
	let bodyTitleAry = [];
	//处理表头
	if (headArea) {
		meta[headArea].items.forEach((item) => {
			let excelcell = {};
			if (item.visible) {
				excelcell.code = item.attrcode;
				excelcell.value = item.label;
				headTitleAry.push(excelcell);
			}
		});
	}
	//处理表体
	if (bodyArea) {
		meta[bodyArea].items.forEach((item) => {
			let excelcell = {};
			if (item.visible) {
				if (item.attrcode && item.children && item.children.length > 0) {
					item.children.forEach((child) => {
						let childcell = {};
						childcell.code = child.attrcode;
						childcell.name = child.label;
						bodyTitleAry.push(childcell);
					});
				} else {
					excelcell.code = item.attrcode;
					excelcell.value = item.label;
					bodyTitleAry.push(excelcell);
				}
			}
		});
	}
	return { head: headTitleAry, body: bodyTitleAry };
}

export { constructExcel, constructExcelData, constructExcelMeta };
