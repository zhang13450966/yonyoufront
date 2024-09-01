export default function buttonClick(props, id) {
	switch (id) {
		case 'Refresh':
			this.refreshTree();
			break;
		case 'Save':
			this.saveRule();
			break;
		case 'Cancel':
			this.cancel();
			break;
		default:
			break;
	}
}
