import { UserInfo } from '@/models/UserInfo';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


// Внимание: если используете Next.js App Router, экспорт должен быть через default!
export async function POST(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  try {
    const { token } = await req.json();

    if (!token || typeof token !== 'string' || token.length < 10) {
      console.error('Invalid FCM token body');
      return new Response(JSON.stringify({ error: 'Invalid FCM token in request' }), { status: 400 });
    }

    const authHeader = req.headers.get('Authorization');

    // Если нет токена авторизации — не ругаемся, просто не делаем ничего и возвращаем success
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Authorization header missing or invalid, skipping token save');
      return new Response(JSON.stringify({ success: true, skipped: true, message: 'No authorization token, skipping.' }), { status: 200 });
    }

    const jwtToken = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(jwtToken, process.env.SECRET);
    } catch (e) {
      console.warn('Invalid JWT token, skipping save:', e);
      return new Response(JSON.stringify({ success: true, skipped: true, message: 'Invalid token, skipping.' }), { status: 200 });
    }

    const userEmail = payload.email;
    if (!userEmail || typeof userEmail !== 'string') {
      console.warn('No email in JWT payload, skipping');
      return new Response(JSON.stringify({ success: true, skipped: true, message: 'No email in token, skipping.' }), { status: 200 });
    }

    const user = await UserInfo.findOne({ email: userEmail });
    if (!user) {
      console.warn('User not found, skipping token save');
      return new Response(JSON.stringify({ success: true, skipped: true, message: 'User not found, skipping.' }), { status: 200 });
    }

    if (!user.seller) {
      console.warn('User is not a seller, skipping token save');
      return new Response(JSON.stringify({ success: true, skipped: true, message: 'User is not a seller, skipping.' }), { status: 200 });
    }

    await UserInfo.updateOne(
      { email: userEmail },
      { $addToSet: { fcmTokens: token } }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (e) {
    console.error('Internal server error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}


// Если используете Next.js pages/api, используйте
// export default (req, res) => {...} с аналогичной логикой
