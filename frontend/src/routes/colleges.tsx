import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/colleges")({
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
