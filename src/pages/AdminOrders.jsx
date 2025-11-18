import React, { useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "Ahmed Ali",
      table: "Table 5 (Upstairs)",
      items: "Cappuccino, Cheesecake",
      total: "$12.50",
      payment: "Cash",
      status: "Pending",
    },
    {
      id: 2,
      customer: "Sara Mohamed",
      table: "Takeaway",
      items: "Latte, Croissant",
      total: "$9.00",
      payment: "Visa",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Omar Khaled",
      table: "Table 2 (Downstairs)",
      items: "Espresso, Brownie",
      total: "$8.00",
      payment: "Cash",
      status: "Pending",
    },
  ]);


  const handleStatus = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };


  const pendingOrders = orders.filter((order) => order.status === "Pending");

  return (
    <div className="min-h-screen bg-dark text-white p-6">
    
      <h1 className="text-2xl font-bold text-primary mb-4 text-center">
        Admin Orders Dashboard
      </h1>

  
      <div className="bg-black p-3 rounded-xl mb-4 text-center shadow-lg border border-primary">
        <p className="text-base font-medium">
          You have{" "}
          <span className="text-primary font-bold">{pendingOrders.length}</span>{" "}
          new pending {pendingOrders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-primary/30 rounded-xl overflow-hidden shadow-md">
          <thead className="bg-primary text-dark">
            <tr>
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Table</th>
              <th className="py-2 px-3">Items</th>
              <th className="py-2 px-3">Total</th>
              <th className="py-2 px-3">Payment</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-dark hover:bg-dark/60 transition text-sm"
                >
                  <td className="py-2 px-3">{order.id}</td>
                  <td className="py-2 px-3">{order.customer}</td>
                  <td className="py-2 px-3">{order.table}</td>
                  <td className="py-2 px-3">{order.items}</td>
                  <td className="py-2 px-3">{order.total}</td>
                  <td className="py-2 px-3">{order.payment}</td>
                  <td className="py-2 px-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleStatus(order.id, "Confirmed")}
                      className="bg-primary text-dark font-semibold px-2 py-1 rounded-lg hover:bg-white hover:text-black transition text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatus(order.id, "Cancelled")}
                      className="bg-red-500 text-white font-semibold px-2 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-primary font-semibold text-sm"
                >
                  No pending orders right now
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
