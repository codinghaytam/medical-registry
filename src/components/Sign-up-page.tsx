import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

// preview-start
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// preview-end

const signIn: (provider: AuthProvider, formData: FormData) => void = async (
  provider,
  formData,
) => {
  const promise = new Promise<void>((resolve) => {
    setTimeout(() => {
        axios.post('http://localhost:9090/realms/myRealm/protocol/openid-connect/token', {
            "grant_type": "password",
            "client_id": "medical-registry",
            "scope":"email",
            "username": formData.get('email'),
            "password": formData.get('password')            
        }, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            window.location.href = 'http://localhost:1420';
        }).catch((error) => {
            console.log(error);
        });
        
      /*alert(
        `Signing in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}`,
      );*/
      resolve();
    }, 300);
  });
  return promise;
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
