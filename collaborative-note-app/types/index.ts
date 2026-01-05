export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  versions: NoteVersion[]
}

export interface NoteVersion {
  id: string
  noteId: string
  title: string
  content: string
  timestamp: Date
  versionNumber: number
}

export interface User {
  id: string
  name: string
  color: string
}

