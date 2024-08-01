'use client';

import {
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';

interface Stream {
  id: string;
  name: string;
}

const DashboardPage: React.FC = () => {
  const [activeOptions, setActiveOptions] = useState<string | null>(null);
  const optionsRef = React.useRef<HTMLDivElement>(null);

  return (
    <Grid container spacing={3}>
      <Grid item>
        <Paper></Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
