// Content script for Thomson Reuters sign-on page
// Pre-fills credentials and notifies background that login page is ready

(function() {
  'use strict';

  console.log('[ACC Agent] Westlaw login page detected');

  // Notify background that login page is ready
  chrome.runtime.sendMessage({ type: 'WESTLAW_LOGIN_READY' });

  // Listen for credential fill request
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'FILL_CREDENTIALS') {
      fillCredentials(msg.username, msg.password);
      sendResponse({ ok: true });
    }
    return true;
  });

  function fillCredentials(username, password) {
    // Thomson Reuters login form selectors
    const usernameSelectors = [
      '#co_clientIDTextbox',
      'input[name="username"]',
      'input[name="userid"]',
      'input[type="email"]',
      '#username',
      '#email',
      'input[placeholder*="username" i]',
      'input[placeholder*="email" i]',
      'input[placeholder*="ID" i]',
    ];

    const passwordSelectors = [
      '#co_clientPasswordTextbox',
      'input[name="password"]',
      'input[type="password"]',
      '#password',
    ];

    let usernameFilled = false;
    let passwordFilled = false;

    // Try to find and fill username
    for (const sel of usernameSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        setNativeValue(el, username);
        console.log('[ACC Agent] Username filled via', sel);
        usernameFilled = true;
        break;
      }
    }

    // Try to find and fill password
    for (const sel of passwordSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        setNativeValue(el, password);
        console.log('[ACC Agent] Password filled via', sel);
        passwordFilled = true;
        break;
      }
    }

    // Auto-submit if both fields filled — fully automatic, no user action needed
    if (usernameFilled && passwordFilled) {
      setTimeout(() => {
        const submitSelectors = [
          '#co_clientSignInButton',
          'button[type="submit"]',
          'input[type="submit"]',
          '#SignIn',
          'button[name="SignIn"]',
          'button:not([type="button"])',
          '.sign-in-btn',
          'button[class*="sign"]',
          'button[class*="login"]',
          'button[class*="submit"]',
        ];

        for (const sel of submitSelectors) {
          const btn = document.querySelector(sel);
          if (btn && (btn.textContent?.toLowerCase().includes('sign') || 
                      btn.textContent?.toLowerCase().includes('log') ||
                      btn.type === 'submit' ||
                      btn.id?.toLowerCase().includes('sign'))) {
            console.log('[ACC Agent] Auto-submitting login via', sel);
            btn.click();
            return;
          }
        }

        // Fallback: try pressing Enter on the password field
        for (const sel of passwordSelectors) {
          const el = document.querySelector(sel);
          if (el) {
            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            el.form?.submit();
            console.log('[ACC Agent] Auto-submitted via Enter/form.submit');
            break;
          }
        }
      }, 500); // Small delay to let form validation catch up
    }
  }

  // Set value in a way that React/Angular forms detect
  function setNativeValue(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Watch for successful login (URL change away from signon page)
  let loginCheckInterval = setInterval(() => {
    if (!window.location.hostname.includes('signon.thomsonreuters.com')) {
      clearInterval(loginCheckInterval);
      chrome.runtime.sendMessage({ type: 'WESTLAW_LOGGED_IN' });
    }
  }, 1000);

  // Also detect navigation to Westlaw after login
  const observer = new MutationObserver(() => {
    // Check if we've been redirected to Westlaw
    if (window.location.hostname.includes('next.westlaw.com')) {
      observer.disconnect();
      clearInterval(loginCheckInterval);
      chrome.runtime.sendMessage({ type: 'WESTLAW_LOGGED_IN' });
    }
  });
  observer.observe(document, { childList: true, subtree: true });

  function showAgentBanner(text) {
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; z-index: 999999;
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      color: white; padding: 10px 20px; font-size: 13px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex; align-items: center; gap: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `
      <span style="font-size: 16px;">⚖️</span>
      <span>${text}</span>
      <button onclick="this.parentElement.remove()" style="
        margin-left: auto; background: rgba(255,255,255,0.2); border: none;
        color: white; padding: 4px 12px; border-radius: 6px; cursor: pointer;
        font-size: 11px;
      ">Dismiss</button>
    `;
    document.body.prepend(banner);

    // Auto-dismiss after 10 seconds
    setTimeout(() => banner.remove(), 10000);
  }
})();
