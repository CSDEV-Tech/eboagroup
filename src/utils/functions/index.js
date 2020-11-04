// import slide1 from "../banners/slide1.jpg";
// import slide6 from '../images/slide6.jpg';
import slide7 from '../images/slide7.jpg';
import slide8 from '../images/slide8.jpg';
import slide9 from "../images/PROMO_3.jpg";
import productImg from "../images/items/4.jpg";

export function generateProducts(amount = 20) {
    var li = [];
    for (let i = 1; i <= amount; i++) {
        li.push(
            {
                id: i,
                image: productImg,
                name: "Stylo à bille",
                description: " Lorem Ipsum dolor sit atmet Lorem Ipsum dolor sit atmet Lorem Ipsum dolor sit atmet Lorem Ipsum dolor sit atmet Lorem Ipsum dolor sit atmet Lorem Ipsum dolor sit atmet Lorem Ipsum dolor sit atmet Lorem Ipsum dolor sit atmet.",
                price: 2000,
                reduction: (i % 3 === 0 ? {
                    label: "PROMO Rentrée scolaire",
                    ammout: 15,
                } : null),
                is_new: (i % 2 === 0),
                stock: 10,
            },
        )
    }

    return li;
}

export function generateCategories() {
    return [
        {id: 1, name: "Rentrée scolaire"},
        {id: 2, name: "Nouvel An"},
        {id: 3, name: "Lecture et relaxation"}
    ];
}

export function generateUser() {
    return {
        token: "abcd",
        name: "FREDHEL KISSIE",
        userId: 1,
        commands: {items: []},
        wishList: {items: []}
    };
}

export function generateSlides() {
    return [
        {
            id: 9,
            image: slide9,
        },
        {
            id: 7,
            image: slide7,
        },
        {
            id: 8,
            image: slide8,
        },
    ]
}

export function getMonth(month): string {
    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];


    return months[month - 1];
}