import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isActiveMember } from "@/lib/membership";
import recipesData from "@/data/recipes.json";

type Recipe = {
  id: string;
  title: string;
  photo: string;
  tags: string[];
  description: string;
  ingredients: string[];
  steps: string[];
};

/**
 * "Meal plans" membership perk. Members get full recipe content; everyone else gets a teaser
 * (title/photo/tags/description only) — ingredients/steps are omitted server-side, not just
 * hidden in the UI, so they never reach a non-member's browser.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isMember = !!user && (await isActiveMember(supabase, user.id));

  const recipes = recipesData as Recipe[];
  if (isMember) {
    return NextResponse.json({ recipes, isMember });
  }

  const teaser = recipes.map(({ ingredients: _ingredients, steps: _steps, ...safe }) => safe);
  return NextResponse.json({ recipes: teaser, isMember });
}
