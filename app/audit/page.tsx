export const metadata = {
  title: "Audit Log — NextCMS",
};

export default function AuditPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Audit Log</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          A transparent record of system activities and content updates.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase tracking-wider text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100 font-medium">
                  Post Published <span className="text-zinc-400 font-normal ml-2">#00{i}</span>
                </td>
                <td className="px-6 py-4 text-zinc-500">System Admin</td>
                <td className="px-6 py-4 text-zinc-400 font-mono text-xs text-right">
                  2024-05-1{i} 14:30:22
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}