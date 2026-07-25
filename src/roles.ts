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
  { code: "H", name: "CLIENT_HIDDEN" },
  { code: "S", name: "SENSOR" },
  { code: "T", name: "TRACKER" },
  { code: "F", name: "LOST_AND_FOUND" },
  { code: "K", name: "TAK" },
  { code: "E", name: "TAK_TRACKER" },
];
