import type { ReactNode } from "react";
import { AppTopBar } from "./app-top-bar";

export type AppScreenProps = {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

export function AppScreen({ title, action, children }: AppScreenProps) {
  return (
    <>
      <AppTopBar title={title} action={action} />
      <div className="mx-auto w-full max-w-screen-sm px-5 py-6">{children}</div>
    </>
  );
}
