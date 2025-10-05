// codigo
import express, {Request, Response, Router} from "express"
const db = require("../DAO/models");

const InviteUsersController = (): [String, Router] => {
    const path: string = "/inviteUsers";
    const router = express.Router();
    
    return [path, router];
}; 
