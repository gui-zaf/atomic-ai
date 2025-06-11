import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TokenContextType {
  tokens: number;
  isRecharging: boolean;
  rechargeTimeRemaining: number;
  decrementToken: () => boolean;
  resetTokens: () => void;
  addTokens: (amount: number) => void;
}

const INITIAL_TOKENS = 10;
const RECHARGE_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState(INITIAL_TOKENS);
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeTimeRemaining, setRechargeTimeRemaining] = useState(0);
  const [rechargeEndTime, setRechargeEndTime] = useState<number | null>(null);

  // Load token state from storage
  useEffect(() => {
    const loadTokenState = async () => {
      try {
        const storedTokens = await AsyncStorage.getItem('tokens');
        const storedRechargeEndTime = await AsyncStorage.getItem('rechargeEndTime');
        
        if (storedTokens) {
          setTokens(parseInt(storedTokens, 10));
        }
        
        if (storedRechargeEndTime) {
          const endTime = parseInt(storedRechargeEndTime, 10);
          setRechargeEndTime(endTime);
          
          if (endTime > Date.now()) {
            setIsRecharging(true);
          }
        }
      } catch (error) {
        console.error('Failed to load token state:', error);
      }
    };
    
    loadTokenState();
  }, []);

  // Timer for countdown
  useEffect(() => {
    if (!isRecharging) return;
    
    const intervalId = setInterval(() => {
      if (!rechargeEndTime) return;
      
      const remaining = rechargeEndTime - Date.now();
      
      if (remaining <= 0) {
        setIsRecharging(false);
        setRechargeTimeRemaining(0);
        setRechargeEndTime(null);
        setTokens(INITIAL_TOKENS);
        AsyncStorage.setItem('tokens', INITIAL_TOKENS.toString());
        AsyncStorage.removeItem('rechargeEndTime');
        clearInterval(intervalId);
      } else {
        setRechargeTimeRemaining(remaining);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isRecharging, rechargeEndTime]);

  const decrementToken = () => {
    if (tokens <= 0) return false;
    
    const newTokens = tokens - 1;
    setTokens(newTokens);
    AsyncStorage.setItem('tokens', newTokens.toString());
    
    if (newTokens === 0 && !isRecharging) {
      const endTime = Date.now() + RECHARGE_TIME;
      setRechargeEndTime(endTime);
      setRechargeTimeRemaining(RECHARGE_TIME);
      setIsRecharging(true);
      AsyncStorage.setItem('rechargeEndTime', endTime.toString());
    }
    
    return true;
  };

  const resetTokens = () => {
    // Reset cooldown and give 10 tokens
    const newTokens = tokens + 10;
    setTokens(newTokens);
    
    // Reset recharge state if needed
    if (isRecharging) {
      setIsRecharging(false);
      setRechargeTimeRemaining(0);
      setRechargeEndTime(null);
      AsyncStorage.removeItem('rechargeEndTime');
    }
    
    // Save to storage
    AsyncStorage.setItem('tokens', newTokens.toString());
  };

  const addTokens = (amount: number) => {
    // Add specified amount of tokens
    const newTokens = tokens + amount;
    setTokens(newTokens);
    
    // Reset recharge state if needed
    if (isRecharging) {
      setIsRecharging(false);
      setRechargeTimeRemaining(0);
      setRechargeEndTime(null);
      AsyncStorage.removeItem('rechargeEndTime');
    }
    
    // Save to storage
    AsyncStorage.setItem('tokens', newTokens.toString());
  };

  return (
    <TokenContext.Provider value={{ 
      tokens, 
      isRecharging, 
      rechargeTimeRemaining, 
      decrementToken,
      resetTokens,
      addTokens
    }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}; 