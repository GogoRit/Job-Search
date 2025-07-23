import { RequestHandler } from "express";
import { getAvailableFeatures } from "../config";

export const handleFeatures: RequestHandler = (_req, res) => {
  const features = getAvailableFeatures();
  
  res.json({
    ...features,
    // Add additional feature flags here
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
}; 