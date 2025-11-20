'use client';

import React from 'react';
import { FileText, Scale, Users, DollarSign, CheckCircle2 } from 'lucide-react';

export default function ReferralPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden bg-meatzy-tallow font-sans -mt-[140px]">

      {/* Hero Section */}
      <section className="relative min-h-[60vh] w-full flex items-center bg-meatzy-tallow overflow-hidden pt-32 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="text-center py-10 lg:py-0">
            <div className="inline-flex items-center gap-2 bg-white border border-meatzy-mint rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <Scale className="w-4 h-4 text-meatzy-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-meatzy-olive">Legal Agreement</span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-meatzy-olive leading-[0.9] mb-6 font-slab capitalize tracking-tight">
              Meatzy Referral Program<br/>
              <span className="text-meatzy-rare">Agreement</span>
            </h1>

            <p className="text-lg text-meatzy-olive/70 mb-10 max-w-3xl font-medium leading-relaxed mx-auto">
              Terms and conditions governing participation in the Meatzy Affiliate Program
            </p>

            <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-wide text-meatzy-olive/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> Clear Terms
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> Fair Commission
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> Transparent
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-meatzy-mint/30 overflow-hidden">

          {/* Content Container */}
          <div className="p-8 md:p-12 space-y-12">

            {/* Section 1: Referral Program Agreement */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  1. Referral Program Agreement
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  This Meatzy Referral Program Agreement ("<strong>Agreement</strong>") governs your participation in the Meatzy referral program ("<strong>Program</strong>") operated by Meatzy LLC ("<strong>Meatzy</strong>," "<strong>we</strong>," "<strong>our</strong>," or "<strong>us</strong>"). By enrolling in the Program, you ("<strong>Participant</strong>," "<strong>you</strong>," or "<strong>your</strong>") agree to comply with the terms outlined here. The Program enables Participants to refer new customers to Meatzy and earn commissions on qualifying purchases.
                </p>
                <p>
                  The "<strong>Participant</strong>," "<strong>you</strong>," or "<strong>your</strong>" in this Agreement means the individual person who registered in this Program. The terms "<strong>we</strong>," "<strong>us</strong>," and "<strong>our</strong>" refer to Meatzy LLC.
                </p>
                <p>
                  This Program is administered and managed through our third-party affiliate platform partner, OSI Affiliate Software ("<strong>OSI</strong>"). By participating in the Program, you also agree to OSI's terms of service and privacy policy. OSI processes referrals, tracks commissions, and helps us manage the Program in compliance with applicable tax and privacy laws (as required by Meatzy and OSI's Agreement).
                </p>
                <p>
                  Meatzy is Meatzy LLC, a limited liability company, incorporated under the laws of Florida and with a registered office at 1968 S Congress Ave Ste #2048, West Palm Beach, FL 33406.
                </p>
                <p>
                  Meatzy may amend the Agreement or any term, terminology, and/or section or clause(s) at any time to the greatest extent allowed under the law, including, but not limited to, updating the commission rates and structure, updating the Program design and workflow, and/or Program eligibility requirements, either with or without notice to you. Please periodically review this Agreement and the Program for the most current information.
                </p>
                <p>
                  The Program is a marketing incentive reward and all bonuses, payments, and payouts of commission shall be treated as such at all times and in all instances.
                </p>
              </div>
            </div>

            {/* Section 2: Referral Forms */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  2. Referral Forms
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p><strong>Unique Referral Link:</strong> Each referral and referral event(s) are uniquely tied to the Meatzy profile of the Participant.</p>
                <p><strong>Referral Purchase Requirement:</strong> A referral must make their first purchase using the Participant's unique link and/or Participant's unique checkout code. Initial purchases made using the Participant's unique referral link are required to generate commissions.</p>
                <p><strong>Reward Attribution:</strong> Participants who have their unique referral link used by Participants (for a set time period stated below) will receive credit for a Referral.</p>
                <p><strong>Cookie-Based Tracking:</strong> The referral link utilizes cookie-based tracking to attribute purchases to the Participant who referred them. Cookies last 30 days from the time a potential customer clicks on a Participant's Referral Link or applies a Participant's Checkout code at the time of Checkout. In the event a Checkout code is stacked with a Referral Link, the Participant to whom the Checkout code applies shall be entitled to receive reward and commission.</p>
                <p><strong>Referral Link or Referral Code:</strong> A referral attribution can only originate by Meatzy via a Referral Link and/or Checkout code. In the event a Participant cannot produce verified documentation which includes the Referral Link or Checkout code utilized by a customer, then no commission or reward shall be allowed or entitled to the Participant.</p>
                <p><strong>Referral Link to Include:</strong> Referral Links and Checkout codes assigned to Meatzy via an Account or Dashboard purchase for the Program shall include the Participant ID and code within it (e.g., yourname.meatzy.com or discount code such as YOURNAME10 depending on the promotion structure, content, commission, payment, and compensation structure). Referral codes are tracked by OSI's software in the Participant's account via a separate tracking tool (Post Affiliate Pro), and are linked to Meatzy customer accounts for commission processing and Commission attribution. Referral Codes cannot be modified by Participants after initial setup without Meatzy approval. Any attempt to manipulate attribution or circumvent tracking may result in immediate disqualification from the Program and forfeiture of all unpaid commissions.</p>
              </div>
            </div>

            {/* Section 3: Eligibility */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  3. Eligibility
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>To participate in the Program, you must meet the following eligibility criteria:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 18 years old;</li>
                  <li>You must have a valid email address and access to the internet;</li>
                  <li>You must reside in the United States of America; and</li>
                  <li>You must comply with all applicable laws and Meatzy Policies.</li>
                </ul>
                <p>
                  The Program is not eligible to anyone prohibited by the Meatzy Affiliate Terms of Service (or any variation of the Program Terms or Agreement). All Participants in the Program are eligible to opt-in and eligible to earn and receive commissions (subject to the restrictions outlined in this Agreement).
                </p>
              </div>
            </div>

            {/* Section 4: Referral Process */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  4. Referral Process
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Each Participant will be assigned a unique referral link (i.e., BRAND NAME, Meatzy subdomain of Meatzy.com or code). When a new customer ("<strong>Referral</strong>") purchases a product via the Participant's Referral Link or code, the Participant will receive a commission (also referred to as "<strong>Reward</strong>," "<strong>Payout</strong>," and/or "<strong>Payment</strong>") based on the reward and commission structure and terms set forth within this Agreement.
                </p>
                <p>
                  There is one minimum value of Participant's Referral Link or referral order to receive commissions. However, in order to withdraw commissions or receive payment, minimum withdrawal and cash-out thresholds apply, as outlined in Section 6 (Bonus Payments Payments and Commissions). Any Participant who does not meet any threshold(s) before the Program concludes or who closes or terminates their account before their commission payout is processed will not receive any commission or amounts. Meatzy may, in its sole discretion, determine the treatment or disposition of unrealized commissions (i.e., amounts not yet available for withdrawal) remaining in Participant accounts when a Participant is banned, suspended, or if the Program terminates, subject to applicable federal and state laws.
                </p>
                <p>
                  Commissions on a sale are possible as a Participant's account (only as permitted under the Program for the current provisions) at the time the order is fulfilled and delivered. The commissions apply to the full value of the product(s) in the Referral's cart (subject to applicable taxes, shipping fees, and discounts) following the schedule set forth in Section 6. Meatzy may elect to implement additional verification steps or impose additional conditions or impose adjustments to the commission structure at its discretion.
                </p>

                <div className="bg-meatzy-mint/20 border-l-4 border-meatzy-rare p-6 rounded-r-lg my-6">
                  <h3 className="font-black text-xl text-meatzy-olive mb-4">COMMISSION STRUCTURE</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-meatzy-olive mb-2">A) Eligibility:</p>
                      <p className="text-gray-700">You must have made a purchase of Consciously Created LLC's Purchased merchandise (i.e., a Meatzy meal purchased via a Meatzy order that's delivered by OSI) to be considered for commission earnings. Participants who have made a qualifying purchase are eligible to participate in the Program for commission earnings.</p>
                    </div>

                    <div>
                      <p className="font-bold text-meatzy-olive mb-2">B) Referral Link & Tracking:</p>
                      <p className="text-gray-700">Commission earnings are generated when Referrals place a qualified and completed purchase using your referral link or code. Referrals must click on your unique referral link or code within a maximum of 30 days preceding the purchase to qualify for commission credit.</p>
                    </div>

                    <div>
                      <p className="font-bold text-meatzy-olive mb-2">C) Commission Tiers:</p>
                      <p className="text-gray-700 mb-2">You'll receive a percentage of the Referred Purchase (after tax, fees, in the form noted herein, before discounts and promotions - subject to change) according to the following tier schedule:</p>

                      <div className="overflow-x-auto mt-4">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-meatzy-olive text-white">
                              <th className="border border-gray-300 px-4 py-3 text-left font-bold">Earning Threshold (Cumulative Qualified Sales)</th>
                              <th className="border border-gray-300 px-4 py-3 text-left font-bold">Commission Rate for Qualifying Purchases</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-3">Baseline: $0</td>
                              <td className="border border-gray-300 px-4 py-3">5%</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-4 py-3">Milestone 1: $3,000+ (in 12 months or less; Year 1)</td>
                              <td className="border border-gray-300 px-4 py-3">10%</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-3">Milestone 2: $9,000+ (in 12 months or less; Year 1)</td>
                              <td className="border border-gray-300 px-4 py-3">10% (Bonus Extra +2% / 12% Total)</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-4 py-3">Milestone 3: $18,000+ (in 12 months or less; Year 1)</td>
                              <td className="border border-gray-300 px-4 py-3">10% (Bonus Extra +5% / 15% Total)</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-3">Milestone 4: $30,000+ (in 12 months or less; Year 1)</td>
                              <td className="border border-gray-300 px-4 py-3">10% (Bonus Extra +7% / 17% Total)</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-4 py-3">Milestone 5: $45,000+ (in 12 months or less; Year 1)</td>
                              <td className="border border-gray-300 px-4 py-3">10% (Bonus Extra +10% / 20% Total)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-meatzy-olive mb-2">D) Tiered Rewards Payments:</h3>
                  <p className="text-gray-700 mb-4">
                    <strong>Life-Time Locked-in Rate:</strong> Once you've reached higher tiers (i.e., 10%-20% tiers), Participant earns commissions at their current tier for all future Qualifying Purchases by all direct Referrals (tier 1 customers only). For instance, in a scenario when a customer makes a purchase at $100 in qualifying purchases and you have reached the 15% tier, your tier 1 (direct referral) customer would earn 15%.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Should your commission tier be increased, all Tier 1 customers qualifying purchases (of which, qualified purchases are tracked by OSI at the time of the sale) will be compensated in the Participant Meatzy account at the updated commission tier amount. If the commission tier is decreased, any existing tier 1 customers shall stay at existing rates and all new referrals will be set to new tier rates set by the Participant Meatzy account.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-meatzy-olive mb-2">E) Earnings Excluded From Commission Calculation:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Shipping, handling fees, and taxes.</li>
                    <li>Discounts, coupon codes, or promotional offers applied to the Referral's order.</li>
                    <li>Returns, refunds, and charge-backs.</li>
                    <li>Subscriptions or repeat orders after the initial sale (this applies only to subscriptions made by your Referrals post-trial or post-first purchase). Original Participant rewards remain locked to Original Participant.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-meatzy-olive mb-2">F) Important Additional Notes:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Commissions are only available on a Participant's Meatzy account upon a confirmed Participant signup via OSI Affiliate or a direct Meatzy customer order (e.g., a customer's first purchase must be completed successfully for the Participant to receive their commission). All future referring and Participant qualifying sales will follow this pattern throughout the Participant lifetime.</li>
                    <li>Tiers are cumulative and do not reset. If you generate $18K in Cumulative Qualified Sales in 12 or less months, you'll earn at a 15% commission for subsequent and future referred order in which the initial qualifying sale amount is in excess of $18K. However, commissions apply only to orders created, fulfilled, and paid (not cancelled) within that eligibility timeframe.</li>
                    <li>Participants cannot refer themselves to Meatzy or otherwise refer new Meatzy customer accounts that they control or have control over. These are treated as self-referrals. Attempted self-referrals are grounds for immediate expulsion from the Program and forfeit of all outstanding commission.</li>
                    <li>In order to earn the rewards stated above via this Program, Participants must stay in good standing with Meatzy. Meatzy may disqualify participants for a variety of reasons, including without limitation, the following: (1) Engaging in deceptive or misleading behavior in connection with promotion of the Program; (2) Actions or conduct that bring Meatzy, the Program, or other participant into disrepute or otherwise harm the goodwill or reputation of Meatzy or the Program; (3) Use of inappropriate language, images, or content during promotional activity; (4) Violation of any part of the Agreement; (5) Falsifying referral data; and (6) Violating applicable law.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5: Bonus Payments */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  5. Bonus Payments Payments
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p><strong>Life-Time Locked-in Rate:</strong> Participants who have reached higher tiers (i.e., 10%-20% tier(s)) in a 12-month or less-earned time-frame will keep their lifetime earning percentage for their direct referring customers (tier 1 only). In instances where the commission or payment amount for tier 1 (the customer referred via Referral Link and/or checkout code) decreases (or commission rates for tier 1 customers are adjusted/changed by Meatzy at any point in the future in the event of a commission rate change, downgrade, or restructuring), the pre-existing Referrals acquired by Participant at their initially-higher commission tier will retain access to their higher tier compensation and higher tiered commission rates (the locked-lifetime or legacy rates set in the initial Participant account prior to the rate updates will continue to apply at those higher lifetime rates to Referrals previously acquired for the full life of the Participant's account). New tier 1 customer referrals generated after the commission-rate change apply new, updated commission rates per commission tier table.</p>
                <p>
                  Should commission tiers and rates be increased by Meatzy, the updated commission rates will apply to existing tier 1 customers as well (all qualifying purchases in the Participant Meatzy Dashboard account via Post Affiliate Pro will automatically recalibrate for correct payouts).
                </p>
              </div>
            </div>

            {/* Section 6: Payment and Commissions */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  6. Payment and Commission(s) Rate
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Commissions will be paid monthly via the payment method(s) elected by Participant (check, cash, or wire/direct deposit) within sixty (60) days following the end of the month in which the order is delivered. Participant is solely responsible for any wire/direct deposit fees. If commission is $100 or less at the end of the applicable monthly time period, then said commission will roll over into the next month's commission payments. No commission is paid until a Participant's total commission balance reaches the minimum payout threshold of $100.
                </p>
                <p>
                  Meatzy reserves the right to withhold payment of commissions in the event of suspected fraud, misuse, self-referral activity, returns, refunds, or chargebacks. Additionally, should Meatzy believe that Participant engaged in prohibited conduct (as defined in Section 8 (Prohibited Conduct)), OSI may suspend payment or freeze Participant's Meatzy account pending an investigation. The investigation period shall be of a reasonable time frame depending on circumstances and may require assistance of the Participant for additional info and details of the suspected issue. Additionally, Meatzy reserves the right to recoup commissions paid on returned orders, canceled orders, refund orders, or chargeback orders.
                </p>
                <p>
                  Please note that depending on your country and jurisdiction, tax laws require Meatzy to collect tax information on individuals earning commissions. As of the writing of this policy, Meatzy may be required to file 1099 forms on US Participants in compliance with the Internal Revenue Service (IRS) requirements. Please consult a tax advisor regarding your specific reporting and tax-filing responsibilities before electing to participate in the Program.
                </p>
                <p>
                  Meatzy may elect to modify the commission structure or rates at any time (either by lowering or by increasing rates) upon providing notice to Participants via email notice. By continuing to participate in the Program, Participants agree to new commission structure terms and commission rates.
                </p>
              </div>
            </div>

            {/* Section 7: Termination */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  7. Termination
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  You may withdraw from the Program at any time by contacting Meatzy and requesting to opt-out of the Program. If you withdraw before your accumulated commissions reach the minimum threshold for payout, you will forfeit any unpaid commission balances, and no payment will be made for any commission amounts that would have otherwise become due to you.
                </p>
                <p>
                  Meatzy may suspend your account, remove your access to the Program, and/or revoke your Participant status at any time, with or without cause and with or without notice. Common reasons for termination include, but are not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violations of the Agreement terms, including failure to follow the Code of Conduct, engaging in fraud, engaging in deceptive marketing practices, or violating promotional guidelines.</li>
                  <li>Failure to comply with applicable law or Meatzy Policies.</li>
                  <li>Intentional manipulation of the Program for personal gain beyond what it permits.</li>
                </ul>
                <p>
                  If Participant terminates this Agreement or if we terminate Participant for any breach and/or violation of the terms and conditions in this Agreement, Participant forfeits any unpaid commissions. Termination does not relieve Participant of any obligations under applicable law, including but not limited to privacy compliance or tax obligations for compensation received.
                </p>
                <p>
                  The termination provision will survive the termination or expiration of the Agreement, provided that they are required to be preserved or followed after the Agreement term pursuant to their express terms and language or applicable federal and state law.
                </p>
              </div>
            </div>

            {/* Section 8: Prohibited Conduct */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  8. Participant Conduct
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>By participating in the Program, Participants agree to abide by the following code of conduct:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>NOT Spamming:</strong> Do not send unsolicited bulk emails or unsolicited messages.</li>
                  <li><strong>NOT Using misleading or deceptive marketing:</strong> Do not misrepresent Meatzy, its products, its Program, or its services in any of your promotional materials.</li>
                  <li><strong>NOT Creating fake accounts or self-referrals:</strong> Do not create multiple Participant accounts or attempt to refer yourself to Meatzy in any capacity.</li>
                  <li><strong>Compliance with applicable laws:</strong> You must follow all applicable federal, state, and local laws, rules, and regulations related to endorsements and affiliate marketing.</li>
                  <li><strong>Misrepresentation of your relationship with Meatzy or Meatzy as your brand:</strong> You may not present yourself as a Meatzy employee, authorized agent, partner, or joint venture, and you may not make statements that imply any relationship with Meatzy that does not exist.</li>
                  <li><strong>Use Meatzy's Intellectual Property only as authorized by this Agreement:</strong> Meatzy's logos and registered trademarks may be used for promotional efforts only when expressly authorized and in accordance with our brand guidelines.</li>
                  <li><strong>Ensure accuracy in information you provide to Meatzy, OSI, and our Partners:</strong> You must maintain accurate information in your Meatzy account and in your OSI Post Affiliate Pro Dashboard account.</li>
                  <li><strong>Engage in a respectful and fair manner with the Agreement:</strong> Meatzy delivers what will be applicable and will not accept misuse of its services.</li>
                </ul>
                <p>
                  Failure to adhere to this Code of Conduct may lead to immediate suspension or termination of Participant's participation in the Program and forfeiture of unpaid referral commissions, in our sole discretion without notice.
                </p>
                <p>
                  Meatzy reserves discretion to update and publish its standards and policies in terms of its standards and policies at meatzy.com/referral-terms and its update(s) to this Agreement will be in effect immediately for ongoing Participants.
                </p>
              </div>
            </div>

            {/* Section 9: Disclosure Requirements */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  9. Disclosure Requirements
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  As a Participant, you are required to comply with the Federal Trade Commission's ("<strong>FTC</strong>") endorsement and testimonial guidelines, including making a clear and conspicuous disclosure that you are an affiliate of Meatzy and will earn compensation if people purchase products using your Referral Link and/or referral checkout code. For more information, visit the FTC's advertising guidelines at ftc.gov/endorsements.
                </p>
                <p>
                  Sample disclosure language may include the following: "<em>This post contains affiliate links. If you purchase through my link, I may earn a commission at no additional cost to you.</em>"
                </p>
              </div>
            </div>

            {/* Section 10: General */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-meatzy-rare rounded-lg">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase">
                  10. General
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Meatzy Affiliate Agreement by the Program (the part of the 1st that excludes Meatzy Affiliate) is the Program, i.e. the OSI Affiliate (i.e., Partner referred by the Meatzy to qualifying purchases for this Agreement to agreement) to the continuing effect to this and any other Policies ("<strong>Meatzy Policy</strong>") adopted by Meatzy regarding the Program. If a provision of this Agreement is found by a court of competent jurisdiction to be unlawful, void, or unenforceable, that provision shall be deemed severed and shall not affect the validity or enforceability of the remaining provisions of this Agreement. We may amend this Agreement from time to time by posting the amended Agreement on our website. By continuing to participate in the Program after such amendments, you agree to be bound by the revised Agreement.
                </p>
                <p>
                  The relationship between you and Meatzy is solely that of independent contractors. Nothing in this Agreement creates a partnership, joint venture, agency, employment, or franchise relationship between you and Meatzy.
                </p>
                <p>
                  This Agreement shall be governed by the laws of the State of Florida without regard to its conflict of laws provisions.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-meatzy-olive/5 border-2 border-meatzy-olive/20 rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4">
                Questions About This Agreement?
              </h3>
              <p className="text-gray-700 mb-4">
                If you have questions about this Referral Program Agreement, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:contact@meatzy.com" className="text-meatzy-rare hover:underline">contact@meatzy.com</a></p>
                <p><strong>Address:</strong> Meatzy LLC, 1968 S Congress Ave Ste #2048, West Palm Beach, FL 33406</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-meatzy-olive py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black font-slab uppercase mb-6 leading-tight">
            Ready To Start Earning?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join our affiliate program and earn commissions by sharing premium proteins with your network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/affiliate"
              className="inline-flex items-center justify-center gap-3 bg-meatzy-rare text-white px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-white hover:text-meatzy-olive transition-all shadow-xl"
            >
              Join Affiliate Program
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-white text-meatzy-olive px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-meatzy-mint transition-all shadow-xl"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
