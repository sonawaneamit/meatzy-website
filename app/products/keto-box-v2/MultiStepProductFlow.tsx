'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import type { ShopifyProduct } from '../../../lib/shopify/types';
import StepOneChooseBox from './StepOneChooseBox';
import StepTwoSelectAddOns from './StepTwoSelectAddOns';

interface MultiStepProductFlowProps {
  mainProduct: ShopifyProduct;
  addOnProducts: ShopifyProduct[];
}

export default function MultiStepProductFlow({
  mainProduct,
  addOnProducts,
}: MultiStepProductFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<Array<{ variantId: string; quantity: number }>>([]);

  const steps = [
    { number: 1, title: 'Choose Your Box' },
    { number: 2, title: 'Select Add-ons' },
    { number: 3, title: 'Checkout' },
  ];

  const handleBoxSelected = (variantId: string) => {
    setSelectedVariantId(variantId);
    setCurrentStep(2);
  };

  const handleContinueToCheckout = async () => {
    setCurrentStep(3);

    try {
      // Import cart functions dynamically (client-side only)
      const { createCart, addToCart, saveCartId, saveCheckoutUrl } = await import('../../../lib/shopify/cart');

      // Step 1: Create cart with main product
      const cart = await createCart(selectedVariantId, 1);

      if (!cart) {
        throw new Error('Failed to create cart');
      }

      saveCartId(cart.id);

      // Step 2: Add all add-ons to the cart
      if (selectedAddOns.length > 0) {
        const lines = selectedAddOns.map(addOn => ({
          merchandiseId: addOn.variantId,
          quantity: addOn.quantity,
        }));

        const updatedCart = await addToCart(cart.id, lines);

        if (!updatedCart) {
          throw new Error('Failed to add add-ons to cart');
        }

        // Save checkout URL
        await saveCheckoutUrl(updatedCart.checkoutUrl);

        // Redirect to checkout
        window.location.href = updatedCart.checkoutUrl;
      } else {
        // No add-ons, redirect directly
        await saveCheckoutUrl(cart.checkoutUrl);
        window.location.href = cart.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
      setCurrentStep(2); // Go back to add-ons step
    }
  };

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-black text-lg
                      transition-all duration-300
                      ${
                        step.number < currentStep
                          ? 'bg-meatzy-dill text-white'
                          : step.number === currentStep
                          ? 'bg-meatzy-olive text-white'
                          : 'bg-gray-300 text-gray-600'
                      }
                    `}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-sm font-bold uppercase tracking-wider hidden md:block
                      ${
                        step.number === currentStep
                          ? 'text-meatzy-olive'
                          : step.number < currentStep
                          ? 'text-meatzy-dill'
                          : 'text-gray-500'
                      }
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-1 w-16 md:w-32 transition-all duration-300
                      ${
                        step.number < currentStep
                          ? 'bg-meatzy-dill'
                          : 'bg-gray-300'
                      }
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="transition-opacity duration-300">
          {currentStep === 1 && (
            <StepOneChooseBox
              product={mainProduct}
              onSelect={handleBoxSelected}
            />
          )}

          {currentStep === 2 && (
            <StepTwoSelectAddOns
              addOnProducts={addOnProducts}
              selectedAddOns={selectedAddOns}
              onAddOnsChange={setSelectedAddOns}
              onContinue={handleContinueToCheckout}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase mb-4">
                Redirecting to Checkout...
              </h2>
              <p className="text-gray-600">Please wait while we prepare your order</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
