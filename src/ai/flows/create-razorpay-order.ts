'use server';
/**
 * @fileOverview A server-side flow to securely create Razorpay orders.
 *
 * - createRazorpayOrder - A function that creates a Razorpay order.
 * - CreateRazorpayOrderInput - The input type for the createRazorpayOrder function.
 * - CreateRazorpayOrderOutput - The return type for the createRazorpayOrder function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Razorpay from 'razorpay';

const CreateRazorpayOrderInputSchema = z.object({
  amount: z.number().describe('The order amount in the smallest currency unit (e.g., paise for INR).'),
  currency: z.string().describe('The currency of the order (e.g., "INR").'),
  receipt: z.string().describe('A unique receipt ID for the order.'),
});
export type CreateRazorpayOrderInput = z.infer<typeof CreateRazorpayOrderInputSchema>;

const CreateRazorpayOrderOutputSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
});
export type CreateRazorpayOrderOutput = z.infer<typeof CreateRazorpayOrderOutputSchema>;


export async function createRazorpayOrder(
  input: CreateRazorpayOrderInput
): Promise<CreateRazorpayOrderOutput> {
  return createRazorpayOrderFlow(input);
}


const createRazorpayOrderFlow = ai.defineFlow(
  {
    name: 'createRazorpayOrderFlow',
    inputSchema: CreateRazorpayOrderInputSchema,
    outputSchema: CreateRazorpayOrderOutputSchema,
  },
  async (input) => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keySecret === 'YOUR_RAZORPAY_KEY_SECRET_HERE') {
      throw new Error('Razorpay API keys are not configured on the server.');
    }
    
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    
    const options = {
      amount: input.amount,
      currency: input.currency,
      receipt: input.receipt,
    };
    
    // Using a promise because the razorpay library uses callbacks by default.
    return new Promise((resolve, reject) => {
      razorpay.orders.create(options, (err, order) => {
        if (err) {
          console.error("Razorpay order creation error:", err);
          return reject(new Error('Failed to create Razorpay order.'));
        }
        if (!order) {
           return reject(new Error('Razorpay did not return an order object.'));
        }
        resolve({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
      });
    });
  }
);
