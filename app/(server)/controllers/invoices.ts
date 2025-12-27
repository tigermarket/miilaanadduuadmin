import { formatCurrency } from "@/lib/utils";
import { Invoice } from "../models/Seed";
import { connectedToMongodb } from "../startup/db";
import { logger } from "@/lib/lgger";

export default {
  fetchLatestInvoices: async () => {
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
      throw new Error("Failed to fetch the latest invoices.");
    }
  },
};
