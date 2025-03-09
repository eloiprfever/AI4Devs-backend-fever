import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get candidates for a specific position with pagination
 * @param positionId - The ID of the position
 * @param page - The page number (default: 1)
 * @param pageSize - The number of items per page (default: 20)
 * @returns An object containing the candidates and pagination info
 */
export const getCandidatesForPosition = async (
  positionId: number,
  page: number = 1,
  pageSize: number = 20
) => {
  // Calculate skip value for pagination
  const skip = (page - 1) * pageSize;

  // Get total count for pagination
  const totalCount = await prisma.application.count({
    where: { positionId }
  });

  // Get applications for the position with pagination
  const applications = await prisma.application.findMany({
    where: { positionId },
    skip,
    take: pageSize,
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      interviewStep: {
        select: {
          name: true
        }
      },
      interviews: {
        select: {
          score: true
        }
      }
    }
  });

  // Format the response
  const candidates = applications.map((app: any) => {
    // Calculate average score from interviews
    const scores = app.interviews
      .filter((interview: any) => interview.score !== null)
      .map((interview: any) => interview.score as number);
    
    const averageScore = scores.length > 0
      ? scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
      : null;

    return {
      id: app.candidate.id,
      fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
      current_interview_step: app.interviewStep.name,
      average_score: averageScore !== null ? Number(averageScore.toFixed(2)) : null
    };
  });

  return {
    data: candidates,
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    }
  };
}; 