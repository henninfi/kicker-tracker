import { PLANS } from '../config/stripe'
import { db } from '../db'
import Stripe from 'stripe'
import { useRedirectFunctions, useLogoutFunction, useAuthInfo } from "@propelauth/react";
import { ArrowRight } from 'lucide-react'
import UserAccountNav from '../components/UserAccountNav'
import MobileNav from '../components/MobileNav'


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  // apiVersion: '2023-08-16',
  typescript: true,
})

export async function getUserSubscriptionPlan() {
  const {redirectToLoginPage, redirectToSignupPage, redirectToAccountPage} = useRedirectFunctions()
  const authInfo = useAuthInfo();
  const user = authInfo.user

  if (!user?.userId) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    }
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.userId,
    },
  })

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    }
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  )

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceIds.test === dbUser.stripePriceId)
    : null

  let isCanceled = false
  if (isSubscribed && dbUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...plan,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  }
}