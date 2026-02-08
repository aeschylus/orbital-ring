import { SimulationProvider } from "@/providers/SimulationProvider";

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimulationProvider>{children}</SimulationProvider>;
}
