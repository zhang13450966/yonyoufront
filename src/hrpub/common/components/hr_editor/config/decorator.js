import { CompositeDecorator } from 'draft-js';
import { ajax, toast } from 'nc-lightapp-front';
function findLinkEntities(contentBlock, callback, contentState) {
	contentBlock.findEntityRanges((character) => {
		const entityKey = character.getEntity();
		return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
	}, callback);
}
const Link = (props) => {
	const { url } = props.contentState.getEntity(props.entityKey).getData();
	return (
		<a href={url} style={styles.link}>
			{props.children}
		</a>
	);
};
function findImageEntities(contentBlock, callback, contentState) {
	contentBlock.findEntityRanges((character) => {
		const entityKey = character.getEntity();
		return entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMAGE';
	}, callback);
}

const Image = (props) => {
	const { height, src, width } = props.contentState.getEntity(props.entityKey).getData();
	let errorFn = (event) => {
		toast({
			color: 'error',
			content: '您所复制的图片源被删除或不允许跨域访问'
		});
	};
	let _image_ = (
		<img
			onError={errorFn}
			referrerpolicy="origin-when-cross-origin"
			crossorigin="anonymous"
			src={src}
			height={height}
			width={width}
		/>
	);
	return _image_;
};
const styles = {
	link: {
		color: '#3b5998',
		textDecoration: 'underline'
	}
};
const decorator = new CompositeDecorator([
	{
		strategy: findLinkEntities,
		component: Link
	},
	{
		strategy: findImageEntities,
		component: Image
	},
	{
		strategy: (contentBlock, callback, contentState) => {
			// console.log(contentBlock.getData());
			// console.log(contentState.getBlockMap());
			// contentBlock.findStyleRanges((character) => {
			// 	// console.log(character.getEntity());
			// 	let entityKey = character.getEntity();
			// 	// console.log(entityKey);
			// 	entityKey !== null && console.log(contentState.getEntity(entityKey).getType());
			// 	// 	return true;
			// 	return entityKey !== null && contentState.getEntity(entityKey).getType() === 'ALIGN';
			// }, callback);
			// switch (contentBlock.getType()) {
			// 	case 'header-two':
			// 		contentBlock.findEntityRanges((character) => {
			// 			return true;
			// 		}, callback);
			// 		break;
			// }
		},
		component: (props) => {
			// console.log(props);
			// console.log(props.contentState.getBlockForKey(props.blockKey).toJS());
			// return <span style={{ fontSize: 24 }}>{props.children}</span>;
		}
	}
]);
export default decorator;
