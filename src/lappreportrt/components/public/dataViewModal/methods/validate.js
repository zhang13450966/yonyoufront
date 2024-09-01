export function isRepeatItem(list, inputValue) {
	let key = inputValue.anaRepField.m_field.expression;
	let hasRepeat = list.filter(item => {
		return item.anaRepField.m_field.expression === key
	});

	return hasRepeat.length > 0
}

export function isSameItem(currentItem, inputValue) {
	let isSame = isRepeatItem([currentItem], inputValue)
	return isSame
}

export function validateSubmitData(data) {
	if (Object.keys(data.referValue).length === 0) return false;
}
