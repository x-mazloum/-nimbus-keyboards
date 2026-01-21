import { createClient } from "@/prismicio";
import { asText } from "@prismicio/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover"
})

export async function POST(
    request: NextRequest,
    {params} : {params: Promise<{uid: string}>}
) {
    try{
        const {uid} = await params
        if(!uid){
            return NextResponse.json({error: "Missing Product UID"}, {status: 400})
        }
        const prismicClient = createClient();
        const product = await prismicClient.getByUID("product", uid);

        const name = product.data.name;
        const price = product.data.price;
        const image = product.data.image?.url;
        const description = asText(product.data.description);

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: name as string,
                            ...(description ? {description} : {}),
                            ...(image ? {images: [image]} : {})
                        },
                        unit_amount: Math.round((price as number) * 100),
                    },
                    quantity: 1
                }
            ],
            mode: "payment",
            success_url: `${request.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get("origin")}`
        }
        const session = await stripe.checkout.sessions.create(sessionParams);
        return NextResponse.json({ url: session.url})
    }catch(err){
        console.error("Stripe session creation error", err)
        return NextResponse.json({err: "Failed to create Stripe Session"}, {status: 500})
    }
}