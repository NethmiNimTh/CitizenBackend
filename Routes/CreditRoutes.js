import express from 'express';
import PhotoInformation from '../models/creditModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { contactInfo, canUsePhoto, photoCredit } = req.body;
    const photoInformation = new PhotoInformation({ contactInfo, canUsePhoto, photoCredit });
    await photoInformation.save();

    res.status(201).json({
      success: true,
      message: 'Photo information submitted successfully!',
      data: photoInformation,
    });
  } catch (error) {
    console.error('Photo information submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit photo information',
      error: error.message,
    });
  }
});

export default router;
