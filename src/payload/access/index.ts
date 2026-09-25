import type { Access, FieldAccess, PayloadRequest } from "payload";

export type Role = "admin" | "editor";

const hasRole = (req: PayloadRequest, role: Role) =>
  Boolean(req.user && (req.user as { roles?: Role[] }).roles?.includes(role));

/** Signed-in team member (admin or editor). */
export const authenticated = ({ req }: { req: PayloadRequest }): boolean => Boolean(req.user);

export const admins: Access = ({ req }) => hasRole(req, "admin");

export const adminsField: FieldAccess = ({ req }) => hasRole(req, "admin");

/** Admins manage every user; editors can only read and update themselves. */
export const adminsOrSelf: Access = ({ req }) => {
  if (hasRole(req, "admin")) return true;
  if (req.user) return { id: { equals: req.user.id } };
  return false;
};

/** Public sees published documents only; the team sees drafts too. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};

export const anyone: Access = () => true;
