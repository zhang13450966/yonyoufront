import React, { useState, useEffect, useRef, useMemo } from 'react';
import GraphicReport from '@components/Graphic/index';
function WrapGraphicReport(props) {
	const { schemeParams, searchParams, pkcode, analysisParams, refreshKey, iframeLoaded } = props;
	const graphicRef = useRef(null)
	useEffect(() => {
		if (graphicRef && graphicRef.current) {
			graphicRef.current.resetState()
		}
	}, [schemeParams]);
	return useMemo(
		() =>
			schemeParams.pk_storyboard && (
				<GraphicReport
                    needLoading={ false}
					ref={graphicRef}
					params={{
						...schemeParams,
						search_params: searchParams,
						analysis_params: analysisParams,
						pkcode,
						associate_application: true,
						refreshKey,
						iframeLoaded
					}}
				/>
			),
		[ schemeParams, searchParams, pkcode, analysisParams ]
	);
}

export default React.memo(WrapGraphicReport);
