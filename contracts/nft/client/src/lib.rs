#![no_std]

// Incorporate code generated based on the IDL file
include!(concat!(env!("OUT_DIR"), "/nft_client.rs"));
