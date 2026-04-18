export const ROLES = {
    ADMIN: "ADMIN",
    VENUE_MANAGER: "VENUE_MANAGER",
    STALL_OWNER: "STALL_OWNER",
    PLAYER: "PLAYER",
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isManager = (user) => user?.role === ROLES.VENUE_MANAGER;
export const isStallOwner = (user) => user?.role === ROLES.STALL_OWNER;
export const isPlayer = (user) => user?.role === ROLES.PLAYER;

export const hasRole = (user, role) => user?.role === role;
