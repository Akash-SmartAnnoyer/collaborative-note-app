'use client'

import { useState } from 'react'
import {
  Card,
  CardBody,
  Button,
  ScrollShadow,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react'
import { History, RotateCcw, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { useNotesStore } from '@/store/notesStore'
import { Note } from '@/types'
import { formatDate, formatRelativeTime } from '@/utils/dateFormatter'

interface VersionHistoryProps {
  note: Note
  isMobile?: boolean
}

export function VersionHistory({ note, isMobile = false }: VersionHistoryProps) {
  const { restoreVersion } = useNotesStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(!isMobile)

  const sortedVersions = [...note.versions].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )

  const handleRestore = (versionId: string) => {
    if (confirm('Are you sure you want to restore this version? This will replace the current content.')) {
      restoreVersion(note.id, versionId)
      onClose()
    }
  }

  const handleViewVersion = (versionId: string) => {
    setSelectedVersion(versionId)
    onOpen()
  }

  const versionToView = sortedVersions.find(v => v.id === selectedVersion)

  return (
    <div className={`flex flex-col ${isMobile ? 'max-h-64' : 'h-full'}`}>
      <div 
        className={`p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${isMobile ? 'cursor-pointer' : ''}`}
        onClick={() => isMobile && setIsExpanded(!isExpanded)}
        role={isMobile ? 'button' : undefined}
        tabIndex={isMobile ? 0 : undefined}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
            Version History
          </h2>
          <Chip size="sm" variant="flat" color="primary" className="text-xs">
            {sortedVersions.length} {sortedVersions.length === 1 ? 'version' : 'versions'}
          </Chip>
        </div>
        {isMobile && (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {(!isMobile || isExpanded) && (
        <ScrollShadow className="flex-1 overflow-y-auto">
        <div className="p-2 sm:p-4">
          {sortedVersions.length === 0 ? (
            <div className="text-center py-8 px-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              No version history yet. Start editing to create versions.
            </div>
          ) : (
            <div className="space-y-2">
              {sortedVersions.map((version, index) => (
                <Card
                  key={version.id}
                  className={`${
                    index === 0 ? 'border-2 border-primary-200 dark:border-primary-800' : ''
                  }`}
                >
                  <CardBody className="p-2 sm:p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-100">
                            Version {version.versionNumber}
                          </span>
                          {index === 0 && (
                            <Chip size="sm" color="primary" variant="flat" className="text-xs">
                              Current
                            </Chip>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-words truncate">
                          <span className="hidden sm:inline">{formatDate(version.timestamp)} </span>
                          ({formatRelativeTime(version.timestamp)})
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate overflow-hidden text-ellipsis">
                          {version.title || 'Untitled'}
                        </p>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <Tooltip content="View version">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleViewVersion(version.id)}
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </Tooltip>
                        {index !== 0 && (
                          <Tooltip content="Restore this version">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="primary"
                              onPress={() => handleRestore(version.id)}
                            >
                              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollShadow>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" classNames={{
        base: "max-w-[95vw] sm:max-w-2xl",
        body: "p-4 sm:p-6"
      }}>
        <ModalContent>
          <ModalHeader>
            Version {versionToView?.versionNumber} - {versionToView && formatDate(versionToView.timestamp)}
          </ModalHeader>
          <ModalBody>
            {versionToView && (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">{versionToView.title}</h3>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: versionToView.content }}
                  />
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Close
            </Button>
            {versionToView && versionToView.id !== sortedVersions[0]?.id && (
              <Button
                color="primary"
                onPress={() => handleRestore(versionToView.id)}
                startContent={<RotateCcw className="w-4 h-4" />}
              >
                Restore This Version
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

