export type Role = {
  code: string;
  name: string;
};

export const roles: Role[] = [
  { code: "R", name: "ROUTER" },
  { code: "L", name: "ROUTER_LATE" },
  { code: "B", name: "CLIENT_BASE" },
  { code: "C", name: "CLIENT" },
  { code: "M", name: "CLIENT_MUTE" },
];
