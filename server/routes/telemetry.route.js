import express from 'express';
const router = express.Router();
import telemetryContoller from '../controllers/user.controller';

router.route('/list')
.get(telemetryContoller.listOfDiscussions);


export default router;