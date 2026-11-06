export const propertyRegistryAbi = [
  {
    type: "function",
    name: "getAllActiveProperties",
    stateMutability: "view",
    inputs: [{ name: "offset", type: "uint256" }, { name: "limit", type: "uint256" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "ipfsMetadataHash", type: "string" },
          { name: "owner", type: "address" },
          { name: "price", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "createdAt", type: "uint256" },
          { name: "updatedAt", type: "uint256" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "listProperty",
    stateMutability: "nonpayable",
    inputs: [{ name: "ipfsHash", type: "string" }, { name: "price", type: "uint256" }],
    outputs: [{ name: "propertyId", type: "uint256" }]
  }
] as const;

export const escrowManagerAbi = [
  {
    type: "function",
    name: "createEscrow",
    stateMutability: "payable",
    inputs: [
      { name: "propertyId", type: "uint256" },
      { name: "seller", type: "address" },
      { name: "deadline", type: "uint256" }
    ],
    outputs: [{ name: "escrowId", type: "uint256" }]
  },
  { type: "function", name: "approveDeal", stateMutability: "nonpayable", inputs: [{ name: "escrowId", type: "uint256" }], outputs: [] }
] as const;

export const rentalAgreementAbi = [
  {
    type: "function",
    name: "createRental",
    stateMutability: "payable",
    inputs: [
      { name: "propertyId", type: "uint256" },
      { name: "monthlyRent", type: "uint256" },
      { name: "startDate", type: "uint256" },
      { name: "endDate", type: "uint256" }
    ],
    outputs: [{ name: "rentalId", type: "uint256" }]
  }
] as const;

export const contracts = {
  propertyRegistry: import.meta.env.VITE_CONTRACT_PROPERTY_REGISTRY as `0x${string}` | undefined,
  escrowManager: import.meta.env.VITE_CONTRACT_ESCROW_MANAGER as `0x${string}` | undefined,
  rentalAgreement: import.meta.env.VITE_CONTRACT_RENTAL as `0x${string}` | undefined,
  propertyToken: import.meta.env.VITE_CONTRACT_TOKEN as `0x${string}` | undefined
};
