import { useState } from 'react';

const PayWithPoints = ({ userId, orderAmount }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handlePayWithPoints(ev) {
    ev.preventDefault();
    // address and shopping cart products
    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          address,
          cartProducts,
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          const data = await response.json();
          setError(data.error);
        } else {
          window.location = await response.json();
          reject();
        }setLoading(false);
      });
    });
    await toast.promise(promise, {
      loading: 'Preparing your order...',
      success: 'Redirecting to payment...',
      error: 'Something went wrong... Please try again later',
    })
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Your shopping cart is empty 😔</p>
      </section>
    );
  }
  return (
    <div>
      <button onClick={handlePayWithPoints} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with Points'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PayWithPoints;