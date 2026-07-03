/** Fictional demo identities — swap here to re-skin the entire app. */

export const primaryUser = {
  name: "Alex Morgan",
  firstName: "Alex",
  email: "alex@meridian.dev",
  handle: "@alexmorgan",
  githubUsername: "alexmorgan",
  eventsCalendar: "events@meridian.dev",
} as const;

export const teamMembers = {
  riley: {
    id: "riley",
    name: "Riley Chen",
    email: "riley@meridian.dev",
    handle: "@rileychen",
    slackId: "riley-chen",
  },
  jordan: {
    id: "jordan",
    name: "Jordan Hayes",
    email: "jordan@meridian.dev",
    handle: "@jordanhayes",
    slackId: "jordan-hayes",
  },
  sam: {
    id: "sam",
    name: "Sam Patel",
    email: "sam@meridian.dev",
    handle: "@sampatel",
    slackId: "sam-patel",
  },
  casey: {
    id: "casey",
    name: "Casey Walsh",
    email: "casey.walsh@meridian.dev",
    handle: "@caseywalsh",
    slackId: "casey-walsh",
  },
} as const;

export const groups = {
  productTeam: "Product Team",
  meridianBot: "Meridian Bot",
  meridianDesignHandle: "@meridiandesign",
  meridianBotHandle: "@meridianbot",
} as const;

export const companies = {
  employer: "Meridian Labs",
  emailDomain: "meridian.dev",
  ticketProduct: "Pixel Lab",
  analytics: "Harbor Analytics",
  analyticsHandle: "@harboranalytics",
} as const;

export const settingsUser = {
  name: "Stargazer",
  username: "stargazer3000",
  email: "stargazer@gmail.com",
} as const;
