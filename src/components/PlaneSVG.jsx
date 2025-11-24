import React from 'react';

// Dynamic plane SVG component
// Scales width (wingspan) by seatsPerRow and length by flightRowsCount.
// Baseline configuration derived from typical narrow-body: 20 rows, 6 seats/row.
// Scaling is clamped to avoid extreme distortion.
export default function PlaneSVG({
	flightRowsCount = 20,
	seatsPerRow = 6,
	className = '',
	style = {},
	showSeatLabels = true,
	onSeatClick
}) {
	const BASE_ROWS = 20;
	const BASE_SEATS = 6;

	// Linear scale factors with gentle clamp
	const rawRowScale = flightRowsCount / BASE_ROWS;
	const rawSeatScale = seatsPerRow / BASE_SEATS;
	const rowScale = clamp(rawRowScale, 0.5, 3); // vertical (length)
	const seatScale = clamp(rawSeatScale, 0.6, 3); // horizontal (wingspan)

	// Original viewBox size
	const BASE_W = 505.42;
	const BASE_H = 468.09;

	// We distort the path via a transform while keeping the viewBox constant.
	// To keep the plane roughly centered after scaling, translate half of the delta.
	const translateX = (BASE_W - BASE_W * seatScale) / 2;
	const translateY = (BASE_H - BASE_H * rowScale) / 2;

	// Seat geometry inside fuselage approximation
	const fuselageWidth = BASE_W * 0.32; // narrow section
	const fuselageHeight = BASE_H * 0.72;
	const fuselageX = (BASE_W - fuselageWidth) / 2;
	const fuselageY = (BASE_H - fuselageHeight) / 2;
	const aisleGap = 8; // px gap between seat sides pre-scale
	const padX = 6;
	const padY = 10;

	const seatsLeftSide = Math.ceil(seatsPerRow / 2);
	const seatsRightSide = seatsPerRow - seatsLeftSide;

	const seatColumnWidths = [seatsLeftSide, seatsRightSide];
	const totalSeatCols = seatsPerRow + 1; // +1 for aisle gap effect

	const seatWidth = (fuselageWidth - padX * 2 - aisleGap) / seatsPerRow;
	const seatHeight = (fuselageHeight - padY * 2) / flightRowsCount;

	// Generate seat data
	const seatElements = [];
	for (let row = 0; row < flightRowsCount; row++) {
		for (let col = 0; col < seatsPerRow; col++) {
			const isRightSide = col >= seatsLeftSide;
			const seatLetter = String.fromCharCode(65 + col);
			const seatId = `${row + 1}${seatLetter}`;
			const xBase = fuselageX + padX + col * seatWidth + (isRightSide ? aisleGap : 0);
			const yBase = fuselageY + padY + row * seatHeight;
			seatElements.push({ seatId, x: xBase, y: yBase });
		}
	}

	return (
		<svg
			className={className}
			style={style}
			viewBox={`0 0 ${BASE_W} ${BASE_H}`}
			role="img"
			aria-label={`Airplane (${flightRowsCount} rows, ${seatsPerRow} seats per row)`}
		>
			<g transform={`translate(${translateX} ${translateY}) scale(${seatScale} ${rowScale})`}>
				<path
					fill="#53b848"
					d="M188.09,191.81c9.41-5.57,32.13-16.06,34.59-17.29.42-.21.72-.59.83-1.03.06-.25.05-.46.04-.5-1.07-12.83,1.1-25.78.25-38.62-.92-13.88-1.59-43.22,1.16-72.58,0,0,2.49-26.57,18-53.72,1.13-1.97,4.23-7.4,9.2-8.01,0,0,.75-.09,1.51-.03,5.36.41,25.66,27.34,28.18,72.99,1.24,22.47-2.09,44.53-.19,61.55.56,5,1.57,9.57.97,16.84-.08.97-.56,6.44-.58,13.55-.01,3.64.1,6.39,1.94,8.71,1.44,1.82,3.2,2.44,5.23,3.29,4.26,1.79,8.13,4.39,12.19,6.58,9.39,5.07,16.43,10.65,20.16,9.56.4-.12,1.58-.46,2.27-1.5.79-1.19.52-2.63.41-3.41,0,0-.05-.34.39-7.74.26-4.42,3.24-9.55,7.58-12.35,4.99-3.23,10.46-2.53,13.33-2.16,2.26.29,4.49.58,6.77,1.94,6.93,4.12,7.92,14.26,8.32,18.39.57,5.83.09,14.58,0,16.26-.19,3.5-.42,5.29.6,7.52,1.14,2.51,3.11,3.94,9.66,7.39,6.27,3.29,9.53,4.64,13.74,6.77,5.25,2.66,8.4,4.74,11.42,6.58,11.13,6.8,19,9.55,46.32,23.03,24.7,12.19,19.73,10.66,26.39,13.35,6.72,2.72,17.72,6.68,24.52,12.9,1.64,1.51,6.47,5.93,8.67,13.1.09.29.15.52.2.68,1.14,5.4,2.1,11.41,2.68,17.96.34,3.79.52,7.41.58,10.84.09,4.77-.37,6.04-.97,6.19-1.08.27-2.94-3.06-3.61-4.26-.83-1.49-1.13-2.42-1.42-3.03-1.42-3.03-5.31-4.24-9.1-5.23-2.7-.7-11.83-3.08-21.37-3.94-1.1-.1-4.51-.38-8.91-1.47-.85-.21-1.54-.4-1.99-.53-.52.93-1.2,2.23-1.94,3.81-1.31,2.82-1.53,3.84-2.13,3.87-.9.05-1.52-2.29-3.16-5.55-1.09-2.17-2.17-3.86-2.92-4.96-.08-.11-.21-.28-.43-.42-.17-.11-.36-.19-.56-.23l-105.61-20.59c-.35-.03-.64.01-.88.08-1.31.36-2.11,1.74-4.3,5.99-.61,1.19-.93,1.82-1.48,1.87-.79.07-1.53-1.07-1.94-1.81-.84-2.19-1.67-4.37-2.51-6.56-.13-.21-.3-.38-.51-.51,0,0-.2-.13-.44-.19-43.65-11.53-48.55-2.93-48.55-2.93-.27.47-.42,2.7-.71,7.16-.49,7.48-.47,11.53-.71,16.19-.27,5.13-.55,5.3-1.42,14.06-1.47,14.87-.62,14.14-1.94,26.19-.63,5.75-.87,11.54-1.55,17.29-.11.93-.47,3.88-.13,7.74.09,1.05.21,1.91.31,2.49l78.22,52.78c.31.21.53.51.63.85.07.23.07.42.07.48-.19,18.28-.12,19.02-.12,19.02.27,3.19.74,4.29-.13,5.29-1.84,2.14-6.91.57-9.2-.17-20.67-6.62-41.48-12.83-62.15-19.45-2.33-.74-5.72-1.57-12.52-3.23-6.04-1.47-6.57-1.47-7.23-1.16-4.39,2.09-.63,11.53-4.52,27.61-1.03,4.27-3.54,12.88-4.64,12.69-.05,0-.08-.03-.1-.04-3.6-2.58-5.32-12.9-5.32-12.9-2.26-13.53-4.58-23.2-4-26.19,0-.04.03-.16-.02-.28-.67-1.53-11.7,2.11-22.69,5.44-23.16,7.01-20.07,4.7-32.26,9.03-7.35,2.61-15.08,4.03-22.45,6.58-4.03,1.39-9.24,3.31-12,.9-.38-.33-.8-.81-1.81-5.16,0,0-2.15-9.23-1.01-16.99.03-.2.11-.38.11-.38.12-.28.32-.52.57-.69l79.19-53.68c.47-.32.73-.85.69-1.42l-6.26-85.42c-.09-1.09-.42-2.81-1.68-4.26,0,0-.65-.75-1.55-1.29-3.74-2.26-20.82-.41-23.75-.11-6.37.65-16.96,1.19-21.41,4.37-.73.52-1.81,1.3-2.45,2.71-1.24,2.74.33,5.37-.65,6.06-.45.32-1.43.24-3.77-1.5-.61-2.55-2.46-4.49-4.74-4.95-1.86-.38-3.39.35-3.94.64-.1-.03-.23-.06-.39-.08-.13,0-.26,0-.39.02l-102.74,18.94c-.5.09-.93.42-1.15.88l-3.55,7.53c-.46.98-1.75,1.22-2.53.47-.52-.93-1.08-1.89-1.7-2.87-.69-1.1-1.38-2.13-2.06-3.1-5.13.55-10.57,1.3-16.26,2.32-7.89,1.42-15.16,3.15-21.77,5.01-.13.03-.36.1-.6.27-.18.13-.33.29-.44.49l-4.61,7.9c-.28.49-.81.79-1.37.79-.8,0-1.49-.6-1.58-1.4-1.25-11.2-.93-26.68,7.91-39.92,6.12-9.16,12.43-11.43,51.61-30.68,28.24-13.88,23.14-11.81,49.55-24.52,14.46-6.96,26.51-12.65,34.91-16.58.58-.27.93-.86.9-1.5-.16-3.12-.34-7.25-.46-12.11-.29-11.23-.4-16.91.77-20.13,2.25-6.14,8.7-14.92,18.32-15.23,6.89-.22,14.08,3.96,16.52,9.55,1.58,3.62,1.55,8.75,1.55,10.06-.02,4.88-1.13,7.78.26,8.77,1.4,1,4.17-.74,5.71-1.65Z"
				/>
				{/* Seats */}
				{seatElements.map(({ seatId, x, y }) => (
					<g key={seatId} transform={`translate(${x} ${y})`}>
						<rect
							width={seatWidth * 0.85}
							height={seatHeight * 0.85}
							rx={seatWidth * 0.12}
							fill="#2563eb"
							stroke="#3b82f6"
							strokeWidth={1.5}
							style={{ cursor: onSeatClick ? 'pointer' : 'default' }}
							onClick={() => onSeatClick && onSeatClick(seatId)}
						/>
						{showSeatLabels && seatHeight > 10 && seatWidth > 10 && (
							<text
								x={(seatWidth * 0.85) / 2}
								y={(seatHeight * 0.85) / 2 + 3}
								fontSize={Math.min(seatWidth, seatHeight) * 0.28}
								fill="#fff"
								textAnchor="middle"
								fontFamily="sans-serif"
							>
								{seatId}
							</text>
						)}
					</g>
				))}
			</g>
		</svg>
	);
}

function clamp(v, min, max) {
	return Math.min(Math.max(v, min), max);
}

