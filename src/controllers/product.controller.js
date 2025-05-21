import Product from '../models/product.model.js';

export const listProducts = async (_, res) => res.json(await Product.find());
export const createProduct = async (req, res) =>
  res.status(201).json(await Product.create(req.body));
