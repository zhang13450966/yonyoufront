export default function(props, moduleId, key, value, changedrows, i, record) {
	if (key == 'cmaterialvid') {
		if (value != undefined && value.refpk) {
			props.editTable.setValByKeyAndIndex(moduleId, i, 'cmaterialvid.name', {
				value: value.refname,
				display: value.refname
			});
			props.editTable.setValByKeyAndIndex(moduleId, i, 'cmaterialoid', {
				value: value.values.pk_source.value,
				display: value.values.pk_source.value
			});
		} else {
			clearValue(this.props, moduleId, i, [ 'cmaterialvid.name' ]);
		}
	}
}

function clearValue(props, moduleId, i, fields) {
	for (let field of fields) {
		props.editTable.setValByKeyAndIndex(moduleId, i, field, { value: null, display: null });
	}
}
