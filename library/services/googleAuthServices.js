import "react-native-url-polyfill/auto";

import supabase from "../supabase.js";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const getRedirectTo = () => {
  const redirectTo = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL;

  if (!redirectTo) {
    throw new Error("Missing Google OAuth redirect URL in .env.local");
  }

  return redirectTo;
};

const extractParamsFromUrl = (url) => {
  const parsedUrl = new URL(url);

  const queryParams = parsedUrl.searchParams;
  const hashParams = new URLSearchParams(parsedUrl.hash.substring(1));

  const getParam = (key) => hashParams.get(key) ?? queryParams.get(key);

  return {
    access_token: getParam("access_token"),
    refresh_token: getParam("refresh_token"),
    code: getParam("code"),
    error: getParam("error"),
    error_description: getParam("error_description"),
  };
};

export const signInWithGoogle = async () => {
  //* 1. generate google OAuth URL
  const redirectTo = getRedirectTo();
  console.log("OAuth redirect being sent:", redirectTo); //! hays ang hirap idebug

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) throw error;

  if (!data?.url) {
    throw new Error("Google authentication URL was not generated.");
  }

  //* 2. open external browser
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== "success" || !result.url) {
    return {
      cancelled: true,
      type: result.type,
    };
  }

  //* 3. extract authentication response
  const params = extractParamsFromUrl(result.url);

  if (params.error) {
    throw new Error(params.error_description || params.error);
  }

  //* 4. establish Supabase session
  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(
      params.code,
    );

    if (error) throw error;

    return {
      cancelled: false,
      ...data,
    };
  }

  if (!params.access_token || !params.refresh_token) {
    throw new Error("Authentication tokens were not returned.");
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });

  if (sessionError) throw sessionError;

  return {
    cancelled: false,
    ...sessionData,
  };
};
