import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient, Consultation } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface ConsultationRequestBody {
  // Add appropriate fields based on your Prisma schema
  [key: string]: any;
}

// GET all consultations
router.get('/', async function(_req: Request, res: Response, _next: NextFunction) {
  try {
    const consultations: Consultation[] = await prisma.consultation.findMany();
    res.status(200).send(consultations);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to fetch consultations" });
  } finally {
    await prisma.$disconnect();
  }
});

// GET a specific consultation
router.get('/:id', async function(req: Request, res: Response, _next: NextFunction) {
  try {
    const consultation: Consultation | null = await prisma.consultation.findUnique({
      where: { id: req.params.id }
    });
    if (consultation) {
      res.status(200).send(consultation);
    } else {
      res.status(404).send({ error: "Consultation not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to fetch consultation" });
  } finally {
    await prisma.$disconnect();
  }
});

// POST a new consultation
router.post('/', async function(req: Request<{}, {}, ConsultationRequestBody>, res: Response, _next: NextFunction) {
  try {
    const newConsultation: Consultation = await prisma.consultation.create({
      data: {
        date: req.body.date,
        idConsultation: req.body.idConsultation,
        patient: req.body.patient,
        medecin: req.body.medecin,
        // Add other required fields here
      }
    });
    res.status(201).send(newConsultation);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to create consultation" });
  } finally {
    await prisma.$disconnect();
  }
});

// PUT to update a specific consultation
router.put('/:id', async function(req: Request<{id: string}, {}, Partial<ConsultationRequestBody>>, res: Response, _next: NextFunction) {
  try {
    const updatedConsultation: Consultation = await prisma.consultation.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).send(updatedConsultation);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to update consultation" });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE a specific consultation
router.delete('/:id', async function(req: Request, res: Response, _next: NextFunction) {
  try {
    await prisma.consultation.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to delete consultation" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;