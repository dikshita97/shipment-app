export function saveToken(t){ localStorage.setItem("token", t); }
export function getToken(){ return localStorage.getItem("token"); }
export function logout(){ localStorage.removeItem("token"); }
export function isAuthed(){ return !!getToken(); }
