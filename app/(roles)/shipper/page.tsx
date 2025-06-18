// app/(roles)/picker/page.tsx

export default function ShipperPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Shipper Dashboard</h2>
      <p>This is a protected page only for users with role “shipper.”</p>
    </div>
  );
}