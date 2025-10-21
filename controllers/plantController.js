import Plant from "../models/plantModel.js"; 

export const createPlant = async (req, res) => {
  try {
    // console.log(' POST /api/plants - Received request');
    // console.log('Body size:', JSON.stringify(req.body).length, 'bytes');
    
    const { 
      plantCategory, 
      plantType, 
      photo, 
      date, 
      timeOfDay, 
      description 
    } = req.body;

    // Validation
    if (!plantCategory || !plantType || !photo || !date || !timeOfDay) {
      console.log(' Validation failed');
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    console.log('Creating plant...');
    console.log('Category:', plantCategory);
    console.log('Type:', plantType);
    console.log('Date:', date);
    console.log('Time:', timeOfDay);

    const plant = await Plant.create({
      category: 'Plant',
      plantCategory,
      plantType,
      photo,
      date,
      timeOfDay,
      description: description || undefined,
    });

    console.log(' Plant created:', plant._id);

    res.status(201).json({
      success: true,
      message: "Plant observation created successfully",
      data: plant,
    });
  } catch (error) {
    console.error(' Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPlants = async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }
    res.status(200).json({
      success: true,
      data: plant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }
    res.status(200).json({
      success: true,
      data: plant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Plant deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPlantsByCategory = async (req, res) => {
  try {
    const plants = await Plant.find({ 
      plantCategory: req.params.category 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};