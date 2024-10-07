import {GRAPH_URI} from '../../config';
import {request} from 'graphql-request';

export const fetcher = async (
  chainId: number,
  query: any,
  variables: Record<string, any>,
): Promise<any> => request(GRAPH_URI[chainId], query, variables);
