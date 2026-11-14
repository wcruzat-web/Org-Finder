import { supabase } from "../library/supabase";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectTo = "orgfinder://google-auth";
  
  const { data, error } = await supabase.auth.signInWithOAuth(
    {
      provider: "google",
    },
    {
      options: {
        skipBrowserRedirect: true,
        queryParams: {
          prompt: "select_account",
        },
      },
    },
  );
}
