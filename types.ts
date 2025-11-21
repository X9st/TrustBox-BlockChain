
export enum BoxStatus {
  WAITING = 0,   // 待拆
  OPENED = 1,    // 已拆待履约
  VOTING = 2,    // 履约中投票
  COMPLETED = 3, // 履约完成
  FAILED = 4     // 履约失败
}

export interface BlindBox {
  id: string;
  publisher: string;
  description: string; // Public teaser
  promiseContent: string; // The hidden promise
  priceEth: number; // Staked amount required by publisher
  pointsCost: number; // Points to open
  status: BoxStatus;
  imageUrl: string; // Preview image
  createdAt: string;
  surpriseScore: number; // 0-100
  opener?: string;
  fulfillmentProofUrl?: string;
  transactionHash?: string; // Real blockchain tx hash
}

export interface UserProfile {
  address: string;
  ethBalance: number;
  points: number;
  medals: Medal[];
  fulfillmentRate: number; // 0-100%
  publishedCount: number;
  openedCount: number;
}

export enum MedalType {
  BRONZE = '青铜诚信勋章',
  SILVER = '白银诚信勋章',
  GOLD = '黄金诚信勋章',
  SHARER = '社交分享达人'
}

export interface Medal {
  type: MedalType;
  earnedAt: string;
}

export interface DaoVote {
  id: string;
  boxId: string;
  proofUrl: string;
  promiseContent: string;
  deadline: string;
  votesFor: number;
  votesAgainst: number;
  status: '进行中' | '已通过' | '已拒绝';
}
