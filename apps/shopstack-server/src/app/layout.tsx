import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import './global.css';
import dynamic from 'next/dynamic';
import { FaSignOutAlt } from 'react-icons/fa';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from './theme';
import MainBox from './main';

export const metadata = {
  title: 'Welcome to shopstack-server',
  description: 'Generated by create-nx-workspace',
};

const GoogleOAuthProviderWrapper = dynamic(
  () => import('./components/GoogleOAuthProviderWrapper'),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
  };

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <GoogleOAuthProviderWrapper>
              <Box sx={{ display: 'flex' }}>
                <AppBar position="absolute">
                  <Toolbar
                    sx={{
                      pr: '24px',
                    }}
                  >
                    <Link href="/" underline="none">
                      <Typography
                        variant="h4"
                        component="h1"
                        noWrap
                        sx={{ fontWeight: 'bold', color: 'black', flexGrow: 1 }}
                      >
                        ShopStack
                      </Typography>
                    </Link>
                    <IconButton color="inherit">
                      <Badge color="secondary">
                        <FaSignOutAlt />
                      </Badge>
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <MainBox>{children}</MainBox>
              </Box>
            </GoogleOAuthProviderWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
