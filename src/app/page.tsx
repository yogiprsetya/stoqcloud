// import { getServerSession } from 'next-auth';
// import { redirect } from 'next/navigation';
// import { authOptions } from '~/config/auth';

export default async function Home() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Warehouse & stock summary</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Total Stock Summary</div>
            <div className="mt-2 text-2xl font-bold">-</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Low Stock</div>
            <div className="mt-2 text-2xl font-bold">-</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Most Outbound Items</div>
            <div className="mt-2 text-2xl font-bold">-</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Inventory Value</div>
            <div className="mt-2 text-2xl font-bold">-</div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card p-4 h-64">
            <div className="text-sm font-medium">Summary Chart</div>
          </div>
          <div className="rounded-lg border bg-card p-4 h-64">
            <div className="text-sm font-medium">Low Stock (details)</div>
          </div>
        </section>
      </div>
    </div>
  );
}
