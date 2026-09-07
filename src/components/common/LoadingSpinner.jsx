// File: src/components/common/LoadingSpinner.jsx
import React from 'react';
import { NauLoadingLogo } from '../brand/NauLoadingLogo';

/**
 * LoadingSpinner component wrapper wrapping the official NauLoadingLogo
 */
export const LoadingSpinner = ({ size = 'md', text = 'Đang tải dữ liệu...', className = '' }) => {
  return <NauLoadingLogo size={size} text={text} className={className} />;
};

export default LoadingSpinner;
