import type { Dictionary } from "./lt";

export const en: Dictionary = {
  common: {
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading…",
    soon: "Soon",
    saved: "Saved",
  },
  nav: {
    dashboard: "Dashboard",
    activity: "Activity",
    insights: "Insights",
    services: "Services",
    settings: "Settings",
  },
  settings: {
    title: "More",
    subtitle: "Settings",
    sections: {
      business: "Business",
      app: "App",
      subscription: "Subscription",
      account: "Account",
    },
    profile: {
      editTitle: "Edit name",
      displayName: "Name",
      displayNamePlaceholder: "Enter your name",
      businessType: "Business type",
      individualActivity: "Individual activity",
    },
    business: {
      services: "Services & prices",
      taxRate: "Tax reserve",
      activityType: "Business type",
    },
    app: {
      appearance: "Appearance",
      appearanceValue: "Light",
      language: "Language",
      export: "Export data",
      exportValue: "CSV",
    },
    subscription: {
      title: "Your plan",
      statusActive: "Active plan",
      statusTrialing: "Trial",
      statusExpired: "Expired",
      statusPastDue: "Payment overdue",
      statusCanceled: "Canceled",
      trialDaysLeft: "{n} days left",
      trialEnded: "Trial ended",
    },
    account: {
      account: "Account",
      logout: "Sign out",
    },
  },
};
