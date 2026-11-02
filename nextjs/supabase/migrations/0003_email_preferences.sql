-- Email setup: idempotency flag for the one-time welcome email, and an opt-out
-- flag for future non-transactional email sends. Additive only.

alter table public.preferences add column welcome_email_sent_at timestamptz;

alter table public.preferences add column email_opt_out boolean not null default false;
