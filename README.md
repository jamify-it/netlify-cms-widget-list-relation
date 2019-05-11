# @jamify-it/netlify-cms-widget-list-relation

![npm (scoped)](https://img.shields.io/npm/v/@jamify-it/netlify-cms-widget-list-relation.svg)

This is a widget for [Netlify CMS](https://www.netlifycms.org/). 

Standard [relation widget](https://www.netlifycms.org/docs/widgets/relation/) only allows for using folder collection. This widget works with **files collections** instead, or to be more precise, with lists inside those files. See 

[Check out a demo!](https://netlify-cms-widget-list-relation.netlify.com/demo)

## Install

As an npm package:

```shell
npm install --save @jamify-it/netlify-cms-widget-list-relation
```

```js
import { ListRelationControl, ListRelationPreview } from '@jamify-it/netlify-cms-widget-list-relation'

CMS.registerWidget('list-relation', ListRelationControl, ListRelationPreview)
```

## How to use

Add to your Netlify CMS configuration:

```yaml
    fields:
      - name: authors, 
        label: Authors, 
        widget: list-relation
        collection: 
          name: settings # name of the collection
          file: people   # name of the file
          field: authors # key of the field containing a list
        # other settings as in the relation widget
        multiple: true
        searchFields: [name, email]
        valueField: email
        displayField: name
```

This assumes you have a **files collection** named `settings` (see example below).

For info on fields `multiple`, `searchFields`, `valueField` and `displayField`, refer to [relation widget documentation](https://www.netlifycms.org/docs/widgets/relation/).


## Example

File `site/data/settings/people.yml`:

```yaml
authors: 
  - {name: Jane Jones, email: jane.jones@example.com}
  - {name: Dan Doe, email: dan.doe@example.com}
```

File `site/content/projects/summer-project.md`:

```yaml
---
name: My Great Summer Project
authors: [jane.jones@example.com, dan.doe@example.com]
---
```

File `config.yml` (showing only `collections`):

```yaml
collections:
  - name: settings
    label: Settings
    files: 
      - name: people
        label: People
        file: site/data/settings/people.yml
        extension: yml
        fields: 
          - name: authors
            label: Authors
            widget: list
            fields: 
              - {name: name, label: Full name, widget: string}
              - {name: email, label: Email, widget: string}
  - name: projects
    label: Projects
    folder: site/content/projects
    fields: 
      - {name: name, label: Full name, widget: string}
      - name: authors, 
        label: Authors, 
        widget: list-relation
        collection: 
          name: settings
          file: people
          field: authors
        multiple: true
        searchFields: [name, email]
        valueField: email
        displayField: name
```

## Support

For help with this widget, open an [issue](https://github.com/jamify-it/netlify-cms-widget-list-relation) or ask the Netlify CMS community in [Gitter](https://gitter.im/netlify/netlifycms).

## Attributions

- based on [netlify-cms-widget-relation](https://github.com/netlify/netlify-cms/tree/master/packages/netlify-cms-widget-relation) and heavily modified
- project setup from [netlify-cms-widget-starter](https://github.com/netlify/netlify-cms-widget-starter), but needed updating
