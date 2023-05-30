import "react-native-get-random-values";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink, TRPCLink } from "@trpc/client";
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
import { observable } from "@trpc/server/observable";
import Constants from "expo-constants";

import { AppRouter, trpc } from "@utils/trpc";
import { tokenHandler } from "@utils/token-handler";
import { Router } from "@pages";
import { StatusBar } from "expo-status-bar";
import { colors } from "@constants/theme";
import { View } from "react-native";
import { Dialog } from "@components/dialog/dialog";
import { PortalProvider } from "@gorhom/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { manifest } = Constants;

const isDevelompent = !!manifest?.packagerOpts?.dev;
const url = isDevelompent
  ? `http://192.168.1.103:8080`
  : `http://overload-api.com`;

type Response = {
  headers?: {
    map?: Record<string, string>;
  };
};

const authTokenLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next: (value) => {
          const response = value.context?.response as Response;
          const headers = response?.headers?.map;
          const token = headers?.["token"];

          // update the token when recieved from the server (refresh token flow)
          if (token) tokenHandler.setToken(token);
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
        loggerLink({
          enabled: (opts) =>
            isDevelompent &&
            opts.direction === "down" &&
            opts.result instanceof Error,
        }),
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

  if (!fontsLoaded) return;

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <View className="grow bg-base-800">
          <GestureHandlerRootView className="grow">
            <NavigationContainer
              theme={{
                dark: true,
                colors: {
                  background: colors.base[800],
                  card: colors.base[700],
                  text: "white",
                  primary: colors.primary,
                  border: "rgba(255, 255, 255, 0)",
                  notification: colors.primary,
                },
              }}
            >
              <StatusBar style="light" />
              <Dialog />
              <PortalProvider>
                <Router />
              </PortalProvider>
            </NavigationContainer>
          </GestureHandlerRootView>
        </View>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
