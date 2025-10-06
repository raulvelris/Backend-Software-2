// codigo
import express, {Request, Response, Router} from "express"
const db = require("../DAO/models");

const InviteUsersController = (): [String, Router] => {
    const path: string = "/inviteUsers";
    const router = express.Router();
    
    // Endpoint para mostrar los invitados
    router.get("/", async (req: Request, res: Response) => {
        try {
            const invites = await db.InviteUsers.findAll();
            res.status(200).json(invites);
        } catch (error) {
            res.status(500).json({message: "Error retrieving invites", error});
        }           
    });

    // Endpoint para invitar usuarios




    return [path, router];
}; 
