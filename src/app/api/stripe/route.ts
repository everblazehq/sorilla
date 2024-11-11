import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

export async function GET() {
  const headersList = headers()
  const stripeKey = headersList.get('stripe-key')

  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe key is required' }, { status: 401 })
  }

  try {
    const stripe = new Stripe(stripeKey)
    const customers = await stripe.customers.list({
      limit: 100,
      expand: ['data.subscriptions'],
    })

    return NextResponse.json(customers.data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}