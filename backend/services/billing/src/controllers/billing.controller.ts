import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import razorpay from '../config/razorpay.js';
import { PLANS } from '../config/Plans.js';
import Payment from '../models/payment.model.js';

export const createOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { plan } = req.body;
        const userId = req.headers['x-user-id'] as string;

        const selectedPlan = PLANS[plan];

        if (!selectedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        const order = await razorpay.orders.create({
            amount: selectedPlan.amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        });

        await Payment.create({
            userId,
            orderId: order.id,
            amount: selectedPlan.amount,
            currency: 'INR',
            credits: selectedPlan.credits,
            plan,
            status: 'created',
        });

        return res.status(201).json({
            order,
            plan: selectedPlan,
        });
    } catch (error: any) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            message: 'Failed to create order',
            error: error.message || error,
        });
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        const payment = await Payment.findOne({ orderId: razorpay_order_id });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = 'paid';
        payment.paymentId = razorpay_payment_id;
        await payment.save();

        if (process.env.AUTH_SERVICE) {
            await axios.post(
                `${process.env.AUTH_SERVICE}/update-plan`,
                {
                    userId: payment.userId,
                    plan: payment.plan,
                    credits: payment.credits,
                },
            );
        }
        return res.status(200).json({ message: 'Payment verified successfully' });
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message || error,
        });
    }
};
