// app/(roles)/picker/page.tsx

export default function ReceiverPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Receiver Dashboard</h2>
      <p>This is a protected page only for users with role “Receiver.”</p>
    </div>
  );
}