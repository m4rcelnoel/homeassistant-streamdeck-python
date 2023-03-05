import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Container } from '@mui/system';

import KeyCard from '../components/keyCard'

export default function BasicButtons() {
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <KeyCard/>
      </Container>
    </>
  );
}