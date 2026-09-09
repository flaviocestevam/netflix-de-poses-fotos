import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/minha-viagem")({
  component: () => <Navigate to="/favoritos" replace />,
});
