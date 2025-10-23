// /home/leac1m/Projects/de-gallery/config.ts

type WalrusService = {
  id: string;
  name: string;
  publisherUrl: string;
  aggregatorUrl: string;
};

const GraphQL_ENDPOINT = "https://graphql.testnet.sui.io/graphql";
const SELECTED_SERVICE = process.env.SELECTED_SERVICE || "service1";

const PACKAGE_ID = process.env.PACKAGE_ID || "0x17573fd845dfc8985e75b05f4ae667ec764b03b2bce506ec50494f23600be03b" ;
if (!PACKAGE_ID) {
    throw new Error('PACKAGE_ID environment variable is not set');
}

const KEY_SERVER_IDS = ["0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75", "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8"]


const services: WalrusService[] = [
    {
      id: 'service1',
      name: 'walrus.space',
      publisherUrl: 'https://publisher.walrus-testnet.walrus.space',
      aggregatorUrl: 'https://aggregator.walrus-testnet.walrus.space',
    },
    {
      id: 'service2',
      name: 'staketab.org',
      publisherUrl: '/publisher2',
      aggregatorUrl: '/aggregator2',
    },
    {
      id: 'service3',
      name: 'redundex.com',
      publisherUrl: '/publisher3',
      aggregatorUrl: '/aggregator3',
    },
    {
      id: 'service4',
      name: 'nodes.guru',
      publisherUrl: '/publisher4',
      aggregatorUrl: '/aggregator4',
    },
    {
      id: 'service5',
      name: 'banansen.dev',
      publisherUrl: '/publisher5',
      aggregatorUrl: '/aggregator5',
    },
    {
      id: 'service6',
      name: 'everstake.one',
      publisherUrl: '/publisher6',
      aggregatorUrl: '/aggregator6',
    },
  ];

export function getAggregatorUrl(path: string): string {
    const service = services.find((s) => s.id === SELECTED_SERVICE);
    const cleanPath = path.replace(/^\/+/, '').replace(/^v1\//, '');
    return `${service?.aggregatorUrl}/v1/${cleanPath}`;
  }

export function getPublisherUrl(path: string): string {
    const service = services.find((s) => s.id === SELECTED_SERVICE);
    const cleanPath = path.replace(/^\/+/, '').replace(/^v1\//, '');
    return `${service?.publisherUrl}/v1/${cleanPath}`;
  }


const AppConfig = {
    PACKAGE_ID,
    KEY_SERVER_IDS,
    NUM_EPOCH: 5,
    GraphQL_ENDPOINT,
}
export default AppConfig;