import { UserInfo } from '@/models/UserInfo';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


// Внимание: если используете Next.js App Router, экспорт должен быть через default!
export async function POST(req) {
  
  // Гарантируем соединение с базой
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  }

  try {
    // Получаем тело запроса
    const { token } = await req.json();

    if (!token || typeof token !== 'string' || token.length < 10) {
      console.error('Invalid FCM token body');
      return new Response(JSON.stringify({ error: 'Invalid FCM token in request' }), { status: 400 });
    }

    // Получаем JWT из заголовка Authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Unauthorized: Missing or invalid Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const jwtToken = authHeader.split(' ')[1];

    // Проверяем токен
    let payload;
    try {
      payload = jwt.verify(jwtToken, process.env.SECRET);
    } catch (e) {
      console.error('Invalid JWT token:', e);
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    // Убеждаемся, что в токене есть email
    const userEmail = payload.email;
    if (!userEmail || typeof userEmail !== 'string') {
      console.error('No email in JWT payload');
      return new Response(JSON.stringify({ error: 'Email not found in token' }), { status: 400 });
    }

    // Находим пользователя
    const user = await UserInfo.findOne({ email: userEmail });
    if (!user) {
      console.error('User not found with email:', userEmail);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    if (!user.seller) {
      console.error('User is not a seller:', user.email);
      return new Response(JSON.stringify({ error: 'User is not a seller' }), { status: 403 });
    }

    // Добавляем токен только если его еще нет
    await UserInfo.updateOne(
      { email: userEmail },
      { $addToSet: { fcmTokens: token } }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('Error in POST /api/save-fcm-token:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

// Если используете Next.js pages/api, используйте
// export default (req, res) => {...} с аналогичной логикой
