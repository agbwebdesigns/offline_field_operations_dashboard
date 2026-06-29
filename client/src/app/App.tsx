import { Outlet } from "react-router-dom";

import { AppLayout } from "../shared/components/AppLayout";

export function App() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
