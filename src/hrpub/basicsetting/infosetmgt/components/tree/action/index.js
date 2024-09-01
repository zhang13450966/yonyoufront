/**
 * Tree actions
 * @constructor
 * @author neo   
*/
export default class TreeAction {
	constructor(comp) {
		this.comp = comp;
	}
	test = () => {
		console.log(this.comp);
	};
	selectTree = () => {};
	selectedChange = (node) => {
		// console.log(node);
	};
}
