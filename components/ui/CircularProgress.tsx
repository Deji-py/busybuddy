import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Typography from './Typography';

// ================================================================
// CIRCULAR PROGRESS COMPONENT
// ================================================================

interface CircularProgressProps {
  /**
   * Progress value between 0 and 1
   */
  progress: number;

  /**
   * Size of the circular progress
   */
  size?: number;

  /**
   * Width of the progress ring
   */
  strokeWidth?: number;

  /**
   * Color of the progress
   */
  color?: string;

  /**
   * Background color of the ring
   */
  backgroundColor?: string;

  /**
   * Show percentage text
   */
  showPercentage?: boolean;

  /**
   * Percentage text color
   */
  percentageColor?: string;

  /**
   * Percentage font size
   */
  percentageFontSize?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showPercentage = true,
  percentageColor = '#1f2937',
  percentageFontSize = 16,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - Math.min(Math.max(progress, 0), 1) * circumference;

  const centerX = size / 2;
  const centerY = size / 2;
  const percentage = Math.round(progress * 100);

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          originX={centerX}
          originY={centerY}
          rotation={-90}
        />
      </Svg>

      {/* Percentage text */}
      {showPercentage && (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Typography
            type="h5"
            color={percentageColor}
            style={{ fontSize: percentageFontSize, fontFamily: 'Figtree_700Bold' }}>
            {percentage}%
          </Typography>
        </View>
      )}
    </View>
  );
};

export default CircularProgress;
