

## Plan: Enforce Strong Password on Registration

Currently the password validation only requires 6+ characters. Will upgrade to require a strong password before allowing registration.

### Changes

**`src/pages/Auth.tsx`**
- Update `passwordSchema` to require: 8+ chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
- Block form submission unless password meets all criteria (during signup)
- Update `PasswordStrength` to show specific requirement checklist (checkmarks for met criteria)
- Show real-time feedback as user types (e.g., "✓ Uppercase letter", "✗ Special character")

No database or backend changes needed.

