import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import { mongoClientPromise } from '../../../libs/mongodb';

import { connectMongoDB } from "@/libs/mongodb";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(mongoClientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
async authorize(credentials) {
  const { email, password } = credentials;

  await connectMongoDB();
  const user = await User.findOne({ email }).select('+password'); // обязательно выбрать password
 
  if (!user) {
    return null;
  }

  if (!user.password) {
    console.log('Password hash is missing for user');
    return null;
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return null;
  }

  return user;
}

    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
};
