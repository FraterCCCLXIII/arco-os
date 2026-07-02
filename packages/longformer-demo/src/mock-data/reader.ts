import type { Ebook } from "longformer-ui";

export const readerBooks: Ebook[] = [
  {
    id: "book-1",
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    progressPercent: 42,
    chapters: [
      {
        id: "ch-1",
        title: "A Parade in Erhenrang",
        content:
          "I'll make my report as if I told a story, for I was taught as a child on my homeworld that Truth is a matter of the imagination.\n\nThe men of Winter are all alike in appearance. They are tall and long-limbed, with fair skin and light hair. Their voices are soft, and they move with a certain grace that I have never seen in men of my own world.\n\nI arrived on Gethen in the first month of spring. The snow was melting in the streets of Erhenrang, and the air smelled of wet stone and new growth.",
      },
      {
        id: "ch-2",
        title: "Winter's King",
        content:
          "The king was dead. The news traveled quickly through the palace corridors, carried by whisper and gesture rather than spoken word.\n\nIn Karhide, death is not spoken of directly. One says that a person has gone into the darkness, or has left the hearth. The customs of mourning are elaborate and precise.",
      },
    ],
  },
  {
    id: "book-2",
    title: "Project Hail Mary",
    author: "Andy Weir",
    progressPercent: 78,
    chapters: [
      {
        id: "ch-1",
        title: "Chapter 1",
        content:
          "What's two plus two?\n\nI blink. The question hangs in the sterile white air of the room. My mouth is dry. There's a tube in my arm and another one somewhere I don't want to think about.\n\nFour. The answer is four. Why is that so hard?",
      },
    ],
  },
  {
    id: "book-3",
    title: "Design Systems Handbook",
    author: "Longformer Press",
    progressPercent: 12,
    chapters: [
      {
        id: "ch-1",
        title: "Tokens First",
        content:
          "A design system is only as portable as its tokens. Colors, spacing, typography, and elevation should be expressed as named variables before any component is built.\n\nWhen tokens are consistent, components compose naturally. When they drift, every new screen becomes a negotiation.",
      },
    ],
  },
];
