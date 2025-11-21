import { BlindBox, BoxStatus, DaoVote, MedalType, UserProfile } from './types';

export const MOCK_USERS: (UserProfile & { name: string })[] = [
  {
    name: "Alice (发布达人)",
    address: "0xAlice...A111",
    ethBalance: 5.0,
    points: 60, // 积分较少，主要靠发布赚分
    medals: [],
    fulfillmentRate: 100,
    publishedCount: 2,
    openedCount: 1
  },
  {
    name: "Bob (寻宝猎人)",
    address: "0xBob.....B222",
    ethBalance: 0.5,
    points: 800, // 积分多，主要用来拆盒
    medals: [{ type: MedalType.SHARER, earnedAt: "2023-11-02" }],
    fulfillmentRate: 0,
    publishedCount: 0,
    openedCount: 5
  },
  {
    name: "Charlie (DAO节点)",
    address: "0xCharlie.C333",
    ethBalance: 2.0,
    points: 300,
    medals: [{ type: MedalType.BRONZE, earnedAt: "2023-10-15" }],
    fulfillmentRate: 98,
    publishedCount: 10,
    openedCount: 25
  }
];

export const MOCK_BOXES: BlindBox[] = [
  {
    id: "BOX-1024",
    publisher: "0xAlice...A111",
    description: "一份来自京都的限量伴手礼",
    promiseContent: "我会寄出一盒限定款抹茶甜点，附带购物小票。",
    priceEth: 0.005,
    pointsCost: 50,
    status: BoxStatus.WAITING,
    imageUrl: "https://picsum.photos/400/300?random=1",
    createdAt: "2023-12-01",
    surpriseScore: 85
  },
  {
    id: "BOX-1025",
    publisher: "0xCharlie.C333",
    description: "手绘巴黎埃菲尔铁塔明信片",
    promiseContent: "一张我在战神广场现场绘制的素描明信片，背面写有祝福。",
    priceEth: 0.002,
    pointsCost: 20,
    status: BoxStatus.WAITING,
    imageUrl: "https://picsum.photos/400/300?random=2",
    createdAt: "2023-12-02",
    surpriseScore: 45
  },
  {
    id: "BOX-1026",
    publisher: "0xAlice...A111",
    description: "神秘极客装备（全新未拆）",
    promiseContent: "一套机械键盘定制键帽（GMK 配色）。",
    priceEth: 0.01,
    pointsCost: 80,
    status: BoxStatus.VOTING,
    opener: "0xBob.....B222",
    fulfillmentProofUrl: "https://picsum.photos/400/300?random=3",
    imageUrl: "https://picsum.photos/400/300?random=4",
    createdAt: "2023-11-20",
    surpriseScore: 90
  },
  {
    id: "BOX-1027",
    publisher: "0xCharlie.C333",
    description: "手工陶艺马克杯",
    promiseContent: "一只蓝色釉面的手工马克杯，独一无二。",
    priceEth: 0.005,
    pointsCost: 40,
    status: BoxStatus.COMPLETED,
    opener: "0xAlice...A111",
    imageUrl: "https://picsum.photos/400/300?random=5",
    createdAt: "2023-10-05",
    surpriseScore: 70
  }
];

export const MOCK_VOTES: DaoVote[] = [
  {
    id: "VOTE-001",
    boxId: "BOX-1026",
    proofUrl: "https://picsum.photos/600/400?random=10",
    promiseContent: "一套机械键盘定制键帽（GMK 配色）。",
    deadline: "12小时30分",
    votesFor: 15,
    votesAgainst: 2,
    status: '进行中'
  }
];