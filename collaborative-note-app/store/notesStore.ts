import { create } from 'zustand'
import { Note, NoteVersion } from '@/types'

interface NotesState {
  notes: Note[]
  selectedNoteId: string | null
  addNote: (note: Note) => void
  updateNote: (id: string, title: string, content: string) => void
  deleteNote: (id: string) => void
  selectNote: (id: string | null) => void
  addVersion: (noteId: string, version: NoteVersion) => void
  restoreVersion: (noteId: string, versionId: string) => void
}

// Generate a random color for user identification
const generateUserColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  selectedNoteId: null,
  
  addNote: (note) => {
    // Ensure note has an initial version if it doesn't have versions
    const noteWithVersion = note.versions && note.versions.length > 0
      ? note
      : {
          ...note,
          versions: [{
            id: `v-${Date.now()}`,
            noteId: note.id,
            title: note.title,
            content: note.content,
            timestamp: note.createdAt,
            versionNumber: 1
          }]
        }
    
    return set((state) => ({
      notes: [...state.notes, noteWithVersion],
      selectedNoteId: noteWithVersion.id
    }))
  },
  
  updateNote: (id, title, content) => set((state) => {
    const note = state.notes.find(n => n.id === id)
    if (!note) return state
    
    const newVersion: NoteVersion = {
      id: `v-${Date.now()}`,
      noteId: id,
      title,
      content,
      timestamp: new Date(),
      versionNumber: note.versions.length + 1
    }
    
    return {
      notes: state.notes.map(n =>
        n.id === id
          ? {
              ...n,
              title,
              content,
              updatedAt: new Date(),
              versions: [...n.versions, newVersion]
            }
          : n
      )
    }
  }),
  
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(n => n.id !== id),
    selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId
  })),
  
  selectNote: (id) => set({ selectedNoteId: id }),
  
  addVersion: (noteId, version) => set((state) => ({
    notes: state.notes.map(n =>
      n.id === noteId
        ? { ...n, versions: [...n.versions, version] }
        : n
    )
  })),
  
  restoreVersion: (noteId, versionId) => set((state) => {
    const note = state.notes.find(n => n.id === noteId)
    if (!note) return state
    
    const version = note.versions.find(v => v.id === versionId)
    if (!version) return state
    
    // Create a new version when restoring
    const restoredVersion: NoteVersion = {
      id: `v-${Date.now()}`,
      noteId: noteId,
      title: version.title,
      content: version.content,
      timestamp: new Date(),
      versionNumber: note.versions.length + 1
    }
    
    return {
      notes: state.notes.map(n =>
        n.id === noteId
          ? {
              ...n,
              title: version.title,
              content: version.content,
              updatedAt: new Date(),
              versions: [...n.versions, restoredVersion]
            }
          : n
      )
    }
  })
}))

