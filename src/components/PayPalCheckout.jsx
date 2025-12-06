import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation } from "react-router-dom"; 
export default function PayPalCheckout() {
  const { state } = useLocation();
  const amount = state?.amount || "9.99"; 
  const currency = state?.currency || "USD";
  const description = state?.description || "Payment";
  const [status, setStatus] = useState("idle"); 
  const [details, setDetails] = useState(null);

  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX || "";

  const initialOptions = {
    "client-id": clientId,
    currency,
    intent: "capture",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 p-3">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7l-9-5z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{description}</h2>
                <p className="mt-1 text-sm text-gray-500">Secure checkout powered by PayPal (Sandbox)</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-sm text-gray-500">Amount</div>
                <div className="mt-1 text-3xl font-bold text-gray-800">{amount} <span className="text-base font-medium text-gray-500">{currency}</span></div>
                <ul className="mt-4 text-sm text-gray-600 space-y-2">
                  <li>• Instant access after successful payment</li>
                  <li>• Sandbox test — no real charges</li>
                  <li>• Works on localhost:3000 (allow popups)</li>
                </ul>
              </div>

              <div>
                {/* PayPalScriptProvider and Buttons */}
                <PayPalScriptProvider options={initialOptions}>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-3 text-sm text-gray-600">Pay with PayPal</div>

                    <div className="flex flex-col gap-3">
                      <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                        createOrder={(data, actions) => {
                          setStatus("processing");
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: { value: amount, currency_code: currency },
                                description,
                              },
                            ],
                          });
                        }}
                       onApprove={async (data, actions) => {
  try {
    const capture = await actions.order.capture();
    setDetails(capture);
    setStatus("succeeded");
  } catch (err) {
    console.error("capture error", err);
    setStatus("error");
  }

                        }}
                        onCancel={() => {
                          setStatus("idle");
                        }}
                        onError={(err) => {
                          console.error("PayPal Buttons error:", err);
                          setStatus("error");
                        }}
                      />

                      <div className="text-xs text-gray-400">Tip: if no PayPal login popup appears, check that your browser allows popups and that you’re using the SANDBOX client ID.</div>
                    </div>
                  </div>
                </PayPalScriptProvider>
              </div>
            </div>

            <div className="mt-6">
              {status === "processing" && (
                <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">Processing — follow the PayPal popup to sign in to your sandbox buyer account.</div>
              )}

              {status === "succeeded" && details && (
                <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                  <div className="font-semibold">Payment completed ✓</div>
                  <div className="mt-2 text-xs text-green-700">Transaction ID: <span className="font-mono">{details.id}</span></div>
                </div>
              )}

              {status === "error" && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">There was an error with the payment. Check console for details.</div>
              )}
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <strong>Testing notes:</strong>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Use a <em>Sandbox</em> Business app Client ID in <code>.env</code> as <code>REACT_APP_PAYPAL_CLIENT_ID_SANDBOX</code>.</li>
                <li>Open PayPal popup and log in with a <em>Sandbox buyer</em> account (create one from developer.paypal.com).</li>
                <li>If you get SMS verification issues on PayPal when logging into the sandbox buyer, try a different sandbox buyer account or use a different browser/profile.</li>
              </ol>
            </div>

          </div>

          <div className="border-t px-6 py-4 bg-gray-50 flex items-center justify-between">
            <div className="text-xs text-gray-500">Built for testing — Drop into any page.</div>
            <div className="text-xs text-gray-500">Need a backend? ask and I'll add Node.js example</div>
          </div>
        </div>
      </div>
    </div>
  );
}
