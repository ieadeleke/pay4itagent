export const config = {
    public_key: "FLWPUBK_TEST-4d3d7fcca01f0895d2d3434eeed7d909-X",
    amount: 100,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
        email: "user@gmail.com",
        phone_number: "070********",
        name: "john doe",
    },
    customizations: {
        title: "My store",
        description: "Payment for items in cart",
        logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
};

// export const FLUTTERWAVE_TEST_KEY = "FLWPUBK_TEST-c790994c4d69983890677a5f380162dc-X"
export const FLUTTERWAVE_TEST_KEY = "FLWPUBK_TEST-086bad0df8991ac589157f1f67aa1352-X";
export const FLUTTERWAVE_LIVE_KEY = "FLWPUBK-1e1d43067051e4c48eb73148feb26c4a-X"