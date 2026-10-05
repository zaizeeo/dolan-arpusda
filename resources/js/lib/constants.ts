export const ALLOWED_AUTH_ROUTES = ["login", "register"] as const;

export type ALLOWED_AUTH_ROUTE_TYPE = (typeof ALLOWED_AUTH_ROUTES)[number];
