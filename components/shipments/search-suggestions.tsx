"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, TrendingUp } from "lucide-react"

interface SearchSuggestionsProps {
  query: string
  onSelectSuggestion: (suggestion: string) => void
  recentSearches: string[]
}

const popularSearches = [
  "in-transit",
  "priority shipments",
  "delivered today",
  "express shipping",
  "high priority",
  "overnight delivery",
  "pending confirmation",
  "insured packages",
]

export function SearchSuggestions({ query, onSelectSuggestion, recentSearches }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (query.length > 0) {
      // Filter popular searches based on query
      const filtered = popularSearches.filter((search) => search.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [query])

  if (query.length === 0 && recentSearches.length === 0) return null

  return (
    <Card className="absolute top-full left-0 right-0 z-10 mt-1 shadow-lg">
      <CardContent className="p-2">
        {query.length > 0 && suggestions.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-sm h-8"
                onClick={() => onSelectSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        {query.length === 0 && recentSearches.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Recent Searches
            </div>
            {recentSearches.slice(0, 5).map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-sm h-8"
                onClick={() => onSelectSuggestion(search)}
              >
                {search}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
