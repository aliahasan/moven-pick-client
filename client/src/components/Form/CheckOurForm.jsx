import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import "./CheckoutForm.css";
import { ImSpinner9 } from "react-icons/im";
import {
  createPaymentIntent,
  saveBookingInfo,
  updateStatus,
} from "../../api/booking";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const CheckOurForm = ({ bookingInfo, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  //   create payment intent

  useEffect(() => {
    // create payment secret
    if (bookingInfo.price > 0) {
      createPaymentIntent({ price: bookingInfo.price }).then((data) => {
        console.log(data);
        setClientSecret(data.clientSecret);
      });
    }
  }, [bookingInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    // card data lookup (asynchronous network call)
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardError(error.message);
    } else {
      setCardError("");
      console.log("payment method", paymentMethod);
    }
    setProcessing(true);

    // ekhane taka katbe
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(
        clientSecret,

        {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email,
              name: user?.displayName,
            },
          },
        }
      );
    if (confirmError) {
      console.log(confirmError);
      setCardError(confirmError.message);
    }
    console.log("payment intent ", paymentIntent);

    if (paymentIntent.status === "succeeded") {
      // save payment information to the server
      //  update form status in db
      const paymentInfo = {
        ...bookingInfo,
        transactionId: paymentIntent.id,
        date: new Date(),
      };
      try {
        await saveBookingInfo(paymentInfo);

        // update room status in db
        await updateStatus(bookingInfo.roomId, true);
        const text = `Booking Successful ! ${paymentInfo.id}`;
        toast.success(text);
        navigate("/dashboard/my-bookings");
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      } finally {
        setProcessing(false);
      }
      setProcessing(false);
    }
  };

  return (
    <>
      <form className="my-2" onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <div className="flex mt-2 justify-around">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border bg-transparent bg-red-500 px-2 py-1 "
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className="inline-flex justify-center rounded-md border px-2 py-1 bg-transparent bg-green-500"
          >
            {processing ? (
              <ImSpinner9 className="m-auto animate-spin" size={24} />
            ) : (
              `Pay ${bookingInfo.price}$`
            )}
          </button>
        </div>
      </form>
      {cardError && <p className="text-red-600 ml-8">{cardError}</p>}
    </>
  );
};

export default CheckOurForm;
