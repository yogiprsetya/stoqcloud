// import { getServerSession } from 'next-auth';
// import { redirect } from 'next/navigation';
// import { authOptions } from '~/config/auth';

export default async function Home() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan gudang & stok</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Ringkasan Stok Total</div>
            <div className="mt-2 text-2xl font-bold">-</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Stok Menipis</div>
            <div className="mt-2 text-2xl font-bold">-</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Barang Keluar Terbanyak</div>
            <div className="mt-2 text-2xl font-bold">-</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Nilai Persediaan</div>
            <div className="mt-2 text-2xl font-bold">-</div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card p-4 h-64">
            <div className="text-sm font-medium">Grafik Ringkas</div>
          </div>
          <div className="rounded-lg border bg-card p-4 h-64">
            <div className="text-sm font-medium">Stok Menipis (detail)</div>
          </div>
        </section>
      </div>
    </div>
  );
}
