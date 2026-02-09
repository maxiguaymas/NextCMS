import Button from "@/components/ui/Button";

export default function WebhooksCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Content Publish</p>
        <Button size="sm" variant="ghost">
          Test
        </Button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        POST https://hooks.example.com/webhook
      </p>
    </div>
  );
}
