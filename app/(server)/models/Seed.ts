import mongoose from "mongoose";

// Define schemas
const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const CustomerSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  email: String,
  image_url: String,
});

const InvoiceSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  customer_id: String,
  amount: Number,
  status: String,
  date: Date,
});

const RevenueSchema = new mongoose.Schema({
  month: { type: String, unique: true },
  revenue: Number,
});

// Create models
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
export const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
export const Revenue =
  mongoose.models.Revenue || mongoose.model("Revenue", RevenueSchema);
