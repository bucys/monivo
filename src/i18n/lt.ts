export type Dictionary = {
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    loading: string;
    soon: string;
    saved: string;
  };
  nav: {
    dashboard: string;
    activity: string;
    insights: string;
    services: string;
    settings: string;
  };
  settings: {
    title: string;
    subtitle: string;
    sections: {
      business: string;
      app: string;
      subscription: string;
      account: string;
    };
    profile: {
      editTitle: string;
      displayName: string;
      displayNamePlaceholder: string;
      businessType: string;
      individualActivity: string;
    };
    business: {
      services: string;
      taxRate: string;
      activityType: string;
    };
    app: {
      appearance: string;
      appearanceValue: string;
      language: string;
      export: string;
      exportValue: string;
    };
    subscription: {
      title: string;
      statusActive: string;
      statusTrialing: string;
      statusExpired: string;
      statusPastDue: string;
      statusCanceled: string;
      trialDaysLeft: string;
      trialEnded: string;
    };
    account: {
      account: string;
      logout: string;
    };
  };
};

export const lt: Dictionary = {
  common: {
    save: "Išsaugoti",
    cancel: "Atšaukti",
    edit: "Keisti",
    delete: "Ištrinti",
    loading: "Įkeliama…",
    soon: "Greitai",
    saved: "Išsaugota",
  },
  nav: {
    dashboard: "Apžvalga",
    activity: "Veikla",
    insights: "Įžvalgos",
    services: "Paslaugos",
    settings: "Nustatymai",
  },
  settings: {
    title: "Daugiau",
    subtitle: "Nustatymai",
    sections: {
      business: "Verslas",
      app: "Programa",
      subscription: "Prenumerata",
      account: "Paskyra",
    },
    profile: {
      editTitle: "Keisti vardą",
      displayName: "Vardas",
      displayNamePlaceholder: "Įvesk vardą",
      businessType: "Veiklos rūšis",
      individualActivity: "Individuali veikla",
    },
    business: {
      services: "Paslaugos ir kainos",
      taxRate: "Mokesčių rezervas",
      activityType: "Veiklos rūšis",
    },
    app: {
      appearance: "Išvaizda",
      appearanceValue: "Šviesi",
      language: "Kalba",
      export: "Eksportuoti duomenis",
      exportValue: "CSV",
    },
    subscription: {
      title: "Tavo planas",
      statusActive: "Aktyvus planas",
      statusTrialing: "Bandomasis laikotarpis",
      statusExpired: "Pasibaigė",
      statusPastDue: "Mokėjimas vėluoja",
      statusCanceled: "Atšauktas",
      trialDaysLeft: "Liko {n} d.",
      trialEnded: "Bandymas pasibaigė",
    },
    account: {
      account: "Paskyra",
      logout: "Atsijungti",
    },
  },
};
