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
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';

interface Stream {
  id: string;
  name: string;
}

const DashboardPage: React.FC = () => {
  const [streams, setStreams] = useState<Stream[]>([
    { id: '1', name: 'Stream 1' },
    { id: '2', name: 'Stream 2' },
    { id: '3', name: 'Stream 3' },
  ]);

  const [rows, setRows] = useState([]);

  const [activeOptions, setActiveOptions] = useState<string | null>(null);
  const optionsRef = React.useRef<HTMLDivElement>(null);

  const handleCreateStream = () => {
    // Implement create stream logic
    console.log('Creating new stream...');
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setActiveOptions(null);
      }
    };

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);

  const handleStreamOptions = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveOptions(activeOptions === id ? null : id);
  };

  const renderTile = (id: string, name: string) => (
    <Grid item xs={12} sm={6} md={4} key={id}>
      <Link href={`/streams/${id}`}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              {name}
            </Typography>
            {/* <IconButton
              onClick={(e) => handleStreamOptions(id, e)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              <FaEllipsisV />
            </IconButton> */}
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );

  function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Container disableGutters maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {streams.map(({ id, name }) => renderTile(id, name))}
          </Grid>
        </Container>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <React.Fragment>
              <Typography>Recent Orders</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Ship To</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell align="right">Sale Amount</TableCell>
                  </TableRow>
                </TableHead>
                {/* <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.shipTo}</TableCell>
                      <TableCell>{row.paymentMethod}</TableCell>
                      <TableCell align="right">{`$${row.amount}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody> */}
              </Table>
              <Link color="primary" href="#" onClick={preventDefault}>
                See more orders
              </Link>
            </React.Fragment>
          </Paper>
        </Grid>
      </main>
    </div>
  );
};

export default DashboardPage;
