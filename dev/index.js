import './bootstrap.js'
import CMS, { init } from 'netlify-cms'
import 'netlify-cms/dist/cms.css'
import { ListRelationControl, ListRelationPreview } from '../src'

window.repoFiles = {
  site: {
    data: {
      settings: {
        'people.yml': {
          content: 'authors:\n  - {name: Jane Jones, email: jane.jones@example.com}\n  - {name: Dan Doe, email: dan.doe@example.com}'
        }
      }
    }
  },
  'site/content/projects': {
    'summer-project.md': {
      content: '---\ntitle: My Great Summer Project\nauthors: [jane.jones@example.com, dan.doe@example.com]\n---'
    }
  }
};

CMS.registerWidget('list-relation', ListRelationControl, ListRelationPreview)

init();
