export const config = {
    port: process.env.PORT || 3100,
    databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://user:JuvexyZy3!@cluster0.urp2jsz.mongodb.net/?appName=Cluster0',
    jwtSecret: process.env.JWT_SECRET || 'super_tajny_klucz_123'
};