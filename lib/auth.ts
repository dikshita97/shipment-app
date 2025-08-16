export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "manager" | "user"
  createdAt: string
}

// Hardcoded users for demo purposes
export const DEMO_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@shiptrack.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "manager",
    email: "manager@shiptrack.com",
    role: "manager",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    username: "user",
    email: "user@shiptrack.com",
    role: "user",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

// Demo credentials (username: password)
export const DEMO_CREDENTIALS = {
  admin: "admin123",
  manager: "manager123",
  user: "user123",
}

export function validateCredentials(username: string, password: string): User | null {
  if (DEMO_CREDENTIALS[username as keyof typeof DEMO_CREDENTIALS] === password) {
    return DEMO_USERS.find((user) => user.username === username) || null
  }
  return null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
}
