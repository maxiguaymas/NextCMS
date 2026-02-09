import UserRow, { User } from "./UserRow";

export default function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
        <thead className="bg-gray-50 dark:bg-neutral-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Status
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-neutral-950">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
