// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Royalty} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/// @title PropertyToken
/// @notice ERC-721 deed NFT minted when a BSREMS property sale completes.
contract PropertyToken is ERC721, ERC721URIStorage, ERC721Royalty, AccessControl, Pausable {
    bytes32 public constant ESCROW_CONTRACT = keccak256("ESCROW_CONTRACT");
    uint96 public constant PLATFORM_ROYALTY_BPS = 100;
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public propertyToToken;

    event DeedMinted(uint256 indexed tokenId, uint256 indexed propertyId, address indexed to);
    event TokenContractPaused(address indexed account);
    event TokenContractUnpaused(address indexed account);

    /// @notice Deploys the deed token.
    /// @param admin Admin wallet.
    /// @param royaltyReceiver Platform royalty receiver.
    constructor(address admin, address royaltyReceiver) ERC721("BSREMS Property Deed", "BDEED") {
        require(admin != address(0), "admin required");
        require(royaltyReceiver != address(0), "royalty required");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _setDefaultRoyalty(royaltyReceiver, PLATFORM_ROYALTY_BPS);
    }

    /// @notice Mints a deed for a completed sale.
    /// @param to Token recipient.
    /// @param propertyId Property id.
    /// @param uri Metadata URI.
    /// @return tokenId Minted token id.
    function mintDeed(address to, uint256 propertyId, string calldata uri)
        external
        onlyRole(ESCROW_CONTRACT)
        whenNotPaused
        returns (uint256 tokenId)
    {
        require(to != address(0), "to required");
        require(propertyToToken[propertyId] == 0, "deed exists");
        tokenId = ++nextTokenId;
        propertyToToken[propertyId] = tokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit DeedMinted(tokenId, propertyId, to);
    }

    /// @notice Pauses token transfers and minting.
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
        emit TokenContractPaused(msg.sender);
    }

    /// @notice Unpauses token transfers and minting.
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit TokenContractUnpaused(msg.sender);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) whenNotPaused returns (address) {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Royalty, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
