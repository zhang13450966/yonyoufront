import { ajax, getLangCode } from 'nc-lightapp-front';
import { BATCHCODERULE_CONST } from '../const';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../pub/tool/messageUtil';

// 创建树组件需要的数据结构
function buildTreeData(data) {
	//根据语种判断
	let langCode = getLangCode();
	let nameField = langCode == 'simpchn' ? 'name' : langCode == 'tradchn' ? 'name2' : 'name3';
	return data.map((item, index) => {
		let { values } = item;
		let curNameFidld = handleProperty(values[nameField]);
		let d = {
			key: handleProperty(values.pk_marbasclass),
			refpk: handleProperty(values.pk_marbasclass),
			refname:
				handleProperty(values.code) + ' ' + (curNameFidld == '' ? handleProperty(values['name']) : curNameFidld)
		};
		if (values.pk_parent && values.pk_parent.value) {
			d.pid = handleProperty(values.pk_parent);
		}

		d.iconBox = {
			delIcon: false, // false:隐藏； true:显示; 默认都为true显示
			editIcon: true,
			addIcon: false
		};
		return d;
	});
}

function handleProperty(val) {
	return val && val.value ? val.value : '';
}

function queryTreeData(id, NCProps, type) {
	let { syncTree } = NCProps;
	ajax({
		url: BATCHCODERULE_CONST.QRYMARCLASSURL,
		success: (res) => {
			if (res.success) {
				let treeData = buildTreeData(res.data.materialTree.rows);
				let data = syncTree.createTreeData(treeData); // 创建树 组件需要的数据结构
				syncTree.setSyncTreeData(id, data);
				if (type == 'refresh') {
					showSuccessInfo(getLangByResId(this, '4001BATCHRULE-000023')); /* 国际化处理： 刷新成功！*/
				}
			}
		}
	});
}

function getStrLen() {
	String.prototype.gblen = function() {
		var len = 0;
		for (var i = 0; i < this.length; i++) {
			if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
				len += 2;
			} else {
				len++;
			}
		}
		return len;
	};
}

export { buildTreeData, queryTreeData, getStrLen };
