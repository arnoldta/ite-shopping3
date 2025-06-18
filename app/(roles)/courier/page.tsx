// app/(roles)/picker/page.tsx

export default function CourierPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Courier Dashboard</h2>
      <p>This is a protected page only for users with role “courier.”</p>
    </div>
  );
}