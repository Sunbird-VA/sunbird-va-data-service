import express from 'express';
import telemetryRoutes from './telemetry.route'


const router = express.Router(); // eslint-disable-line new-cap

router.use('/discussion', telemetryRoutes)

export default router;
