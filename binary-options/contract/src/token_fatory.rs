/// Represents the `Coin` proto message.
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Coin {
    /// denom is the denomination of the coin.
    #[prost(string, tag="1")]
    pub denom: ::prost::alloc::string::String,

    /// amount is the quantity of coins in the given denomination.
    #[prost(string, tag="2")]
    pub amount: ::prost::alloc::string::String,
}

/// MsgMint is the protobuf message that allows an admin account to mint
/// more of a token. For now, only supports minting to the sender account.
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgMint {
    /// sender is the address initiating the mint operation.
    #[prost(string, tag="1")]
    pub sender: ::prost::alloc::string::String,

    /// amount is the coin (denom + quantity) to be minted.
    /// Wrapped in an Option to handle protobuf’s optional field semantics.
    #[prost(message, optional, tag="2")]
    pub amount: ::core::option::Option<Coin>,
}

impl MsgMint {
    pub const TYPE_URL: &'static str = "/rollapp.tokenfactory.MsgMint";
}

/// MsgBurn is the protobuf message that allows an admin account to burn
/// a token. For now, only supports burning from the sender account.
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgBurn {
    /// sender is the address initiating the burn operation.
    #[prost(string, tag="1")]
    pub sender: ::prost::alloc::string::String,

    /// amount is the coin (denom + quantity) to be burned.
    #[prost(message, optional, tag="2")]
    pub amount: ::core::option::Option<Coin>,
}

impl MsgBurn {
    pub const TYPE_URL: &'static str = "/rollapp.tokenfactory.MsgBurn";
}
