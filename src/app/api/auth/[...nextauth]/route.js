import NextAuth from "next-auth/next";
import { authOptions } from "../../libs/authOptions"; // вынесите authOptions в отдельный файл

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
