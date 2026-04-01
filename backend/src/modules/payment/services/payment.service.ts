import type { Request, Response } from 'express';

import { ApiResponse } from '../../../shared/responses/api-response.builder.js';
import { asyncHandler } from '../../../shared/utils/async-handler.util.js';
import { getStripe } from '../../../shared/utils/stripe.util.js';
import { Order } from '../../order/repositories/order.model.js';
import { OrderStatusHistory } from '../../order/repositories/order-status-history.model.js';
import { Payment } from '../repositories/payment.model.js';

export const createStripePayment = asyncHandler(
    async (req: Request, res: Response) => {
        const stripe = getStripe();
        const { orderId, amount } = req.body ?? {};

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        const payment = await Payment.create({
            orderId,
            amount,
            paymentMethod: 'stripe',
            paymentStatus: 'pending',
            transactionId: paymentIntent.id,
        });

        return res.status(201).json(
            new ApiResponse(201, 'Stripe PaymentIntent created', {
                clientSecret: paymentIntent.client_secret,
                payment,
            }),
        );
    },
);

export const confirmPayment = asyncHandler(
    async (req: Request, res: Response) => {
        const { transactionId, status } = req.body ?? {};

        const payment = await Payment.findOneAndUpdate(
            { transactionId },
            { paymentStatus: status },
            { new: true },
        );

        if (!payment) {
            return res
                .status(404)
                .json(new ApiResponse(404, 'Payment not found', null));
        }

        if (status === 'success') {
            await Order.findByIdAndUpdate((payment as any).orderId, {
                currentStatus: 'paid',
            });
            await OrderStatusHistory.create({
                orderId: (payment as any).orderId,
                status: 'paid',
            });
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'Payment updated successfully', payment),
            );
    },
);
