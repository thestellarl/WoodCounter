import OAuth2Client from 'googleapis';
import { google } from 'googleapis';

class GoogleAPIService {
  authClient: null | OAuth2Client.Common.OAuth2Client = null;

  isAuthenticated = () => {
    return false;
  };

  authenticate = (callbackUrl: string) => {
    this.authClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl
    );

    const authUrl = this.authClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return authUrl;
  };
}

export default GoogleAPIService;
