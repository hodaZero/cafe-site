import React from "react";
import OrderItem from "../components/OrderItem";

export default function Orders() {
  return (
    <div className="p-4">
      <OrderItem
        id={12345}
        items="2x Cappuccino, 1x Croissant"
        status="Processing"
      />
    </div>
  );
}
