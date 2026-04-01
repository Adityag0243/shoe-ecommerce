import Stripe from 'stripe';

import { config } from '../../config.js';

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
    if (!stripeInstance) {
        const key = config.stripeSecretKey;
        if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
        stripeInstance = new Stripe(key, {});
    }
    return stripeInstance;
};
