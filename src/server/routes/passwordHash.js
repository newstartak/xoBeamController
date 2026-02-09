import { Router } from 'express';
import crypto from 'node:crypto'

import database from '../firebaseServer.js'

const router = Router();

const encrypt = (id, pw) =>
{
  // 사용자마다 고유 SALT 추가
  pw += id + "xoSaLt"

  return crypto.createHash("sha256").update(pw).digest("hex");
}

router.post('/register', async (req, res) => 
{
  const { id, pw } = req.body;

  const ref = database.ref("Users");
  const snapshot = await ref.once("value");
  const rtdbVal = snapshot.val();

  if(rtdbVal?.[id])
  {
    return res.status(400).send("duplicateId")
  }

  const hashedPw = encrypt(id, pw);

  await ref.child(id).set
  ({
    hashedPw: hashedPw
  });

  writeLog(id, "newRegister")
  return res.status(200).send("registerOk")
})

router.post('/login', async (req, res) => 
{
  const { id, pw } = req.body;

  const ref = database.ref("Users");
  const snapshot = await ref.once("value");
  const rtdbVal = snapshot.val();

  if(!rtdbVal?.[id])
  {
    return res.status(400).send("invalidId")
  }
  else if(rtdbVal[id].hashedPw === encrypt(id, pw))
  {
    writeLog(id, "login")
    return res.status(200).send("loginSuccess")
  }
  else
  {
    return res.status(400).send("invalidPw")
  }
})

export default router;