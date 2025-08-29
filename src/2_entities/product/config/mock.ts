import { IProduct } from "./types";

export const mock: IProduct[] = [
  {
    id: 1,
    name: "Пицца Маргарита",
    image:
      "https://plus.unsplash.com/premium_photo-1675103910740-533375dd3864?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjBtYXJnaGVyaXRhfGVufDB8fDB8fHww",
    price: 399.9,
    group: [1, 4],
    subgroup: ["Классика"],
    types: [
      {
        id: 1,
        name: "25 см",
        price: 399.9,
      },
      {
        id: 2,
        name: "30 см",
        price: 499.9,
      },
      {
        id: 3,
        name: "35 см",
        price: 599.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Пепперони",
        description: "Острая колбаска",
        price: 90,
        image:
          "https://plus.unsplash.com/premium_photo-1677048633882-81ed0e6427d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm91ciUyMGNoZWVzZSUyMHBpenphJTIwY2hlZXNlfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Грибы",
        description: "Шампиньоны",
        price: 70,
        image:
          "https://plus.unsplash.com/premium_photo-1677048633882-81ed0e6427d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm91ciUyMGNoZWVzZSUyMHBpenphJTIwY2hlZXNlfGVufDB8fDB8fHww",
      },
      {
        id: 3,
        name: "Оливки",
        description: "Чёрные оливки",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1677048633882-81ed0e6427d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm91ciUyMGNoZWVzZSUyMHBpenphJTIwY2hlZXNlfGVufDB8fDB8fHww",
      },
      {
        id: 4,
        name: "Сыр дополнительный",
        description: "Моцарелла",
        price: 80,
        image:
          "https://plus.unsplash.com/premium_photo-1675103909152-4aa4efcb5598?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW96emFyZWxsYSUyMGZvdXIlMjBjaGVlc2UlMjBwaXp6YSUyMGNoZWVzZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "Халапеньо",
        description: "Лёгкая остринка",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1677048633882-81ed0e6427d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm91ciUyMGNoZWVzZSUyMHBpenphJTIwY2hlZXNlfGVufDB8fDB8fHww",
      },
      {
        id: 6,
        name: "Бекон",
        description: "Копчёный",
        price: 100,
        image:
          "https://plus.unsplash.com/premium_photo-1677048633882-81ed0e6427d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm91ciUyMGNoZWVzZSUyMHBpenphJTIwY2hlZXNlfGVufDB8fDB8fHww",
      },
    ],
    information: {
      id: 1,
      composition: "Тесто, томатный соус, моцарелла, базилик",
      description:
        "Классическая итальянская пицца с ароматным томатным соусом и свежим базиликом.",
      fats: 8,
      proteins: 11,
      carbohydrates: 32,
      calories: 270,
    },
  },
  {
    id: 2,
    name: "Пицца Пепперони",
    image:
      "https://plus.unsplash.com/premium_photo-1733259709671-9dbf22bf02cc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjBwZXBwZXJvbml8ZW58MHx8MHx8fDA%3D",
    price: 449.9,
    group: [1, 4],
    subgroup: ["Классика"],
    types: [
      {
        id: 1,
        name: "25 см",
        price: 449.9,
      },
      {
        id: 2,
        name: "30 см",
        price: 549.9,
      },
      {
        id: 3,
        name: "35 см",
        price: 649.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Доп. пепперони",
        price: 90,
        image:
          "https://plus.unsplash.com/premium_photo-1723055661216-3eaad98463b4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b2xpdmVzJTIwdmVnZXRhcmlhbiUyMHBpenphfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Грибы",
        price: 70,
        image:
          "https://plus.unsplash.com/premium_photo-1663858366999-aa1ce123a972?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bXVzaHJvb20lMjB2ZWdldGFyaWFuJTIwcGl6emF8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 3,
        name: "Оливки",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1722945691819-e58990e7fb27?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVwcGVyJTIwdmVnZXRhcmlhbiUyMHBpenphfGVufDB8fDB8fHww",
      },
      {
        id: 4,
        name: "Сыр дополнительный",
        price: 80,
        image:
          "https://plus.unsplash.com/premium_photo-1722945691819-e58990e7fb27?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29ybiUyMHZlZ2V0YXJpYW4lMjBwaXp6YXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "Халапеньо",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1723478407550-a4a3dacd77f4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9tYXRvJTIwdmVnZXRhcmlhbiUyMHBpenphfGVufDB8fDB8fHww",
      },
      {
        id: 6,
        name: "Бекон",
        price: 100,
        image:
          "https://plus.unsplash.com/premium_photo-1671405925502-89fa11b0f41c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwdmVnZXRhcmlhbiUyMHBpenphfGVufDB8fDB8fHww",
      },
    ],
    information: {
      id: 2,
      composition: "Тесто, томатный соус, моцарелла, пепперони",
      description:
        "Сочная и яркая пицца с фирменной колбаской пепперони и тянущимся сыром.",
      fats: 15,
      proteins: 14,
      carbohydrates: 33,
      calories: 320,
    },
  },
  {
    id: 3,
    name: "Пицца Четыре сыра",
    image:
      "https://plus.unsplash.com/premium_photo-1671559020929-0a19de16da14?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjBmb3VyJTIwY2hlZXNlJTIwY2hlZXNlfGVufDB8fDB8fHww",
    price: 459.9,
    group: [4],
    subgroup: ["Сырная"],
    types: [
      {
        id: 1,
        name: "25 см",
        price: 459.9,
      },
      {
        id: 2,
        name: "30 см",
        price: 559.9,
      },
      {
        id: 3,
        name: "35 см",
        price: 659.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Горгонзола",
        price: 120,
        image: "https://picsum.photos/seed/ing-gorgonzola/100/100",
      },
      {
        id: 2,
        name: "Пармезан",
        price: 110,
        image: "https://picsum.photos/seed/ing-parmesan/100/100",
      },
      {
        id: 3,
        name: "Маскарпоне",
        price: 130,
        image: "https://picsum.photos/seed/ing-mascarpone/100/100",
      },
      {
        id: 4,
        name: "Моцарелла",
        price: 90,
        image: "https://picsum.photos/seed/ing-mozzarella/100/100",
      },
      {
        id: 5,
        name: "Орехи",
        price: 70,
        image: "https://picsum.photos/seed/ing-nuts/100/100",
      },
      {
        id: 6,
        name: "Мёд",
        price: 40,
        image: "https://picsum.photos/seed/ing-honey/100/100",
      },
    ],
    information: {
      id: 3,
      composition: "Тесто, соус сливочный, моцарелла, дорблю, пармезан, чеддер",
      description: "Насыщенный сырный вкус для истинных любителей сыров.",
      fats: 18,
      proteins: 16,
      carbohydrates: 30,
      calories: 340,
    },
  },
  {
    id: 4,
    name: "Пицца Барбекю",
    image:
      "https://plus.unsplash.com/premium_photo-1737232107266-a9e2f07119f4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjBiYnF8ZW58MHx8MHx8fDA%3D",
    price: 479.9,
    group: [4],
    subgroup: ["Мясная"],
    types: [
      {
        id: 1,
        name: "25 см",
        price: 479.9,
      },
      {
        id: 2,
        name: "30 см",
        price: 579.9,
      },
      {
        id: 3,
        name: "35 см",
        price: 679.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Бекон",
        price: 100,
        image: "https://picsum.photos/seed/ing-bacon3/100/100",
      },
      {
        id: 2,
        name: "Курица",
        price: 100,
        image: "https://picsum.photos/seed/ing-chicken/100/100",
      },
      {
        id: 3,
        name: "Лук красный",
        price: 40,
        image: "https://picsum.photos/seed/ing-redonion/100/100",
      },
      {
        id: 4,
        name: "Соус BBQ",
        price: 30,
        image: "https://picsum.photos/seed/ing-bbq/100/100",
      },
      {
        id: 5,
        name: "Сыр дополнительный",
        price: 80,
        image: "https://picsum.photos/seed/ing-cheese3/100/100",
      },
      {
        id: 6,
        name: "Халапеньо",
        price: 60,
        image: "https://picsum.photos/seed/ing-jalapeno3/100/100",
      },
    ],
    information: {
      id: 4,
      composition: "Тесто, соус BBQ, курица, бекон, лук, моцарелла",
      description:
        "Смоковый вкус соуса BBQ и сочное мясо — топовая мясная пицца.",
      fats: 16,
      proteins: 17,
      carbohydrates: 34,
      calories: 330,
    },
  },
  {
    id: 5,
    name: "Пицца Диабло",
    image:
      "https://plus.unsplash.com/premium_photo-1730829006881-7a7c4c4aed91?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjBkaWFibG98ZW58MHx8MHx8fDA%3D",
    price: 489.9,
    group: [1, 4],
    subgroup: ["Острые"],
    types: [
      {
        id: 1,
        name: "25 см",
        price: 489.9,
      },
      {
        id: 2,
        name: "30 см",
        price: 589.9,
      },
      {
        id: 3,
        name: "35 см",
        price: 689.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Халапеньо",
        price: 60,
        image: "https://picsum.photos/seed/ing-jalapeno4/100/100",
      },
      {
        id: 2,
        name: "Пепперони",
        price: 90,
        image: "https://picsum.photos/seed/ing-pepperoni3/100/100",
      },
      {
        id: 3,
        name: "Чили соус",
        price: 30,
        image: "https://picsum.photos/seed/ing-chili/100/100",
      },
      {
        id: 4,
        name: "Лук красный",
        price: 40,
        image: "https://picsum.photos/seed/ing-redonion2/100/100",
      },
      {
        id: 5,
        name: "Сыр дополнительный",
        price: 80,
        image: "https://picsum.photos/seed/ing-cheese4/100/100",
      },
      {
        id: 6,
        name: "Грибы",
        price: 70,
        image: "https://picsum.photos/seed/ing-mushrooms3/100/100",
      },
    ],
    information: {
      id: 5,
      composition:
        "Тесто, томатный соус, пепперони, халапеньо, чили, моцарелла",
      description: "Острая, как надо. Для тех, кто любит погорячее.",
      fats: 17,
      proteins: 16,
      carbohydrates: 32,
      calories: 335,
    },
  },
  {
    id: 6,
    name: "Пицца Вегетарианская",
    image:
      "https://plus.unsplash.com/premium_photo-1675451537385-e76cd7e78087?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjB2ZWdldGFyaWFufGVufDB8fDB8fHww",
    price: 429.9,
    group: [4],
    subgroup: ["Вегетарианская"],
    types: [
      {
        id: 1,
        name: "25 см",
        price: 429.9,
      },
      {
        id: 2,
        name: "30 см",
        price: 519.9,
      },
      {
        id: 3,
        name: "35 см",
        price: 619.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Оливки",
        price: 60,
        image: "https://picsum.photos/seed/ing-olives3/100/100",
      },
      {
        id: 2,
        name: "Грибы",
        price: 70,
        image: "https://picsum.photos/seed/ing-mushrooms4/100/100",
      },
      {
        id: 3,
        name: "Перец болгарский",
        price: 60,
        image: "https://picsum.photos/seed/ing-bellpepper/100/100",
      },
      {
        id: 4,
        name: "Кукуруза",
        price: 50,
        image: "https://picsum.photos/seed/ing-corn/100/100",
      },
      {
        id: 5,
        name: "Томаты",
        price: 50,
        image: "https://picsum.photos/seed/ing-tomato/100/100",
      },
      {
        id: 6,
        name: "Сыр дополнительный",
        price: 80,
        image: "https://picsum.photos/seed/ing-cheese5/100/100",
      },
    ],
    information: {
      id: 6,
      composition:
        "Тесто, томаты, перец, шампиньоны, кукуруза, оливки, моцарелла",
      description: "Лёгкая и яркая пицца без мяса — насыщенный овощной вкус.",
      fats: 10,
      proteins: 12,
      carbohydrates: 31,
      calories: 280,
    },
  },
  {
    id: 7,
    name: "Пицца Гавайская",
    image:
      "https://plus.unsplash.com/premium_photo-1672498268734-0f41e888298d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjBoYXdhaWlhbnxlbnwwfHwwfHx8MA%3D%3D",
    price: 449.9,
    group: [4],
    subgroup: ["Классика"],
    types: [
      {
        id: 1,
        name: "25 см",
        price: 449.9,
      },
      {
        id: 2,
        name: "30 см",
        price: 549.9,
      },
      {
        id: 3,
        name: "35 см",
        price: 649.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Ананас",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1724849318956-c17403245ce4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGluZWFwcGxlJTIwaGF3YWlpYW4lMjBwaXp6YXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 2,
        name: "Курица",
        price: 100,
        image:
          "https://plus.unsplash.com/premium_photo-1672498193372-2b91ef813252?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGhhd2FpaWFuJTIwcGl6emF8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 3,
        name: "Кукуруза",
        price: 50,
        image:
          "https://plus.unsplash.com/premium_photo-1730829006881-7a7c4c4aed91?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29ybiUyMGhhd2FpaWFuJTIwcGl6emF8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 4,
        name: "Сыр дополнительный",
        price: 80,
        image:
          "https://plus.unsplash.com/premium_photo-1727173973896-b6f2ff10b5ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwaGF3YWlpYW4lMjBwaXp6YXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "Оливки",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1723055661216-3eaad98463b4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b2xpdmVzJTIwaGF3YWlpYW4lMjBwaXp6YXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 6,
        name: "Лук красный",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1723478458871-fe6606e93261?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b25pb24lMjBoYXdhaWlhbiUyMHBpenphfGVufDB8fDB8fHww",
      },
    ],
    information: {
      id: 7,
      composition: "Тесто, томатный соус, курица, ананас, моцарелла",
      description: "Сладко-солёная классика для ценителей.",
      fats: 13,
      proteins: 13,
      carbohydrates: 33,
      calories: 310,
    },
  },
  {
    id: 8,
    name: "Бургер Классический",
    image:
      "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
    price: 299.9,
    group: [3],
    subgroup: ["Классические"],
    types: [
      {
        id: 1,
        name: "Одинарный",
        price: 299.9,
      },
      {
        id: 2,
        name: "Двойной",
        price: 379.9,
      },
      {
        id: 3,
        name: "Тройной",
        price: 449.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Сыр",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1675252371648-7a6481df8226?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Бекон",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1661387986575-0ac3a4d53395?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFjb24lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 3,
        name: "Халапеньо",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 4,
        name: "Томаты",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1671485867703-3a9057260f4b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9tYXRvJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 5,
        name: "Листья салата",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1673809798626-cc94ebab0815?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWQlMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 6,
        name: "Котлета дополнительная",
        price: 120,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
    ],
    information: {
      id: 8,
      composition: "Булочка, говяжья котлета, салат, томаты, огурцы, соус",
      description: "Сбалансированный вкус и много сочности.",
      fats: 18,
      proteins: 22,
      carbohydrates: 25,
      calories: 420,
    },
  },
  {
    id: 9,
    name: "Чизбургер",
    image:
      "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
    price: 319.9,
    group: [3],
    subgroup: ["Классические"],
    types: [
      {
        id: 1,
        name: "Одинарный",
        price: 319.9,
      },
      {
        id: 2,
        name: "Двойной",
        price: 399.9,
      },
      {
        id: 3,
        name: "Тройной",
        price: 469.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Доп. сыр",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1675252371648-7a6481df8226?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Бекон",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1661387986575-0ac3a4d53395?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFjb24lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 3,
        name: "Лук",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1667682209368-2e3629cceaa5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b25pb24lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 4,
        name: "Халапеньо",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 5,
        name: "Соус фирменный",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1684534125661-614f59f16f2e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 6,
        name: "Котлета дополнительная",
        price: 120,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
    ],
    information: {
      id: 9,
      composition: "Булочка, котлета, сыр чеддер, томаты, огурцы, соус",
      description: "Сырный кайф в каждом укусе.",
      fats: 20,
      proteins: 24,
      carbohydrates: 25,
      calories: 450,
    },
  },
  {
    id: 10,
    name: "Бекон-бургер",
    image:
      "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
    price: 359.9,
    group: [3],
    subgroup: ["Мясные"],
    types: [
      {
        id: 1,
        name: "Одинарный",
        price: 359.9,
      },
      {
        id: 2,
        name: "Двойной",
        price: 439.9,
      },
      {
        id: 3,
        name: "Тройной",
        price: 509.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Доп. бекон",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1661387986575-0ac3a4d53395?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFjb24lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 2,
        name: "Сыр",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1738431707827-70cd52f23709?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwYnVyZ2VyJTIwYmFjb258ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 3,
        name: "Лук",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1664392112262-271039647be9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b25pb24lMjBidXJnZXIlMjBiYWNvbnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 4,
        name: "Соус BBQ",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1664392112262-271039647be9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBidXJnZXIlMjBiYWNvbnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "Томаты",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1684534125391-9e01a39570d2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9tYXRvJTIwYnVyZ2VyJTIwYmFjb258ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 6,
        name: "Котлета дополнительная",
        price: 120,
        image:
          "https://plus.unsplash.com/premium_photo-1738431707827-70cd52f23709?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyJTIwYmFjb258ZW58MHx8MHx8fDA%3D",
      },
    ],
    information: {
      id: 10,
      composition: "Булочка, котлета, бекон, сыр, лук, соус BBQ",
      description: "Хрустящий бекон и дымный соус — мощное сочетание.",
      fats: 24,
      proteins: 26,
      carbohydrates: 26,
      calories: 520,
    },
  },
  {
    id: 11,
    name: "Острый бургер",
    image:
      "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
    price: 339.9,
    group: [1, 3],
    subgroup: ["Острые"],
    types: [
      {
        id: 1,
        name: "Одинарный",
        price: 339.9,
      },
      {
        id: 2,
        name: "Двойной",
        price: 419.9,
      },
      {
        id: 3,
        name: "Тройной",
        price: 489.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Халапеньо",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Соус чили",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1684534125661-614f59f16f2e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 3,
        name: "Сыр",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1675252371648-7a6481df8226?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 4,
        name: "Томаты",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1671485867703-3a9057260f4b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9tYXRvJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 5,
        name: "Листья салата",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1673809798626-cc94ebab0815?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWQlMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 6,
        name: "Котлета дополнительная",
        price: 120,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
    ],
    information: {
      id: 11,
      composition: "Булочка, котлета, сыр, халапеньо, чили-соус",
      description: "Остро, сочно и бодрит.",
      fats: 19,
      proteins: 23,
      carbohydrates: 24,
      calories: 440,
    },
  },
  {
    id: 12,
    name: "Бургер с курицей",
    image:
      "https://plus.unsplash.com/premium_photo-1683655058728-415f4f2674bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyJTIwY2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D",
    price: 329.9,
    group: [3],
    subgroup: ["Куриные"],
    types: [
      {
        id: 1,
        name: "Одинарный",
        price: 329.9,
      },
      {
        id: 2,
        name: "Двойной",
        price: 399.9,
      },
      {
        id: 3,
        name: "Тройной",
        price: 459.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Сыр",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1694769318070-5fbe38d744c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwY2hpY2tlbiUyMGJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 2,
        name: "Бекон",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1738431707796-15850af48b26?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFjb24lMjBjaGlja2VuJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 3,
        name: "Соус чесночный",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1664392112262-271039647be9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBnYXJsaWMlMjBjaGlja2VuJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 4,
        name: "Томаты",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1691598046901-7153c95f4357?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9tYXRvJTIwY2hpY2tlbiUyMGJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "Салат",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1675864532183-8f37e8834db5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWQlMjBjaGlja2VuJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 6,
        name: "Котлета куриная доп.",
        price: 100,
        image:
          "https://plus.unsplash.com/premium_photo-1683655058728-415f4f2674bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
    information: {
      id: 12,
      composition: "Булочка, куриная котлета, салат, томаты, соус",
      description: "Лёгкий и нежный, но всё так же насыщенный.",
      fats: 14,
      proteins: 24,
      carbohydrates: 24,
      calories: 390,
    },
  },
  {
    id: 13,
    name: "Веган-бургер",
    image:
      "https://plus.unsplash.com/premium_photo-1664648063630-c2ce1c99b975?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyJTIwdmVnZXRhcmlhbnxlbnwwfHwwfHx8MA%3D%3D",
    price: 349.9,
    group: [1, 3],
    subgroup: ["Вегетарианские"],
    types: [
      {
        id: 1,
        name: "Одинарный",
        price: 349.9,
      },
      {
        id: 2,
        name: "Двойной",
        price: 419.9,
      },
      {
        id: 3,
        name: "Тройной",
        price: 479.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Авокадо",
        price: 50,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Веган-сыр",
        price: 50,
        image:
          "https://plus.unsplash.com/premium_photo-1675252371648-7a6481df8226?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 3,
        name: "Халапеньо",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 4,
        name: "Огурцы",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 5,
        name: "Томаты",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1671485867703-3a9057260f4b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9tYXRvJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 6,
        name: "Соус веган",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1684534125661-614f59f16f2e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
    ],
    information: {
      id: 13,
      composition: "Булочка, растительная котлета, овощи, веган-соус",
      description: "100% растительно, 100% вкусно.",
      fats: 12,
      proteins: 16,
      carbohydrates: 30,
      calories: 360,
    },
  },
  {
    id: 14,
    name: "Дабл чизбургер",
    image:
      "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
    price: 389.9,
    group: [3],
    subgroup: ["Сочные"],
    types: [
      {
        id: 1,
        name: "Одинарный",
        price: 389.9,
      },
      {
        id: 2,
        name: "Двойной",
        price: 469.9,
      },
      {
        id: 3,
        name: "Тройной",
        price: 539.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Доп. сыр",
        price: 40,
        image:
          "https://plus.unsplash.com/premium_photo-1675252371648-7a6481df8226?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Бекон",
        price: 60,
        image:
          "https://plus.unsplash.com/premium_photo-1661387986575-0ac3a4d53395?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFjb24lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 3,
        name: "Лук",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1667682209368-2e3629cceaa5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b25pb24lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 4,
        name: "Соус",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1684534125661-614f59f16f2e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 5,
        name: "Огурцы",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
      {
        id: 6,
        name: "Котлета дополнительная",
        price: 120,
        image:
          "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww",
      },
    ],
    information: {
      id: 14,
      composition: "Булочка, две котлеты, двойной сыр, соус, овощи",
      description: "Сырная мощь и много мяса — как ты любишь.",
      fats: 28,
      proteins: 34,
      carbohydrates: 28,
      calories: 650,
    },
  },
  {
    id: 15,
    name: "Кола",
    image:
      "https://plus.unsplash.com/premium_photo-1676979223508-1509a7dc4571?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbmslMjBiZXZlcmFnZSUyMGNvY2ElMjBjb2xhfGVufDB8fDB8fHww",
    price: 99.9,
    group: [2],
    subgroup: ["Газированные"],
    types: [
      {
        id: 1,
        name: "0.33 л",
        price: 79.9,
      },
      {
        id: 2,
        name: "0.5 л",
        price: 99.9,
      },
      {
        id: 3,
        name: "1 л",
        price: 149.9,
      },
    ],
    ingredients: null,
    information: null,
  },
  {
    id: 16,
    name: "Спрайт",
    image:
      "https://plus.unsplash.com/premium_photo-1674461536261-99491025b4ed?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbmslMjBiZXZlcmFnZSUyMHNwcml0ZXxlbnwwfHwwfHx8MA%3D%3D",
    price: 99.9,
    group: [2],
    subgroup: ["Газированные"],
    types: [
      {
        id: 1,
        name: "0.33 л",
        price: 79.9,
      },
      {
        id: 2,
        name: "0.5 л",
        price: 99.9,
      },
      {
        id: 3,
        name: "1 л",
        price: 149.9,
      },
    ],
    ingredients: null,
    information: null,
  },
  {
    id: 17,
    name: "Апельсиновый фреш",
    image:
      "https://plus.unsplash.com/premium_photo-1687871815451-7afab362a64c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbmslMjBiZXZlcmFnZXxlbnwwfHwwfHx8MA%3D%3D",
    price: 189.9,
    group: [1, 2],
    subgroup: ["Свежевыжатые"],
    types: [
      {
        id: 1,
        name: "0.3 л",
        price: 189.9,
      },
      {
        id: 2,
        name: "0.5 л",
        price: 259.9,
      },
    ],
    ingredients: null,
    information: {
      id: 17,
      composition: "Свежевыжатый апельсиновый сок",
      description: "100% апельсин, без сахара и без добавок.",
      fats: 0,
      proteins: 2,
      carbohydrates: 18,
      calories: 90,
    },
  },
  {
    id: 18,
    name: "Домашний лимонад (лимон-мята)",
    image:
      "https://plus.unsplash.com/premium_photo-1668146929114-78f099e7845a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbmslMjBiZXZlcmFnZSUyMGxlbW9uYWRlfGVufDB8fDB8fHww",
    price: 159.9,
    group: [2],
    subgroup: ["Напитки", "Лимонады"],
    types: [
      {
        id: 1,
        name: "0.3 л",
        price: 129.9,
      },
      {
        id: 2,
        name: "0.5 л",
        price: 159.9,
      },
      {
        id: 3,
        name: "1 л",
        price: 279.9,
      },
    ],
    ingredients: null,
    information: null,
  },
  {
    id: 19,
    name: "Латте",
    image:
      "https://plus.unsplash.com/premium_photo-1669687924894-55203ff8750d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbmslMjBiZXZlcmFnZSUyMGxhdHRlfGVufDB8fDB8fHww",
    price: 159.9,
    group: [2],
    subgroup: ["Кофе"],
    types: [
      {
        id: 1,
        name: "S",
        price: 159.9,
      },
      {
        id: 2,
        name: "M",
        price: 189.9,
      },
      {
        id: 3,
        name: "L",
        price: 219.9,
      },
    ],
    ingredients: null,
    information: {
      id: 19,
      composition: "Эспрессо, молоко",
      description: "Мягкий кофейный напиток с шелковистой молочной пенкой.",
      fats: 8,
      proteins: 7,
      carbohydrates: 12,
      calories: 160,
    },
  },
  {
    id: 20,
    name: "Капучино",
    image:
      "https://plus.unsplash.com/premium_photo-1669687924859-f04cf02a12c0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbmslMjBiZXZlcmFnZSUyMGNhcHB1Y2Npbm98ZW58MHx8MHx8fDA%3D",
    price: 149.9,
    group: [2],
    subgroup: ["Кофе"],
    types: [
      {
        id: 1,
        name: "S",
        price: 149.9,
      },
      {
        id: 2,
        name: "M",
        price: 179.9,
      },
      {
        id: 3,
        name: "L",
        price: 209.9,
      },
    ],
    ingredients: null,
    information: {
      id: 20,
      composition: "Эспрессо, молоко, молочная пена",
      description: "Классика с приятной горчинкой и объёмной пенкой.",
      fats: 7,
      proteins: 6,
      carbohydrates: 10,
      calories: 140,
    },
  },
  {
    id: 21,
    name: "Чай жасмин",
    image:
      "https://plus.unsplash.com/premium_photo-1730833407702-253d157ffd7a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbmslMjBiZXZlcmFnZSUyMGphc21pbmUlMjB0ZWF8ZW58MHx8MHx8fDA%3D",
    price: 89.9,
    group: [2],
    subgroup: ["Чай"],
    types: [
      {
        id: 1,
        name: "S",
        price: 89.9,
      },
      {
        id: 2,
        name: "L",
        price: 109.9,
      },
    ],
    ingredients: null,
    information: null,
  },
  {
    id: 22,
    name: "Цезарь с курицей",
    image:
      "https://plus.unsplash.com/premium_photo-1664392068994-9277c9ed4837?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWQlMjBjaGlja2VuJTIwY2Flc2FyfGVufDB8fDB8fHww",
    price: 249.9,
    group: [5],
    subgroup: ["Цезарь"],
    types: [
      {
        id: 1,
        name: "Маленький",
        price: 249.9,
      },
      {
        id: 2,
        name: "Большой",
        price: 329.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Пармезан",
        price: 50,
        image:
          "https://plus.unsplash.com/premium_photo-1667239466000-f2aeaa83af5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGNhZXNhcnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 2,
        name: "Сухарики",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1667239466000-f2aeaa83af5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGNhZXNhcnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 3,
        name: "Соус Цезарь",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1723575734758-97e6e862a670?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2Flc2FyJTIwc2F1Y2UlMjBjaGlja2VufGVufDB8fDB8fHww",
      },
      {
        id: 4,
        name: "Курица",
        price: 80,
        image:
          "https://plus.unsplash.com/premium_photo-1667239466000-f2aeaa83af5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGNhZXNhcnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "Креветки",
        price: 120,
        image:
          "https://plus.unsplash.com/premium_photo-1674498270206-3e6861930f54?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hyaW1wJTIwY2hpY2tlbiUyMGNhZXNhcnxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
    information: {
      id: 22,
      composition:
        "Курица, романо, помидоры черри, пармезан, сухарики, соус Цезарь",
      description: "Сытный и свежий салат с нежной курицей.",
      fats: 14,
      proteins: 22,
      carbohydrates: 10,
      calories: 290,
    },
  },
  {
    id: 23,
    name: "Цезарь с креветками",
    image:
      "https://plus.unsplash.com/premium_photo-1700089483464-4f76cc3d360b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWQlMjBjYWVzYXJ8ZW58MHx8MHx8fDA%3D",
    price: 299.9,
    group: [5],
    subgroup: ["Цезарь"],
    types: [
      {
        id: 1,
        name: "Маленький",
        price: 299.9,
      },
      {
        id: 2,
        name: "Большой",
        price: 389.9,
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Пармезан",
        price: 50,
        image:
          "https://plus.unsplash.com/premium_photo-1738099524754-251c3c2d2b40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2Flc2FyJTIwc2hyaW1wfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Сухарики",
        price: 20,
        image:
          "https://plus.unsplash.com/premium_photo-1738099524754-251c3c2d2b40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2Flc2FyJTIwc2hyaW1wfGVufDB8fDB8fHww",
      },
      {
        id: 3,
        name: "Соус Цезарь",
        price: 30,
        image:
          "https://plus.unsplash.com/premium_photo-1674498270206-3e6861930f54?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2Flc2FyJTIwc2F1Y2UlMjBzaHJpbXB8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 4,
        name: "Курица",
        price: 80,
        image:
          "https://plus.unsplash.com/premium_photo-1674498270206-3e6861930f54?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGNhZXNhciUyMHNocmltcHxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "Креветки",
        price: 120,
        image:
          "https://plus.unsplash.com/premium_photo-1747953374155-63047f4c86e6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hyaW1wJTIwY2Flc2FyfGVufDB8fDB8fHww",
      },
    ],
    information: {
      id: 23,
      composition: "Креветки, романо, черри, пармезан, сухарики, соус Цезарь",
      description: "Морская версия легендарного салата.",
      fats: 13,
      proteins: 20,
      carbohydrates: 9,
      calories: 280,
    },
  },
  {
    id: 24,
    name: "Салат Греческий",
    image:
      "https://plus.unsplash.com/premium_photo-1690561082636-06237f98bfab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWQlMjBncmVla3xlbnwwfHwwfHx8MA%3D%3D",
    price: 229.9,
    group: [1, 5],
    subgroup: ["Овощные"],
    types: null,
    ingredients: null,
    information: {
      id: 24,
      composition: "Огурцы, помидоры, фета, оливки, лук, оливковое масло",
      description: "Лёгкий и освежающий салат из свежих овощей.",
      fats: 10,
      proteins: 6,
      carbohydrates: 11,
      calories: 180,
    },
  },
  {
    id: 25,
    name: "Салат Мексика",
    image:
      "https://plus.unsplash.com/premium_photo-1664392068994-9277c9ed4837?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWQlMjBtZXhpY2FufGVufDB8fDB8fHww",
    price: 227.9,
    group: [5],
    subgroup: ["Мексика"],
    types: null,
    ingredients: null,
    information: {
      id: 25,
      composition: "Кукуруза, фасоль, перец, томаты, салат, соус сальса",
      description: "Яркий салат с мексиканским характером.",
      fats: 12,
      proteins: 14,
      carbohydrates: 13,
      calories: 220,
    },
  },
  {
    id: 26,
    name: "Салат Нисуаз",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981770-307f61735af8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWQlMjBuaWNvaXNlfGVufDB8fDB8fHww",
    price: 279.9,
    group: [5],
    subgroup: ["Рыбные"],
    types: null,
    ingredients: null,
    information: {
      id: 26,
      composition: "Тунец, яйцо, фасоль, оливки, картофель, салат, винегрет",
      description: "Французская классика с тунцом и овощами.",
      fats: 15,
      proteins: 19,
      carbohydrates: 10,
      calories: 260,
    },
  },
  {
    id: 27,
    name: "Чизкейк Нью-Йорк",
    image:
      "https://plus.unsplash.com/premium_photo-1675371470292-a358dc213d0a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzc2VydCUyMHN3ZWV0JTIwY2hlZXNlY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
    price: 199.9,
    group: [6],
    subgroup: ["Чизкейк"],
    types: [
      {
        id: 1,
        name: "Кусочек",
        price: 199.9,
      },
      {
        id: 2,
        name: "Большой кусок",
        price: 279.9,
      },
    ],
    ingredients: null,
    information: {
      id: 27,
      composition: "Сыр креметте, печенье, сливки",
      description: "Нежный, сливочный, тает во рту.",
      fats: 20,
      proteins: 7,
      carbohydrates: 28,
      calories: 380,
    },
  },
  {
    id: 28,
    name: "Тирамису",
    image:
      "https://plus.unsplash.com/premium_photo-1695123862393-e93a4165fd29?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzc2VydCUyMHN3ZWV0JTIwdGlyYW1pc3V8ZW58MHx8MHx8fDA%3D",
    price: 229.9,
    group: [6],
    subgroup: ["Классика"],
    types: null,
    ingredients: null,
    information: {
      id: 28,
      composition: "Савоярди, маскарпоне, эспрессо, какао",
      description: "Итальянская легенда со сливочно-кофейным вкусом.",
      fats: 18,
      proteins: 6,
      carbohydrates: 29,
      calories: 360,
    },
  },
  {
    id: 29,
    name: "Брауни шоколадный",
    image:
      "https://plus.unsplash.com/premium_photo-1738105946794-3c82fca44783?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzc2VydCUyMHN3ZWV0JTIwYnJvd25pZSUyMGNvY2ElMjBjb2xhfGVufDB8fDB8fHww",
    price: 189.9,
    group: [6],
    subgroup: ["Шоколадные"],
    types: null,
    ingredients: null,
    information: {
      id: 29,
      composition: "Шоколад, какао, масло, мука",
      description: "Плотный, влажный и сверхшоколадный.",
      fats: 22,
      proteins: 5,
      carbohydrates: 32,
      calories: 420,
    },
  },
  {
    id: 30,
    name: "Мороженое пломбир",
    image:
      "https://plus.unsplash.com/premium_photo-1667683701928-ab179b86fc1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzc2VydCUyMHN3ZWV0JTIwaWNlJTIwY3JlYW18ZW58MHx8MHx8fDA%3D",
    price: 99.9,
    group: [6],
    subgroup: ["Мороженое"],
    types: [
      {
        id: 1,
        name: "1 шар",
        price: 99.9,
      },
      {
        id: 2,
        name: "2 шара",
        price: 169.9,
      },
      {
        id: 3,
        name: "3 шара",
        price: 229.9,
      },
    ],
    ingredients: null,
    information: {
      id: 30,
      composition: "Сливки, молоко, сахар, ваниль",
      description: "Классика, которую любят все.",
      fats: 11,
      proteins: 4,
      carbohydrates: 20,
      calories: 210,
    },
  },
  {
    id: 31,
    name: "Яблочный пирог",
    image:
      "https://plus.unsplash.com/premium_photo-1695865412393-af4d352b46cc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzc2VydCUyMHN3ZWV0JTIwYXBwbGUlMjBwaWV8ZW58MHx8MHx8fDA%3D",
    price: 169.9,
    group: [1, 6],
    subgroup: ["Выпечка"],
    types: null,
    ingredients: null,
    information: {
      id: 31,
      composition: "Тесто, яблоки, корица, сахар",
      description: "Тёплый и уютный вкус домашней выпечки.",
      fats: 12,
      proteins: 4,
      carbohydrates: 35,
      calories: 300,
    },
  },
  {
    id: 32,
    name: "Соус Барбекю",
    image:
      "https://plus.unsplash.com/premium_photo-1738071641789-286a9f297fea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBkaXAlMjBiYnF8ZW58MHx8MHx8fDA%3D",
    price: 39.9,
    group: [7],
    subgroup: ["Соусы", "Классические"],
    types: null,
    ingredients: null,
    information: null,
  },
  {
    id: 33,
    name: "Соус Сырный",
    image:
      "https://plus.unsplash.com/premium_photo-1677706562692-6c4e44434420?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBkaXAlMjBjaGVlc2V8ZW58MHx8MHx8fDA%3D",
    price: 39.9,
    group: [1, 7],
    subgroup: ["Сливочные"],
    types: null,
    ingredients: null,
    information: null,
  },
  {
    id: 34,
    name: "Соус Чесночный",
    image:
      "https://plus.unsplash.com/premium_photo-1699986347166-6ed8b07af5da?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBkaXAlMjBnYXJsaWN8ZW58MHx8MHx8fDA%3D",
    price: 39.9,
    group: [7],
    subgroup: ["Сливочные"],
    types: null,
    ingredients: null,
    information: null,
  },
  {
    id: 35,
    name: "Соус Кисло-сладкий",
    image:
      "https://plus.unsplash.com/premium_photo-1695865411429-fc175f8d408d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2F1Y2UlMjBkaXAlMjBzd2VldCUyMGFuZCUyMHNvdXJ8ZW58MHx8MHx8fDA%3D",
    price: 39.9,
    group: [7],
    subgroup: ["Азиатские"],
    types: null,
    ingredients: null,
    information: null,
  },
  {
    id: 36,
    name: "Паста Карбонара",
    image:
      "https://plus.unsplash.com/premium_photo-1676651534637-f1906933aef4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90JTIwZGlzaCUyMG1haW4lMjBjb3Vyc2UlMjBwYXN0YSUyMGNhcmJvbmFyYXxlbnwwfHwwfHx8MA%3D%3D",
    price: 349.9,
    group: [8],
    subgroup: ["Паста"],
    types: null,
    ingredients: null,
    information: {
      id: 36,
      composition: "Спагетти, бекон, сливки, пармезан, яйцо",
      description: "Кремовая паста с беконом и сыром.",
      fats: 19,
      proteins: 18,
      carbohydrates: 55,
      calories: 620,
    },
  },
  {
    id: 37,
    name: "Курица терияки с рисом",
    image:
      "https://plus.unsplash.com/premium_photo-1667807522245-ae3de2a7813a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90JTIwZGlzaCUyMG1haW4lMjBjb3Vyc2UlMjBjaGlja2VuJTIwdGVyaXlha2l8ZW58MHx8MHx8fDA%3D",
    price: 329.9,
    group: [1, 8],
    subgroup: ["Вок"],
    types: null,
    ingredients: null,
    information: {
      id: 37,
      composition: "Курица, рис, овощи, соус терияки, кунжут",
      description: "Сбалансированное блюдо в азиатском стиле.",
      fats: 12,
      proteins: 24,
      carbohydrates: 48,
      calories: 520,
    },
  },
  {
    id: 38,
    name: "Лосось на гриле",
    image:
      "https://plus.unsplash.com/premium_photo-1692309186544-676236cdab1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90JTIwZGlzaCUyMG1haW4lMjBjb3Vyc2UlMjBzYWxtb258ZW58MHx8MHx8fDA%3D",
    price: 549.9,
    group: [8],
    subgroup: ["Рыба"],
    types: null,
    ingredients: null,
    information: {
      id: 38,
      composition: "Филе лосося, лимон, травы, масло",
      description: "Сочный лосось с хрустящей корочкой.",
      fats: 16,
      proteins: 30,
      carbohydrates: 3,
      calories: 360,
    },
  },
  {
    id: 39,
    name: "Том Ям",
    image:
      "https://plus.unsplash.com/premium_photo-1669831178095-005ed789250a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c291cHxlbnwwfHwwfHx8MA%3D%3D",
    price: 399.9,
    group: [9],
    subgroup: ["Азиатские"],
    types: null,
    ingredients: null,
    information: {
      id: 39,
      composition: "Креветки/курица, кокосовое молоко, лемонграсс, лайм, чили",
      description: "Острый и кислый суп с насыщенным ароматом.",
      fats: 9,
      proteins: 10,
      carbohydrates: 12,
      calories: 180,
    },
  },
  {
    id: 40,
    name: "Крем-суп грибной",
    image:
      "https://plus.unsplash.com/premium_photo-1671377388704-c7b6a543dde8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c291cCUyMGNyZWFtJTIwc291cCUyMG11c2hyb29tfGVufDB8fDB8fHww",
    price: 249.9,
    group: [9],
    subgroup: ["Пюре"],
    types: null,
    ingredients: null,
    information: {
      id: 40,
      composition: "Шампиньоны, сливки, лук, чеснок, зелень",
      description: "Нежный сливочный суп с ярким грибным вкусом.",
      fats: 8,
      proteins: 6,
      carbohydrates: 11,
      calories: 160,
    },
  },
];
