import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/minha-viagem/$id")({
  component: () => <Navigate to="/favoritos" replace />,
});
