import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (error) {
    return null;
  }
}
