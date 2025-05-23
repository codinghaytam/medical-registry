import express, { Request, Response } from 'express';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import * as dotenv from "dotenv"
import { connectToKeycloak } from '../utils/keycloak.js';

dotenv.config({path:"./../../.env"})

const router = express.Router();

let kcAdminClient: KcAdminClient;

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

interface UserRequestBody {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/* GET users listing. */
router.get('/', async function(_req: Request, res: Response) {
  try {
    kcAdminClient = await connectToKeycloak();
    const users = await kcAdminClient.users.find();  
    res.status(200).send(users);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

router.get('/:id', async function(req: Request, res: Response):Promise<any> {
  try {
    const keycloakUser = await getKeycloakUserInfo(req.params.id);
    if (!keycloakUser) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send(keycloakUser);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: "Failed to fetch user" });
  }
});

router.post('/', async function(req: Request<{}, {}, UserRequestBody>, res: Response) {
  try {
    kcAdminClient = await connectToKeycloak();
    // Create user in Keycloak
    const keycloakUser = await kcAdminClient.users.create({
      username: req.body.username,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      enabled: true,
    });

    res.status(201).send(keycloakUser);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Failed to create Keycloak user: " + e });
  }
});

router.put('/:id', async function(req: Request<{id: string}, {}, Partial<UserRequestBody>>, res: Response):Promise<any> {
  try {
    kcAdminClient = await connectToKeycloak();
    const keycloakUser = await getKeycloakUserInfo(req.params.id);
    if (!keycloakUser) {
      return res.status(404).send({ error: "User not found" });
    }

    // Update Keycloak user
    await kcAdminClient.users.update(
      { id: req.params.id },
      {
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }
    );

    const updatedUser = await getKeycloakUserInfo(req.params.id);
    return res.status(200).send(updatedUser);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: "Failed to update user" });
  }
});

router.delete('/:id', async function(req: Request, res: Response):Promise<any> {
  try {
    kcAdminClient = await connectToKeycloak();
    const keycloakUser = await getKeycloakUserInfo(req.params.id);
    if (!keycloakUser) {
      return res.status(404).send({ error: "User not found" });
    }

    // Delete from Keycloak
    await kcAdminClient.users.del({ id: req.params.id });
    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: "Failed to delete user" });
  }
});

export default router;
