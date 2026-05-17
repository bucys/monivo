export type Dictionary = {
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    loading: string;
    soon: string;
    saved: string;
    income: string;
    expense: string;
    taxReserve: string;
    seeAll: string;
    thisMonth: string;
  };
  nav: {
    dashboard: string;
    activity: string;
    insights: string;
    services: string;
    settings: string;
    more: string;
    home: string;
    browse: string;
    business: string;
    sidebarAria: string;
    mobileNavAria: string;
    addIncome: string;
    addExpense: string;
    dashboardSub: string;
    activitySub: string;
    insightsSub: string;
    servicesSub: string;
    settingsSub: string;
    taxReserveMini: string;
    taxReserveSubline: string;
    individualActivity: string;
  };
  topbar: {
    notificationsAria: string;
  };
  dashboard: {
    greeting: string;
    greetingNamed: string;
    spendableTitle: string;
    spendableSubPositive: string;
    spendableSubNegative: string;
    monthlyComposition: string;
    incomeRemainderLabel: string;
    incomeCaption: string;
    statsIncome: string;
    statsExpense: string;
    statsTaxReserve: string;
    weeklyTitle: string;
    weeklyWeekShort: string;
    quickActions: string;
    quickActionsHint: string;
    quickActionsSeeAll: string;
    quickActionsEmptyTitle: string;
    quickActionsEmptyBody: string;
    quickActionsEmptyCta: string;
    quickActionsAllLinkShort: string;
    quickActionsAllLink: string;
    todayAria: string;
    todayTitle: string;
    todayCountSingle: string;
    todayCountFew: string;
    todayCountMany: string;
    todayEmptyTitle: string;
    todayEmptyBody: string;
    todayPaymentCash: string;
    todayPaymentCard: string;
    todayPaymentTransfer: string;
    todayPaymentExpense: string;
  };
  notifications: {
    title: string;
    unreadCount: string;
    allRead: string;
    markAllRead: string;
    emptyTitle: string;
    emptyBody: string;
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
    income: "Pajamos",
    expense: "Išlaidos",
    taxReserve: "Atidėta",
    seeAll: "Visi įrašai",
    thisMonth: "Šis mėnuo",
  },
  nav: {
    dashboard: "Apžvalga",
    activity: "Veikla",
    insights: "Įžvalgos",
    services: "Paslaugos",
    settings: "Nustatymai",
    more: "Daugiau",
    home: "Pagrindinis",
    browse: "Naršyti",
    business: "Verslas",
    sidebarAria: "Šoninė navigacija",
    mobileNavAria: "Pagrindinė navigacija",
    addIncome: "Pridėti pajamas",
    addExpense: "Pridėti išlaidas",
    dashboardSub: "Šis mėnuo",
    activitySub: "Šis mėnuo",
    insightsSub: "Šis mėnuo",
    servicesSub: "Tavo presetai",
    settingsSub: "Paskyra",
    taxReserveMini: "Mokesčių rezervas",
    taxReserveSubline: "nuo pajamų",
    individualActivity: "Individuali veikla",
  },
  topbar: {
    notificationsAria: "Pranešimai",
  },
  dashboard: {
    greeting: "Labas",
    greetingNamed: "Labas, {name}",
    spendableTitle: "Kiek galiu išleisti",
    spendableSubPositive: "Lieka po mokesčių rezervo ir išlaidų.",
    spendableSubNegative: "Šį mėnesį išlaidos viršija pajamas.",
    monthlyComposition: "Mėnesio sudėtis",
    incomeRemainderLabel: "Šio mėnesio pajamos",
    incomeCaption: "pajamos",
    statsIncome: "Pajamos",
    statsExpense: "Išlaidos",
    statsTaxReserve: "Atidėta",
    weeklyTitle: "Uždarbis šį mėnesį",
    weeklyWeekShort: "sav.",
    quickActions: "Greiti veiksmai",
    quickActionsHint: "Spustelėk — pridėk",
    quickActionsSeeAll: "Žiūrėti visas",
    quickActionsEmptyTitle: "Dar nėra paslaugų greitam įvedimui.",
    quickActionsEmptyBody:
      "Pridėk dažniausias paslaugas — pajamas įvesi vienu paliestimu.",
    quickActionsEmptyCta: "Pridėti paslaugą",
    quickActionsAllLinkShort: "Visos",
    quickActionsAllLink: "Žiūrėti visas paslaugas",
    todayAria: "Šios dienos įrašai",
    todayTitle: "Šiandien",
    todayCountSingle: "įrašas",
    todayCountFew: "įrašai",
    todayCountMany: "įrašų",
    todayEmptyTitle: "Šiandien dar nieko neužregistruota.",
    todayEmptyBody: "Pridėk pajamas ar išlaidas — pamatysi jas čia.",
    todayPaymentCash: "Grynais",
    todayPaymentCard: "Kortele",
    todayPaymentTransfer: "Pavedimu",
    todayPaymentExpense: "Išlaida",
  },
  notifications: {
    title: "Pranešimai",
    unreadCount: "{n} naujų",
    allRead: "Viskas perskaityta",
    markAllRead: "Pažymėti perskaitytus",
    emptyTitle: "Kol kas pranešimų nėra.",
    emptyBody:
      "Čia matysi mokesčių priminimus, mėnesio įžvalgas ir paskyros žinutes.",
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
