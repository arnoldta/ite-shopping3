// app/(roles)/[role]/page.tsx
import { notFound } from "next/navigation";
import PickerDashboard from "./dashboards/PickerDashboard";
import ForwarderDashboard from "./dashboards/ForwarderDashboard";
import ShipperDashboard from "./dashboards/ShipperDashboard";
import CourierDashboard from "./dashboards/CourierDashboard";
import ReceiverDashboard from "./dashboards/ReceiverDashboard";

type Role = "picker" | "forwarder" | "shipper" | "courier" | "receiver";

interface PageProps {
  params: Promise<{ role: string }>;
}

export default async function RolePage({ params }: PageProps) {
  const { role } = await params;
  const roleLower = role.toLowerCase() as Role;

  switch (roleLower) {
    case "picker":
      return <PickerDashboard />;
    case "forwarder":
      return <ForwarderDashboard />;
    case "shipper":
      return <ShipperDashboard />;
    case "courier":
      return <CourierDashboard />;
    case "receiver":
      return <ReceiverDashboard />;
    default:
      // No such role → 404
      notFound();
  }
}