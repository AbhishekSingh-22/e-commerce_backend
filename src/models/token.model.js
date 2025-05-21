import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '2m' }, // auto-delete
});

export default mongoose.model('Token', tokenSchema);
