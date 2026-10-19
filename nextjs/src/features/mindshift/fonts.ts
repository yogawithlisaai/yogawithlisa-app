import { Cormorant_Garamond } from "next/font/google";

/**
 * MindShift's brand guide (Appendix A) calls for Cormorant Garamond headings, distinct from the
 * rest of the app's Playfair Display. Loaded here rather than the root layout so it's only ever
 * fetched/applied on this route — see mindshift-brand.module.css for how it's scoped.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500"],
  variable: "--font-cormorant",
});
