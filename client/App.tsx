import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCLink } from "@trpc/client";
import { NavigationContainer } from "@react-navigation/native";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import Constants from "expo-constants";

import { AppRouter, trpc } from "utils/trpc";
import { tokenHandler } from "utils/token-handler";
import { themeConfig } from "constants/theme-config";
import { ThemeProvider } from "components/theme/theme-provider";
import { Router } from "pages/index";
import { useState } from "react";
import { observable } from "@trpc/server/observable";

const { manifest } = Constants;

const isDevelompent = manifest?.packagerOpts?.dev;
const url = isDevelompent
  ? `http://192.168.1.100:8080`
  : `http://overload-api.com`;

type Response = {
  headers?: {
    map?: Record<string, string>;
  };
};

export const authTokenLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next: (value) => {
          const response = value.context?.response as Response;
          const headers = response?.headers?.map;
          const token = headers?.["token"];

          // update the token when recieved from the server (refresh token flow)
          if (token) {
            tokenHandler.setToken(token);
          }
          observer.next(value);
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });

      return unsubscribe;
    });
  };
};

const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        authTokenLink,
        httpBatchLink({
          url,
          headers: () => {
            const token = tokenHandler.getToken();

            return {
              ...(token && { Authorization: `Bearer ${token}` }),
            };
          },
        }),
      ],
    })
  );

  if (!fontsLoaded) {
    return;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <ThemeProvider config={themeConfig}>
            <Router />
          </ThemeProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
