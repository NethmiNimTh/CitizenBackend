import HumanActivity from "../models/humanityModel.js";


export const createHumanActivity = async (req, res) => {
  try {
    console.log('📥 POST /api/human-activities - Received request');
    console.log('Body size:', JSON.stringify(req.body).length, 'bytes');
    
    const { 
      activityType, 
      photo, 
      date, 
      timeOfDay, 
      description,
      location 
    } = req.body;

    // Validation
    if (!activityType || !photo || !date || !timeOfDay) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (activityType, photo, date, timeOfDay)",
      });
    }

    // Validate activityType
    const validTypes = [
      "Fire",
      "Deforestation",
      "Mining",
      "Waste & Pollution",
      "Waste disposal",
      "Plastic and polythene",
      "Constructions",
      "Domestic Animal",
      "Hunting",
      "Illegal behaviour",
      "Other"
    ];
    
    if (!validTypes.includes(activityType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity type",
      });
    }

    // Validate timeOfDay
    if (!['Morning', 'Noon', 'Evening', 'Night'].includes(timeOfDay)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time of day",
      });
    }

    console.log('Creating human activity observation...');
    console.log('Type:', activityType);
    console.log('Date:', date);
    console.log('Time:', timeOfDay);

    // Create human activity record
    const observation = await HumanActivity.create({
      category: 'Human Activity',
      activityType,
      photo,
      date,
      timeOfDay,
      description: description || undefined,
      location: location || undefined,
    });

    console.log('Human activity observation created:', observation._id);

    res.status(201).json({
      success: true,
      message: "Human activity observation created successfully",
      data: observation,
    });
  } catch (error) {
    console.error('Error creating human activity:', error);
    
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


export const getHumanActivities = async (req, res) => {
  try {
    const activities = await HumanActivity.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching human activities:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getHumanActivityById = async (req, res) => {
  try {
    const activity = await HumanActivity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Human activity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Error fetching human activity by ID:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "Human activity not found",
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateHumanActivity = async (req, res) => {
  try {
    const activity = await HumanActivity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Human activity not found",
      });
    }

    console.log('Human activity updated:', activity._id);

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: activity,
    });
  } catch (error) {
    console.error('Error updating human activity:', error);
    
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


export const deleteHumanActivity = async (req, res) => {
  try {
    const activity = await HumanActivity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Human activity not found",
      });
    }

    await activity.deleteOne();

    console.log('Human activity deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting human activity:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get human activities by type
// @route   GET /api/human-activities/type/:activityType
// @access  Public
export const getHumanActivitiesByType = async (req, res) => {
  try {
    const activities = await HumanActivity.find({ 
      activityType: req.params.activityType 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching human activities by type:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get human activity statistics
// @route   GET /api/human-activities/stats
// @access  Public
export const getHumanActivityStats = async (req, res) => {
  try {
    const totalActivities = await HumanActivity.countDocuments();
    
    // Count by activity type
    const typeStats = await HumanActivity.aggregate([
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Group by major categories
    const environmental = ['Fire', 'Deforestation', 'Mining', 'Waste & Pollution', 'Waste disposal', 'Plastic and polythene'];
    const development = ['Constructions'];
    const wildlife = ['Domestic Animal', 'Hunting'];
    const illegal = ['Illegal behaviour', 'Other'];

    const categoryStats = await HumanActivity.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $in: ['$activityType', environmental] }, then: 'Environmental Impacts' },
                { case: { $in: ['$activityType', development] }, then: 'Development Activities' },
                { case: { $in: ['$activityType', wildlife] }, then: 'Wildlife Related' },
                { case: { $in: ['$activityType', illegal] }, then: 'Illegal or Other Activities' },
              ],
              default: 'Uncategorized'
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
    const recentActivities = await HumanActivity.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('activityType date createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalActivities,
        typeStats,
        categoryStats,
        recentActivities
      }
    });
  } catch (error) {
    console.error('Error fetching human activity statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
