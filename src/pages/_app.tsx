import {
  ControllableSnackBar,
  ControllableSnackBarRef,
  ControllableSnackBarStateParams,
} from "@/components/snackbar/ControllableSnackbar";
import '@carbon/styles/css/styles.css';
import { GlobalActionContext } from "@/context/GlobalActionContext";
import "@/styles/globals.css";
import { theme } from "@/utils/theme";
import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { useRef } from "react";
import Script from 'next/script'
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress';
import UserContext from "@/context/UserContext";
import { Profile } from "@/models/profile";
import { UserProvider } from "@/components/UserProvider";

export default function App({ Component, pageProps }: AppProps) {
  const snackBarRef = useRef<ControllableSnackBarRef>(null);
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false);

  function showSnackBar(params: ControllableSnackBarStateParams) {
    snackBarRef.current?.open(params);
  }

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true));
    Router.events.on('routeChangeComplete', () => setIsLoading(false));
    Router.events.on('routeChangeError', () => setIsLoading(false));
    return () => {
      Router.events.off('routeChangeStart', () => setIsLoading(true));
      Router.events.off('routeChangeComplete', () => setIsLoading(false));
      Router.events.off('routeChangeError', () => setIsLoading(false));
    };
  }, [Router.events]);

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  function updateUser(user: Profile | null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    } else setUser(null)
  }


  return (
    <ThemeProvider theme={theme}>
      <GlobalActionContext.Provider
        value={{
          showSnackBar,
        }}
      >
        <UserContext.Provider value={{
          user,
          updateUser
        }}>
          <UserProvider>
            <>
              <LinearProgress color="primary" sx={{ width: '100%', display: isLoading ? 'inherit' : 'none', zIndex: 2000, position: 'fixed !important' }} />
              <Component {...pageProps} />
              <ControllableSnackBar ref={snackBarRef} />
              <Script src="https://checkout.paygate.upperlink.ng/assets/js/plugin.js"></Script>
            </>
          </UserProvider>
        </UserContext.Provider>
      </GlobalActionContext.Provider>
    </ThemeProvider>
  );
}
