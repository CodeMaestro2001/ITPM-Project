// controllers/foodMenuController.js
const FoodItem = require("../../models/pamaa/foodItemModel");

// Add new food item
const addFoodItem = async (req, res) => {
  const {
    restaurantId,
    name,
    description,
    price,
    category,
    available,
  } = req.body;

  if (!name || !description || !price || !category) {
    return res
      .status(400)
      .json({ message: "Required fields including foodId are missing" }); // Ensure all required fields including foodId are sent
  }

  try {
    const newFoodItem = new FoodItem({
      restaurantId,
      name,
      description,
      price,
      category,
      available,
    });
    await newFoodItem.save();
    res
      .status(201)
      .json({ message: "Food item added successfully", foodItem: newFoodItem });
  } catch (error) {
    console.error("Error in adding food item:", error); // Add detailed logging
    res
      .status(500)
      .json({ message: "Error adding food item", error: error.message });
  }
};

// Get one food item by mongoid
const getFoodItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await FoodItem.findById(id); // Using Mongoose's findOne method to find by foodId
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.json(foodItem); // Return the food item data as JSON
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all food items
const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update food item 
const updateFoodItemById = async (req, res) => {
  const { id } = req.params;
  const { restaurantId, name, description, price, category, available } = req.body;

  try {
    // ✅ Find food item by MongoDB _id and update
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      id, // ✅ Correctly filter by _id
      { restaurantId, name, description, price, category, available }, // Fields to update
      { new: true, runValidators: true } // ✅ Returns updated document & ensures validation
    );

    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json(updatedFoodItem); // ✅ Return updated food item
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete food item 
const deleteFoodItemById = async (req, res) => {
  const { id } = req.params; // Get ID from request parameters

  try {
    // ✅ Find and delete the food item using the correct method
    const deletedFoodItem = await FoodItem.findByIdAndDelete(id);

    if (!deletedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({
      message: "Food item deleted successfully",
      foodItem: deletedFoodItem,
    });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addFoodItem,
  getFoodItemById,
  getAllFoodItems,
  updateFoodItemById,
  deleteFoodItemById,
};
