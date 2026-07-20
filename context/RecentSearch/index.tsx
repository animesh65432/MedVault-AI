import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useEffect, useState } from "react"

const RECENT_SEARCHES_KEY = "recentSearches"

const RecentSearchContext = createContext<{
    recentSearches: string[],
    addRecentSearch: (search: string) => void,
    clearRecentSearches: () => void,
}>({
    recentSearches: [],
    addRecentSearch: () => { },
    clearRecentSearches: () => { },
})

type Props = {
    children: React.ReactNode
}

const RecentSearchProvider: React.FC<Props> = ({ children }) => {
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    const addRecentSearch = (search: string) => {
        setRecentSearches(prev => {
            const newSearches = [search, ...prev.filter(s => s !== search)]
            return newSearches.slice(0, 4)
        })
    }

    const clearRecentSearches = () => {
        setRecentSearches([])
    }

    useEffect(() => {
        const loadRecentSearches = async () => {
            try {
                const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY)
                if (stored) {
                    setRecentSearches(JSON.parse(stored))
                }
            } catch (e) {
                console.error("Failed to load recent searches", e)
            } finally {
                setIsLoaded(true)
            }
        }
        loadRecentSearches()
    }, [])

    useEffect(() => {
        if (!isLoaded) return
        AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches)).catch(e =>
            console.log("Failed to save recent searches", e)
        )
    }, [recentSearches, isLoaded])

    return (
        <RecentSearchContext.Provider value={{ recentSearches, addRecentSearch, clearRecentSearches }}>
            {children}
        </RecentSearchContext.Provider>
    )
}

export { RecentSearchContext, RecentSearchProvider }
