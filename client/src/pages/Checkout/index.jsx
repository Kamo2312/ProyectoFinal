import axios from "axios";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  confirmOrderCheckout,
  resetCart,
  resetOrder,
} from "../../redux/actions";

const stripePromise = loadStripe(
  "pk_test_51L1HPsAYXX7Bavv4uDeTk9tUjSb4ZzVcVDYWs7nw8gkmrlJGtHTI5O6CmiEqRadAWwBaCcc3j0b8v1bZAyKx1wy300bjsAkEqi"
);

const Wrapper = () => (
  <Elements stripe={stripePromise}>
    <MyComponent />
  </Elements>
);

const MyComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const order_id = useSelector((state) => state.orderSent[0].id);
  const amount = useSelector((state) => state.orderSent[0].total_purchase);
  const order = useSelector((state) => state.orderSent[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      const { id } = paymentMethod;
      const { data } = await axios.post(
        "http://localhost:3001/api/orders/checkout",
        {
          order_id,
          id,
          amount: amount * 100,
        }
      );

      if (data.status !== "payment recieved") {
        alert("not proccess payment");
      } else {
        order.payment_id = data.payment_id;
        order.status = "active";
        dispatch(confirmOrderCheckout(order_id, order));
        alert("order taken succesfully");
        dispatch(resetCart());
        dispatch(resetOrder());
        navigate("/");
      }
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <CardElement />
        <h1>{amount}</h1>
        <input type="submit" value="checkout" />
      </form>
    </div>
  );
};

function Checkout() {
  return (
    <div className="checkoutPage">
      <Wrapper />
    </div>
  );
}

export default Checkout;
