declare module '@monaco-editor/react' {
  import * as monaco from 'monaco-editor'
  import { ComponentType } from 'react'

  interface EditorProps {
    height?: string | number
    width?: string | number
    defaultLanguage?: string
    defaultValue?: string
    value?: string
    language?: string
    theme?: string
    line?: number
    loading?: string | ComponentType
    options?: monaco.editor.IStandaloneEditorConstructionOptions
    overrideServices?: monaco.editor.IEditorOverrideServices
    keepCurrentModel?: boolean
    saveViewState?: boolean
    beforeMount?: (monaco: typeof import('monaco-editor')) => void
    onMount?: (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => void
    onChange?: (value: string | undefined, event: monaco.editor.IModelContentChangedEvent) => void
    onValidate?: (markers: monaco.editor.IMarker[]) => void
  }

  const Editor: ComponentType<EditorProps>
  export default Editor
}