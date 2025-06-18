// app/(roles)/picker/page.tsx

export default function ForwarderPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Forwarder Dashboard</h2>
      <p>This is a protected page only for users with role “forwarder.”</p>
    </div>
  );
}