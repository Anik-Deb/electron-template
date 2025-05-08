import * as React from 'react';
import PropTypes from 'prop-types';

const PosIcon = ({ size = 100, color = '#000', ...props }) => {
  const rectProps = {
    style: {
      fill: '#f1f1f1',
      stroke: color,
      strokeWidth: 0.565,
      strokeLinecap: 'square',
      strokeLinejoin: 'bevel',
      strokeMiterlimit: 4,
      strokeDasharray: 'none',
      paintOrder: 'normal',
    },
  };

  const largeRectProps = {
    ...rectProps,
    style: {
      ...rectProps.style,
      strokeWidth: 0.71085715,
    },
  };

  const renderRects = (positions, rectProps) =>
    positions.map(([x, y], index) => (
      <rect
        key={index}
        width={3.988}
        height={2.941}
        x={x}
        y={y}
        rx={0}
        ry={0}
        {...rectProps}
      />
    ));

  const renderLargeRects = (positions, rectProps) =>
    positions.map(([x, y], index) => (
      <rect
        key={index}
        width={5.752}
        height={3.227}
        x={x}
        y={y}
        rx={0}
        ry={0}
        {...rectProps}
      />
    ));

  const smallRects = [
    [72.811, 59.696],
    [78.979, 59.696],
    [85.146, 59.696],
    [91.314, 59.696],
  ];

  const largeRects = [
    [72.884, 65.916],
    [81.18, 65.916],
    [89.476, 65.916],
    [72.884, 71.156],
    [81.18, 71.156],
    [89.476, 71.156],
    [72.884, 76.409],
    [81.18, 76.409],
    [89.476, 76.409],
    [72.884, 81.923],
    [81.18, 81.923],
    [89.476, 81.923],
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100.406 232.29"
      fill={color}
      {...props}
    >
      <title>{'Credit Card POS terminal with Card Punch Hand'}</title>
      <g
        style={{ stroke: color }}
        transform="matrix(3.50914 0 0 3.50914 -240.97 -119.625)"
      >
        {renderRects(smallRects, rectProps)}
        {renderLargeRects(largeRects, largeRectProps)}
      </g>
      <path
        d="M63.646 39.07v55.506h76.748V39.07Z"
        style={{
          fill: 'none',
          stroke: color,
          strokeWidth: 2.10899472,
          strokeLinecap: 'square',
          strokeLinejoin: 'round',
          strokeMiterlimit: 4,
          strokeDasharray: 'none',
          paintOrder: 'normal',
        }}
        transform="translate(-48.229 -14.998)"
      />
      <path
        d="M147.929 17.828v185.805M67.151 15.88h69.556c9.288 0 18.045-.028 18.045 23.19v43.383c0 49.128-6.823 121.18-6.823 121.18 0 8.284-10.474 12.114-12.402 12.114H70.37c-1.93 0-15.022-3.83-15.022-12.114 0 0-6.236-72.052-6.236-121.18V39.07c0-23.218 8.752-23.19 18.04-23.19z"
        style={{
          fill: 'none',
          stroke: color,
          strokeWidth: 1.76499999,
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 4,
          strokeDasharray: 'none',
          strokeOpacity: 1,
        }}
        transform="translate(-48.229 -14.998)"
      />
      <g style={{ stroke: color }}>
        <path
          d="M111.448 89.138h19.14s-1.068.49-1.57 1.068h-15.975c-.383-.664-1.595-1.068-1.595-1.068z"
          style={{
            fill: 'none',
            stroke: color,
            strokeWidth: 0.26458332,
            strokeLinecap: 'square',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 6.30000019,
            strokeDasharray: 'none',
            strokeOpacity: 1,
            paintOrder: 'fill markers stroke',
          }}
          transform="matrix(3.50914 0 0 3.50914 -370.955 -119.625)"
        />
        <path
          d="M128.287 89.498v9.232a1.32 1.32 0 0 1-1.323 1.323h-11.902a1.32 1.32 0 0 1-1.323-1.323v-9.232"
          style={{
            fill: '#fff',
            fillOpacity: 1,
            stroke: color,
            strokeWidth: 0.465,
            strokeLinecap: 'square',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 4,
            strokeDasharray: 'none',
            paintOrder: 'normal',
          }}
          transform="matrix(3.50914 0 0 3.50914 -370.955 -119.625)"
        />
      </g>

      {/* Card Punch Hand */}
      <g transform="translate(60, 100)">
        {/* Hand */}
        <path
          d="M10 20 Q15 15 20 20 T30 25"
          style={{
            fill: 'none',
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
          }}
        />
        {/* Card */}
        <rect
          x="15"
          y="15"
          width="15"
          height="10"
          rx="2"
          ry="2"
          style={{
            fill: '#fff',
            stroke: color,
            strokeWidth: 1,
          }}
        />
        {/* Fingers */}
        <path
          d="M30 25 Q32 27 30 30"
          style={{
            fill: 'none',
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
          }}
        />
        <path
          d="M30 25 Q28 27 30 30"
          style={{
            fill: 'none',
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
          }}
        />
      </g>
    </svg>
  );
};

PosIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default PosIcon;
