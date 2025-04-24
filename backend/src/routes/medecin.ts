import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient, Medecin, Profession } from '@prisma/client';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import * as dotenv from "dotenv";
import { connectToKeycloak } from '../utils/keycloak.js';

dotenv.config();

let kcAdminClient: KcAdminClient;
const router = express.Router();
const prisma = new PrismaClient();

interface MedecinRequestBody {
  username: string;
  email: string;
  profession: string;
  isSpecialiste: boolean;
}

// Helper function to get Keycloak user info
async function getKeycloakUserInfo(userId: string) {
  try {
    kcAdminClient = await connectToKeycloak();
    const user = await kcAdminClient.users.findOne({ id: userId });
    return user;
  } catch (error) {
    console.error('Error fetching Keycloak user:', error);
    return null;
  }
}

// GET all medecins
router.get('/', async function(_req: Request, res: Response, _next: NextFunction) {
  try {
    const medecins: Medecin[] = await prisma.medecin.findMany();
    const medecinsWithUserInfo = await Promise.all(medecins.map(async (medecin) => {
      const userInfo = await getKeycloakUserInfo(medecin.userId);
      return { ...medecin, userInfo };
    }));
    res.status(200).send(medecinsWithUserInfo);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to fetch medecins" });
  } finally {
    await prisma.$disconnect();
  }
});

// GET a specific medecin
router.get('/:id', async function(req: Request, res: Response, _next: NextFunction):Promise<any> {
  try {
    const medecin: Medecin | null = await prisma.medecin.findUnique({
      where: { id: req.params.id }
    });
    if (!medecin) {
      return res.status(404).send({ error: "Medecin not found" });
    }
    const userInfo = await getKeycloakUserInfo(medecin.userId.split(",")[0].split("=")[1]);
    res.status(200).send({ ...medecin, userInfo });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to fetch medecin" });
  } finally {
    await prisma.$disconnect();
    return
  }
});

// POST a new medecin
router.post('/', async function(req: Request<{}, {}, MedecinRequestBody>, res: Response, _next: NextFunction) {
  try {
    await kcAdminClient.users.create({
      username: req.body.username,
      email: req.body.email,
      clientRoles:"medecin" as unknown as Record<string,any>
    });
    const userInfo = await kcAdminClient.users.find({ username: req.body.username });
    
    const newMedecin: Medecin = await prisma.medecin.create({
      data: {
        profession: req.body.profession as Profession,
        userId: userInfo[0].id as string,
        isSpecialiste: req.body.isSpecialiste
      }
    });
    
    res.status(201).send("user "+newMedecin.profession+"created");
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to create medecin and Keycloak user: " + e});
  } finally {
    await prisma.$disconnect();
  }
});

// PUT to update a specific medecin
router.put('/:id', async function(req: Request<{id: string}, {}, Partial<MedecinRequestBody>>, res: Response, _next: NextFunction) {
  try {
    const updatedMedecin: Medecin = await prisma.medecin.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        profession: req.body.profession as Profession
      }
    });
    const userInfo = await getKeycloakUserInfo(updatedMedecin.userId);
    res.status(200).send({ ...updatedMedecin, userInfo });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to update medecin" });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE a specific medecin
router.delete('/:id', async function(req: Request, res: Response, _next: NextFunction) {
  try {
    await prisma.medecin.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to delete medecin" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;