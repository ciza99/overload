import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
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

import { trpc } from "trpc/index";
import { themeConfig } from "constants/theme-config";
import { ThemeProvider } from "context/theme/theme-provider";
import { AuthProvider } from "context/auth/auth-provider";
import { tokenHandler } from "context/auth/token-handler";
import { Router } from "modules/router/router";
import { useState } from "react";

const { manifest } = Constants;

const url = manifest?.packagerOpts?.dev
  ? `http://192.168.1.100:8080`
  : `http://overload-api.com`;

const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [queryClient] = useState(
    () =>
      new QueryClient({
        logger: console,
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
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
            <AuthProvider>
              <Router />
            </AuthProvider>
          </ThemeProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
