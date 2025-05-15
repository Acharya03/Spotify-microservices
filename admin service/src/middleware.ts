import { Request, Response, NextFunction } from "express";
import axios from "axios";

interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}

