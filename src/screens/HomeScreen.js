import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppInput, AppText } from "../components/ui";
import { OrgCard } from "../components/cards";
import { layout } from "../styles/style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import ParallaxHeaderScrollView from "../components/ParallaxHeaderScrollView";
import theme from "../styles/theme-dark";
import HEADER_LAYERS from "../../assets/header/HeaderLayers.js";

import supabase from "../../library/supabase.js";

const { colors, spacing } = theme;

const GREETINGS = [
  "Hello",
  "Hi",
  "Hey",
  "Greetings",
  "Welcome Back",
  "Good to see you",
  "Merry Christmas",
];

const SUBTITLE = [
  "What would you like to do today?",
  "What's the constellation today?",
  "How have you been?",
  "Feeling fancy today?",
  "Nothing beats a morning with a cup of coffee.",
  "Friendly Reminder, You matter.",
];

export default function HomeScreen() {

  const navigation = useNavigation();

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navHeaderHeight = useHeaderHeight();
  const headerHeight = width * (219.071 / 390) + insets.top;

  const [fullName, setFullName] = React.useState("");
  const [greeting, setGreeting] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [browseOrganizations, setBrowseOrganizations] = useState([]);

  //para sa ai huhu
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationError, setRecommendationError] = useState(null);

  useEffect(() => {
    const randomGreeting =
      GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setGreeting(randomGreeting);

    const randomSubtitle =
      SUBTITLE[Math.floor(Math.random() * SUBTITLE.length)];
    setSubtitle(randomSubtitle);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) throw new Error("No user found");

        const { data, error } = await supabase
          .from("accounts")
          .select("full_name")
          .eq("auth_user_id", user.id)
          .single();

        if (error) throw error;

        setFullName(data.full_name);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUser();
  }, []);

  //para sa recos
  const fetchRecommendations = async () => {
    try {
      setRecommendationError(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) throw new Error("No active session found");

      const response = await fetch(
        "https://org-finder-backend.onrender.com/api/recommendations",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch recommendations");
      }
      // console.log("API result:", JSON.stringify(result, null, 2));
      setRecommendations(result.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
      setRecommendationError(error.message);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  //fetch ng pang user for data ng organizations

  useEffect(() => {
    const fetchBrowsedOrganizations = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) throw new Error("No user found");

        //! pang fetch ng studnet course
        const { data: account, error: accountError } = await supabase
          .from("accounts")
          .select("course")
          .eq("auth_user_id", user.id)
          .single();

        if (accountError) throw accountError;
        if (!account.course) {
          setBrowseOrganizations([]);
          return;
        }

        const { data: eligibleOrganizations, error: organizationsError } =
          await supabase
            .from("organizations")
            .select("*")
            .or(
              `course_eligibility.eq.all,and(course_eligibility.eq.specific,eligible_courses.cs.{${account.course}})`,
            );

        if (organizationsError) throw organizationsError;

        const { data: countData, error: countError } = await supabase.rpc(
          "get_organization_member_counts",
        );

        if (countError) throw countError;

        const organizationWithCounts = eligibleOrganizations.map((org) => {
          const count = countData.find((c) => c.organization_id === org.id);

          return {
            ...org,
            memberCount: count?.member_count ?? 0,
          };
        });

        //pang shuffle ng organizations
        for (let i = organizationWithCounts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));

          [organizationWithCounts[i], organizationWithCounts[j]] = [
            organizationWithCounts[j],
            organizationWithCounts[i],
          ];
        }

        //random select to guysm 3-4 sha
        const randomCount = Math.floor(Math.random() * 2) + 4;

        setBrowseOrganizations(organizationWithCounts.slice(0, randomCount));
      } catch (error) {
        console.error("Error fetching browsed organizations:", error.message);
        setBrowseOrganizations([]);
      }
    };
    fetchBrowsedOrganizations();
  }, []);

  return (
    <ParallaxHeaderScrollView
      layers={HEADER_LAYERS}
      headerHeight={headerHeight}
      headerContent={
        <>
          <View style={layout.gutter}>
            <AppText variant="headline">
              {greeting}, {fullName ? fullName.trim().split(/\s+/)[0] : "User"}!
            </AppText>
            <AppText variant="subtitle">{subtitle}</AppText>
          </View>
        </>
      }
    >
      <View style={layout.content}>
        <AppInput variant="search" onFilterPress={() => {}} />
      </View>
      <View style={layout.content}>
        <AppText variant="heading">Recommended for you</AppText>
        {Array.isArray(recommendations) && recommendations.length > 0 ? (
          recommendations.map((org) => (
            <OrgCard
              key={org.id}
              variant="featured"
              name={org.name}
              tags={[org.category]}
              description={org.reason}
              tag="Recommended"
              slots={org.memberCount}
            />
          ))
        ) : (
          <AppText variant="caption">No recommendation available.</AppText>
        )}
      </View>
      <View style={layout.content}>
        <View style={layout.row}>
          <AppText variant="heading">Browse organizations</AppText>
          <TouchableOpacity onPress={null}>
            <AppText variant="link">See All</AppText>
          </TouchableOpacity>
        </View>
        {browseOrganizations.map((org, index) => (
          <OrgCard
            key={org.id}
            name={org.name}
            tags={[org.category, org.subcategory]}
            description={org.description}
            memberCount={org.memberCount}
            onPress={() => navigation.navigate("OrgDetail", { org })}
          />
        ))}
      </View>
    </ParallaxHeaderScrollView>
  );
}