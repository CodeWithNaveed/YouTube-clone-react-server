import express from "express";
import {
    addVideo,
    updateVideo,
    deleteVideo,
    getVideo,
    addView,
    trend,
    random,
    sub,
    getByTag,
    search
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// Add a video
router.post("/", verifyToken, addVideo);

// Update a video
router.put("/:id", verifyToken, updateVideo);

// Delete a video
router.delete("/:id", verifyToken, deleteVideo);

// Get a video by ID
router.get("/find/:id", getVideo);

// Increment views
router.put("/view/:id", addView);

// Get trending videos
router.get("/trend", trend);

// Get random videos
router.get("/random", random);

// Get subscribed channels' videos
router.get("/sub", verifyToken, sub);

// Get videos by tags
router.get("/tags", getByTag);

// Search for videos
router.get("/search", search);


export default router;
