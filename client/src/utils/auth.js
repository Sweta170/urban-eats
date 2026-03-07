// Utility for handling access/refresh tokens in localStorage

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function logout() {
  clearTokens();
}
export function getUserRole() {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (err) {
    return null;
  }
}
