import type { Request, Response } from 'express';

import { ApiResponse } from '../../../shared/responses/api-response.builder.js';
import { asyncHandler } from '../../../shared/utils/async-handler.util.js';
import {
    getPaginationMeta,
    getPaginationParams,
} from '../../../shared/utils/pagination.util.js';
import { Order } from '../repositories/order.model.js';
import { OrderItem } from '../repositories/order-item.model.js';
import { OrderStatusHistory } from '../repositories/order-status-history.model.js';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { items, totalAmount } = req.body ?? {};

    const order = await Order.create({
        userId: (req as any).user?.id,
        totalAmount,
    });

    await Promise.all(
        (items ?? []).map((item: any) =>
            OrderItem.create({ ...item, orderId: (order as any)._id }),
        ),
    );

    await OrderStatusHistory.create({
        orderId: (order as any)._id,
        status: 'pending',
    });

    const populatedOrderItems = await OrderItem.find({
        orderId: (order as any)._id,
    }).populate({
        path: 'productId',
        select: 'name brand price',
    });

    res.status(201).json(
        new ApiResponse(201, 'Order created successfully', {
            order,
            items: populatedOrderItems,
        }),
    );
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPaginationParams(
        (req.query as Record<string, unknown>) ?? {},
        { limit: 10, maxLimit: 50 },
    );

    const filter = { userId: (req as any).user?.id };
    const [items, totalItems] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Order.countDocuments(filter),
    ]);

    return res.status(200).json(
        new ApiResponse(200, 'Orders fetched successfully', {
            items,
            pagination: getPaginationMeta(page, limit, totalItems),
        }),
    );
});
