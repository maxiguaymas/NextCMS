import Badge from "@/components/ui/Badge";

type Role = "OWNER" | "ADMIN" | "EDITOR";

export default function RoleBadge({ role }: { role: Role }) {
  const variant =
    role === "OWNER"
      ? "danger"
      : role === "ADMIN"
      ? "warning"
      : "default";

  return <Badge variant={variant}>{role}</Badge>;
}
