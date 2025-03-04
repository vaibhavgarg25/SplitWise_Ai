const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groups",
    required: true
  },
  expenseName: {
    type: String,
    required: true
  },
  expenses: [
    {
      description: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      members: [
        {
          memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
          },
          amount: {
            type: Number,
            required: true
          }
        }
      ],
      totalAmount: {
        type: Number,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Expense = mongoose.model("expenses", expenseSchema);
module.exports = Expense;
