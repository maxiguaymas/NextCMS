import Button from "@/components/ui/Button";

export default function ApiKeysCard() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium">Public API Key</p>
        <input
          disabled
          value="pk_live_xxxxxxxxx"
          className="mt-1 w-full rounded-md bg-gray-100 dark:bg-neutral-900 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-sm font-medium">Secret API Key</p>
        <div className="flex gap-2">
          <input
            disabled
            value="sk_live_xxxxxxxxx"
            type="password"
            className="w-full rounded-md bg-gray-100 dark:bg-neutral-900 px-3 py-2 text-sm"
          />
          <Button variant="ghost">Rotate</Button>
        </div>
      </div>
    </div>
  );
}
