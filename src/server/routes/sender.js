import { Router } from 'express';
import net from 'net';

const router = Router();

router.post('/ping', (req, res) =>
{
  const { id, ip } = req.body;


  if (!ip) return res.status(400).send('ip가 전달되지 않았습니다.');

  writeLog(id, `TCP to ${ip}`)

  const socket = net.createConnection({ host: ip, port: 4352 });
  socket.setTimeout(10000);

  socket.on('connect', () => {
    socket.write('TCP Signal');
  });

  socket.on('data', (data) =>
  {
    res.status(200).send('응답: ' + data);
    socket.end();
  });

  socket.on('timeout', () =>
  {
    res.status(504).send('10초 타임아웃');
    socket.destroy();
  });

  socket.on('error', (e) =>
  {
    res.status(502).send(`에러: ${e.code}`);
  });
});

export default router;