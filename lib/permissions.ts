import { Role } from "@prisma/client";

export function hasRole(
  userRole: Role,
  allowedRoles: Role[]
) {
  return allowedRoles.includes(userRole);
}

export function canEdit(role?: Role) {
  return role === "ADMIN" || role === "EDITOR";
}

export function canDelete(role?: Role) {
  return role === "ADMIN";
}

export function canViewDraft(role?: Role) {
  return role === "ADMIN" || role === "EDITOR";
}
