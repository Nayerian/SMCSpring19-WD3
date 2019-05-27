var shoppingCart = [];

// Add item to cart.
function AddItemToCart(item) {
    switch (item) {
        case 1:
            shoppingCart.push(cards[0]);
            console.log('%c Items', 'color: orange; font-weight: bold');
            console.log(item);
            console.log({ shoppingCart });
            break;
        case 2:
            shoppingCart.push(cards[1]);
            console.log('%c Items', 'color: orange; font-weight: bold');
            console.log(item);
            console.log({ shoppingCart });
            break;
        case 3:
            shoppingCart.push(cards[2]);
            console.log('%c Items', 'color: orange; font-weight: bold');
            console.log(item);
            console.log({ shoppingCart });
            break;
        case 4:
            shoppingCart.push(cards[3]);
            console.log('%c Items', 'color: orange; font-weight: bold');
            console.log(item);
            console.log({ shoppingCart });
            break;
        case 5:
            shoppingCart.push(cards[4]);
            console.log('%c Items', 'color: orange; font-weight: bold');
            console.log(item);
            console.log({ shoppingCart });
            break;
        case 6:
            shoppingCart.push(cards[5]);
            console.log('%c Items', 'color: orange; font-weight: bold');
            console.log(item);
            console.log({ shoppingCart });
            break;
    }
    sessionStorage.setItem('cart', JSON.stringify(shoppingCart));
    console.log('updated session storage');
    return;
}

// Code for product pages.
// Hard Coded Structure for Cards.
var cards = [
    {
        Name: "Item One",
        Price: 24.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Item Two",
        Price: 24.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Item Three",
        Price: 24.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Item Four",
        Price: 24.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Item Five",
        Price: 24.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
    {
        Name: "Item Six",
        Price: 24.99,
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
    },
]

