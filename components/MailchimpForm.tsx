'use client'

import { useState } from 'react'
import '../styles/MailchimpForm.scss'

const MC_ACTION =
  'https://smartassfacts.us15.list-manage.com/subscribe/post?u=042a501513b6fdea97b06ce81&id=85eb6eaa5d&f_id=00f3a6e0f0'

function MailchimpForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    // Form posts to Mailchimp in a new tab; we show a local success state
    setTimeout(() => setSubmitted(true), 200)
  }

  if (submitted) {
    return (
      <div className="mc-form mc-form--success">
        <span className="mc-form__success-icon">🎉</span>
        <p className="mc-form__success-text">
          Almost there! Check your inbox to confirm your subscription.
        </p>
      </div>
    )
  }

  return (
    <div className="mc-form">
      <div className="mc-form__copy">
        <h3 className="mc-form__title">Get smarter, daily</h3>
        <p className="mc-form__subtitle">A weekly dose of surprising facts straight to your inbox.</p>
      </div>

      <form
        action={MC_ACTION}
        method="post"
        name="mc-embedded-subscribe-form"
        target="_blank"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="mc-form__fields">
          <div className="mc-form__name-row">
            <input
              type="text"
              name="FNAME"
              placeholder="First name"
              className="mc-form__input"
              autoComplete="given-name"
            />
            <input
              type="text"
              name="LNAME"
              placeholder="Last name"
              className="mc-form__input"
              autoComplete="family-name"
            />
          </div>
          <div className="mc-form__email-row">
            <input
              type="email"
              name="EMAIL"
              placeholder="Email address *"
              required
              className="mc-form__input mc-form__input--email"
              autoComplete="email"
            />
            <button type="submit" name="subscribe" className="mc-form__button">
              Subscribe
            </button>
          </div>
        </div>

        {/* Mailchimp honeypot — do not remove */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
          <input
            type="text"
            name="b_042a501513b6fdea97b06ce81_85eb6eaa5d"
            tabIndex={-1}
            defaultValue=""
          />
        </div>
      </form>
    </div>
  )
}

export default MailchimpForm
