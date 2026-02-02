
import React from 'react';

/**
 * TooltipProvider component with optional children to prevent strict type errors.
 */
export const TooltipProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  return <>{children}</>;
};
