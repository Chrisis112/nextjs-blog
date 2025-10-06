import { UserInfo } from '@/models/UserInfo';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  }

  try {
    const { token } = await req.json();
    console.log('Received FCM token from body:', token);

    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Unauthorized: Missing or invalid Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const jwtToken = authHeader.split(' ')[1];
    console.log('JWT token from header:', jwtToken);

    let payload;
    try {
      payload = jwt.verify(jwtToken, process.env.SECRET);
      console.log('Decoded JWT payload:', payload);
    } catch (e) {
      console.error('Invalid JWT token:', e);
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const userEmail = payload.email;
    if (!userEmail) {
      console.error('No email in JWT payload');
      return new Response(JSON.stringify({ error: 'Email not found in token' }), { status: 400 });
    }
    console.log('User email from token:', userEmail);

    const user = await UserInfo.findOne({ email: userEmail });
    if (!user) {
      console.error('User not found with email:', userEmail);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    console.log('User found:', user.email);

    if (!user.seller) {
      console.error('User is not a seller:', user.email);
      return new Response(JSON.stringify({ error: 'User is not a seller' }), { status: 403 });
    }

    await UserInfo.updateOne(
      { email: userEmail },
      { $addToSet: { fcmTokens: token } }
    );
    console.log(`FCM token updated for user ${user.email}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('Error in POST /api/save-fcm-token:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
