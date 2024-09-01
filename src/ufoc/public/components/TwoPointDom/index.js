/*
 * @Author: zhuyyj
 * @Date: 2021-08-09 19:26:41
 * @LastEditTime: 2022-03-22 17:50:45
 */
import { useRef, useEffect, useState } from 'react'
import './index.less';

/**
 * @description 向左收缩传 defLeftWid, 向右收缩传defRightWid, 默认向左
 * @export
 * @param {*} { leftDom = () => { }, rightDom = () => { }, defLeftWid = 280, onDragStop = () => { }, onAfter = () => { } ,defRightWid = 0}
 * @return {*} 
 */
export default function TwoPointDom({ leftDom = () => { }, rightDom = () => { }, defLeftWid = 280, onDragStop = () => { }, onAfter = () => { }, defRightWid = 0, onLayoutChange = () => { } }) {
	const boxDom = useRef()
	const boxDomLeft = useRef()
	const maskRightDom = useRef()
	const maskLeftDom = useRef()
	const spanDom = useRef()
	const [leftContraction, leftContractionSet] = useState(true); // 默认收缩向左
	const [visible, setVisible] = useState(true);
	const [dragLeft, setDragLeft] = useState('');
	useEffect(() => {
		let mouseDown = false
		let clientWid = boxDomLeft.current.clientWidth;
		let beginX = 0
		let dragLeftVal = `${defLeftWid}px`
		if (defRightWid > 0) {
			dragLeftVal = `calc(100% - ${defRightWid}px)`
			leftContractionSet(false) // 设置向右收缩
		}
		setDragLeft(dragLeftVal)
		document.addEventListener('mousemove', (e) => {
			if (mouseDown) {
				// fix bug  IE  e.x !== e.clientx  ie
				let wid = clientWid + (e.clientX - beginX);
				if (wid >= boxDom.current.clientWidth - 20 || wid <= 50) {
					boxDomLeft.current.style.width = boxDomLeft.current.clientWidth + 'px';
				} else {
					boxDomLeft.current.style.width = wid + 'px';
				}
			}
		});
		document.addEventListener('mouseup', () => {
			if (mouseDown) {
				mouseDown = false;
				clientWid = boxDomLeft.current.clientWidth;
				setDragLeft(clientWid)
				maskRightDom.current.style.display = 'none'
				maskLeftDom.current.style.display = 'none'
				onDragStop()
				onLayoutChange()
			}
		});
		spanDom.current.addEventListener('mousedown', (e) => {
			beginX = clientWid;
			mouseDown = true;
			// 加个遮罩 应对  iframe的情况
			maskRightDom.current.style.display = 'block'
			maskLeftDom.current.style.display = 'block'
		});

	}, []);
	useEffect(() => {
		onAfter(visible)
		onLayoutChange()
	}, [visible]);

	return (
		<div className="dragWidthCom epmp" ref={boxDom}>
			<div className="dragWidthCom_left" style={{ width: visible ? dragLeft : leftContraction ? '0px' : '100%' }} ref={boxDomLeft}>
				<div className="dragWidthCom_mask" ref={maskLeftDom} />
				{/* 收缩箭头 */}
				<div
					className={`button iconfont ${leftContraction ? `button-left ${visible ? 'icon-jiantouzuo' : 'icon-jiantouyou'}` : `button-right  ${visible ? 'icon-jiantouyou' : 'icon-jiantouzuo'}`}`}
					onClick={() => { setVisible(!visible) }}
				/>
				{leftDom}
			</div>
			<div ref={spanDom} className="dragWidthCom_line" style={{ display: visible ? 'block' : 'none' }}>
				<div className="dragWidthCom_lines" />
			</div>
			<div className="dragWidthCom_right" id="scroll_container">
				<div className="dragWidthCom_mask" ref={maskRightDom} />
				{rightDom}
			</div>
		</div>
	);
}

