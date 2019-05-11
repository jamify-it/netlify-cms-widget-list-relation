import ListRelationControl from './Control'
import ListRelationPreview from './Preview'

if (typeof window !== 'undefined') {
  window.ListRelationControl = ListRelationControl
  window.ListRelationPreview = ListRelationPreview
}

export { ListRelationControl, ListRelationPreview }
