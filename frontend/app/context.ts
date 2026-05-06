import { createContext } from "react-router";
import type { AuthResponse } from "./types/auth";
export const userContext = createContext<AuthResponse>();
