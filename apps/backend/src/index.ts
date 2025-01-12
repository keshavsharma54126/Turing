import express from 'express';
import { authRouter } from './routes/authRouter';
import { userRouter } from './routes/userRouter';
import { testRouter } from './routes/testRouter';
import { conversationRouter } from './routes/conversationRouter';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: process?.env?.NEXT_PUBLIC_FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

app.get('/health', async (req, res) => {
    res.json({
        status: 'ok'
    });
});

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/tests",testRouter);
app.use("/api/v1/conversations",conversationRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});