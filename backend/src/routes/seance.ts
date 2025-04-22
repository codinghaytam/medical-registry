import express, { Request, Response } from 'express';
import { PrismaClient, Seance } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET all seances
router.get('/', async function(_req: Request, res: Response) {
  try {
    const allSeances: Seance[] = await prisma.seance.findMany();
    res.status(200).send(allSeances);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to fetch seances" });
  } finally {
    await prisma.$disconnect();
  }
}); 

// GET a specific seance
router.get('/:id', async function(req: Request, res: Response) {
  try {
    const seance: Seance | null = await prisma.seance.findUnique({
      where: { id: req.params.id }
    });
    if (seance) {
      res.status(200).send(seance);
    } else {
      res.status(404).send({ error: "Seance not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to fetch seance" });
  } finally {
    await prisma.$disconnect();
  }
});

interface SeanceRequestBody {
  idSeance: string;
  type: string;
  date: Date;
  patientId: string;
}

// POST a new seance
router.post('/', async function(req: Request<{}, {}, SeanceRequestBody>, res: Response) {
  try {
    const newSeance: Seance = await prisma.seance.create({
      data: req.body
    });
    res.status(201).send(newSeance);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to create seance" });
  } finally {
    await prisma.$disconnect();
  }
});

// PUT to update a specific seance
router.put('/:id', async function(req: Request<{id: string}, {}, Partial<SeanceRequestBody>>, res: Response) {
  try {
    const updatedSeance: Seance = await prisma.seance.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).send(updatedSeance);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to update seance" });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE a specific seance
router.delete('/:id', async function(req: Request, res: Response) {
  try {
    await prisma.seance.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to delete seance" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;