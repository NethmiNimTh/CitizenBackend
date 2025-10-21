import Animal from "../models/animalModel.js";

// @desc    Create new animal observation
// @route   POST /api/animals
// @access  Public
export const createAnimal = async (req, res) => {
  try {
    console.log('📥 POST /api/animals - Received request');
    console.log('Body size:', JSON.stringify(req.body).length, 'bytes');
    
    const { 
      animalType, 
      photo, 
      date, 
      timeOfDay, 
      description,
      location 
    } = req.body;

    // Validation
    if (!animalType || !photo || !date || !timeOfDay) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (animalType, photo, date, timeOfDay)",
      });
    }

    // Validate animalType
    const validTypes = [
      'Deer', 'Fox', 'Rabbit', 'Squirrel', 'Bat', 'Other Mammal',
      'Songbird', 'Bird of Prey', 'Waterfowl', 'Wading Bird', 'Other Bird',
      'Snake', 'Lizard', 'Turtle', 'Frog', 'Other Reptile/Amphibian'
    ];
    
    if (!validTypes.includes(animalType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid animal type",
      });
    }

    // Validate timeOfDay
    if (!['Morning', 'Noon', 'Evening', 'Night'].includes(timeOfDay)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time of day",
      });
    }

    console.log('✅ Creating animal observation...');
    console.log('Type:', animalType);
    console.log('Date:', date);
    console.log('Time:', timeOfDay);

    // Create animal observation
    const observation = await Animal.create({
      category: 'Animal',
      animalType,
      photo,
      date,
      timeOfDay,
      description: description || undefined,
      location: location || undefined,
    });

    console.log('✅ Animal observation created:', observation._id);

    res.status(201).json({
      success: true,
      message: "Animal observation created successfully",
      data: observation,
    });
  } catch (error) {
    console.error('❌ Error creating animal observation:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected",
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all animal observations
// @route   GET /api/animals
// @access  Public
export const getAnimals = async (req, res) => {
  try {
    const observations = await Animal.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single animal observation by ID
// @route   GET /api/animals/:id
// @access  Public
export const getAnimalById = async (req, res) => {
  try {
    const observation = await Animal.findById(req.params.id);
    
    if (!observation) {
      return res.status(404).json({
        success: false,
        message: "Animal observation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: observation,
    });
  } catch (error) {
    console.error('Error fetching animal by ID:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "Animal observation not found",
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update animal observation
// @route   PUT /api/animals/:id
// @access  Public
export const updateAnimal = async (req, res) => {
  try {
    const observation = await Animal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!observation) {
      return res.status(404).json({
        success: false,
        message: "Animal observation not found",
      });
    }

    console.log('Animal observation updated:', observation._id);

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: observation,
    });
  } catch (error) {
    console.error('Error updating animal:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete animal observation
// @route   DELETE /api/animals/:id
// @access  Public
export const deleteAnimal = async (req, res) => {
  try {
    const observation = await Animal.findById(req.params.id);

    if (!observation) {
      return res.status(404).json({
        success: false,
        message: "Animal observation not found",
      });
    }

    await observation.deleteOne();

    console.log('Animal observation deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting animal:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get animals by type
// @route   GET /api/animals/type/:type
// @access  Public
export const getAnimalsByType = async (req, res) => {
  try {
    const observations = await Animal.find({ 
      animalType: req.params.type 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    console.error('Error fetching animals by type:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get animal statistics
// @route   GET /api/animals/stats
// @access  Public
export const getAnimalStats = async (req, res) => {
  try {
    const totalObservations = await Animal.countDocuments();
    
    // Count by animal type
    const typeStats = await Animal.aggregate([
      {
        $group: {
          _id: '$animalType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Group by category (Mammals, Birds, Reptiles)
    const mammals = ['Deer', 'Fox', 'Rabbit', 'Squirrel', 'Bat', 'Other Mammal'];
    const birds = ['Songbird', 'Bird of Prey', 'Waterfowl', 'Wading Bird', 'Other Bird'];
    const reptiles = ['Snake', 'Lizard', 'Turtle', 'Frog', 'Other Reptile/Amphibian'];

    const categoryStats = await Animal.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $in: ['$animalType', mammals] }, then: 'Mammals' },
                { case: { $in: ['$animalType', birds] }, then: 'Birds' },
                { case: { $in: ['$animalType', reptiles] }, then: 'Reptiles & Amphibians' }
              ],
              default: 'Other'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Recent observations
    const recentObservations = await Animal.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('animalType date createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalObservations,
        typeStats,
        categoryStats,
        recentObservations
      }
    });
  } catch (error) {
    console.error('Error fetching animal statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};