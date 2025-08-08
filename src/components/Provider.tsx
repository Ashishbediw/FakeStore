'use client';

import { Provider as ReduxProvider } from "react-redux";
import { store, persistor} from "../redux/store";
import { SessionProvider } from "next-auth/react";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
         <PersistGate loading={null} persistor={persistor}>
        {children}
        </PersistGate>
      </ReduxProvider>
    </SessionProvider>
  );
}
