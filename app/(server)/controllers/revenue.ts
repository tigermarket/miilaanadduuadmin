import { connectedToMongodb } from "@/(server)/startup/db";
import { Customer, Invoice, Revenue } from "../models/Seed";
import { logger } from "../utils/logger";
import { formatCurrency } from "../utils/util";

const ITEMS_PER_PAGE = 6;

// 1. Fetch Revenue
export default {
  fetchRevenue: async () => {
    try {
      await connectedToMongodb();
      const data = await Revenue.find({}).lean();
      return data;
    } catch (error) {
      logger.error("Database Error:", error);
      throw new Error("Failed to fetch revenue data.");
    }
  },
  fetchCardData: async () => {
    try {
      await connectedToMongodb();

      const invoiceCountPromise = Invoice.countDocuments({});
      const customerCountPromise = Customer.countDocuments({});
      const invoiceStatusPromise = Invoice.aggregate([
        {
          $group: {
            _id: null,
            paid: {
              $sum: {
                $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0],
              },
            },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0],
              },
            },
          },
        },
      ]);

      const [invoiceCount, customerCount, statusData] = await Promise.all([
        invoiceCountPromise,
        customerCountPromise,
        invoiceStatusPromise,
      ]);

      const totals = statusData[0] || { paid: 0, pending: 0 };

      return {
        numberOfInvoices: invoiceCount,
        numberOfCustomers: customerCount,
        totalPaidInvoices: formatCurrency(totals.paid),
        totalPendingInvoices: formatCurrency(totals.pending),
      };
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch card data.");
    }
  },
  fetchFilteredInvoices: async (query: string, currentPage: number) => {
    try {
      await connectedToMongodb();
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;

      const invoices = await Invoice.aggregate([
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "id",
            as: "customer",
          },
        },
        { $unwind: "$customer" },
        {
          $match: {
            $or: [
              { "customer.name": { $regex: query, $options: "i" } },
              { "customer.email": { $regex: query, $options: "i" } },
              { amount: { $regex: query, $options: "i" } },
              { status: { $regex: query, $options: "i" } },
            ],
          },
        },
        { $sort: { date: -1 } },
        { $skip: skip },
        { $limit: ITEMS_PER_PAGE },
        {
          $project: {
            id: 1,
            amount: 1,
            date: 1,
            status: 1,
            "customer.name": 1,
            "customer.email": 1,
            "customer.image_url": 1,
          },
        },
      ]);

      return invoices;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch invoices.");
    }
  },
  fetchInvoicesPages: async (query: string) => {
    try {
      await connectedToMongodb();

      const count = await Invoice.aggregate([
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "id",
            as: "customer",
          },
        },
        { $unwind: "$customer" },
        {
          $match: {
            $or: [
              { "customer.name": { $regex: query, $options: "i" } },
              { "customer.email": { $regex: query, $options: "i" } },
              { amount: { $regex: query, $options: "i" } },
              { status: { $regex: query, $options: "i" } },
            ],
          },
        },
        { $count: "total" },
      ]);

      const total = count[0]?.total || 0;
      return Math.ceil(total / ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch total number of invoices.");
    }
  },

  // 6. Fetch Invoice by ID
  fetchInvoiceById: async (id: string) => {
    try {
      await connectedToMongodb();
      const invoice = await Invoice.findOne({ id }).lean();

      if (!invoice) return null;

      return {
        ...invoice,
        amount: invoice.amount / 100, // convert cents to dollars
      };
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch invoice.");
    }
  },

  // 7. Fetch Customers (id + name)
  fetchCustomers: async () => {
    try {
      await connectedToMongodb();
      return await Customer.find({}, { id: 1, name: 1 })
        .sort({ name: 1 })
        .lean();
    } catch (err) {
      console.error("Database Error:", err);
      throw new Error("Failed to fetch all customers.");
    }
  },

  // 8. Fetch Filtered Customers (with totals)
  fetchFilteredCustomers: async (query: string) => {
    try {
      await connectedToMongodb();

      const data = await Customer.aggregate([
        {
          $lookup: {
            from: "invoices",
            localField: "id",
            foreignField: "customer_id",
            as: "invoices",
          },
        },
        {
          $match: {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } },
            ],
          },
        },
        {
          $project: {
            id: 1,
            name: 1,
            email: 1,
            image_url: 1,
            total_invoices: { $size: "$invoices" },
            total_pending: {
              $sum: {
                $map: {
                  input: "$invoices",
                  as: "inv",
                  in: {
                    $cond: [
                      { $eq: ["$$inv.status", "pending"] },
                      "$$inv.amount",
                      0,
                    ],
                  },
                },
              },
            },
            total_paid: {
              $sum: {
                $map: {
                  input: "$invoices",
                  as: "inv",
                  in: {
                    $cond: [
                      { $eq: ["$$inv.status", "paid"] },
                      "$$inv.amount",
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
        { $sort: { name: 1 } },
      ]);

      return data.map((customer) => ({
        ...customer,
        total_pending: formatCurrency(customer.total_pending),
        total_paid: formatCurrency(customer.total_paid),
      }));
    } catch (err) {
      console.error("Database Error:", err);
      throw new Error("Failed to fetch customer table.");
    }
  },
};

// 4. Fetch Filtered Invoices (search + pagination)
// export async function fetchFilteredInvoices(
//   query: string,
//   currentPage: number
// ) {
//   try {
//     await connectedToMongodb();
//     const skip = (currentPage - 1) * ITEMS_PER_PAGE;

//     const invoices = await Invoice.aggregate([
//       {
//         $lookup: {
//           from: "customers",
//           localField: "customer_id",
//           foreignField: "id",
//           as: "customer",
//         },
//       },
//       { $unwind: "$customer" },
//       {
//         $match: {
//           $or: [
//             { "customer.name": { $regex: query, $options: "i" } },
//             { "customer.email": { $regex: query, $options: "i" } },
//             { amount: { $regex: query, $options: "i" } },
//             { status: { $regex: query, $options: "i" } },
//           ],
//         },
//       },
//       { $sort: { date: -1 } },
//       { $skip: skip },
//       { $limit: ITEMS_PER_PAGE },
//       {
//         $project: {
//           id: 1,
//           amount: 1,
//           date: 1,
//           status: 1,
//           "customer.name": 1,
//           "customer.email": 1,
//           "customer.image_url": 1,
//         },
//       },
//     ]);

//     return invoices;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch invoices.");
//   }
// }

// 5. Fetch Invoices Pages (total count for pagination)
