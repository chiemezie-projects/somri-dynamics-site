import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { DEFAULT_COPY } from "@/lib/content"
import type { SiteCopy } from "@/lib/types"
import { store } from "@/lib/store"

interface CopyState {
  copy: SiteCopy
  loading: boolean
  refresh: () => Promise<void>
}

const CopyContext = createContext<CopyState>({
  copy: DEFAULT_COPY,
  loading: true,
  refresh: async () => {},
})

export function CopyProvider({ children }: { children: ReactNode }) {
  const [copy, setCopy] = useState<SiteCopy>(DEFAULT_COPY)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      setCopy(await store.getCopy())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void refresh() }, [])

  return <CopyContext.Provider value={{ copy, loading, refresh }}>{children}</CopyContext.Provider>
}

export function useCopy() {
  return useContext(CopyContext)
}
