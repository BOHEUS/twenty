# Relationship map

Map how people are connected and see it as a graph, for example to build a power map of an account.

## What it adds

- A **Relationship** object linking two people, with a type: _Reports to_, _Influences_ or _Works with_. It shows up in the sidebar under **Relationships**.
- **Relationships to** and **Relationships from** fields on People, to link people straight from a person's page.
- A **Power map** tab on every company: the company's people and the relationships they have, inside and outside the company.
- A **Relationships** tab on every person: the people they are directly connected to.
- A **Relationship map** page in the sidebar with every relationship in the workspace.

Edges point from the **From** person to the **To** person, colored by type. In the graph you can:

- drag the background to move around, and use the zoom and fit buttons in the corner,
- drag a person to rearrange the map,
- click a person (or focus them and press Enter) to open their record.

## Limits

- The graph shows up to 1,000 relationships (and up to 200 people per company). Beyond that a notice says only part of the map is displayed.
- The mouse wheel does not zoom: front components cannot stop the wheel from also scrolling the page, so zooming uses the buttons.
- People you move are not saved: the map is laid out again the next time it loads.
- Custom relationship types added in the data model settings are drawn in gray with their raw value as label.

## Development

```bash
yarn install
yarn twenty dev          # sync the app to your local Twenty server
yarn test:unit           # graph building and layout
yarn test                # integration tests, needs a running server
```
