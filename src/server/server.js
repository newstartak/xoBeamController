import express from "express";
import cors from "cors";

import authRouter from "./routes/passwordHash.js";
import tcpRouter from "./routes/sender.js";
import beamRouter from "./routes/beamAdder.js";

import { promises as fs } from "fs";


const app = express();


// 회사 나스 내부 망 홈페이지와 리액트 로컬 개발 환경에서만 접속 가능하도록 제한
const allowedOrigins = ['http://192.168.1.208:3000', 'http://localhost:5173'];
const corsOptions =
{
  origin: allowedOrigins
}
app.use(cors(corsOptions));

app.use(express.json());

// 회원가입 및 로그인 등 인증 관련 라우터
app.use("/auth", authRouter);

// 새 빔프로젝터 정보 추가를 위한 라우터
app.use("/beam", beamRouter);

// PJLink 프로토콜을 위한 TCP 라우터
app.use("/tcp", tcpRouter);

app.listen(2999, () => {
  console.log(`서버 실행 중 | PORT 2999`);
});


global.writeLog = async (id, message) =>
{
  const time = new Date().toISOString();

  try
  {
    await fs.appendFile("server.log", `[${time}] ${id}: ${message}\n`, "utf-8");
  }
  catch (err)
  {
    console.error("로그 쓰기 에러:", err);
  }
}