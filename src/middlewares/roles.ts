export type Role = 'client' | 'admin' | 'driver';

const allRoles: Record<Role, string[]> = {
  client: ['client', 'common'],
  admin: ['admin', 'common'],
  driver: ['driver', 'common'],
};

const Roles = Object.keys(allRoles) as Array<keyof typeof allRoles>;

// Map the roles to their corresponding rights
const roleRights = new Map<Role, string[]>(
  Object.entries(allRoles) as [Role, string[]][],
);

export { Roles, roleRights };
