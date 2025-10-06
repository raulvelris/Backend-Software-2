"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// codigo
const express_1 = __importDefault(require("express"));
const db = require("../DAO/models");
const InviteUsersController = () => {
    const path = "/inviteUsers";
    const router = express_1.default.Router();
    // Endpoint para mostrar los invitados
    router.get("/", async (req, res) => {
        try {
            const invites = await db.InviteUsers.findAll();
            res.status(200).json(invites);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving invites", error });
        }
    });
    // Endpoint para invitar usuarios
    return [path, router];
};
//# sourceMappingURL=InviteUsersController.js.map