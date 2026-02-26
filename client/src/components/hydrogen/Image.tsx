import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  data?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  aspectRatio?: string;
}

export function Image({ data, src, alt, aspectRatio, className, ...props }: ImageProps) {
  // Hydrogen Image component logic simulation
  const url = data?.url || src;
  const altText = data?.altText || alt || '';
  
  if (!url) return null;

  return (
    <img
      src={url}
      alt={altText}
      className={className}
      style={aspectRatio ? { aspectRatio } : undefined}
      loading="lazy"
      {...props}
    />
  );
}
