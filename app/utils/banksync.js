import { addTransaction2 } from "../actions/transactionCollection";
var plaid = require('plaid');

export function syncBank(clientId, secret, publicKey) {
    var handler = Plaid.create({
        clientName: 'Plaid Quickstart',
        // Optional, specify an array of country codes to localize Link
        countryCodes: ['US'],
        env: "development",
        // Replace with your public_key from the Dashboard
        key: publicKey,
        product: ['transactions'],
        // Optional, specify a language to localize Link
        language: 'en',
        // Optional, specify a user object to enable all Auth features
        // user: {
        //     legalName: 'John Appleseed',
        //     emailAddress: 'jappleseed@yourapp.com',
        // },
        onLoad: function() {
            // Optional, called when Link loads
        },
        onSuccess: function(public_token, metadata) {
            // Send the public_token to your app server.
            // The metadata object contains info about the institution the
            // user selected and the account ID or IDs, if the
            // Select Account view is enabled.


            // $.post('/get_access_token', {
            //     public_token: public_token,
            // });

            var access_token = null;
            var client = new plaid.Client(
                clientId,
                secret,
                publicKey,
                plaid.environments.development, {
                    version: '2018-05-22'
                }
            );

            client.exchangePublicToken(public_token, function(err, res) {
                access_token = res.access_token;

                var today = (new Date());
                var earlier = today.setMonth(today.getMonth() - 2);

                client.getTransactions(access_token, earlier.toISOString().slice(0, 10), today.toISOString().slice(0, 10), (err, res) => {
                    console.log(res.transactions);
                    plaidToMyBudgetData(res.transactions);
                });
            });
        },
        onExit: function(err, metadata) {
            // The user exited the Link flow.
            if (err != null) {
                // The user encountered a Plaid API error prior to exiting.
            }
            // metadata contains information about the institution
            // that the user selected and the most recent API request IDs.
            // Storing this information can be helpful for support.
        },
        onEvent: function(eventName, metadata) {
            // Optionally capture Link flow events, streamed through
            // this callback as your users connect an Item to Plaid.
            // For example:
            // eventName = "TRANSITION_VIEW"
            // metadata  = {
            //   link_session_id: "123-abc",
            //   mfa_type:        "questions",
            //   timestamp:       "2017-09-14T14:42:19.350Z",
            //   view_name:       "MFA",
            // }
        }
    });
    handler.open();
}

var plaidToMyBudgetData = function(transactions){

}