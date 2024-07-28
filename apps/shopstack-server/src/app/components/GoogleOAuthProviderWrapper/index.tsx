'use client';

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleOAuthProviderWrapperProps {
  children: React.ReactNode;
}

const GoogleOAuthProviderWrapper: React.FC<GoogleOAuthProviderWrapperProps> = ({
  children,
}) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
};

export default GoogleOAuthProviderWrapper;
