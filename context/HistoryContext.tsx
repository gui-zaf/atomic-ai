import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../types";

// Types for history entries
export interface HistoryItem {
  id: string;
  timestamp: Date;
  type: "simulated" | "image" | "error";
  prompt?: string;
  response?: string;
  error?: string;
  tokensUsed: number;
  model?: string;
  expanded?: boolean;
}

interface HistoryContextType {
  historyItems: HistoryItem[];
  addHistoryItem: (item: HistoryItem) => void;
  deleteHistoryItem: (id: string) => void;
  toggleExpandItem: (id: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Load history from storage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem("history");
        if (storedHistory) {
          // Parse dates from JSON
          const parsed = JSON.parse(storedHistory);
          const itemsWithDates = parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
          setHistoryItems(itemsWithDates);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };

    loadHistory();
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem("history", JSON.stringify(historyItems));
      } catch (error) {
        console.error("Failed to save history:", error);
      }
    };

    saveHistory();
  }, [historyItems]);

  const addHistoryItem = (item: HistoryItem) => {
    setHistoryItems((prev) => [item, ...prev]); // Add to the beginning
  };

  const deleteHistoryItem = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleExpandItem = (id: string) => {
    setHistoryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item,
      ),
    );
  };

  const clearHistory = () => {
    setHistoryItems([]);
  };

  return (
    <HistoryContext.Provider
      value={{
        historyItems,
        addHistoryItem,
        deleteHistoryItem,
        toggleExpandItem,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
