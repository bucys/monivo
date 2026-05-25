export type Dictionary = {
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    close: string;
    previousMonth: string;
    nextMonth: string;
    genericError: string;
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
    taxReserveThisMonth: string;
    individualActivity: string;
    accountFallback: string;
    professions: {
      hair: string;
      nails: string;
      cosmetology: string;
      lashes: string;
      other: string;
    };
  };
  topbar: {
    notificationsAria: string;
  };
  dashboard: {
    greeting: string;
    greetingNamed: string;
    spendableAria: string;
    spendableTitle: string;
    spendableSubPositive: string;
    spendableSubNegative: string;
    monthlyComposition: string;
    incomeRemainderLabel: string;
    incomeCaption: string;
    statsIncome: string;
    statsExpense: string;
    statsTaxReserve: string;
    reservePlannedTitle: string;
    reserveAboutPrefix: string;
    reserveTapHint: string;
    reserveBreakdownGpm: string;
    reserveBreakdownVsd: string;
    reserveBreakdownPsd: string;
    reserveBreakdownVl: string;
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
    profession: {
      sheetTitle: string;
      ariaLabel: string;
    };
    business: {
      services: string;
      taxRate: string;
      activityType: string;
      activityForm: string;
    };
    tax: {
      sectionTitle: string;
      sectionHint: string;
      modalSubtitle: string;
      modeLabel: string;
      modes: { iv: string; vl: string; custom: string };
      iv: {
        expenseModeLabel: string;
        fixed30: string;
        fixed30Helper: string;
        actual: string;
        actualHelper: string;
        psdToggle: string;
        psdHelper: string;
      };
      vl: {
        yearlyCostLabel: string;
        yearlyCostPlaceholder: string;
        validUntilLabel: string;
        psdToggle: string;
        psdHelper: string;
        emptyHint: string;
        reserveHelper: string;
      };
      custom: {
        percentLabel: string;
        percentPlaceholder: string;
        helper: string;
      };
      saveCta: string;
      savedToast: string;
      disclaimer: string;
      explain: {
        gpm: string;
        vsd: string;
        psd: string;
        vl: string;
        footnote: string;
      };
    };
    app: {
      appearance: string;
      appearanceValue: string;
      themeAria: string;
      themeOptions: { light: string; dark: string; device: string };
      language: string;
      export: string;
      exportValue: string;
      exportHint: string;
      exportEmpty: string;
      exportEmptyIncome: string;
      exportEmptyExpenses: string;
      exportError: string;
      exportPending: string;
      exportSheet: {
        title: string;
        subtitle: string;
        download: string;
        options: {
          all: { label: string; helper: string };
          income: { label: string; helper: string };
          expenses: { label: string; helper: string };
        };
        rangeLabel: string;
        ranges: {
          this_month: string;
          this_year: string;
          custom: string;
        };
        from: string;
        to: string;
        invalidRange: string;
      };
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
      email: string;
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
  landing: {
    nav: {
      features: string;
      howItWorks: string;
      pricing: string;
      faq: string;
      login: string;
      ctaShort: string;
      ctaFull: string;
    };
    languageToggle: {
      aria: string;
      lt: string;
      en: string;
    };
    hero: {
      eyebrow: string;
      titleStart: string;
      titleAccent: string;
      subtitle: string;
      cta: string;
      trialNote: string;
      reassurances: ReadonlyArray<string>;
      footnote: string;
      imageAlt: string;
      badgeServiceLabel: string;
      badgeTaxLabel: string;
    };
    problem: {
      eyebrow: string;
      title: string;
      pains: ReadonlyArray<{ q: string; a: string }>;
    };
    howItWorks: {
      eyebrow: string;
      title: string;
      recordedBadge: string;
      heroEyebrow: string;
      heroSubline: string;
      services: { manicure: string; pedicure: string; brows: string; lashes: string };
      steps: ReadonlyArray<{ title: string; body: string }>;
    };
    features: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: ReadonlyArray<{ title: string; body: string }>;
    };
    pricing: {
      eyebrow: string;
      title: string;
      subtitle: string;
      badge: string;
      perMonth: string;
      trialNote: string;
      cta: string;
      cancelNote: string;
      features: ReadonlyArray<string>;
    };
    faq: {
      eyebrow: string;
      title: string;
      items: ReadonlyArray<{ q: string; a: string }>;
      contact: {
        title: string;
        body: string;
        sent: string;
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        question: string;
        questionPlaceholder: string;
        submit: string;
        sending: string;
        errorGeneric: string;
        retry: string;
      };
    };
    closing: {
      titleStart: string;
      titleAccent: string;
      body: string;
      cta: string;
    };
    footer: {
      brand: string;
      privacy: string;
      terms: string;
      contact: string;
    };
    legal: {
      updatedPrefix: string;
      backLead: string;
      backLink: string;
    };
    privacy: {
      eyebrow: string;
      title: string;
      updatedAt: string;
      intro: string;
      h_what: string;
      p_what: string;
      h_why: string;
      p_why: string;
      h_storage: string;
      p_storage: string;
      h_contact: string;
      p_contactA: string;
      p_contactLink: string;
      p_contactB: string;
    };
    terms: {
      eyebrow: string;
      title: string;
      updatedAt: string;
      intro: string;
      h_what: string;
      p_what: string;
      h_notWhat: string;
      p_notWhat: string;
      h_liability: string;
      p_liability: string;
      h_changes: string;
      p_changesA: string;
      p_changesLink: string;
      p_changesB: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      updatedAt: string;
      intro: string;
      outro: string;
    };
    contactForm: {
      sentEyebrow: string;
      sentTitle: string;
      sentBody: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      footnote: string;
      submit: string;
      sending: string;
      errorGeneric: string;
      retry: string;
    };
  };
  auth: {
    login: {
      eyebrow: string;
      title: string;
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      submit: string;
      successBody: string;
      rateLimited: string;
      notRegistered: string;
      notRegisteredCta: string;
      footerLead: string;
      footerCta: string;
    };
    register: {
      eyebrow: string;
      title: string;
      subtitle: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      submit: string;
      successBody: string;
      rateLimited: string;
      footerLead: string;
      footerCta: string;
      termsLead: string;
      termsLink: string;
      termsAnd: string;
      privacyLink: string;
    };
  };
  onboarding: {
    stepCounter: string;
    stepAria: string;
    profession: {
      title: string;
      subtitle: string;
      none: string;
      cards: {
        hair: { title: string; sub: string };
        nails: { title: string; sub: string };
        face: { title: string; sub: string };
        body: { title: string; sub: string };
      };
    };
    tax: {
      title: string;
      subtitle: string;
      customLabel: string;
      customPlaceholder: string;
      outOfRange: string;
    };
    actions: {
      continue: string;
      skip: string;
      finish: string;
      back: string;
    };
    footer: string;
    errors: { generic: string };
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
    fab: {
      addedToast: string;
      openIncomeAria: string;
      openExpenseAria: string;
      openMenuAria: string;
      closeMenuAria: string;
    };
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
    previousMonth: "Ankstesnis mėnuo",
    nextMonth: "Kitas mėnuo",
    genericError: "Įvyko klaida",
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
    taxReserveThisMonth: "šį mėnesį",
    individualActivity: "Individuali veikla",
    accountFallback: "Mano paskyra",
    professions: {
      hair: "Plaukai",
      nails: "Nagai",
      cosmetology: "Veidas ir oda",
      lashes: "Blakstienos",
      other: "Individuali veikla",
    },
  },
  topbar: {
    notificationsAria: "Pranešimai",
  },
  dashboard: {
    greeting: "Labas",
    greetingNamed: "Labas, {name}",
    spendableAria: "Mėnesio apžvalga",
    spendableTitle: "Kiek galiu išleisti",
    spendableSubPositive: "Lieka po mokesčių rezervo ir išlaidų.",
    spendableSubNegative: "Šį mėnesį išlaidos viršija pajamas.",
    monthlyComposition: "Mėnesio sudėtis",
    incomeRemainderLabel: "Šio mėnesio pajamos",
    incomeCaption: "pajamos",
    statsIncome: "Pajamos",
    statsExpense: "Išlaidos",
    statsTaxReserve: "Atidėta",
    reservePlannedTitle: "Planuojamas mokesčių rezervas",
    reserveAboutPrefix: "apie",
    reserveTapHint: "Paspauskite, kad pamatytumėte detalizaciją.",
    reserveBreakdownGpm: "GPM",
    reserveBreakdownVsd: "VSD",
    reserveBreakdownPsd: "PSD",
    reserveBreakdownVl: "Verslo liudijimo dalis",
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
    profession: {
      sheetTitle: "Pasirink veiklos sritį",
      ariaLabel: "Veiklos sritis",
    },
    business: {
      services: "Paslaugos ir kainos",
      taxRate: "Mokesčių rezervas",
      activityType: "Veiklos rūšis",
      activityForm: "Veiklos forma",
    },
    tax: {
      sectionTitle: "Mokesčių rezervas",
      sectionHint:
        "Skaičiavimai yra orientaciniai — padeda planuoti, kiek atsidėti.",
      modalSubtitle:
        "Ši informacija naudojama mokesčių rezervo skaičiavimui.",
      modeLabel: "Veiklos forma",
      modes: {
        iv: "Individuali veikla",
        vl: "Verslo liudijimas",
        custom: "Pasirinktinis %",
      },
      iv: {
        expenseModeLabel: "Išlaidų metodas",
        fixed30: "30% išlaidų metodas",
        fixed30Helper:
          "Paprastesnis variantas — išlaidos skaičiuojamos automatiškai.",
        actual: "Faktinės išlaidos",
        actualHelper:
          "Mokesčiai planuojami pagal tavo pridėtas išlaidas.",
        psdToggle: "Įtraukti PSD į rezervą",
        psdHelper: "Išjunk jei PSD moka darbdavys ar kita veikla.",
      },
      vl: {
        yearlyCostLabel: "Verslo liudijimo kaina per metus",
        yearlyCostPlaceholder: "Pvz. 420",
        validUntilLabel: "Galioja iki",
        psdToggle: "Įtraukti PSD į rezervą",
        psdHelper: "Išjunk jei PSD moka darbdavys ar kita veikla.",
        emptyHint:
          "Įvesk metinę VL kainą — paskaičiuosime, kiek atsidėti per mėnesį.",
        reserveHelper:
          "Jei liudijimą jau apmokėjai, ši suma padeda paskirstyti jo kainą per likusį laikotarpį.",
      },
      custom: {
        percentLabel: "Procentas nuo pajamų",
        percentPlaceholder: "Pvz. 20",
        helper: "Naudok, jei tvarkai mokesčius kitu būdu.",
      },
      saveCta: "Išsaugoti",
      savedToast: "Išsaugota",
      disclaimer:
        "Tai planavimo įrankis, ne oficiali apskaita. Tikslius mokesčius patvirtina VMI.",
      explain: {
        gpm: "Pajamų mokestis nuo apmokestinamojo pelno. Naudojamas saugesnis 15% planavimo rezervas — taip lieka šiek tiek atsargos.",
        vsd: "Socialinio draudimo įmoka. Skaičiuojama 12,52% nuo Sodros bazės (90% apmokestinamojo pelno).",
        psd: "Sveikatos draudimas — 6,98% nuo Sodros bazės. Jei suma maža, taikoma mėnesinė minimumo riba. Jei PSD moka darbdavys ar kita veikla, gali PSD rezervą išjungti.",
        vl: "Verslo liudijimo kaina paskirstoma per likusį galiojimo laikotarpį, kad mėnesinis rezervas atspindėtų realų likutį.",
        footnote: "Planavimo įvertis, ne oficialus mokesčių patarimas.",
      },
    },
    app: {
      appearance: "Išvaizda",
      appearanceValue: "Šviesi",
      themeAria: "Pasirinkti išvaizdą",
      themeOptions: { light: "Šviesi", dark: "Tamsi", device: "Įrenginio" },
      language: "Kalba",
      export: "Eksportuoti duomenis",
      exportValue: "CSV",
      exportHint: "Atsisiųsk pajamų ir išlaidų suvestinę.",
      exportEmpty: "Šiame periode įrašų nėra.",
      exportEmptyIncome: "Šiame periode pajamų įrašų nėra.",
      exportEmptyExpenses: "Šiame periode išlaidų įrašų nėra.",
      exportError: "Nepavyko paruošti failo.",
      exportPending: "Ruošiama…",
      exportSheet: {
        title: "Eksportuoti duomenis",
        subtitle: "Pasirink, ką nori atsisiųsti.",
        download: "Atsisiųsti CSV",
        options: {
          all: {
            label: "Visi duomenys",
            helper: "Pilnas eksportas — pajamos ir išlaidos kartu.",
          },
          income: {
            label: "Tik pajamos",
            helper: "Tik pajamų įrašai ir paslaugos.",
          },
          expenses: {
            label: "Tik išlaidos",
            helper: "Tik išlaidų įrašai.",
          },
        },
        rangeLabel: "Periodas",
        ranges: {
          this_month: "Šis mėnuo",
          this_year: "Šie metai",
          custom: "Pasirinktas periodas",
        },
        from: "Nuo",
        to: "Iki",
        invalidRange: "Pradžios data turi būti ne vėlesnė už pabaigos datą.",
      },
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
      email: "El. paštas",
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
  landing: {
    nav: {
      features: "Galimybės",
      howItWorks: "Kaip veikia",
      pricing: "Kainos",
      faq: "D.U.K.",
      login: "Prisijungti",
      ctaShort: "Pradėti →",
      ctaFull: "Pradėti nemokamai →",
    },
    languageToggle: {
      aria: "Pakeisti kalbą",
      lt: "LT",
      en: "EN",
    },
    hero: {
      eyebrow: "Grožio profesionalams · Lietuvoje",
      titleStart: "Pagaliau aišku",
      titleAccent: "kiek lieka tau",
      subtitle:
        "Sek pajamas, išlaidas ir mokesčius be buhalterijos streso. Sukurta tau — grožio profesionalui.",
      cta: "Pradėti 30 d. nemokamai →",
      trialNote: "30 dienų nemokamai · Be kortelės",
      reassurances: [
        "Be buhalterijos žinių",
        "Paruošta per 2 min.",
        "Pritaikyta mobiliam",
      ],
      footnote:
        "Sukurta individualiai dirbantiems. Be Excel. Be buhalterinės kalbos. Be streso.",
      imageAlt:
        "Monivo aplikacijos peržiūra: galiu išleisti €1 350, mokesčiams atidėta €145, šios dienos pajamų ir išlaidų sąrašas.",
      badgeServiceLabel: "Manikiūras · grynais",
      badgeTaxLabel: "Mokesčiams atidėta",
    },
    problem: {
      eyebrow: "Problema · Sprendimas",
      title: "Užtenka spėlioti savo finansus.",
      pains: [
        {
          q: "„Atrodo užsidirbau pakankamai šį mėnesį…“",
          a: "Matai, kiek pinigų lieka po išlaidų ir mokesčių rezervo.",
        },
        {
          q: "„Vis pamirštu atsidėti mokesčiams.“",
          a: "Iškart matai, kiek verta atsidėti mokesčiams.",
        },
        {
          q: "„Buhalterinės programos man per sudėtingos.“",
          a: "Pajamas pridedi per 3 sekundes — be lentelių, be formų.",
        },
      ],
    },
    howItWorks: {
      eyebrow: "Kaip veikia",
      title: "Trys žingsniai — ir aišku.",
      recordedBadge: "Įrašyta",
      heroEyebrow: "Kiek gali laisvai išleisti",
      heroSubline: "Po išlaidų ir mokesčių rezervo",
      services: {
        manicure: "Manikiūras",
        pedicure: "Pedikiūras",
        brows: "Antakiai",
        lashes: "Blakstienos",
      },
      steps: [
        {
          title: "Pridėk savo paslaugas ir kainas",
          body: "Susikuri savo paslaugas vieną kartą — ir greitai jas pridėsi kiekvieną dieną.",
        },
        {
          title: "Sek pajamas per sekundes",
          body: "Pasirenki paslaugą, patvirtini — ir viskas.",
        },
        {
          title: "Matai aiškų likutį",
          body: "Po mokesčių ir išlaidų. Jokio spėliojimo, jokios buhalterijos.",
        },
      ],
    },
    features: {
      eyebrow: "Galimybės",
      title: "Viskas, ko reikia — niekas, ko nereikia.",
      subtitle:
        "Sukurta būti paprasta. Be lentelių, be kategorijų medžio, be vakarų pildant duomenis.",
      items: [
        {
          title: "Greitas pajamų įrašas",
          body: "Spustelk paslaugą — ir įrašas išsaugotas. Be formų, be klaviatūros.",
        },
        {
          title: "Išlaidų sekimas",
          body: "Nuoma, priemonės ar transportas — visos išlaidos vienoje vietoje.",
        },
        {
          title: "Mokesčių rezervas",
          body: "Nustatai procentą — Monivo paskaičiuoja, kiek verta pasilikti mokesčiams.",
        },
        {
          title: "Įžvalgos ir tendencijos",
          body: "Matai geriausias dienas, populiariausias paslaugas ir kaip sekasi šį mėnesį.",
        },
        {
          title: "Grožio specialistams",
          body: "Nuo paslaugų iki pajamų sekimo — viskas pritaikyta kasdieniam darbui.",
        },
        {
          title: "Mobile-first patirtis",
          body: "Sukurta naudoti telefone — greitai, paprastai ir be nereikalingų žingsnių.",
        },
      ],
    },
    pricing: {
      eyebrow: "Kainos",
      title: "Paprasta kaina. Jokių staigmenų.",
      subtitle: "Monivo sąmoningai paprastas.",
      badge: "Pradžios kaina",
      perMonth: "/ mėn.",
      trialNote: "30 dienų nemokamai · Be kortelės.",
      cta: "Pradėti nemokamai →",
      cancelNote: "Galėsi atšaukti bet kada.",
      features: [
        "Pajamos vienu spustelėjimu",
        "Išlaidos be lentelių",
        "Mokesčių rezervo skaičiavimas",
        "Mėnesio įžvalgos ir tendencijos",
        "Mobile-first patirtis",
        "Be sutarties — atsisakai bet kada",
      ],
    },
    faq: {
      eyebrow: "Dažniausi klausimai",
      title: "Viskas aiškiau prieš pradedant.",
      items: [
        {
          q: "Ar Monivo tinka dirbant su individualia veikla?",
          a: "Taip. Monivo sukurta būtent individualiai dirbantiems grožio specialistams — kai pajamos ateina dalimis (grynais, pavedimu, kortele), o mokesčius už save tvarkaisi pats.",
        },
        {
          q: "Ar reikia buhalterinių žinių?",
          a: "Ne. Monivo nėra apskaitos programa. Visa kalba — paprasta: paslauga, pajamos, išlaidos, mokesčių rezervas. Be sąskaitų plano, be kategorijų medžio.",
        },
        {
          q: "Ar galiu naudoti telefone?",
          a: "Taip. Monivo pirmiausia sukurta telefonui — greitam ir patogiam naudojimui kasdien. Jei patogiau, gali naudoti ir naršyklėje kompiuteryje.",
        },
        {
          q: "Kaip veikia mokesčių rezervas?",
          a: "Tu pasirenki procentą, kurį nori atsidėti mokesčiams. Monivo paskaičiuoja ir parodo, kiek verta atsidėti — pinigai lieka tavo banko sąskaitoje, tu pats sprendi, kada juos perkelti.",
        },
        {
          q: "Ar galiu eksportuoti savo duomenis?",
          a: "Taip. Bet kada gali atsisiųsti savo pajamų ir išlaidų suvestinę CSV formatu — galėsi perduoti buhalteriui arba pasilikti archyvui.",
        },
      ],
      contact: {
        title: "Vis dar turi klausimų?",
        body: "Parašyk mums.",
        sent: "Ačiū — susisieksime greitai.",
        name: "Vardas",
        namePlaceholder: "Vardas",
        email: "El. paštas",
        emailPlaceholder: "vardas@pastas.lt",
        question: "Klausimas",
        questionPlaceholder: "Apie ką norėtum sužinoti?",
        submit: "Susisiekti →",
        sending: "Siunčiama…",
        errorGeneric: "Nepavyko išsiųsti. Pabandyk dar kartą.",
        retry: "Pabandyti dar kartą",
      },
    },
    closing: {
      titleStart: "Žinok, kas iš tikrųjų",
      titleAccent: "tavo",
      body: "Be Excel. Be buhalterinės kalbos. Be streso.",
      cta: "Pradėti nemokamai →",
    },
    footer: {
      brand: "© Monivo",
      privacy: "Privatumas",
      terms: "Sąlygos",
      contact: "Kontaktai",
    },
    legal: {
      updatedPrefix: "Atnaujinta",
      backLead: "Grįžti į",
      backLink: "pagrindinį puslapį",
    },
    privacy: {
      eyebrow: "Privatumas",
      title: "Privatumo nuostatos.",
      updatedAt: "2026-05-17",
      intro:
        "Monivo padeda individualiai dirbantiems grožio specialistams sekti pajamas, išlaidas ir mokesčių rezervą. Šis dokumentas paaiškina, kokius duomenis renkame, kodėl ir kaip juos saugome.",
      h_what: "Kokius duomenis renkame",
      p_what:
        "Renkame tik tuos duomenis, kuriuos įvedate Monivo aplikacijoje: paslaugas, pajamų ir išlaidų įrašus, pasirinktą mokesčių procentą bei registracijos duomenis (el. paštą ir vardą).",
      h_why: "Kam naudojame duomenis",
      p_why:
        "Duomenys naudojami tik tam, kad galėtumėte matyti savo finansinį vaizdą Monivo aplikacijoje. Mes nedaliname duomenų reklamos platformoms ir neparduodame jų tretiesiems asmenims.",
      h_storage: "Saugojimas",
      p_storage:
        "Duomenys saugomi šifruoti Europos Sąjungos serveriuose. Bet kuriuo metu galite juos atsisiųsti CSV formatu arba paprašyti, kad būtų ištrinti.",
      h_contact: "Susisiekimas",
      p_contactA: "Klausimais dėl privatumo susisiekite per ",
      p_contactLink: "kontaktų puslapį",
      p_contactB: ". Atsakome per kelias darbo dienas.",
    },
    terms: {
      eyebrow: "Sąlygos",
      title: "Naudojimo sąlygos.",
      updatedAt: "2026-05-17",
      intro:
        "Naudodami Monivo sutinkate su žemiau išdėstytomis sąlygomis. Jos parašytos paprastai, be juridinės kalbos — kad būtų aišku, ko tikimės iš abiejų pusių.",
      h_what: "Ką Monivo daro",
      p_what:
        "Monivo yra įrankis pajamoms, išlaidoms ir mokesčių rezervui sekti. Tai nėra apskaitos programa ir neatlieka oficialios apskaitos funkcijų.",
      h_notWhat: "Ko Monivo nedaro",
      p_notWhat:
        "Monivo nepatvirtina ir nepateikia mokesčių institucijoms jokių deklaracijų. Mokesčius už savo veiklą tvarkote patys arba per savo buhalterį. Skaičiai Monivo aplikacijoje yra orientaciniai.",
      h_liability: "Atsakomybė",
      p_liability:
        "Stengiamės, kad Monivo veiktų stabiliai ir tiksliai, bet negarantuojame nepertraukiamo veikimo. Rekomenduojame periodiškai eksportuoti savo duomenis.",
      h_changes: "Pakeitimai",
      p_changesA:
        "Jei sąlygos keisis reikšmingai, informuosime prieš įsigaliojant pakeitimams. Klausimais dėl sąlygų susisiekite per ",
      p_changesLink: "kontaktų puslapį",
      p_changesB: ".",
    },
    contact: {
      eyebrow: "Kontaktai",
      title: "Parašykite mums.",
      updatedAt: "2026-05-17",
      intro:
        "Sukūrėme Monivo individualiai dirbantiems grožio specialistams. Jei turite klausimų, pastabų ar pasiūlymų — laukiame žinutės.",
      outro:
        "Jei norite pasidalinti, ko trūksta kasdienybėje, rašykite paprastai — be formalumų ir ilgų paaiškinimų.",
    },
    contactForm: {
      sentEyebrow: "Ačiū",
      sentTitle: "Susisieksime greitai.",
      sentBody: "Žinutė užfiksuota. Atsakome per kelias darbo dienas.",
      name: "Vardas",
      namePlaceholder: "Vardas",
      email: "El. paštas",
      emailPlaceholder: "vardas@pastas.lt",
      subject: "Tema",
      subjectPlaceholder: "Apie ką norite parašyti?",
      message: "Žinutė",
      messagePlaceholder: "Parašykite, ko reikia — atsakysime paprastai.",
      footnote: "Atsakome per kelias darbo dienas. Lietuviškai arba angliškai.",
      submit: "Siųsti žinutę →",
      sending: "Siunčiama…",
      errorGeneric: "Nepavyko išsiųsti. Pabandyk dar kartą.",
      retry: "Pabandyti dar kartą",
    },
  },
  auth: {
    login: {
      eyebrow: "Prisijungimas",
      title: "Pradėk nuo el. pašto.",
      subtitle:
        "Atsiųsime nuorodą — paspaudus ja prisijungsi be slaptažodžio.",
      emailLabel: "El. paštas",
      emailPlaceholder: "vardas@pastas.lt",
      submit: "Siųsti nuorodą →",
      successBody: "Patikrink savo el. paštą — nuoroda išsiųsta į {email}.",
      rateLimited:
        "Per trumpą laiką išsiųsta per daug prisijungimo nuorodų. Palaukite kelias minutes ir bandykite dar kartą.",
      notRegistered: "Paskyros su šiuo el. paštu neradome.",
      notRegisteredCta: "Sukurkite paskyrą nemokamai →",
      footerLead: "Neturi paskyros?",
      footerCta: "Registruokis →",
    },
    register: {
      eyebrow: "Registracija",
      title: "Pradėk 30 dienų nemokamai.",
      subtitle:
        "Be kortelės. Atsiųsime nuorodą — paspaudus ja iškart pateksi į Monivo.",
      nameLabel: "Vardas",
      namePlaceholder: "Vardas (nebūtina)",
      emailLabel: "El. paštas",
      emailPlaceholder: "vardas@pastas.lt",
      submit: "Registruotis →",
      successBody: "Patikrink savo el. paštą — nuoroda išsiųsta į {email}.",
      rateLimited:
        "Per trumpą laiką išsiųsta per daug prisijungimo nuorodų. Palaukite kelias minutes ir bandykite dar kartą.",
      footerLead: "Jau turi paskyrą?",
      footerCta: "Prisijunk →",
      termsLead: "Registruodamasis sutinki su",
      termsLink: "naudojimo sąlygomis",
      termsAnd: "ir",
      privacyLink: "privatumo nuostatomis",
    },
  },
  onboarding: {
    stepCounter: "{current} žingsnis iš {total}",
    stepAria: "Žingsnis {current} iš {total}",
    profession: {
      title: "Kokia tavo sritis?",
      subtitle:
        "Pasirink artimiausią sritį. Vėliau galėsi pridėti konkrečias paslaugas ir kainas.",
      none: "Mano srities nėra",
      cards: {
        hair: { title: "Plaukai", sub: "Kirpimai, dažymai, barberis" },
        nails: {
          title: "Nagai",
          sub: "Manikiūras, pedikiūras, nagų dizainas",
        },
        face: {
          title: "Veidas ir oda",
          sub: "Kosmetologija, blakstienos, antakiai",
        },
        body: {
          title: "Kūno procedūros",
          sub: "Masažai, SPA, kūno procedūros",
        },
      },
    },
    tax: {
      title: "Kiek atidėti mokesčiams?",
      subtitle:
        "Monivo nuo kiekvienos pajamos paskaičiuos, kiek verta atsidėti. Pinigai lieka tavo banko sąskaitoje.",
      customLabel: "Arba įvesk savo",
      customPlaceholder: "Pvz. 27",
      outOfRange: "Įvesk skaičių nuo 0 iki 35.",
    },
    actions: {
      continue: "Tęsti →",
      skip: "Praleisti",
      finish: "Baigti →",
      back: "Atgal",
    },
    footer: "Šiuos pasirinkimus galėsi pakeisti bet kada nustatymuose.",
    errors: { generic: "Įvyko klaida" },
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
      openMenuAria: "Pridėti įrašą",
      closeMenuAria: "Uždaryti pridėjimo meniu",
    },
    errors: { generic: "Įvyko klaida" },
  },
};
