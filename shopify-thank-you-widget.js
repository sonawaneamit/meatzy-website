/**
 * Meatzy Affiliate Widget for Shopify Thank You Page
 *
 * Add this script to your Shopify Plus checkout customization:
 * Settings → Checkout → Order status page → Additional scripts
 *
 * This displays an instant affiliate widget showing the customer's
 * referral code immediately after purchase (Social Snowball style)
 */

(function() {
  // Only run on thank you page
  if (!Shopify.Checkout || Shopify.Checkout.step !== 'thank_you') {
    return;
  }

  const customerEmail = Shopify.checkout.email;
  const customerName = Shopify.checkout.billing_address?.first_name || 'there';

  if (!customerEmail) {
    console.log('No customer email found');
    return;
  }

  // Fetch the customer's referral code from your API
  fetch(`https://your-domain.vercel.app/api/get-referral-code?email=${encodeURIComponent(customerEmail)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.referralCode) {
        createAffiliateWidget(data.referralCode, customerName, data.referralLink);
      }
    })
    .catch(error => {
      console.error('Error fetching referral code:', error);
    });

  function createAffiliateWidget(referralCode, customerName, referralLink) {
    // Create widget container
    const widget = document.createElement('div');
    widget.id = 'meatzy-affiliate-widget';
    widget.innerHTML = `
      <style>
        #meatzy-affiliate-widget {
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
          border-radius: 16px;
          padding: 40px;
          margin: 30px 0;
          color: white;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        #meatzy-affiliate-widget h2 {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        #meatzy-affiliate-widget p {
          font-size: 16px;
          margin: 0 0 25px 0;
          opacity: 0.95;
        }

        #meatzy-affiliate-widget .referral-code-box {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        #meatzy-affiliate-widget .referral-code {
          font-size: 32px;
          font-weight: 900;
          color: #8B4513;
          letter-spacing: 3px;
          font-family: 'Courier New', monospace;
        }

        #meatzy-affiliate-widget .copy-btn {
          background: #8B4513;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        #meatzy-affiliate-widget .copy-btn:hover {
          background: #6B3410;
          transform: scale(1.05);
        }

        #meatzy-affiliate-widget .copy-btn.copied {
          background: #228B22;
        }

        #meatzy-affiliate-widget .share-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 25px 0;
        }

        #meatzy-affiliate-widget .share-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        #meatzy-affiliate-widget .share-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        #meatzy-affiliate-widget .share-btn svg {
          width: 24px;
          height: 24px;
          fill: white;
        }

        #meatzy-affiliate-widget .share-btn:hover svg {
          fill: #8B4513;
        }

        #meatzy-affiliate-widget .email-notice {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 20px;
        }

        #meatzy-affiliate-widget .commission-info {
          background: rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          line-height: 1.6;
        }
      </style>

      <div class="affiliate-widget-content">
        <h2>🥩 Share Meatzy & Earn 13% Commission!</h2>
        <p>Your order is confirmed! Now share premium meat with friends and earn on every purchase.</p>

        <div class="referral-code-box">
          <div class="referral-code">${referralCode}</div>
          <button class="copy-btn" onclick="copyReferralCode()">
            <span class="copy-text">Copy Code</span>
          </button>
        </div>

        <div class="commission-info">
          <strong>How it works:</strong><br>
          • Earn 13% on direct referrals<br>
          • Earn 2% on their referrals<br>
          • Up to 4 levels deep!
        </div>

        <div class="share-buttons">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}"
             target="_blank"
             class="share-btn"
             title="Share on Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>

          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out Meatzy! Use my code ${referralCode} for premium meat delivered to your door.`)}&url=${encodeURIComponent(referralLink)}"
             target="_blank"
             class="share-btn"
             title="Share on Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>

          <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out Meatzy! Use my code ${referralCode}: ${referralLink}`)}"
             target="_blank"
             class="share-btn"
             title="Share on WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>

          <a href="mailto:?subject=${encodeURIComponent('Check out Meatzy!')}&body=${encodeURIComponent(`I just ordered from Meatzy and thought you'd love it too! Use my code ${referralCode} to get premium meat delivered: ${referralLink}`)}"
             class="share-btn"
             title="Share via Email">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
        </div>

        <p class="email-notice">
          📧 Check your email for your affiliate dashboard link!
        </p>
      </div>

      <script>
        function copyReferralCode() {
          const code = '${referralCode}';
          const link = '${referralLink}';

          // Copy link (not just code)
          navigator.clipboard.writeText(link).then(() => {
            const btn = document.querySelector('.copy-btn');
            const text = btn.querySelector('.copy-text');
            text.textContent = 'Copied!';
            btn.classList.add('copied');

            setTimeout(() => {
              text.textContent = 'Copy Code';
              btn.classList.remove('copied');
            }, 2000);
          });
        }
      </script>
    `;

    // Insert widget after order confirmation
    const orderStatus = document.querySelector('.os-order-number') ||
                       document.querySelector('.os-header__title') ||
                       document.querySelector('[data-order-details]') ||
                       document.querySelector('.step__sections');

    if (orderStatus) {
      orderStatus.parentNode.insertBefore(widget, orderStatus.nextSibling);
    } else {
      // Fallback: insert at top of main content
      const main = document.querySelector('.main') || document.querySelector('.content');
      if (main) {
        main.insertBefore(widget, main.firstChild);
      }
    }
  }
})();
