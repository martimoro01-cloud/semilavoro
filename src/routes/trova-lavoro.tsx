import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/trova-lavoro")({
  component: TrovaLavoroLayout,
});

function TrovaLavoroLayout() {
  return <Outlet />;
}
