import { Request } from "express";
import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";

interface AuthentiatedRequest extends Request {
    user?: {
        _id: string,
        role: string,
        user: any,
    };
}

export const addAlbum = TryCatch(async (req: AuthentiatedRequest, res) => {
    //console.log(req.user?.user.role);
    if (req.user?.user.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }

    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }

    const fileBuffer = getBuffer(file);


    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "albums",
    });


    const result = await sql`
        INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *
    `;

    res.json({
        message: "Album created successfully",
        album: result[0],
    });

});

export const addSong = TryCatch( async(req: AuthentiatedRequest, res) => {
    if(req.user?.user.role !== "admin"){
        res.status(401).json({
            message: "You are not admin"
        });

        return;
    }

    const { title, description, album } = req.body;

    const isAlbum = await sql`
        SELECT * FROM albums WHERE id = ${album}
    `;

    if(isAlbum.length === 0){
        res.status(404).json({
            message: "No album found with this id",
        });

        return;
    }


    const file = req.file;

    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }

    const fileBuffer = getBuffer(file);


    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "songs",
        resource_type: "video",
    });

    const result = await sql`
        INSERT INTO songs (title, description, thumbnail, audio, album_id) VALUES (${title}, ${description}, ${cloud.secure_url}, 
        ${album})
    `;

    res.json({
        message: "Song added successfully",
    });

})