import { Router } from "express";
import { CompanyProfileController } from "../controller/companyProfileController";
import upload from "../config/multerConfig";

const router = Router();
const companyProfileController = new CompanyProfileController();

// Create or Save Company Profile (Only one profile allowed)
router.post(
  "/company-profile",
  upload,
  companyProfileController.saveCompanyProfile.bind(companyProfileController)
);

// Get the existing Company Profile
router.get(
  "/company-profile",
  companyProfileController.getCompanyProfile.bind(companyProfileController)
);

// Update the Company Profile
router.put(
  "/company-profile",
  upload, // Handle file upload
  companyProfileController.updateCompanyProfile.bind(companyProfileController)
);

export default router;
