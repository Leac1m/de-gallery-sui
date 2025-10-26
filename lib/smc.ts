import AppConfig from "@/config";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { DynamicFieldNode, DynamicFieldsResponse, DynamicFieldsVariables, ParsedJson } from "./types";
import { fromHex } from "@mysten/sui/utils";

// Function to fetch struct Gallery
export async function getGallery(suiClient: SuiClient, address: string) {
    const { data } = await suiClient.getOwnedObjects({
        owner: address,
        filter: {
            StructType: `${AppConfig.PACKAGE_ID}::degallery::Gallery`
        },
    });

    if (data.length == 0 ) {
        return
    }

    return data[0].data?.objectId
}

// Function to create new Gallery
export function newGallery(address: string) {
    const tx = new Transaction();

    const [gallery] = tx.moveCall({
        target: `${AppConfig.PACKAGE_ID}::degallery::new`,
    });

    tx.transferObjects([gallery], address);

    return tx
}

// Function to add to Gallery
export function addToGallery(galleryId: string, file: {
    blob: string,
    type: string,
    thumbnail: string,
    end_epoch: number
}) {
    const tx = new Transaction();

    tx.moveCall({
        target: `${AppConfig.PACKAGE_ID}::degallery::add`,
        arguments: [
            tx.object(galleryId),
            tx.pure.string(file.blob),
            tx.pure.string(file.type),
            tx.pure.string(file.thumbnail),
            tx.pure.u64(file.end_epoch),
            tx.object.clock(),
        ]
    });

    return tx;
}

// Function to fetch dynamic fields
async function getImage(suiClient: SuiClient, galleryId: string, cursor=null) {
    const { data, nextCursor } = await suiClient.getDynamicFields({
        parentId: galleryId,
        cursor,
        limit: 20
    });

    return { data, cursor: nextCursor};
}

// GraphQL query string
const DYNAMIC_FIELDS_QUERY = `
  query DynamicFieldsPagination($id: SuiAddress!, $cursor: String, $limit: Int) {
    address(address: $id) {
      dynamicFields(first: $limit, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name {
            type { repr }
            json
          }
          value {
            __typename
            ... on MoveValue {
              type { repr }
              json
            }
            ... on MoveObject {
              contents {
                type { repr }
                json
              }
            }
          }
        }
      }
    }
  }
`;

// Fetch function
export async function fetchDynamicFields(
  variables: DynamicFieldsVariables
): Promise<DynamicFieldsResponse> {
  const response = await fetch(AppConfig.GraphQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: DYNAMIC_FIELDS_QUERY,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
}

// Helper function to parse field values with type safety
export function parseFieldValue<T = ParsedJson>(node: DynamicFieldNode): {
  name: string;
  type: string;
  value: T;
} {
  const nameValue = typeof node.name.json === 'string' 
    ? node.name.json 
    : JSON.stringify(node.name.json);

  let parsedValue: any;
  
  if (node.value.__typename === 'MoveValue' && node.value.json) {
    parsedValue = node.value.json;
  } else if (node.value.__typename === 'MoveObject' && node.value.contents) {
    parsedValue = typeof node.value.contents.json === 'string'
      ? JSON.parse(node.value.contents.json)
      : node.value.contents.json;
  }

  return {
    name: nameValue,
    type: node.value.type?.repr || node.value.contents?.type.repr || 'unknown',
    value: parsedValue as T,
  };
}

export function seal_approve(gallery: string, suiClient: SuiClient) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${AppConfig.PACKAGE_ID}::degallery::seal_approve`,
    arguments: [
      tx.pure.vector("u8", fromHex(gallery)),
      tx.object(gallery),
    ]
  });

  return tx.build({ client: suiClient, onlyTransactionKind: true })
}