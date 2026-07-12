import { CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

const client = new CoreApiClient();

const findByKey = async (key: string) => {
  const { kvStores } = await client.query({
    kvStores: {
      __args: { filter: { key: { eq: key } }, first: 1 },
      edges: { node: { id: true, value: true } },
    },
  });

  return kvStores?.edges[0]?.node;
};

export const getAll = async () => {
  const { kvStores } = await client.query({
    kvStores: {
      __args: {
        orderBy: null // {createdAt: "AscNullsFirst"}
      },
      edges: { node: { key: true }},
    },
  });

  return kvStores?.edges.map((edge: any) => {
    return edge.node.key?.trim();
  });
}

export const get = async <TValue>(key: string): Promise<TValue | undefined> => {
  const row = await findByKey(key);

  return isDefined(row) ? (row.value as TValue) : undefined;
};

export const set = async (key: string, value: Record<string, unknown>): Promise<void> => {
  const existing = await findByKey(key);

  if (isDefined(existing)) {
    await client.mutation({
      updateKvStore: {
        __args: { id: existing.id, data: { value } },
        id: true,
      },
    });
    return;
  }

  await client.mutation({
    createKvStore: {
      __args: { data: { key, value } },
      id: true,
    },
  });
};

export const del = async (key: string): Promise<void> => {
  const existing = await findByKey(key);

  if (isDefined(existing)) {
    await client.mutation({
      deleteKvStore: { __args: { id: existing.id }, id: true },
    });
  }
};
