import "react-native-get-random-values";

import { useState } from "react";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink, TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Router } from "@features/core/components/router";
import { AppRouter, trpc } from "@features/api/trpc";
import { Toast } from "@features/ui/components";
import { Dialog } from "@features/ui/components/dialog";
import { colors } from "@features/ui/theme";
import { tokenHandler } from "@features/auth/lib/token-handler";
import { TrainingBottomSheet } from "@features/training/components/training-bottom-sheet";

const url = __DEV__ ? `http://192.168.68.102:8080` : `http://overload-api.com`;

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
            __DEV__ &&
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
        <GestureHandlerRootView className="grow">
          <SafeAreaProvider>
            <BottomSheetModalProvider>
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
                <TrainingBottomSheet />
                <StatusBar style="light" />
                <Dialog />
                <PortalProvider>
                  <Router />
                </PortalProvider>
              </NavigationContainer>
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
        <Toast />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
