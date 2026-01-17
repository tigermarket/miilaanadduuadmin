import bcrypt from "bcrypt";

import { Customer, Invoice, Revenue, User } from "../models/Seed";
import { customers, invoices, revenue, users } from "../utils/placeholder-data";
import { connectedToMongodb } from "../startup/db";

export default {
  seedUsers: async () => {
    try {
      await connectedToMongodb();
      const insertedUsers = await Promise.all(
        users.map(async (user: any) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          return User.create(
            { id: user.id },
            {
              id: user.id,
              name: user.name,
              email: user.email,
              password: hashedPassword,
            },
            { upsert: true }
          );
        })
      );

      return insertedUsers;
    } catch (error) {}
  },

  seedInvoices: async () => {
    await connectedToMongodb();
    const insertedInvoices = await Promise.all(
      invoices.map((invoice: any) =>
        Invoice.create(
          { id: invoice.id },
          {
            id: invoice.id,
            customer_id: invoice.customer_id,
            amount: invoice.amount,
            status: invoice.status,
            date: invoice.date,
          },
          { upsert: true }
        )
      )
    );
    return insertedInvoices;
  },
  seedCustomers: async () => {
    await connectedToMongodb();
    const insertedCustomers = await Promise.all(
      customers.map((customer: any) =>
        Customer.create(
          { id: customer.id },
          {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            image_url: customer.image_url,
          },
          { upsert: true }
        )
      )
    );
    return insertedCustomers;
  },
  seedRevenue: async () => {
    await connectedToMongodb();
    const insertedRevenue = await Promise.all(
      revenue.map((rev) =>
        Revenue.create(
          { month: rev.month },
          { month: rev.month, revenue: rev.revenue },
          { upsert: true }
        )
      )
    );
    return insertedRevenue;
  },
  listInvoices: async () => {
    await connectedToMongodb();
    const data = await Invoice.aggregate([
      {
        $match: { amount: 666 }, // WHERE invoices.amount = 666
      },
      {
        $lookup: {
          from: "customers", // collection name in MongoDB
          localField: "customer_id",
          foreignField: "id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer", // flatten the customer array
      },
      {
        $project: {
          amount: 1,
          name: "$customer.name", // SELECT invoices.amount, customers.name
        },
      },
    ]);

    return data;
  },
};
