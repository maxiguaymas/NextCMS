import Button from "@/components/ui/Button";

export default function DangerZone() {
  return (
    <section className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
          Danger Zone
        </h2>
        <p className="text-sm text-red-600 dark:text-red-500">
          Irreversible and destructive actions.
        </p>
      </div>

      <Button variant="danger">Delete Project</Button>
    </section>
  );
}
