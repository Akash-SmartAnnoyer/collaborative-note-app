// Simulated real-time collaboration using localStorage and storage events
// In a production app, this would use WebSockets or similar

import { Note } from '@/types'

const STORAGE_KEY = 'collaborative_notes'

export class CollaborationManager {
  private onChangeCallback: ((notes: Note[]) => void) | null = null
  private storageListener: ((e: StorageEvent) => void) | null = null

  start(onChange: (notes: Note[]) => void) {
    this.onChangeCallback = onChange
    
    // Listen for storage events (changes from other tabs)
    this.storageListener = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        this.sync(e.newValue)
      }
    }
    
    window.addEventListener('storage', this.storageListener)
    
    // Initial sync
    this.sync()
  }

  stop() {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener)
      this.storageListener = null
    }
    this.onChangeCallback = null
  }

  sync(storedValue?: string | null) {
    try {
      const value = storedValue || localStorage.getItem(STORAGE_KEY)
      if (value) {
        const notes = JSON.parse(value)
        // Convert date strings back to Date objects
        const parsedNotes = notes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
          versions: (note.versions || []).map((v: any) => ({
            ...v,
            timestamp: new Date(v.timestamp)
          }))
        }))
        
        if (this.onChangeCallback) {
          this.onChangeCallback(parsedNotes)
        }
      }
    } catch (error) {
      console.error('Error syncing notes:', error)
    }
  }

  saveNotes(notes: Note[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new Event('localStorage'))
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }
}

export const collaborationManager = new CollaborationManager()

