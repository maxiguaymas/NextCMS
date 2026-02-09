import RoleBadge from "./RoleBadge";
import Button from "@/components/ui/Button";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "EDITOR";
  status: "ACTIVE" | "INVITED";
}

export default function UserRow({ user }: { user: User }) {
  return (
    <tr className="border-b border-gray-200 dark:border-neutral-800">
      <td className="py-3 pr-4">
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </td>

      <td className="py-3 pr-4">
        <RoleBadge role={user.role} />
      </td>

      <td className="py-3 pr-4 text-sm">
        {user.status === "ACTIVE" ? "Active" : "Invited"}
      </td>

      <td className="py-3 text-right">
        <Button variant="ghost">Edit</Button>
      </td>
    </tr>
  );
}
