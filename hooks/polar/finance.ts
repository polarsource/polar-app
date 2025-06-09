import { Organization } from "@polar-sh/sdk/models/components/organization.js";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export enum AccountStatus {
  CREATED = "created",
  ONBOARDING_STARTED = "onboarding_started",
  UNDER_REVIEW = "under_review",
  DENIED = "denied",
  ACTIVE = "active",
}

export enum AccountType {
  STRIPE = "stripe",
  OPEN_COLLECTIVE = "open_collective",
}

export interface User {
  email: string;
  avatar_url: string | null;
  account_id: string | null;
}

export interface Address {
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  city: string | null;
  state: string | null;
  country: string; // Two letter country code
}

export interface OrganizationAccount {
  id: string; // UUID as string
  account_type: AccountType;
  status: AccountStatus;
  stripe_id: string | null;
  open_collective_slug: string | null;
  is_details_submitted: boolean;
  is_charges_enabled: boolean;
  is_payouts_enabled: boolean;
  country: string; // Two letter country code

  billing_name: string | null;
  billing_address: Address | null;
  billing_additional_info: string | null;
  billing_notes: string | null;

  users: User[];
  organizations: Organization[];
}

export const useOrganizationAccount = (
  organizationId?: string
): UseQueryResult<OrganizationAccount> => {
  return useQuery({
    queryKey: ["finance", "account", organizationId],
    queryFn: () =>
      fetch(
        `${process.env.EXPO_PUBLIC_POLAR_API_URL}/v1/organizations/${organizationId}/account`
      ).then((res) => res.json()),
    enabled: !!organizationId,
  });
};

export interface TransactionsBalance {
  currency: string;
  amount: number;
  account_currency: string;
  account_amount: number;
}

export interface TransactionsSummary {
  balance: TransactionsBalance;
  payout: TransactionsBalance;
}

export const useTransactionsSummary = (
  accountId?: string
): UseQueryResult<TransactionsSummary> =>
  useQuery({
    queryKey: ["finance", "transactions", "summary", accountId],
    queryFn: () =>
      fetch(
        `${process.env.EXPO_PUBLIC_POLAR_API_URL}/v1/transactions/summary?account_id=${accountId}`
      ).then((res) => res.json()),
    enabled: !!accountId,
  });
