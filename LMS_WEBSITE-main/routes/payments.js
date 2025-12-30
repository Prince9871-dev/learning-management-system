import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Donation from '../models/Donation.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/create-order - Create Razorpay order
router.post('/create-order', verifyFirebaseToken, async (req, res) => {
  try {
    const { amount, message } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Amount in paise (smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `donation_${Date.now()}_${req.user.uid}`,
    };

    const order = await razorpay.orders.create(options);

    // Save donation record
    const donation = new Donation({
      userId: req.user.uid,
      amount: amount,
      message: message || null,
      razorpayOrderId: order.id,
      status: 'pending',
    });

    await donation.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST /api/payments/verify - Verify payment signature
router.post('/verify', verifyFirebaseToken, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Verify signature
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update donation record
    const donation = await Donation.findOne({ razorpayOrderId: orderId });

    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found' });
    }

    if (donation.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    donation.razorpayPaymentId = paymentId;
    donation.status = 'completed';
    await donation.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      donation,
    });
  } catch (error) {
    console.error('Verify payment error:', error.message);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

export default router;

