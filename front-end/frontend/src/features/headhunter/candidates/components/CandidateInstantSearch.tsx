import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock } from "lucide-react";
import { Button } from "@/shared/ui-primitives/button";
import { Input } from "@/shared/ui-primitives/input";
import { useAuth } from "@/features/auth/context/useAuth";
import { useSearchBarTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";
import type { CandidateSuggestion } from "../types";
import { searchCandidates } from "../services/candidateSearchApi";

const MAX_HISTORY = 5;
const DEBOUNCE_MS = 3500;

const sanitizeSearchInput = (value: string): string => {
  if (!value) return "";
  const withoutTags = value
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/[<>]/g, "");
  let cleaned = "";
  let lastWasSpace = false;

  for (let i = 0; i < withoutTags.length; i += 1) {
    const ch = withoutTags[i];
    const code = ch.charCodeAt(0);
    if (code < 32 || code === 127) continue;
    if (/\s/.test(ch)) {
      if (!lastWasSpace) {
        cleaned += " ";
        lastWasSpace = true;
      }
      continue;
    }
    lastWasSpace = false;
    cleaned += ch;
  }

  return cleaned.trim();
};

const normalizeText = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const buildNormalizedMap = (value: string) => {
  let normalized = "";
  const map: number[] = [];

  for (let i = 0; i < value.length; i += 1) {
    const normalizedChar = normalizeText(value[i]);
    if (!normalizedChar) continue;
    for (let j = 0; j < normalizedChar.length; j += 1) {
      normalized += normalizedChar[j];
      map.push(i);
    }
  }

  return { normalized, map };
};

const mergeRanges = (ranges: Array<[number, number]>) => {
  if (ranges.length === 0) return ranges;
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [sorted[0]];

  for (let i = 1; i < sorted.length; i += 1) {
    const [start, end] = sorted[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  return merged;
};

const findHighlightRanges = (value: string, query: string) => {
  if (!query) return [] as Array<[number, number]>;
  const normQuery = normalizeText(query.toLowerCase());
  if (!normQuery) return [] as Array<[number, number]>;

  const { normalized, map } = buildNormalizedMap(value.toLowerCase());
  if (!normalized) return [] as Array<[number, number]>;

  const ranges: Array<[number, number]> = [];
  let index = normalized.indexOf(normQuery);
  while (index !== -1) {
    const start = map[index];
    const end = map[index + normQuery.length - 1] + 1;
    ranges.push([start, end]);
    index = normalized.indexOf(normQuery, index + normQuery.length);
  }

  return mergeRanges(ranges);
};

const renderHighlighted = (value: string, query: string) => {
  const ranges = findHighlightRanges(value, query);
  if (ranges.length === 0) return value;

  const parts: Array<string | JSX.Element> = [];
  let lastIndex = 0;

  ranges.forEach(([start, end], idx) => {
    if (start > lastIndex) {
      parts.push(value.slice(lastIndex, start));
    }
    parts.push(
      <mark
        key={`${start}-${end}-${idx}`}
        className={`rounded ${getSemanticClass("warning", "bg", true)} px-0.5 font-semibold text-slate-900`}
      >
        {value.slice(start, end)}
      </mark>
    );
    lastIndex = end;
  });

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
};

const isAbortError = (error: unknown) => {
  const maybe = error as { name?: string; code?: string };
  return (
    maybe?.name === "CanceledError" ||
    maybe?.name === "AbortError" ||
    maybe?.code === "ERR_CANCELED"
  );
};

export function CandidateInstantSearch() {
  const { t } = useSearchBarTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [results, setResults] = useState<CandidateSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  const historyKey = useMemo(() => {
    return user?.id
      ? `candidate_search_history_${user.id}`
      : "candidate_search_history";
  }, [user?.id]);

  const sanitizedKeyword = useMemo(
    () => sanitizeSearchInput(keyword),
    [keyword]
  );
  const isQueryDirty = sanitizedKeyword !== activeQuery;

  const runSearch = (rawValue: string) => {
    const nextQuery = sanitizeSearchInput(rawValue);
    if (!nextQuery) {
      abortRef.current?.abort();
      requestIdRef.current += 1;
      setActiveQuery("");
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    setActiveQuery(nextQuery);
  };

  useEffect(() => {
    if (!open) return;
    const stored = localStorage.getItem(historyKey);
    setRecent(stored ? JSON.parse(stored) : []);
  }, [open, historyKey]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!sanitizedKeyword) {
      if (activeQuery) {
        runSearch("");
      }
      return;
    }

    if (!isQueryDirty) return;

    debounceRef.current = window.setTimeout(() => {
      runSearch(sanitizedKeyword);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [activeQuery, isQueryDirty, open, sanitizedKeyword]);

  useEffect(() => {
    if (!open) return;

    if (!activeQuery) {
      abortRef.current?.abort();
      requestIdRef.current += 1;
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        const data = await searchCandidates({
          keyword: activeQuery,
          limit: 10,
          signal: controller.signal,
        });
        if (requestIdRef.current !== requestId) return;
        setResults(data);
      } catch (err) {
        if (requestIdRef.current !== requestId) return;
        if (!isAbortError(err)) {
          setError(t("loadFailed"));
          setResults([]);
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    void run();
  }, [open, activeQuery, t]);

  useEffect(() => {
    if (open) return;
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    abortRef.current?.abort();
    requestIdRef.current += 1;
    setActiveQuery("");
    setKeyword("");
    setResults([]);
    setLoading(false);
    setError(null);
  }, [open]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        if (isEditable) return;
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
      abortRef.current?.abort();
    };
  }, []);

  const persistHistory = (value: string) => {
    if (!value) return;
    const next = [value, ...recent.filter((item) => item !== value)].slice(
      0,
      MAX_HISTORY
    );
    setRecent(next);
    localStorage.setItem(historyKey, JSON.stringify(next));
  };

  const handleSelect = (candidate: CandidateSuggestion) => {
    const historyTerm = activeQuery || sanitizedKeyword;
    if (historyTerm) {
      persistHistory(historyTerm);
    }
    setOpen(false);
    navigate(`/headhunter/candidates/${candidate.id}`, {
      state: { candidate },
    });
  };

  const handleSearch = (value: string) => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    runSearch(value);
  };

  const handleSubmit = () => {
    if (!sanitizedKeyword) return;
    if (!isQueryDirty && results.length > 0) {
      handleSelect(results[0]);
      return;
    }
    handleSearch(sanitizedKeyword);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="hidden items-center gap-2 rounded-full border-slate-200 text-sm font-medium text-slate-600 shadow-sm md:flex w-full h-12 text-left"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>{t("openSearch")}</span>
        <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500">
          {t("shortcut")}
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label={t("openSearch")}
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-black/40"
            onClick={() => setOpen(false)}
            aria-label={t("close")}
          />

          <div className="relative z-10 flex items-start justify-center p-4">
            <div className="mt-16 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  ref={inputRef}
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder={t("candidatePlaceholder")}
                  className="border-none px-0 text-lg focus-visible:ring-0 w-full h-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch(sanitizedKeyword)}
                  disabled={!sanitizedKeyword || loading}
                >
                  {t("search")}
                </Button>
                {keyword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("clear")}
                    onClick={() => {
                      setKeyword("");
                      runSearch("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="max-h-[60vh] overflow-auto px-4 py-3">
                {!sanitizedKeyword && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("recent")}
                    </div>
                    {recent.length === 0 ? (
                      <p className="text-sm text-slate-500">{t("noRecent")}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {recent.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setKeyword(term);
                              handleSearch(term);
                            }}
                            className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-slate-300 hover:text-slate-800"
                          >
                            <Clock className="h-3 w-3" />
                            {term}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {sanitizedKeyword && isQueryDirty && (
                  <p className="text-sm text-slate-500">{t("searchHint")}</p>
                )}

                {activeQuery && !isQueryDirty && loading && (
                  <p className="text-sm text-slate-500">{t("loading")}</p>
                )}

                {activeQuery && !isQueryDirty && error && (
                  <p
                    className={`text-sm ${getSemanticClass("danger", "text", true)}`}
                  >
                    {error}
                  </p>
                )}

                {activeQuery &&
                  !isQueryDirty &&
                  !loading &&
                  !error &&
                  results.length === 0 && (
                    <p className="text-sm text-slate-500">{t("noResults")}</p>
                  )}

                {activeQuery && !isQueryDirty && results.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {results.map((candidate) => (
                      <li key={candidate.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(candidate)}
                          className={`w-full rounded-xl border border-slate-100 px-4 py-3 text-left transition ${`hover:${getSemanticClass("success", "border", true).split(" ")[0]}`} hover:bg-emerald-50/40`}
                        >
                          <div className="text-sm font-semibold text-slate-900">
                            {renderHighlighted(
                              candidate.fullName || "",
                              activeQuery
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                            <span>
                              {renderHighlighted(
                                candidate.email || "",
                                activeQuery
                              )}
                            </span>
                            {candidate.phone && (
                              <span>
                                {renderHighlighted(
                                  candidate.phone,
                                  activeQuery
                                )}
                              </span>
                            )}
                          </div>
                          {candidate.skills && candidate.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {candidate.skills.slice(0, 5).map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                                >
                                  {renderHighlighted(skill, activeQuery)}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

