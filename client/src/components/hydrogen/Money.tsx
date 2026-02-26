import React from 'react';

interface MoneyProps {
  data: {
    amount: string;
    currencyCode: string;
  };
  as?: React.ElementType;
  className?: string;
}

export function Money({ data, as: Component = 'span', className }: MoneyProps) {
  const { amount, currencyCode } = data;
  
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));

  return <Component className={className}>{formatted}</Component>;
}
