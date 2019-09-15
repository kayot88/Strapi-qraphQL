import React from 'react';
import { RotateLoader } from 'react-spinners';
import {Box} from 'gestalt'

const Loader = () => {
  return (
    <Box position="fixed" dangerouslySetInlineStyle={{
      __style:{
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 300
      }
    }}>
      <RotateLoader color="red" />
    </Box>
  );
};

export default Loader;