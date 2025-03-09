import { Router } from 'express';
import { getPositionCandidates } from '../presentation/controllers/positionController';

const router = Router();

/**
 * GET /positions/:id/candidates
 * Get all candidates for a specific position
 */
router.get('/:id/candidates', getPositionCandidates);

export default router; 