export type Dictionary = {
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    close: string;
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
    relative: {
      now: string;
      minutesAgo: string;
      hoursAgo: string;
      yesterday: string;
      daysAgo: string;
    };
    generated: {
      trialEnding: { title: string; body: string };
      trialEnded: { title: string; body: string };
      emptyActivity: { title: string; body: string };
      taxReminder: { title: string; body: string };
      topService: { title: string; body: string };
      milestoneFirst: { title: string; body: string };
      milestoneTen: { title: string; body: string };
    };
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
  activity: {
    title: string;
    monthLabel: string;
    filters: { all: string; income: string; expense: string };
    period: {
      week: string;
      month: string;
      choose: string;
      ariaLabel: string;
      modalTitle: string;
    };
    day: { today: string; yesterday: string };
    empty: {
      week: string;
      month: string;
      custom: string;
      normalBody: string;
      filtered: string;
      filteredBody: string;
      resetCta: string;
    };
    paymentMethods: {
      cash: string;
      card: string;
      transfer: string;
      expense: string;
    };
    row: { actionsAria: string };
    actions: { edit: string; delete: string; menuAria: string };
    delete: {
      title: string;
      body: string;
      cancel: string;
      confirm: string;
      ariaLabel: string;
      genericError: string;
    };
    edit: { incomeTitle: string; expenseTitle: string; ariaLabel: string };
  };
  insights: {
    title: string;
    earnings: {
      eyebrow: string;
      emptyBody: string;
      weekShort: string;
    };
    bestDay: {
      eyebrow: string;
      emptyBody: string;
      summary: string;
      countOne: string;
      countFew: string;
      countMany: string;
    };
    clients: {
      eyebrow: string;
      subtitle: string;
      emptyBody: string;
    };
    topServices: {
      eyebrow: string;
      subtitle: string;
      emptyBody: string;
      share: string;
      footer: string;
    };
  };
  services: {
    countOne: string;
    countFew: string;
    countMany: string;
    averagePrefix: string;
    emptyTitle: string;
    emptyBody: string;
    addFirst: string;
    addCta: string;
    addSheetTitle: string;
    editSheetTitle: string;
    readOnly: string;
    form: {
      name: string;
      namePlaceholder: string;
      price: string;
      pricePlaceholder: string;
      saveAdd: string;
      saveEdit: string;
      cancel: string;
    };
    delete: {
      trigger: string;
      confirmBody: string;
      confirm: string;
      confirmPending: string;
      cancel: string;
    };
    errors: { generic: string };
  };
  addEntry: {
    income: {
      sheetTitle: string;
      editTitle: string;
      amount: string;
      service: string;
      paymentMethod: string;
      addNote: string;
      noteLabel: string;
      notePlaceholder: string;
      noServicesHint: string;
      manageServicesLink: string;
      cta: string;
      editCta: string;
    };
    expense: {
      sheetTitle: string;
      editTitle: string;
      amount: string;
      category: string;
      addNote: string;
      noteLabel: string;
      notePlaceholder: string;
      cta: string;
      editCta: string;
      categories: {
        supplies: string;
        rent: string;
        marketing: string;
        education: string;
        equipment: string;
        other: string;
      };
    };
    fab: { addedToast: string; openIncomeAria: string; openExpenseAria: string };
    errors: { generic: string };
  };
};

export const lt: Dictionary = {
  common: {
    save: "Išsaugoti",
    cancel: "Atšaukti",
    edit: "Keisti",
    delete: "Ištrinti",
    close: "Uždaryti",
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
    relative: {
      now: "ką tik",
      minutesAgo: "prieš {n} min.",
      hoursAgo: "prieš {n} val.",
      yesterday: "vakar",
      daysAgo: "prieš {n} d.",
    },
    generated: {
      trialEnding: {
        title: "Bandymas baigiasi",
        body: "Liko {days} d. bandomojo laikotarpio.",
      },
      trialEnded: {
        title: "Bandymas pasibaigė",
        body: "Pasirink planą, kad galėtum tęsti darbą su Monivo.",
      },
      emptyActivity: {
        title: "Tylioji savaitė",
        body: "Per pastarąsias 7 d. įrašų nebuvo. Atnaujink veiklą vienu paliestimu.",
      },
      taxReminder: {
        title: "Mokesčių priminimas",
        body: "Šį mėnesį atidėjai {amount} € mokesčiams.",
      },
      topService: {
        title: "Mėnesio lyderė",
        body: "Daugiausia uždirba {name} — {amount} €.",
      },
      milestoneFirst: {
        title: "Pirmas įrašas pridėtas",
        body: "Sveikiname — Monivo jau seka tavo pajamas.",
      },
      milestoneTen: {
        title: "10 įrašų šį mėnesį",
        body: "Konsistencija atsiperka — taip ir laikykis.",
      },
    },
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
  activity: {
    title: "Veikla",
    monthLabel: "Šis mėnuo",
    filters: { all: "Visi", income: "Pajamos", expense: "Išlaidos" },
    period: {
      week: "Ši savaitė",
      month: "Šis mėnuo",
      choose: "Pasirinkti",
      ariaLabel: "Periodas",
      modalTitle: "Pasirinkti mėnesį",
    },
    day: { today: "Šiandien", yesterday: "Vakar" },
    empty: {
      week: "Šią savaitę įrašų nėra.",
      month: "Šį mėnesį įrašų nėra.",
      custom: "Pasirinktą mėnesį įrašų nėra.",
      normalBody: "Pridėk pirmą įrašą — pamatysi jį čia.",
      filtered: "Pagal šį filtrą įrašų nėra.",
      filteredBody: "Pakeisk filtrą arba pridėk naują įrašą.",
      resetCta: "Rodyti visus",
    },
    paymentMethods: {
      cash: "Grynais",
      card: "Kortele",
      transfer: "Pavedimu",
      expense: "Išlaidos",
    },
    row: { actionsAria: "Veiksmai" },
    actions: {
      edit: "Redaguoti",
      delete: "Ištrinti",
      menuAria: "Įrašo veiksmai",
    },
    delete: {
      title: "Ištrinti įrašą?",
      body: "Šio veiksmo atšaukti nepavyks.",
      cancel: "Atšaukti",
      confirm: "Ištrinti",
      ariaLabel: "Ištrinti įrašą",
      genericError: "Įvyko klaida",
    },
    edit: {
      incomeTitle: "Redaguoti pajamas",
      expenseTitle: "Redaguoti išlaidas",
      ariaLabel: "Redaguoti",
    },
  },
  insights: {
    title: "Įžvalgos",
    earnings: {
      eyebrow: "Uždarbis",
      emptyBody: "Kai pridėsi daugiau įrašų, čia matysi pajamas pagal savaites.",
      weekShort: "sav.",
    },
    bestDay: {
      eyebrow: "Geriausia diena",
      emptyBody:
        "Kai pridėsi įrašų, pamatysi savaitės dieną, kurią uždirbi daugiausia.",
      summary: "{amount} € · {count} {label} šį mėnesį",
      countOne: "įrašas",
      countFew: "įrašai",
      countMany: "įrašų",
    },
    clients: {
      eyebrow: "Aptarnavimai šį mėnesį",
      subtitle: "pagal pajamų įrašus",
      emptyBody:
        "Pradėk registruoti pajamas — čia matysi mėnesio aptarnavimų skaičių.",
    },
    topServices: {
      eyebrow: "Populiariausios paslaugos",
      subtitle: "Pagal pajamas",
      emptyBody: "Kai pridėsi įrašų prie paslaugų, čia matysi populiariausias.",
      share: "{pct}% pajamų",
      footer: "Žiūrėti visas paslaugas",
    },
  },
  services: {
    countOne: "paslauga",
    countFew: "paslaugos",
    countMany: "paslaugų",
    averagePrefix: "vid.",
    emptyTitle: "Dar nepridėjai paslaugų.",
    emptyBody:
      "Pridėk dažniausiai teikiamas paslaugas — jas vienu paliestimu pridėsi prie pajamų.",
    addFirst: "Pridėti pirmą paslaugą",
    addCta: "+ Pridėti",
    addSheetTitle: "Pridėti paslaugą",
    editSheetTitle: "Redaguoti paslaugą",
    readOnly: "Tvarkyti paslaugas galėsi, kai prenumerata bus aktyvi.",
    form: {
      name: "Pavadinimas",
      namePlaceholder: "Pvz. Manikiūras",
      price: "Kaina",
      pricePlaceholder: "Pvz. 25,00",
      saveAdd: "Išsaugoti",
      saveEdit: "Išsaugoti pakeitimus",
      cancel: "Atšaukti",
    },
    delete: {
      trigger: "Ištrinti paslaugą",
      confirmBody: "Tikrai ištrinti?",
      confirm: "Trinti",
      confirmPending: "Trinama…",
      cancel: "Atšaukti",
    },
    errors: { generic: "Įvyko klaida" },
  },
  addEntry: {
    income: {
      sheetTitle: "Pridėti pajamas",
      editTitle: "Redaguoti pajamas",
      amount: "Suma",
      service: "Paslauga",
      paymentMethod: "Apmokėjimo būdas",
      addNote: "+ Pridėti pastabą",
      noteLabel: "Pastaba",
      notePlaceholder: "Nebūtina",
      noServicesHint: "Dar nepridėjai paslaugų.",
      manageServicesLink: "Tvarkyti paslaugas →",
      cta: "Pridėti",
      editCta: "Išsaugoti",
    },
    expense: {
      sheetTitle: "Pridėti išlaidas",
      editTitle: "Redaguoti išlaidas",
      amount: "Suma",
      category: "Kategorija",
      addNote: "+ Pridėti pastabą",
      noteLabel: "Pastaba",
      notePlaceholder: "Nebūtina",
      cta: "Pridėti išlaidas",
      editCta: "Išsaugoti",
      categories: {
        supplies: "Priemonės",
        rent: "Nuoma",
        marketing: "Marketingas",
        education: "Mokymai",
        equipment: "Įranga",
        other: "Kita",
      },
    },
    fab: {
      addedToast: "Pridėta ✓",
      openIncomeAria: "Pridėti pajamas",
      openExpenseAria: "Pridėti išlaidas",
    },
    errors: { generic: "Įvyko klaida" },
  },
};
