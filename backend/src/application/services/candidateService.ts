import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { Application } from '../../domain/models/Application';
import { InterviewStep } from '../../domain/models/InterviewStep';

export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};

export const findCandidateById = async (id: number): Promise<Candidate | null> => {
    try {
        const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
        return candidate;
    } catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw new Error('Error al recuperar el candidato');
    }
};

/**
 * Update the interview stage of a candidate
 * @param candidateId - The ID of the candidate
 * @param interviewStepId - The ID of the new interview step
 * @param applicationId - Optional application ID if the candidate has multiple applications
 * @returns The updated application
 */
export const updateCandidateStage = async (
  candidateId: number,
  interviewStepId: number,
  applicationId?: number
): Promise<Candidate> => {
  try {
    // Validate that the candidate exists using the static findOne method
    const candidate = await Candidate.findOne(candidateId);

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Validate that the interview step exists
    const interviewStep = await InterviewStep.findOne(interviewStepId);

    if (!interviewStep) {
      throw new Error('Interview step not found');
    }

    let application;

    if (applicationId) {
      // If applicationId is provided, find that specific application
      application = await Application.findOne(applicationId);

      if (!application) {
        throw new Error('Application not found');
      }

      if (application.candidateId !== candidateId) {
        throw new Error('Application does not belong to this candidate');
      }
    } else {
      // If applicationId is not provided, find the most recent application for the candidate
      // We need to use the candidate's applications from the model
      if (!candidate.applications || candidate.applications.length === 0) {
        throw new Error('No applications found for this candidate');
      }

      // Sort applications by date (most recent first) and take the first one
      application = candidate.applications.sort((a, b) => 
        b.applicationDate.getTime() - a.applicationDate.getTime()
      )[0];
    }

    // Update the application with the new interview step
    application.currentInterviewStep = interviewStepId;
    const updatedApplication = await application.save();

    // Get the updated application with related data
    const fullApplication = await Application.findOne(updatedApplication.id);
    
    if (!fullApplication) {
      throw new Error('Failed to retrieve updated application');
    }

    return candidate;
  } catch (error) {
    console.error('Error updating candidate stage:', error);
    throw error;
  }
};
