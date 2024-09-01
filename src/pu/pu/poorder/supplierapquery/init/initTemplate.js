import { SUPPLIERAP, APPCODE } from '../../constance';
export default function(props) {
	props.createUIDom(
		{
			pagecode: SUPPLIERAP.PAGECODE,
			appcode: APPCODE.orderAppCode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
				}
			}
		}
	);
}
