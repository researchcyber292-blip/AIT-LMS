'use server';
/**
 * @fileOverview A server-side flow to securely verify Razorpay payment signatures.
 *
 * - verifyRazorpayPayment - A function that verifies a Razorpay payment.
 * - VerifyPaymentInput - The input type for the verifyRazorpayPayment function.
 * - VerifyPaymentOutput - The return type for the verifyRazorpayPayment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import crypto from 'crypto';

const VerifyPaymentInputSchema = z.object({
  order_id: z.string(),
  payment_id: z.string(),
  signature: z.string(),
});
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentInputSchema>;

const VerifyPaymentOutputSchema = z.object({
  isVerified: z.boolean(),
});
export type VerifyPaymentOutput = z.infer<typeof VerifyPaymentOutputSchema>;

export async function verifyRazorpayPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
  return verifyRazorpayPaymentFlow(input);
}

const verifyRazorpayPaymentFlow = ai.defineFlow(
  {
    name: 'verifyRazorpayPaymentFlow',
    inputSchema: VerifyPaymentInputSchema,
    outputSchema: VerifyPaymentOutputSchema,
  },
  async ({ order_id, payment_id, signature }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret || keySecret === 'YOUR_RAZORPAY_KEY_SECRET_HERE') {
      throw new Error('Razorpay key secret is not configured on the server.');
    }

    const body = order_id + "|" + payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isVerified = expectedSignature === signature;

    return { isVerified };
  }
);
