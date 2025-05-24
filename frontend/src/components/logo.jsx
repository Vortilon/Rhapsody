import React from 'react';
import { SvgIcon } from '@mui/material';

export default function Logo(props) {
  return (
    <SvgIcon
      viewBox="0 0 36 36"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18 0C8.059 0 0 8.059 0 18s8.059 18 18 18 18-8.059 18-18S27.941 0 18 0zm0 6c6.627 0 12 5.373 12 12s-5.373 12-12 12S6 24.627 6 18 11.373 6 18 6zm0 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 4c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4z"
      />
    </SvgIcon>
  );
}
