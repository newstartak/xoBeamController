import { Router } from 'express';

import database from '../firebaseServer.js'

const router = Router();

  router.post('/', async (req, res) => {

    const { id, place, deviceName, ip } = req.body;

        const ref = database.ref(`Beams/${place}/${deviceName}`);

    await ref.set
    ({
      ip: ip
    });

    res.status(200).send("newBeamAdded");
    writeLog(id, `newBeamAdded: ${ip}`)
  })

  router.delete('/', async (req, res) => {

    const { id, place, deviceName } = req.body;

    const ref = database.ref(`Beams/${place}/${deviceName}`);

    await ref.remove();

    res.status(200).send("beamRemoved");
    writeLog(id, `beamRemoved: ${deviceName}`)
  })

export default router;