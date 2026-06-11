import { useState, useEffect, useCallback } from "react";
import { GAME_PATH, buildGameSearch } from "../components/GameRoute";
import type { AppContextValue, NavigateFn } from "./AppContext";
import { getOnboardingData, setOnboardingData } from "../utils/localStorage";

const BATTLE_PREFIX = '/battle/';
const ROOM_PREFIX = '/room';

const normalize = (p: string) =>
  p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p

export function useAppState(): AppContextValue & {
  isGameRoute: boolean;
  showOnboarding: boolean;
  completeOnboarding: (favouriteIds: number[]) => void;
} {
  const [pathname, setPathname] = useState(() => normalize(window.location.pathname));
  const [searchText, setSearchText] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [favouriteCategories, setFavouriteCategories] = useState<number[]>(
    () => getOnboardingData().favouriteCategoryIds
  );
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    () => !getOnboardingData().completed
  );

  const isGameRoute = pathname === GAME_PATH || pathname.startsWith(BATTLE_PREFIX) || pathname.startsWith(ROOM_PREFIX);

  const navigate = useCallback<NavigateFn>((path, search, replace = false) => {
    const normalized = normalize(path);
    const url = search ? `${normalized}?${search}` : normalized;
    window.scrollTo(0, 0);
    if (replace) {
      window.history.replaceState({}, "", url);
    } else {
      window.history.pushState({}, "", url);
    }
    setPathname(normalized);
  }, []);

  useEffect(() => {
    const onPopState = () => setPathname(normalize(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const onSearchChange = useCallback((text: string) => {
    setSearchText(text);
    if (text.trim() !== "") setSelectedGroupId(null);
  }, []);

  const onGroupSelect = useCallback((groupId: number | null) => {
    setSelectedGroupId(groupId);
    setSearchText("");
  }, []);

  const onPlayClick = useCallback(
    (category: string) => {
      navigate(GAME_PATH, buildGameSearch(category));
    },
    [navigate],
  );

  const completeOnboarding = useCallback((favouriteIds: number[]) => {
    setOnboardingData({ completed: true, favouriteCategoryIds: favouriteIds });
    setFavouriteCategories(favouriteIds);
    setShowOnboarding(false);
  }, []);

  return {
    pathname,
    navigate,
    searchText,
    onSearchChange,
    selectedGroupId,
    onGroupSelect,
    onPlayClick,
    favouriteCategories,
    isGameRoute,
    showOnboarding,
    completeOnboarding,
  };
}
