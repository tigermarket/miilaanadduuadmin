import { revalidatePath } from "next/cache";
import { invoiceSchema } from "../models/Products";
import { Invoice } from "../models/Seed";
import { connectedToMongodb } from "../startup/db";
import { logger } from "../utils/logger";
import { formatCurrency } from "../utils/util";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export default {
  fetchLatestProducts: async () => {
    try {
      await connectedToMongodb();
      const data = await Invoice.aggregate([
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "id",
            as: "customer",
          },
        },
        { $unwind: "$customer" },
        { $sort: { date: -1 } },
        { $limit: 5 },
        {
          $project: {
            id: 1,
            amount: 1,
            "customer.name": 1,
            "customer.email": 1,
            "customer.image_url": 1,
          },
        },
      ]);

      return data.map((invoice) => ({
        id: invoice.id,
        amount: formatCurrency(invoice.amount),
        name: invoice.customer.name,
        email: invoice.customer.email,
        image_url: invoice.customer.image_url,
      }));
    } catch (error) {
      logger.error("Database Error:", error);
      throw new Error("Failed to fetch the latest Products.");
    }
  },
  createProduct: async (prevState: State, formData: FormData) => {
    try {
      await connectedToMongodb();

      const validatedFields = await invoiceSchema.validate(
        {
          customerId: formData.get("customerId"),
          amount: formData.get("amount"),
          status: formData.get("status"),
        },
        { abortEarly: false }
      );

      const amountInCents = Number(validatedFields.amount) * 100;
      const date = new Date().toISOString().split("T")[0];

      await Invoice.create({
        customerId: validatedFields.customerId,
        amount: amountInCents,
        status: validatedFields.status,
        date,
      });

      revalidatePath("/miilaanCommerce/invoices");
      redirect("/miilaanCommerce/invoices");
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return {
          errors: error.inner.reduce(
            (acc: any, err: any) => ({
              ...acc,
              [err.path]: [err.message],
            }),
            {}
          ),
          message: "Missing Fields. Failed to Create Invoice.",
        };
      }
      return { message: "Database Error: Failed to Create Invoice." };
    }
  },
  updateProduct: async (id: string, prevState: State, formData: FormData) => {
    try {
      await connectedToMongodb();

      const validatedFields = await invoiceSchema.validate(
        {
          customerId: formData.get("customerId"),
          amount: formData.get("amount"),
          status: formData.get("status"),
        },
        { abortEarly: false }
      );

      const amountInCents = Number(validatedFields.amount) * 100;

      await Invoice.findByIdAndUpdate(id, {
        customerId: validatedFields.customerId,
        amount: amountInCents,
        status: validatedFields.status,
      });

      revalidatePath("/miilaanCommerce/invoices");
      redirect("/miilaanCommerce/invoices");
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return {
          errors: error.inner.reduce(
            (acc: any, err: any) => ({
              ...acc,
              [err.path]: [err.message],
            }),
            {}
          ),
          message: "Missing Fields. Failed to Update Invoice.",
        };
      }
      return { message: "Database Error: Failed to Update Invoice." };
    }
  },
  deleteProduct: async (id: string) => {
    await connectedToMongodb();
    await Invoice.findByIdAndDelete(id);
    revalidatePath("/miilaanCommerce/invoices");
  },
};
