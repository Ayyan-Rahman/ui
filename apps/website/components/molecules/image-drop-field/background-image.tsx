import { useMemo } from 'react';

import { Box } from '@mui/material';

type Props = {
  value: string | File;
  isOver?: boolean;
};

export function BackgroundImage({ value, isOver }: Props) {
  const preview = useMemo(
    () => (value instanceof File ? URL.createObjectURL(value) : value),
    [value]
  );
  return (
    <Box
      className="field-image"
      sx={{
        backgroundImage: `url(${preview})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        transition: 'opacity 0.2s ease-in-out',
      }}
      style={{
        opacity: isOver ? 0.5 : 1,
      }}
    />
  );
}
