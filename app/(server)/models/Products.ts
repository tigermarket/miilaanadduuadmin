import mongoose, { Schema, Document } from "mongoose";
import * as yup from "yup";
export interface IProduct extends Document {
  customerId: string;
  amount: number;
  status: "pending" | "paid";
  date: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    customerId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export const invoiceSchema = yup.object({
  customerId: yup.string().required("Please select a customer."),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Please enter an amount greater than $0."),
  status: yup
    .string()
    .oneOf(["pending", "paid"], "Please select an invoice status."),
});
