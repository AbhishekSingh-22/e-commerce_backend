import Product from '../models/product.model.js';

// GET /api/products - List all products
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Error listing products:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/products - Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // Basic validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price are required.',
      });
    }

    const newProduct = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
