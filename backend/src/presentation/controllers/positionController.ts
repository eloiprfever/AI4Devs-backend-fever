import { Request, Response } from 'express';
import { getCandidatesForPosition } from '../../application/services/positionService';

/**
 * Get all candidates for a specific position
 * @param req - Express request object
 * @param res - Express response object
 */
export const getPositionCandidates = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id);
    
    // Validate position ID
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Invalid position ID format' });
    }
    
    // Get pagination parameters from query string
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
    
    // Validate pagination parameters
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: 'Invalid page parameter' });
    }
    
    if (isNaN(pageSize) || pageSize < 1) {
      return res.status(400).json({ error: 'Invalid pageSize parameter' });
    }
    
    // Get candidates for the position
    const result = await getCandidatesForPosition(positionId, page, pageSize);
    
    // Return the result
    res.json(result);
  } catch (error) {
    console.error('Error fetching position candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 