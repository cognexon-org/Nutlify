import SimpleHeader from "@/components/SimpleHeader";
import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <SimpleHeader showCart={false} />
      <main className="container-x py-12 sm:py-16">
        <h1 className="text-4xl text-ink sm:text-5xl">Checkout</h1>
        <CheckoutForm />
      </main>
    </>
  );
}
