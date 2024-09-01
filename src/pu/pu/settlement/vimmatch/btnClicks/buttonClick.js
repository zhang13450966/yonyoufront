import ActionHandler from '../viewController/actionHandler';
export default function(props, id) {
	ActionHandler.getInstance(this).doAction(id);
}
