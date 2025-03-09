import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Update the interview stage of a candidate
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        
        // Validate candidate ID
        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID format' });
        }
        
        const { interviewStepId, applicationId } = req.body;
        
        // Validate interview step ID
        if (!interviewStepId || isNaN(parseInt(interviewStepId))) {
            return res.status(400).json({ error: 'Invalid or missing interview step ID' });
        }
        
        // Validate application ID if provided
        if (applicationId && isNaN(parseInt(applicationId))) {
            return res.status(400).json({ error: 'Invalid application ID format' });
        }
        
        // Update the candidate's stage
        const result = await updateCandidateStage(
            candidateId,
            parseInt(interviewStepId),
            applicationId ? parseInt(applicationId) : undefined
        );
        
        // Return the updated application
        res.json({
            message: 'Candidate stage updated successfully',
            data: result
        });
    } catch (error) {
        if (error instanceof Error) {
            // Handle specific errors
            if (error.message.includes('not found')) {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export { addCandidate };