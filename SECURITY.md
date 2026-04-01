# Security Policy

## Supported Versions

Since this project follows a copy-paste model (similar to shadcn), there are no strict versioned releases distributed via npm.

Security updates are applied directly to:
- the main branch
- the latest documentation and component registry

Users are encouraged to:
- regularly sync with the latest components
- review changes before applying them to their codebase

---

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

You can:
- Open a private discussion (if enabled)
- Or create an issue with the label `security` (avoid sharing sensitive details publicly if the risk is high)

If the vulnerability is sensitive, you can also contact directly via GitHub:  
https://github.com/ddtamn

---

## What to Expect

After reporting a vulnerability:

- You can expect an initial response within **2–5 days**
- The issue will be reviewed and validated
- If confirmed:
  - A fix will be implemented
  - Documentation and components will be updated
- If declined:
  - A clear explanation will be provided

---

## Scope

This project includes:
- UI components
- audio state management (AudioProvider)
- interaction logic (controls, queue, etc.)

Please note:
- This project does **not** handle backend security, authentication, or data storage
- Security responsibility is shared with the application using these components

---

## Best Practices for Users

Since you own the code:

- Review all components before using them in production
- Avoid blindly trusting generated or modified code (including AI-generated changes)
- Keep dependencies up to date
- Test edge cases related to audio playback and user interaction

---

## Acknowledgement

Inspired by open source principles — responsible disclosure helps improve the ecosystem for everyone 🙏
