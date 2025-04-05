import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { fetch } from '@tauri-apps/plugin-http';

import { useSession } from '@toolpad/core';

type KeucloakResponse = {
  access_token: string,
  expires_in: number,
  refresh_expires_in: number,
  refresh_token: string,
  token_type: string,
  not_before_policy: number,
  session_state: string
  scope: string
}
// preview-start
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// preview-end

const signIn: (provider: AuthProvider, formData: FormData) => Promise<void> = async (
  provider,
  formData,
) => {
  const formBody = new URLSearchParams({
    grant_type: "password",
    client_id: "medical-registry",
    scope: "email",
    username: formData.get('email') as string,
    password: formData.get('password') as string,
    client_secret: "WPmW6BkDm4RMPTkfHG3Pftj7Y2UT8Pbi"
  }).toString();

  try {
    const response = await fetch(
      'http://localhost:9080/realms/medManager/protocol/openid-connect/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: KeucloakResponse = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    window.location.href = 'http://localhost:1420';
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error; // Re-throw to handle it in the UI
  }
};

export default function CredentialsSignInPage() {
  const theme = useTheme();
  return (
    // preview-start
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{ emailField: { autoFocus: false }, form: { noValidate: true } }}
      />
    </AppProvider>
    // preview-end
  );
}

