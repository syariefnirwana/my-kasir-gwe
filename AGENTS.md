<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Follow PROGRESS.md batch order and tick tasks + changelog after each batch — it is the project's single source of truth.
- WhatsApp OTP lives in server functions (src/lib/otp.functions.ts) that issue a magic-link token hash for Supabase sessions — keeps login phone-only without SMS provider config.
- Roles live in public.user_roles with has_role(); the super admin row is protected by a DB trigger — prevents privilege escalation and accidental revocation.
