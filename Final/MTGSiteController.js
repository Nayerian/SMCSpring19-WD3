var shoppingCart = [];

function AddItemToCart(type, item) {
    
    shoppingCart = JSON.parse(sessionStorage.getItem('cart'));
        
    if (shoppingCart == null) { shoppingCart = []; }

    if (type == 'card') {
        switch (item) {
            case 1:
                shoppingCart.push(cards[0]);
                break;
            case 2:
                shoppingCart.push(cards[1]);
                break;
            case 3:
                shoppingCart.push(cards[2]);
                break;
            case 4:
                shoppingCart.push(cards[3]);
                break;
            case 5:
                shoppingCart.push(cards[4]);
                break;
            case 6:
                shoppingCart.push(cards[5]);
                break;
        }
    }
    else if (type == 'toy') {
        switch (item) {
            case 1:
                shoppingCart.push(cards[0]);
                break;
            case 2:
                shoppingCart.push(cards[1]);
                break;
            case 3:
                shoppingCart.push(cards[2]);
                break;
            case 4:
                shoppingCart.push(cards[3]);
                break;
            case 5:
                shoppingCart.push(cards[4]);
                break;
            case 6:
                shoppingCart.push(cards[5]);
                break;
        }
    }
    else if (type == 'supply') {
        switch (item) {
            case 1:
                shoppingCart.push(cards[0]);
                break;
            case 2:
                shoppingCart.push(cards[1]);
                break;
            case 3:
                shoppingCart.push(cards[2]);
                break;
            case 4:
                shoppingCart.push(cards[3]);
                break;
            case 5:
                shoppingCart.push(cards[4]);
                break;
            case 6:
                shoppingCart.push(cards[5]);
                break;
        }
    }
    sessionStorage.setItem('cart', JSON.stringify(shoppingCart));
    return;
}

// Code for product pages.
// Using hard coded arrays for product data.
var cards = [
    {
        Name: "Core Set 2019",
        Price: 35.94,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "The Gatewatch",
        Price: 24.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Dominaria",
        Price: 79.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Ravnica Allegiance",
        Price: 26.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "MTG-XLN-BU-EN Ixalan",
        Price: 34.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "War of the Spark",
        Price: 34.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
]

var toys = [
    {
        Name: "Garruk Wildspeaker Vinyl Figure",
        Price: 21.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Chandra Nalaar - Pop! Vinyl Figure",
        Price: 11.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Liliana Vess - Vinyl Figure",
        Price: 15.52,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Sarkhan Vol Vinyl Figure",
        Price: 20.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Nicol Bolas Vinyl Figure",
        Price: 20.49,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Jace Beleren",
        Price: 12.00,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
]

var supplies = [
    {
        Name: "Set of 20 Metal MTG Buff Counters",
        Price: 12.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "12 Pack Life Counters",
        Price: 14.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Hex Dice Wood Chest with Magnetic Lid",
        Price: 39.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Game Card Storage Case",
        Price: 59.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "100 PCS Colorful Backs Card Sleeves",
        Price: 5.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "The Arisen Deck Protector Sleeves",
        Price: 8.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
]