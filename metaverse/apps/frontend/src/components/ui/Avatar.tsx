import React, { useState } from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Player',
  size = 'md',
  status,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-[#55FF55]',
    busy: 'bg-meta-gold',
    offline: 'bg-meta-muted',
  };

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const showImg = src && !imgError;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} mc-slot flex items-center justify-center overflow-hidden font-bold text-meta-text`}
      >
        {showImg ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center [image-rendering:pixelated]"
          />
        ) : initials ? (
          <span className="text-meta-accent select-none mc-text">{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-meta-muted" />
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusDotSizes[size]} ${statusColors[status]} ring-2 ring-meta-bg`}
          style={{ borderRadius: 0 }}
        />
      )}
    </div>
  );
};
