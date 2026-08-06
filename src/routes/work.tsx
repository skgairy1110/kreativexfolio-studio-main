import { createFileRoute, Outlet } from "@tanstack/react-router";

function WorkLayout() {
  return <Outlet />;
}

export const Route = createFileRoute("/work")({
  component: WorkLayout,
});
