import { useEffect, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { t, useSelectedRecordIds } from 'twenty-sdk/front-component';
import { useTheme } from 'twenty-ui/theme-constants';
import 'twenty-ui/style.css';

import { RELATIONSHIP_TYPES } from 'src/constants/relationship-types';
import { RelationshipGraphCanvas } from 'src/front-components/components/RelationshipGraphCanvas';
import {
  type RelationshipGraph,
  type RelationshipGraphScope,
} from 'src/front-components/types/relationship-graph.type';
import {
  computeGraphLayout,
  type GraphLayout,
} from 'src/front-components/utils/compute-graph-layout';
import { fetchRelationshipGraph } from 'src/front-components/utils/fetch-relationship-graph';

type GraphState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; graph: RelationshipGraph; layout: GraphLayout };

type RelationshipMapProps = {
  scope: RelationshipGraphScope;
};

export const RelationshipMap = ({ scope }: RelationshipMapProps) => {
  const theme = useTheme();
  const [recordId = null] = useSelectedRecordIds();
  const [graphState, setGraphState] = useState<GraphState>({
    status: 'loading',
  });

  useEffect(() => {
    let isCancelled = false;

    setGraphState({ status: 'loading' });

    fetchRelationshipGraph({ client: new CoreApiClient(), scope, recordId })
      .then((graph) => {
        if (!isCancelled) {
          setGraphState({
            status: 'loaded',
            graph,
            layout: computeGraphLayout(graph),
          });
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setGraphState({ status: 'error' });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [scope, recordId]);

  const containerStyle = {
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing[2],
    height: '100%',
    minHeight: 320,
    padding: theme.spacing[3],
    width: '100%',
    color: theme.font.color.primary,
    fontFamily: theme.font.family,
    fontSize: theme.font.size.sm,
  };

  const messageStyle = {
    ...containerStyle,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.font.color.tertiary,
  };

  if (graphState.status === 'loading') {
    return <div style={messageStyle}>{t('Loading relationships')}</div>;
  }

  if (graphState.status === 'error') {
    return <div style={messageStyle}>{t('Could not load relationships.')}</div>;
  }

  const { graph, layout } = graphState;

  if (graph.nodes.length === 0) {
    return (
      <div style={messageStyle}>
        {t(
          'No relationships yet. Link people with the "Relationships to" field on a person.',
        )}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: theme.spacing[3],
          color: theme.font.color.secondary,
          fontSize: theme.font.size.xs,
        }}
      >
        {RELATIONSHIP_TYPES.map(({ value, label, color }) => (
          <span
            key={value}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: theme.spacing[1],
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: theme.color[color],
              }}
            />
            {label}
          </span>
        ))}
        {graph.isTruncated && (
          <span style={{ color: theme.font.color.tertiary }}>
            {t(
              'Too many relationships to show at once, only part of the map is displayed.',
            )}
          </span>
        )}
        <span style={{ marginLeft: 'auto', color: theme.font.color.tertiary }}>
          {t('Drag to move around or rearrange people. Click a person to open them.')}
        </span>
      </div>
      <RelationshipGraphCanvas graph={graph} layout={layout} />
    </div>
  );
};
