import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class CompanyProfileController {
  async saveCompanyProfile(req: Request, res: Response): Promise<void> {
    const {
      companyName,
      registrationNumber,
      companyAddress,
      companyEmail,
      companyPhone,
      companyPhoneSecondary,
      taxDetails,
      createdByID,
    } = req.body;

    let image_url: string | null = null;

    if (req.file) {
      image_url = req.file.path;
    }

    try {
      if (
        !companyName ||
        !registrationNumber ||
        !companyPhone ||
        !taxDetails ||
        !createdByID
      ) {
        res.status(400).json({
          success: false,
          message: "Missing required fields.",
        });
      }

      const createdByIDInt = parseInt(createdByID, 10);
      if (isNaN(createdByIDInt)) {
        res.status(400).json({
          success: false,
          message: "Invalid 'createdByID' provided.",
        });
      }

      const existingProfile = await prisma.companyProfile.findFirst();
      if (existingProfile) {
        res.status(400).json({
          success: false,
          message:
            "A company profile already exists. Only one profile is allowed.",
        });
      }

      const newProfile = await prisma.companyProfile.create({
        data: {
          image_url,
          companyName,
          registrationNumber,
          companyAddress,
          companyEmail,
          companyPhone,
          companyPhoneSecondary,
          taxDetails,
          createdByID: createdByIDInt,
        },
      });

      console.log("New Profile Created:", newProfile);
      res.status(201).json({
        success: true,
        message: "Company profile created successfully.",
        data: newProfile,
      });
    } catch (error) {
      logger.error(
        `Error creating company profile: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error creating company profile.",
      });
    }
  }

  // Get the existing Company Profile
  async getCompanyProfile(req: Request, res: Response): Promise<void> {
    try {
      const profile = await prisma.companyProfile.findFirst();

      if (!profile) {
        logger.warn("No company profile found");
        res.status(404).json({
          success: false,
          message: "Company profile not found.",
        });
        return;
      }

      logger.info("Fetched company profile");
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      logger.error(
        `Error fetching company profile: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching company profile.",
      });
    }
  }

  // Update the Company Profile
  async updateCompanyProfile(req: Request, res: Response): Promise<void> {
    const {
      image_url,
      companyName,
      registrationNumber,
      companyAddress,
      companyEmail,
      companyPhone,
      companyPhoneSecondary,
      taxDetails,
      modifiedByID,
    } = req.body;

    try {
      const existingProfile = await prisma.companyProfile.findFirst();

      if (!existingProfile) {
        logger.warn("Attempt to update non-existing company profile");
        res.status(404).json({
          success: false,
          message: "Company profile not found. Create a profile first.",
        });
        return;
      }

      const updatedProfile = await prisma.companyProfile.update({
        where: { companyID: existingProfile.companyID },
        data: {
          image_url,
          companyName,
          registrationNumber,
          companyAddress,
          companyEmail,
          companyPhone,
          companyPhoneSecondary,
          taxDetails,
          modifiedByID,
        },
      });

      logger.info(`Company profile updated: ID ${updatedProfile.companyID}`);
      res.status(200).json({
        success: true,
        message: "Company profile updated successfully.",
        data: updatedProfile,
      });
    } catch (error) {
      logger.error(
        `Error updating company profile: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error updating company profile.",
      });
    }
  }
}
