use gstd::{msg, ActorId};

pub fn currency_transfer(
    collection_owner: ActorId,
    token_owner: ActorId,
    price: u128,
    royalty: u16,
    minimum_transfer_value: u128,
) {
    // calculate the percentage to the creator of the collection
    // current_price * royalty / 10_000
    let percent_to_collection_creator = price * (royalty as u128) / 10_000u128;
    if percent_to_collection_creator > minimum_transfer_value {
        // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
        msg::send_with_gas(collection_owner, "", 0, percent_to_collection_creator)
            .expect("Error in sending value");
        msg::send_with_gas(token_owner, "", 0, price - percent_to_collection_creator)
            .expect("Error in sending value");
    } else {
        msg::send_with_gas(token_owner, "", 0, price).expect("Error in sending value");
    }
}
