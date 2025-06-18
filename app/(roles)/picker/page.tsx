// app/(roles)/picker/page.tsx

export default function PickerPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Picker Dashboard</h2>
      <p>This is a protected page only for users with role “picker.”</p>
    </div>
  );
}