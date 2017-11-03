const http = require('http'),
    express = require('express'),
    mysql = require('mysql'),
    parser = require('body-parser'),
    steam = require('steam-login'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    cookie = require('cookie'),
    crypto = require('crypto'),
    NanoTimer = require('nanotimer'),
    async = require('async');

const port = process.env.PORT || 5000;

const secret = 'joaa2ssd';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hyperdraft'
});

try {
    connection.connect();
} catch (e){
    console.log('Database Connection Failed: '+e);
}

const app = express();

const helper = require('./general');
const io = require('socket.io')(app.listen(port));
const appRoutes = require('./routes')(router, io, connection);
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.use(steam.middleware({
    realm: 'https://nerdom.co',
    verify: 'https://nerdom.co/api/verify',
    apiKey: 'F0805751E388F454DEE0AC10C0B675A5'}
));
app.use('/api', appRoutes);

app.get('*', function(req, res){
    res.send('Its Alive!');
});


/*const items = [
        {
            weapon: {
                name: "★ M9 Bayonet | Fade (Factory New)",
                price: 301.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KlsjyMr_UqWdY781lteXA54vwxgLi-0FrNWqiI4CWIw5sYQnY81m3xLjs18LouZjNwXc3uCF27SuOy0SpwUYbghNKfR8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P90 | Asiimov (Factory New)",
                price: 20.19,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIXBD_9W_mY-dqPv9NLPFqWdQ-sJ0xLnC9Nvz31K3-0BuMGD7d4PGIQM-ZwuDrgS3w7zshsO5tJ7PmHoysig8pSGKpkWB0BI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Aquamarine Revenge (Factory New)",
                price: 33.9,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWdY781lxLuW8Njw31Dn8xc_YTqmJ4DDJFM2ZwqE_ATtx-u7g8C5vpjOzHM263E8pSGKJ1XuG9M/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Hellfire (Field-Tested)",
                price: 7.26,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09SzmIyNnuXxDLbUkmJE5fp9i_vG8ML33Absr0o9YmjyIIbAJFM7YVvUq1HowbjsjZe5tJ_IyCRq63F24X6PgVXp1iJDp8Rl/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P90 | Elite Build (Minimal Wear)",
                price: 0.2,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIQJP7c-ikZKSqPv9NLPFqWdQ-sJ0xO-UrYrz3AztqEpuNT-iLNWTJwJtZVrY-1XskLrvhMW_uZ-dn3Iy6CY8pSGK7PES7n8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Water Elemental (Factory New)",
                price: 7.27,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRd4cJ5ntbN9J7yjRrl_kI5amz3cdKRI1NoY1CDqQK7xLrv1se47pnKmHU3syYm4SnemUTkn1gSOYPIEaei/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Specialist Gloves | Emerald Web (Field-Tested)",
                price: 357.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDL7ck3lQ5MFOnezDyoHwjF2hpiwwMiukcZjGJg85NQnR81LolObogsLo6MvJzHBlsyl04nvUmke-hxEfPeVojPXKVxzAUDsQyVOl/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDL7ck3lQ5MFOnezDyoHwjF2hpiwwMiukcZjGJg85NQnR81LolObogsLo6MvJzHBlsyl04nvUmke-hxEfPeVojPXKVxzAUDsQyVOl/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Vulcan (Battle-Scarred)",
                price: 13.99,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj8NrrHj1Rd6dd2j6fA9ImniQex_UQ_NT-nJtKRJgU3aFHY_Vm-ybrqjMO56Z3OnXE27HIq-z-DyAtSAyL7/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Chantico's Fire (Field-Tested)",
                price: 14.4,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j_v--InxgUG5lB89IT6mOtSUcFVvaFHR_QXrkOi808O1uJ6czCQyuXUhtC7cmkSx0BpPb-Nu0_yACQLJ3UbJPy4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Fire Serpent (Battle-Scarred)",
                price: 124.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszOeC9H_9mkhIWFg8j1OO-GqWlD6dN-teHE9Jrst1i1uRQ5fW3yI9WRcw83YViCr1DswO680JW57cjPwXcwvXQrtHbUmByzgkkZOuJxxavJ1uEsotc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Decimator (Field-Tested)",
                price: 7.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDL_UlWJc6dF-mNbM8Ij8nVn6rhFtYmyiJ4SWJAc4NQvS8ge9xb3v1J65usmbnCY17CMr5CvYmkG1hgYMMLJencFQUA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Dragon Lore (Minimal Wear)",
                price: 1760.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5Mx2gv2P9o6migzl_Us5ZmCmLYDDJgU9NA6B81S5yezvg8e-7cycnXJgvHZx5WGdwUJqz1Tl4g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Kill Confirmed (Well-Worn)",
                price: 25.45,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh4DPzixc9OLcQU2Z1vQ_FfrwbvnhJ6-uJ_PnXAyuCUmtHfenRW00h5MPOVt1_KYHULeWfL4W83H_Q/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Moto Gloves | Cool Mint (Field-Tested)",
                price: 281.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDK_Dn2pf78l0tevN4InKhVGwogYxDDWiZtHAbAc4ZVDZ_AO9wry-18S5v8-fmHNjsylx7HqJmR3liUlKO-Ju1vGZHVmAR_se7dA8TbI/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDK_Dn2pf78l0tevN4InKhVGwogYxDDWiZtHAbAc4ZVDZ_AO9wry-18S5v8-fmHNjsylx7HqJmR3liUlKO-Ju1vGZHVmAR_se7dA8TbI/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Tiger Tooth (Factory New)",
                price: 410.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GFqOP9NL7DqWRD6ct2j9bN_Iv9nBrmrRY_NmmhJIDEegJtNFqCqFfrwOu6gsXov8zKziRnuiB0537VlhG3n1gSOW5JgsIr/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Doppler Ruby (Factory New)",
                price: 1350.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJQ-d6vq42KhfX4NrLLk29u5Mx2gv2P9o6njA3mrxVrNm2iItXAdAY7ZFuEq1e2wri-gsTousjBn3Nqs3Fw5GGdwUIbpPL9uQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Black Laminate (Field-Tested)",
                price: 9.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KcqPrxN7LEm1Rd6dd2j6eTrdul2QLt-xZvMj3xIoSXdgQ-YF2GrgPsw7u9jZe7vpTInHNg7ycq-z-DyKKSrF1I/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Royal Legion (Field-Tested)",
                price: 0.41,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4Tck29Y_chOhujT8om721DjqBU4YW72IoTAdwdqMFvY_1W3ye_sgpa878jPy3o27HUr5yuLyQv3308XfsBUmA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | X-Ray (Factory New)",
                price: 7.77,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszQYzxb09Hiq4yCkP_gDLfQhGxUpsAo2LDD99-s0QywrUdlY2ugJtTBdFA4NwqC_Va7kru8hZG9uZjBmyN9-n51YAq6eTE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Asiimov (Well-Worn)",
                price: 32.37,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ-sJ0xOzAot-jiQa3-hBqYzvzLdSVJlQ3NQvR-FfsxL3qh5e7vM6bzSA26Sg8pSGKJUPeNtY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P2000 | Scorpion (Factory New)",
                price: 1.02,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zJfAJR79OkhImEmcjkYeuBxlRd4cJ5ntbN9J7yjRrs_UBvYDj2LYPHIQBtZ1nT8wC6lObrgpW46Zucm3pr6XQh5iveyhSzn1gSOfRffSvr/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Kill Confirmed (Field-Tested)",
                price: 28.6,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh4DPzixc9OLcQU2Z1vQ_FfrwbvnhJ6-uJ_PnXAyuCUmtHfenRW00h5MPOVt1_KYHULeWfL4W83H_Q/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Sport Gloves | Hedge Maze (Field-Tested)",
                price: 391.06,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eOxhoWOmcj5Nr_Yg2Zu5MRjjeyPpdX22gbhqkppMWz7coGcIAE9ZVvV8le2wOq7h5TotM7My3FkuCEk42GdwUK5qPdDsA/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eOxhoWOmcj5Nr_Yg2Zu5MRjjeyPpdX22gbhqkppMWz7coGcIAE9ZVvV8le2wOq7h5TotM7My3FkuCEk42GdwUK5qPdDsA/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Shadow Daggers | Doppler (Factory New)",
                price: 236.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD4eOym5Cbm_LmDKvZl3hUvPp9g-7J4cKg0AyxqUM4NWn0JIWWIAY6NVnQrAftxr3mhJHqvZmbySRgs3Mq7XmOgVXp1nQeST2E/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Isaac (Factory New)",
                price: 1.85,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b092lnYmGmOHLP7LWnn9u5MRjjeyPrI2hjlbtqRE6ZT_zJYSVe1Q2NwzTrwfolLq-hMPp78uayCdm6ylz5mGdwUJXtvY84A/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bloodhound Gloves | Guerrilla (Field-Tested)",
                price: 219.94,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAR0hwIQFTibipJAhk2_zdfzl969C5goWYqPX4PLTVnmRE5sFOjfzE5578hFi1lB45NzC2eenJI0RpNEbX-Fa5xuvohJ_t6pzJzScyuyYl5X7alkfmhBEZb7M9gvzITQ3PUfYaAuDcUW_UGkXA/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAR0hwIQFTibipJAhk2_zdfzl969C5goWYqPX4PLTVnmRE5sFOjfzE5578hFi1lB45NzC2eenJI0RpNEbX-Fa5xuvohJ_t6pzJzScyuyYl5X7alkfmhBEZb7M9gvzITQ3PUfYaAuDcUW_UGkXA/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Doppler (Factory New)",
                price: 520.0,
                image: "https://steamcommunity-a.opskins.media/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPP7I6vdk3lu-M1wmeyQyoD8j1yg5RVtMmCmctOWJlI-YwyD_VG8w-nohsPt78zKz3Zhsygq4HnczEHk0k5SLrs4Un2yL0k/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Cyrex (Field-Tested)",
                price: 1.56,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRc7cF4n-T--Y3nj1H68xU4YG-mdtPEdQ9tMFrX-AXtxL_vhpfptcvMzHVrviFw433emEGzhgYMMLLdmCIa3w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Safari Mesh (Field-Tested)",
                price: 0.12,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q42Ok_7hPoTdl3lW7Yt3iOuRrdT32wPk-UI9YW_xJo_HewJoZwuE8lbryejsh5bv7ZmYmiFjpGB8shCX1QG8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Orion (Factory New)",
                price: 11.63,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnI7LFkGJD7fp9g-7J4bP5iUazrl1ka2qhLIGSIw5vZF-D8wXqwO_tjcC-uZjJnSY3vCkmsXbYlkO0gB1McKUx0vNO72r1/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Safari Mesh (Field-Tested)",
                price: 74.64,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zbYQJP6c--q5SKmcj5Nr_Yg2Zu5MRjjeyPp9Ws0QDjqEpuNmjxJdDBIVc4ZV7U-FG8kuztgZHttMmYznFg6SQk7WGdwUKUDs9gvQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Bright Water (Minimal Wear)",
                price: 3.75,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-ElPL1PYTThGpH5_p9g-7J4bP5iUazrl1rMmD3JoKRew88Z1nV-VS5xOzpjMfqvZrNznFg73Rx4i2IyxDh0E0ecKUx0mgVIkh6/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Rust Coat (Battle-Scarred)",
                price: 115.33,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KhsjnJ77UmlRa5sx3j9bJ8I3jkWu4qgE7Nnf7IoCdJA85NAvXrgO3xLu9gZLotZvImHY1s3V04nqJzBTmhEpPZ-Q6m7XAHhi2BnJN/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Kill Confirmed (Minimal Wear)",
                price: 40.1,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP5gVO8vywwMiukcZjEcVc5M1CG-1jtyLi9jJW97pzBmnM27nQlsSvfnkGzhU1OPeY8h6CeVxzAUEsa6pHf/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Safari Mesh (Field-Tested)",
                price: 91.58,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Yh8j5NqjZqX9Q5vp8j-3I4IHKhFWmrBZyMGj2JNWReg43MF_Y_AO2yOrshMLov5vPwXVn6yF2tirfzRSw1B1MbPsv26I55_R-ww/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MP9 | Deadly Poison (Factory New)",
                price: 0.65,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAR17P7YKAJG6d2ymJm0h_j9ILTfqWdY781lteXA54vwxgTj_EVlZG-mI4acJ1U5M13Q-QXqxrvrgsS075TPy3FgsiYj4C3Yy0SpwUYb0AETg9w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P250 | Asiimov (Minimal Wear)",
                price: 12.1,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS092lnYmGmOHLP7LWnn9u5MRjjeyPoo_2jgDi_hVrNzr2IdKXJg84YVzW_wW6weq8hJbv7s7BmnZnuHN3sGGdwUIcgRyEsg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Hyper Beast (Well-Worn)",
                price: 7.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoHwjF2hpiwwMiukcZiQJAJvMwqGrAW-wubnjJe4uZXMwCRq6yIgsXyMnEPhiE4ZbOBs0aeeVxzAUEeAasNQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Hyper Beast (Factory New)",
                price: 54.7,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tdn2xZ_Ismju2To9qm31Hsr0ZsMTryJo_BcANrMwyCrFLrx7vrhJa1vZrByXo2pGB8sr2_Epwm/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Ice Cap (Minimal Wear)",
                price: 0.11,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhh3szcdD59teOlkYG0hPb4J4Tdn2xZ_Pp9i_vG8MKi2gKy_Es6N2H0JtfEcFVtNwuBqFjvwevu15Luu5SaynNn7iUitHuIgVXp1hWR0d90/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Vulcan (Well-Worn)",
                price: 22.2,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj5Nr_Yg2YfvZcg0rmXrI2n31ex8ks9Zjz2JIKdcVA4ZArRqVm-wLzn1sC8uJnMwWwj5HcoJjKuZA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Stained (Well-Worn)",
                price: 61.42,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxT09q5hoOOk8j5Nr_Yg2Zu5MRjjeyPotqg2gDgrUU5Zm-nJdKVdg5vNAyG8wTvwum5hMXptJnAnHZi7nIitmGdwUII6z1SkA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Lore (Minimal Wear)",
                price: 220.53,
                image: "http://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJB-eOwmImbqPv7Ib7ummJW4NFOhujT8om7jFLk-BFvYmH1d4eVdwA5Z1zX-gW8kL3ohsO47siYynVm7HV2tynamAv3308tGiHD0w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Blue Fissure (Factory New)",
                price: 5.81,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf2-r3ci9D_cmzmJWZksj4OrzZglRd6dd2j6eZ8NWijVbl_BJsYjz0J9WRdVc2aFDX_Fm7lenrhcS_uJmYnCBh6XIq-z-DyEnn8nMM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MAC-10 | Neon Rider (Minimal Wear)",
                price: 3.5,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0Ob3fDxBvYyJmoWEmeX9N77DqWdY781lteXA54vwxlHl8hc5Y2nxcYHGcFJoNFiB-FXslby8gJDq6svBwHI26SQntH-JmUepwUYbVDDJYDE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Cyrex (Battle-Scarred)",
                price: 6.47,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp5j-jX7LP5iUazrl1uMG_1dYHDdQY-Zl3Xq1m_yey7gMS9uZ3JwCFruSh3tHbYmUO21xtMcKUx0jge81b4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Safari Mesh (Minimal Wear)",
                price: 0.32,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q4yCkP_gDLfQhGxUppYn2rHC94n30Va2-kVvMT-nJtTAIVQ6NAqDqQS8xOnp15_v7ZrBnXt9-n51vIDunR4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Doppler Black Pearl (Factory New)",
                price: 230.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP0966lYOAh_L1Ibfum2pD6sl0g_PE8bP5gVO8v11tZzqhLYGRIw86aQ2G81i3k-bog8XptcjIynFi7CB3sH6Jzh2_1BlFcKUx0ncN5NuB/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Shadow Daggers | Marble Fade (Factory New)",
                price: 149.77,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD4eO7lZKJm_LLNbrVk1Rd4cJ5nqfH9ommjgDnqkBsZGr6INLGJFc5YFHY8la2xrq915PovsifzyNgvCEj-z-DyBpnqknK/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Stained (Minimal Wear)",
                price: 60.33,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxT09q5hoOOk8j4OrzZglRd6dd2j6eS89n32AHjqERtYz-gIIKVcVA7ZQzT81a3l-rnh8C5vZycm3Rq7ihw-z-DyB1e9elV/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P250 | Mehndi (Factory New)",
                price: 7.52,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS086zkomFkvPLP7LWnn9u5MRjjeyPrIj02wy2qEZqYjv1IYGTdwM7M1nX-lHryLvuhcLo7s7My3tqvnMk4mGdwUL_7jJtRA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ AWP | Man-o'-war (Minimal Wear)",
                price: 34.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZt7PLfYQJF4NOkjb-HnvD8J4Tdl3lW7Ysi3rHE9ImljgGw_xc9a2_0JY6ddA48Z17U8gXqxe_mgse1tJ_AyXtjpGB8srCcYzyi/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZt7PLfYQJF4NOkjb-HnvD8J4Tdl3lW7Ysi3rHE9ImljgGw_xc9a2_0JY6ddA48Z17U8gXqxe_mgse1tJ_AyXtjpGB8srCcYzyi/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Chantico's Fire (Battle-Scarred)",
                price: 9.65,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j_v-_Yn0nk2LpxIuNDztJIadJlM9YFjTr1a8x7rogZ6_tJybz3pgvSUhtyyLmEHjhUsZbuZpgeveFwspreEVlA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Desert-Strike (Factory New)",
                price: 6.37,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszceClD4s-im5KGqPv9NLPFqWdQ-sJ0xOiQo93zjgKxqkFvMj_xcI_HIFJtYQnX_1boxO_phsDtvcydwXUyuSA8pSGKJZ_JCy4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Cyrex (Factory New)",
                price: 3.92,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRd4cJ5ntbN9J7yjRq3qhY6Zjz6cteSJwc3MluB_gfqx7juhpPou8ycyHBhviUrt3zZl0G3n1gSOddhMMaQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SG 553 | Aerial (Minimal Wear)",
                price: 0.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0Ob3YjoXuY-JlYWZnvb4DLfYkWNF18lwmO7Eu42k2gfs_EdsamyiLYDEewRvMAmDrlHox-q-gcDp6pjNnyNnvyV37X3D30vg15lPbYY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Fade (Factory New)",
                price: 172.15,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD7eOwlYSOqPv9NLPFqWdQ-sJ0xLGQpIqtjQy1rUE5Y2n1I4PGcgI5MFGD-wS3l-7r18TpucyanHpg6CE8pSGKbZ02GvY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Dragon Lore (Battle-Scarred)",
                price: 790.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu4MBwnPCPrI73jgLh-xY5ZDygJIGVd1Q6NVjRqVO8k-a5gMW4upzBwSEwuSl3t2GdwUKlZg2OYg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Lightning Strike (Factory New)",
                price: 60.18,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZt7P_BdjVW4tW4k7-KgOfLP7LWnn9u5MRjjeyPptuj2Qzt_0JsYDymJNDAIQ8-MA7U_1i3w-bphpO1v56bmHBk7yMksWGdwUJq4NI0lg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Redline (Minimal Wear)",
                price: 17.29,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJB496klb-HnvD8J4Tdl3lW7YtyjLuR9omjiVfl-kZtMW2iJ4bBelc2ZVjY-wTtxe3ohsXu6sydzSNnpGB8shVvZCcj/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "CZ75-Auto | Nitro (Minimal Wear)",
                price: 1.26,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZfwPz3fi9D4tuzq4GIlPL6J6iDqWdY781lteXA54vwxgzg_xE4ZT3zJdXAdVU4aFzY_FK8xr2615K47pvMm3owvXNx4XaLnUGpwUYb_7K30uE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ StatTrak™ Butterfly Knife | Slaughter (Minimal Wear)",
                price: 324.25,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqO3xManQqWdY781lteXA54vwxgyy_hduaz_7do6TcgFqaVvQ_1jtxbq5g5e07p7AwCdh7HEn4H6PzRGpwUYb-q86lXo/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqO3xManQqWdY781lteXA54vwxgyy_hduaz_7do6TcgFqaVvQ_1jtxbq5g5e07p7AwCdh7HEn4H6PzRGpwUYb-q86lXo/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Urban Masked (Field-Tested)",
                price: 65.67,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJR_OOilZCOqOLmMbrfqWZU7Mxkh9bN9J7yjRrh_hduZT_ydYGccgRqM13Xq1Xolbrt1sC6vp_JzCBh7ygj53vfnR3kn1gSOdeWAw8q/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Decimator (Factory New)",
                price: 14.35,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDL_UlWJc6dF-mNbN_Iv9nBrhqhVkYTz6LYSScVBtMliB_gDqwuu9h5-7vc_PynVrvXV37HfUyxPmn1gSOa-1kwUB/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDL_UlWJc6dF-mNbN_Iv9nBrhqhVkYTz6LYSScVBtMliB_gDqwuu9h5-7vc_PynVrvXV37HfUyxPmn1gSOa-1kwUB/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Elite Build (Factory New)",
                price: 3.56,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LP7LWnn9u5MRjjeyPod-l3VfkqRJoMWnxd9OQcQdoMljYqVO5xLi-g8e16JXOnSNh6XYlsGGdwUI-f1fsZg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Frontside Misty (Minimal Wear)",
                price: 15.4,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08u_mpSOhcjnI7TDglRd4cJ5ntbN9J7yjRrn8xA4Yj3yd9OSdFU7aVmF8wPvwrrpgpG47c7InHVjuiMm5ymOn0S2n1gSOR29uyL_/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Neon Revolution (Field-Tested)",
                price: 22.49,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV0924lZKIn-7LPr7Vn35c18lwmO7Eu9Wh3lHg-Us4MDylIIPEIVc_MlmDrALsxOe5hce7ucjOmnM3viAq4yrD30vgQUUy1Yw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bowie Knife | Doppler (Factory New)",
                price: 349.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMrbukmRB-Ml0mNbR_Y3mjQWLpxo7Oy3tJI6ddwM-aQ7S_VW-w-a8gcDuvZrKz3Rl63F05X7UyRGziRFJa-xvgeveFwsmoJhDFQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Dual Berettas | Duelist (Factory New)",
                price: 9.21,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf1OD3fDJW5Nmkq4-NqOfxMqndqW5d4dF0teXI8oTht1i1uRQ5fWvzJoXAdgJsYF6G-le6ku3tjJC-7pvAyCAw7nInsXvYnxC2hhxIPLZxxavJapqyNRo/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJf1OD3fDJW5Nmkq4-NqOfxMqndqW5d4dF0teXI8oTht1i1uRQ5fWvzJoXAdgJsYF6G-le6ku3tjJC-7pvAyCAw7nInsXvYnxC2hhxIPLZxxavJapqyNRo/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Howl (Factory New)",
                price: 1810.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTQmWAPFhVPot-AHiDhg-4cBrQJm1oe8HcFq8vdSXM7R-NYxNH5TUCPfTZAn960g91aRULZ2M8yK-2iq6JC5UDGH5rzzY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Lore (Minimal Wear)",
                price: 490.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zLZAJA7cW5moWfqPv7Ib7ummJW4NE_2b6T9tvw2FG3_UZoNWqhcYPBdwVraV-DqAPvku2-15e6vM7BmnVl7z5iuyjsDymLtA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Fire Serpent (Field-Tested)",
                price: 205.77,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszOeC9H_9mkhIWFg8j1OO-GqWlD6dN-teTE8YXghRrkqRVqMGzzIYeTIAVqaQuErlbvlb-80JfuusvJmHFr6SRxsXzfm0fkn1gSOc02RC4r/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SCAR-20 | Bloodsport (Factory New)",
                price: 2.83,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PTbTi5B7c7kxL-Jm_j7N6jBmXlF18l4jeHVyoD0mlOx5Rc4amClcdXGIAU_NVqFqVO3x7y80ZC-vMybnXprv3UksyrYn0GzhU1SLrs42O1g5dc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Sun in Leo (Field-Tested)",
                price: 1.34,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957OnHdTRD746JmYWPnuL5DLfQhGxUppQh3L2Wo96k3A228kI9NTzyIYKdegc4YFHX81Xol-a9hZW-uZTNyXJ9-n51oWQQ_Vc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Nova | Hyper Beast (Factory New)",
                price: 5.67,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhjxszGfitD09SvhIWZlfL1IK_ummJW4NFOhujT8om7jVfi_xZtMjjxJtLGdQ5oMF7Z-AC8w-jm1J-1upvAwXZh6CkjtizbyQv3308wMAGOhw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Boreal Forest (Well-Worn)",
                price: 98.8,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4iSqPH7Ib7CglRT59d0i-X--InxgUG5lB89IT6mOo_HIA44Y1iD_Qfswe3ngcS4vZ2cmCRmvCMk7HvZm0O1gkwfZuY8g_WACQLJNbmeHFc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Fire Serpent (Well-Worn)",
                price: 186.81,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszOeC9H_9mkhIWFg8j1OO-GqWlD6dN-teTE8YXghWu4qgE7NnfzdtCTIQM-ZFnWqFLqyb270ZHt6MyanHMxvHYitHzVzBHk1RtOarc8m7XAHlYw1xU4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Hellfire (Factory New)",
                price: 19.22,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09SzmIyNnuXxDLfYkWNF18lwmO7Eu4im3gPh80dsNzjycICVJwc3MwnS_AftwO_qhp_ptZ7MyCNj73Mq7H3D30vgbtpRt3U/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Orbit Mk01 (Minimal Wear)",
                price: 5.96,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJegJB49C5mpnbxsjmNr_ummJW4NFOhujT8om7igLs8xc9ZG_yIdSTJwE4NwnT_ge5xuu6h5a8tZzNnSFnvnQn5nzbzAv330_AxVvPyA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Cyrex (Minimal Wear)",
                price: 8.23,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp9g-7J4bP5iUazrl1tZ22hIIaQcVNsZluC_gC6xrjnhJS06c-bySdruih27Srfl0Oy0xEfcKUx0knZQYH9/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Blood Tiger (Minimal Wear)",
                price: 0.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09Svq5KOk-P9NL7DqWdY781lteXA54vwxgGw_ERkNW_zJ4bBJwI3Y1HWrFK6yO7nhJG0vcnBzSc1uCEntHaPlhWpwUYby7pd3Ws/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Kill Confirmed (Factory New)",
                price: 74.51,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP5gVO8vywwMiukcZjEcVc5M1CG-1jtyLi9jJW97pzBmnM27nQlsSvfnkGzhU1OPeY8h6CeVxzAUEsa6pHf/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Royal Blue (Minimal Wear)",
                price: 1.07,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09Svq4mFk_7zPITEhXtu5Mx2gv3--Y3nj1H6qhJoZWnzIYbBIQZoNVqE8la7w-y-jZC178ifmyRm7iVzt3vZnUO1hgYMMLJOVLO6Lw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Fuel Injector (Factory New)",
                price: 5.55,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhnwMzcdD4b08-jhIWZlP_1IbzUklRd4cJ5ntbN9J7yjRqx-BY-MGvzcoeVJ1drYVrX81HolOfqgpa_7pvJwHsy6XNz5CvclxW-n1gSOaNQCgyp/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhnwMzcdD4b08-jhIWZlP_1IbzUklRd4cJ5ntbN9J7yjRqx-BY-MGvzcoeVJ1drYVrX81HolOfqgpa_7pvJwHsy6XNz5CvclxW-n1gSOaNQCgyp/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ AK-47 | Redline (Field-Tested)",
                price: 25.99,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEm1Rd6dd2j6eQ9N2t2wK3-ENsZ23wcIKRdQE2NwyD_FK_kLq9gJDu7p_KyyRr7nNw-z-DyIFJbNUz/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEm1Rd6dd2j6eQ9N2t2wK3-ENsZ23wcIKRdQE2NwyD_FK_kLq9gJDu7p_KyyRr7nNw-z-DyIFJbNUz/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "P250 | Asiimov (Field-Tested)",
                price: 3.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS092lnYmGmOHLPr7Vn35c18lwmO7Eu4nwjQfs_kY-YmihJNeRcQ4-MgrT_1O5xr3n05S_7ZnBnyE3viIh5CnD30vgOqm4kmw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Emerald Pinstripe (Field-Tested)",
                price: 1.3,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYeDNR-M6_hIW0lvygZITck29Y_chOhujT8om72gK2qUJoNmCiJYDHJFA8ZFHW8lS8xrzog5C7vMvOyyM1unMl4X7bygv3308LPTeH-g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Weasel (Factory New)",
                price: 3.11,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-ckvbnNrfummJW4NFOhujT8om7jQTmrkU5Zmj6ItPHJlNrZV-D_1i7xufm08C8vZydnXRnvyEm4nrdmgv3309W5awQKQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Galil AR | Sage Spray (Field-Tested)",
                price: 0.03,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczbYQJR_M63jb-PkuTxIa_uhWpW7fp8j-3I4IHKhFWmrBZyMm_7IIKQJgVvaVqG-Ae6w7_u05fov5TNz3thvyMg4CmMmEPliBxJPfsv26JnrB-Q9g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "FAMAS | Mecha Industries (Minimal Wear)",
                price: 2.66,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf1OD3dzxP7c-JmYWIn_bLP7LWnn9u5MRjjeyP9t6jjAeyqBA_Ymz1ctOXdFRvYlvS_wTqxu29h5-8tZ-byidisiAr5mGdwULkZTnJQA/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf1OD3dzxP7c-JmYWIn_bLP7LWnn9u5MRjjeyP9t6jjAeyqBA_Ymz1ctOXdFRvYlvS_wTqxu29h5-8tZ-byidisiAr5mGdwULkZTnJQA/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Fuel Injector (Field-Tested)",
                price: 31.48,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV08-jhIWZlP_1IbzUklRc7cF4n-T--Y3nj1H6-hU-ZWmicYeTcQ82Yl_V-VG5yOa5hZbp6Z2fnHYw7yEn4i2ImEa10gYMMLLca3SSng/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Cyrex (Minimal Wear)",
                price: 2.52,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRd4cJ5ntbN9J7yjRq3qhY6Zjz6cteSJwc3MluB_gfqx7juhpPou8ycyHBhviUrt3zZl0G3n1gSOddhMMaQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRd4cJ5ntbN9J7yjRq3qhY6Zjz6cteSJwc3MluB_gfqx7juhpPou8ycyHBhviUrt3zZl0G3n1gSOddhMMaQ/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Master Piece (Battle-Scarred)",
                price: 13.9,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuhWJd7ctyj9bJ8I3jkWu4qgE7NnfyJI_He1doNQnR-lTowejvh8S-7p-azCQyuCchs3aOnR3khh4YOLFsm7XAHuqvsTNd/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Twilight Galaxy (Factory New)",
                price: 10.99,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73cCxX7eOwmIWInOTLP7LWnn9u5MRjjeyP8Nvx3AW3rkc4MT_zd9KXe1A_NArTrgDvxL26hcTuu5jKmCA3uyki5mGdwULO2eKnFg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Wasteland Rebel (Minimal Wear)",
                price: 25.07,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszcYzRA-cizq4GAw6DLP7LWnn9u5MRjjeyP89z2i1KxrhJkMm3wJtedcFVoZQ6C_Qe-xe_u1JG-uMmbm3ZgviUrtGGdwULRVQuqfg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Elite Build (Field-Tested)",
                price: 3.85,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqPrxN7LEm1Rd6dd2j6fDrNzz3lXmqENlY2yiIoecdg48YlCBqFW_l-a708C96Z_KzCdl7HF2-z-DyCGf5u7A/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Reactor (Well-Worn)",
                price: 1.1,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73fyhB4Nm3hr-bluPgNqnfx1RW5MpygdbM8Ij8nVmLpxIuNDztLNeXegQ3YQzV-li9ye_pjZW0uJvJnCFguCAhtHvVzhG01U4fauZmg-veFwv4TERPOw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Oni Taiji (Factory New)",
                price: 62.32,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK7dK4jYG0m_7zO6_ummpD78A_j-2S9tzwiwSx_BY9a2z0LIecegVoZgmCq1Tqwuvn1pS6vM7PznZq6D5iuyiTFK4_Bw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Frontside Misty (Battle-Scarred)",
                price: 8.25,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08u_mpSOhcjnI7TDglRZ7cRnk9bN9J7yjRrt-RBpMWCnIoLEJgFrZ17S_lnskru5gJS-6JzByntl6SAr5HuPmBWyn1gSOeBbOGui/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ StatTrak™ Flip Knife | Tiger Tooth (Factory New)",
                price: 201.61,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4uOinYeOhcj7IbrfkW5u5Mx2gv3--Y3nj1H6_0dtMGmnJtXDdgQ5NVHQrAO-xue6jZTt6p2dyXVn6SFwsy6JnhbihQYMMLJJD10GFg/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4uOinYeOhcj7IbrfkW5u5Mx2gv3--Y3nj1H6_0dtMGmnJtXDdgQ5NVHQrAO-xue6jZTt6p2dyXVn6SFwsy6JnhbihQYMMLJJD10GFg/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Para Green (Minimal Wear)",
                price: 0.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ08-5q4uDlvz9DLzDk25f18l4jeHVyoD0mlOx5UZoZTvwcdSddwBsMw7SqwTrkrvtjMO-tJjLz3pr7nRzsH7emha20x9SLrs4LhAglGw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Torque (Minimal Wear)",
                price: 0.65,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbTWhG5C-8xnteXI8oTht1i1uRQ5fWDyd9LAdQ4_MgzQqVm7wey918TuupufynUw6Sd05C2MyRfmgBgfbuBxxavJa8F12Qc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ AWP | Asiimov (Field-Tested)",
                price: 112.88,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ-sJ0xOzAot-jiQa3-hBqYzvzLdSVJlQ3NQvR-FfsxL3qh5e7vM6bzSA26Sg8pSGKJUPeNtY/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ-sJ0xOzAot-jiQa3-hBqYzvzLdSVJlQ3NQvR-FfsxL3qh5e7vM6bzSA26Sg8pSGKJUPeNtY/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Sport Gloves | Pandora's Box (Field-Tested)",
                price: 757.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eOmgZKbm_LLPr7Vn35c18lwmO7Eu9ut2Fa1rUFtMmiiJdKWIFI5ZgmCqFe9kOy80Z7v7cnImHpkuSQqtHfD30vgHujwGg0/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ AK-47 | Vulcan (Field-Tested)",
                price: 84.78,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj5Nr_Yg2Zu5MRjjeyPoN6k0ATi8hJuZDqmLY7Ed1M7YVzY-Qe4xLzu1p68vc_BmiRjviQn7WGdwUJ150pPUQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj5Nr_Yg2Zu5MRjjeyPoN6k0ATi8hJuZDqmLY7Ed1M7YVzY-Qe4xLzu1p68vc_BmiRjviQn7WGdwUJ150pPUQ/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Golden Coil (Minimal Wear)",
                price: 17.48,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITCmGpa7cd4nuz-8oP5jGu4ohQ0JwavdcTCJxg7ZlyBqQS5xrvuhZK46M-fyiNgsid053_dzRe_hx9Pbec6jPKaH1ueGeUXSzRAor56/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SSG 08 | Necropos (Factory New)",
                price: 1.02,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJmoWIhfjkPKjummJW4NFOhujT8om7i1DmrUBuMjjzJ4KcJ1JtMAzTqwTokLvnhcS5vJSfmndqvCJz5y3enwv330_MO8kGzA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Master Piece (Minimal Wear)",
                price: 35.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuhWJd7ctyj9bN_Iv9nGu4qgE7NnemII7BcgA5aVuF_wK4kufm15TqupidzyFruCgr5CyIlhK0iE5Mb-1um7XAHhVEIznY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Hyper Beast (Well-Worn)",
                price: 20.59,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tck29Y_chOhujT8om7jQWwqhdoYmz0IIDEdgE7YFDTqQC7w-bs1Je6v8_AnCYxs3NzsCqPywv330-KxuSQ1w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Royal Blue (Field-Tested)",
                price: 0.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09Svq4mFk_7zPITEhXtu5cB1g_zMyoD0mlOx5URpMD-gINPGcVRrNwrT_1K-l-y8jJO7v5ucyXVl7ygqsH2JzUaygRxSLrs4ksTxI5Q/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Falchion Knife | Tiger Tooth (Factory New)",
                price: 149.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1fLEcjVL49KJlY60g_7zNqnumXlQ5sJ0teXI8oThxlfg_UQ_NmGlI4WdJlI3MwuF8gLqxr-5gJK6vZ2fwHNrvHRzsSvemRepwUYbfQ7bq_U/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Doppler Ruby (Factory New)",
                price: 2246.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20heL2KoTcl3lT5MB4kOzFyoD8j1yg5UNkaz_xIdfEd1A5aQ3U-lPskunphJHptZvPwSM26CUht3_UmUe3gEpSLrs4ZlidBgY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Vulcan (Minimal Wear)",
                price: 40.77,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj4OrzZglRd6dd2j6eUrd-jiwfsr0BsYG6iIdeUJA8-Nw6EqVntyLrv15-4v5vOmiNr73Z2-z-DyAddTn8e/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Isaac (Well-Worn)",
                price: 0.27,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b092lnYmGmOHLPr7Vn35c18lwmO7Eu9ii3Vfhr0Foazj2I9CTJAVvaVGCrFLvyLu8gp_ttZ6dzSRiv3VwsX3D30vgmI_45mM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Case Hardened (Minimal Wear)",
                price: 32.98,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszHeDFH6OO6nYeDg8j4MqnWkyUIusYpjriToImhjQHg_EZkN2r0cY-RdAI3Z1jT-gS3kO_njZW_7pjB1zI97T2FIK3X/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Galil AR | Sugar Rush (Factory New)",
                price: 5.73,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczLZAJF7dC_mL-IlvnwKrjZl2RC18l4jeHVyoD0mlOx5URsMGindteTIQRqNFHZ_ATtx-jp1JS6vM_PyXYwvSYisH_czUe1gUxSLrs4lUwxnXw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Corticera (Field-Tested)",
                price: 6.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PXJZzhO7eO3g5C0mvLwOq7cqWdQ-sJ0xL6UotT33FDn-UBvMDj6cIfAdgFtN13Rr1folezp08S_tJ3NwSNm6HE8pSGKFALUdWg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Dragon Lore (Factory New)",
                price: 2474.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5Mx2gv2P9o6migzl_Us5ZmCmLYDDJgU9NA6B81S5yezvg8e-7cycnXJgvHZx5WGdwUJqz1Tl4g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Gamma Doppler (Factory New)",
                price: 560.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20kPb5PrrukmRB-Ml0mNbR_Y3mjQCLpxo7Oy3tddKScVVvYVzQq1a2lb2615Hu6p7OmHNluCdzsSvazkSyghBEOLNuh-veFwtgyyI7Iw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Electric Hive (Field-Tested)",
                price: 10.06,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PvBZzh94dmynZWGqPv1IbzU2DMEv8Rw3-3Epo6giQyxqkFoYGChJ4adcQ46YAzY_1DswObvgMO_u8nXiSw0zFWmqYw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Jaguar (Well-Worn)",
                price: 11.54,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYcDNW5Nmkq4GAw6DLPr7Vn35c18lwmO7Eu46lilXm-kQ4YmHxdoeddVVqY1vU-lO7lb3vg57uu5rIzCMw7nZ35i3D30vgFhd2p1E/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AUG | Torque (Factory New)",
                price: 1.4,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJS_tOxhoWYhP7iDLfYkWNF18lwmO7Eu4qi2Qa2qhVlYWzwdtKWdwFtZlmB-1S8xLq-1pO96Z7Jy3tr6Skn5nrD30vgYhMJ-CM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Hydroponic (Minimal Wear)",
                price: 68.82,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhh3szKcDBA49OJnpWFkPvxDLfYkWNF18lwmO7Eu9Wti1Dk-UA5aj3xJoaSI1I5Z12C_FG-k-znhJW5vs6bmndjuiki4H7D30vgYDi_Mc0/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Aquamarine Revenge (Minimal Wear)",
                price: 23.77,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWdY781lxLuW8Njw31Dn8xc_YTqmJ4DDJFM2ZwqE_ATtx-u7g8C5vpjOzHM263E8pSGKJ1XuG9M/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Five-SeveN | Urban Hazard (Minimal Wear)",
                price: 0.32,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTEhGlQ5vp5i_PA54jKhF2zowcDPzixc9OLdgM4aF7WrlO9l7-5hJa_uM7MyCBruyMit3iMmBW1iBwdOOVngvWcT0LeWfIFPrcKKw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Chroma 3 Case Key",
                price: 2.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiev3ZV851qOaJ28RvInuxIWPw_WtMr-Gkz0FvZwh27mU8Yqm3APir0VrYm3tZNjC3MZhHzk/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Forest DDPAT (Field-Tested)",
                price: 78.74,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zAaAJG6My3gL-GkvP9JrbummpD78A_27HCp9qi2FawqBduYGCgI47HdFBtMg3R-wK9l-zugZPou5zJwHAyuD5iuyjZxtS4iw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Man-o'-war (Field-Tested)",
                price: 10.43,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZt7PLfYQJF4NOkjb-GkvP9JrbummpD78A_3b2RrNSk2wzlqkFuMTzzIdWXd1dvZwqGrAW3yOvuhsO8vZ7KwCNmsj5iuyimOVrHYQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MP7 | Urban Hazard (Minimal Wear)",
                price: 0.11,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAR17P7YJnBB49G7lY6PkuXLP7LWnn9u5MRjjeyPp9qljAey-URqZjr7J9CSd1NvNQmD_wDslei605K9tJqcmHAwuCAq7GGdwUJMw04E0g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Candy Apple (Minimal Wear)",
                price: 0.36,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxfwPz3YzhG09C_k4ifqPv1IbzU2DoG6pQpi7qV9Njx0ADk8kNpZmH0cY-Uelc2ZFjQ_1a4lOfu15bv7pTXiSw0KjtfQAI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Moto Gloves | Boom! (Field-Tested)",
                price: 206.46,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDLbemGRu6sp-h9bM8Ij8nVmLpxIuNDztdYORJgVoZF-C_wO-wbu6hsPp6J3JyXJjvyQmtHfVlxe1iUlObeVo0-veFwvNdiHvnQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDLbemGRu6sp-h9bM8Ij8nVmLpxIuNDztdYORJgVoZF-C_wO-wbu6hsPp6J3JyXJjvyQmtHfVlxe1iUlObeVo0-veFwvNdiHvnQ/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Slaughter (Factory New)",
                price: 307.3,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqO3xManQqWdY781lteXA54vwxgyy_hduaz_7do6TcgFqaVvQ_1jtxbq5g5e07p7AwCdh7HEn4H6PzRGpwUYb-q86lXo/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ StatTrak™ M9 Bayonet | Crimson Web (Minimal Wear)",
                price: 846.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-DjsjjNrnCqWdY781lteXA54vwxgG2rhFla2-hcYTGclBqYAnWrgXrx728hsC_up2fm3MyvnIl4nffnEGpwUYbLGuk_6Y/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Bunsen Burner (Factory New)",
                price: 0.76,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79fnzL-Nm_b5NqjulGdE7fp9g-7J4bP5iUazrl1pNTynJoXBd1c9Y1_Z-QK8xOfugcPp7pTAm3Zm7CFz5y3dzEe-1R4fcKUx0gkHdoQp/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AUG | Ricochet (Field-Tested)",
                price: 0.21,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAZt7PLddgJI-dG0mIW0mvLwOq7cqWdQ-sJ0xLHDp9yn3g21_0tqMTj7cNWQcAc3YQ7Z-la-xubshMW66JiYm3swuyM8pSGK_x08KJ4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Midnight Storm (Factory New)",
                price: 2.47,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTi5H7c-im5KGqPv9NLPFqWdQ-sJ0xOjE896kjVKxqBc9YG7xJ4HBcAJqNAqF-Qe6wee5gZS1uZmdmCY37nQ8pSGKkzvEHHU/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P90 | Death by Kitty (Field-Tested)",
                price: 20.4,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17PDJZS5J-dC6h7-bzqfLPr7Vn35c18lwmO7Eu9iiilXl8kVoN2nyIIORdgRqY1nU_lS3x7y61pe-vszMnXE1uHEhsXrD30vggDzyTcg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Fade (Factory New)",
                price: 548.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlYG0kfbwNoTdn2xZ_Ity07iXrdzx3wHnqhc_YT-gd4PAJgRrZV2Eqwe2wOu5g8K47c_MySBkpGB8si99cQGQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SSG 08 | Big Iron (Factory New)",
                price: 5.81,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJgIWIn_n9MLrdn39I18l4jeHVyoD0mlOx5UI9Y2z0dYeRIVc_aFmDr1C8x-zm0Ja6vpzOmiA2siYi7HjZmxHlgRtSLrs4lKhxtCY/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJgIWIn_n9MLrdn39I18l4jeHVyoD0mlOx5UI9Y2z0dYeRIVc_aFmDr1C8x-zm0Ja6vpzOmiA2siYi7HjZmxHlgRtSLrs4lKhxtCY/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Knight (Factory New)",
                price: 259.24,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-GkuP1P6jummJW4NFOhujT8om72VGy-kJpZjr0JYSWdg9sYwmBrwS2wOnt1JXo7Zqfm3M2vCJ35HzbnQv330-9f4-Ixw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Falchion Knife | Boreal Forest (Field-Tested)",
                price: 59.04,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1fLEcjVL49KJnJm0kfjmNqjFqWle-sBwhtbM8Ij8nVmLpxIuNDztINeWcwE9Yl3R8lbskOnt05W76ZnOynUxs3YksymMzUa3hU4fP7BqgOveFwtESutf8g/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1fLEcjVL49KJnJm0kfjmNqjFqWle-sBwhtbM8Ij8nVmLpxIuNDztINeWcwE9Yl3R8lbskOnt05W76ZnOynUxs3YksymMzUa3hU4fP7BqgOveFwtESutf8g/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Bullet Rain (Field-Tested)",
                price: 6.68,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszKZDFO6ciJhoGCmcj5Z7qAqWZU7Mxkh9bN9J7yjRq18kBsZG6lJ4SUcAdrMlzR8wLsk-bvh5ftvZrLnHE1uCYjs3yMl0O1n1gSOYmlpP_c/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Gamma Doppler Emerald (Factory New)",
                price: 3658.0,
                image: "https://steamcommunity-a.opskins.media/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjxPr7Dl2dV18hwmOvN8IXvjVCLpxo7Oy3tIdLEdgdqNAmBqFa_kO3mh8K9uJqbyiMy7HIn5H3VzUPl1B0dO7M7hOveFwvYitsMFw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Chroma Case Key",
                price: 2.61,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Crimson Web (Minimal Wear)",
                price: 215.26,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zAaAJV6d6lq4yCkP_gDLfQhGxUppwj3r-Rpd3zjAy38xFsMGn0I9LGcA49Zw2B_VO5wL_r1Ja-vJrMySB9-n51NRRkGyg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | The Battlestar (Minimal Wear)",
                price: 6.42,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW08y_m46OkuXLP7LWnn9u5MRjjeyPp4j2iwC38kA9N2j7IIeSe1M9ZQrZ-VS3wefv0ZG_tZXOyHo3uSZ34WGdwUJSqpF9BQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Point Disarray (Field-Tested)",
                price: 12.28,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18h0juDU-LP5iUazrl04YW-lLNSTIVU7ZV3U-FK6ku_tgp_vu53NySZhvSJ35XvUlxS1iB5FcKUx0hzV6cx4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Elite Build (Minimal Wear)",
                price: 6.31,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqPv9NLPFqWdQ-sJ0xL-Qoomm2wHk_0A6YWzzd9LHe1I4MFyD_Vi2lO7ogMTptZjPySE37iQ8pSGKluvjCzA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Cartel (Field-Tested)",
                price: 2.98,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV09-3hpSOm8j5Nr_Yg2Zu5MRjjeyP8I6jjlHg-UJsMG33J9CRegI3ZgrTrlS3wevs05616pmcmnBg63Mh5GGdwUIXr_jb8w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ Desert Eagle | Oxide Blaze (Field-Tested)",
                price: 1.14,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_9mkgL-OlvD4NoTSmXlD58F0hNbM8Ij8nVmLpxIuNDztLITGdVQ9M1HU8wPtwLvpgcXp7pnBzCRjvCkitHzYlxS-1x9Obudt0-veFwsitg72Kg/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_9mkgL-OlvD4NoTSmXlD58F0hNbM8Ij8nVmLpxIuNDztLITGdVQ9M1HU8wPtwLvpgcXp7pnBzCRjvCkitHzYlxS-1x9Obudt0-veFwsitg72Kg/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Blueprint (Factory New)",
                price: 4.35,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLMbfEk3tD4ctlteXI8oTht1i1uRQ5fTz3JY-Qcg82MwrTq1C-xLvpgJK56J7LmnY3vSIq7XeLmRK000xLaORxxavJqBhIHi8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Royal Paladin (Minimal Wear)",
                price: 19.6,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW0865jYGHqOTlJrLDk1Rd4cJ5ntbN9J7yjRqy80NuNjrwd9CcIQdtZ1DT_QW2xe_sjZLqusnIyHBgvCch4X_VlxXln1gSOYPgMY0F/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Nitro (Factory New)",
                price: 2.53,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOlm7-Ehfb6NL7ul2hS7ctlmdbN_Iv9nGu4qgE7Nnf1JoPDdw5tNQvV_FW_l-rrhcXv6p-fnHplvHMh5HrfzRC_gRsYb7Ntm7XAHueE-po5/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "UMP-45 | Scaffold (Factory New)",
                price: 2.43,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf1OD3ZDBS0920jZOYqPv9NLPF2D4EsZQh2LCZ9Nr3jQ22-0RtYmz1cdCUdQBvYlmE-Fe-wem7jJTovMvXiSw0GHO1Iuc/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf1OD3ZDBS0920jZOYqPv9NLPF2D4EsZQh2LCZ9Nr3jQ22-0RtYmz1cdCUdQBvYlmE-Fe-wem7jJTovMvXiSw0GHO1Iuc/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Atomic Alloy (Minimal Wear)",
                price: 3.71,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-Gw_alfqjul2dd59xOhfvA-4vwt1i9rBsoDDWiZtHAbA48MwzS_VPqwezqg8C9u8ibwXRjuClz7SvcmxS20hwZa7c5h6fNQA-AR_seVEiZW-4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Guardian (Minimal Wear)",
                price: 0.84,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jxP77Wl2VF18l4jeHVyoD0mlOx5UdtZT_1JIHGIQNoMA2C_1PslO65h5Tpvc_AwXZmuiMr5CnZmhfm0hpSLrs4U9WKdHc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Tiger Tooth (Factory New)",
                price: 233.84,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfwJW5duzhr-Ehfb6NL7ummJW4NFOhujT8om73wzkrRVvMmz7cIaUIwE9NVyE_QW5xOu-0cTo78zNz3ZruXQj5imMyQv330-wFnub9Q/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ P2000 | Fire Elemental (Field-Tested)",
                price: 21.83,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJSvozmxL-NnuXxDL7dk2ZU5tFwhtbM8Ij8nVmLpxIuNDztLYGcJFVoZF3X-gO2x7y808K8vZ2cwHYxsigh4C7emkfm1BxOb7M80eveFwtKPv5lvA/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJSvozmxL-NnuXxDL7dk2ZU5tFwhtbM8Ij8nVmLpxIuNDztLYGcJFVoZF3X-gO2x7y808K8vZ2cwHYxsigh4C7emkfm1BxOb7M80eveFwtKPv5lvA/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Fade (Factory New)",
                price: 241.46,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJcAJE7dizq4yCkP_gDLfQhGxUppBwib3Hod6n2ADnqUdkMW30cYKRdwVtMlrV-gK5yLi71JXpu5XBzHd9-n51Ga5qFJk/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Frontside Misty (Field-Tested)",
                price: 10.99,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08u_mpSOhcjnI7TDglRc7cF4n-T--Y3nj1H6-hBrMW_3LIOWdlU_MlGDqwO6wrvq15C6vp-bnHY36SAm4XbYl0SwhgYMMLJqUag1Og/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Para Green (Field-Tested)",
                price: 0.2,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ08-5q4uDlvz9DLzDk25f18h0juDU-LP5iUazrl1uam6hd4WcJw9rZ13X-Vjox-bsg5S9vp3Az3Jn73Ej5HmMzkPi1R9McKUx0pknneQS/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Fuel Injector (Minimal Wear)",
                price: 41.97,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV08-jhIWZlP_1IbzUklRd4cJ5ntbN9J7yjRrsqkM4ZmqmLILHdQY6aFvW_AC9lO2718S-ucnLwCRnvSN24nmJzEDln1gSOcGSLCO2/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Slaughter (Factory New)",
                price: 357.95,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjuNrnDl1Rd4cJ5ntbN9J7yjRrh-BVlZW3ydoTHdABsZ13Y_Qe5xue6gMC-vp-amntr6yQq4XfUzhTin1gSOZHog2Kf/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Jaguar (Minimal Wear)",
                price: 16.28,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYcDNW5Nmkq4GAw6DLP7LWnn9u5MRjjeyPo46iiwzm-0tvMWyldtSScwA9YAmE_Vi4wL-8hJO4v8nInyFh6yVxsWGdwUIYQq5JMA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Road Rash (Minimal Wear)",
                price: 6.8,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnMrXVhmpB7dd0jtbN_Iv9nGu4qgE7Nnf7cNOccgFoNAzSrlG-wui6hcW675yfynBl6SIi7H7Yyh2zhxpOabRom7XAHmwNQX_f/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Hyper Beast (Battle-Scarred)",
                price: 14.68,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4TZk2pH8fp9i_vG8ML0ilKy_EJqYGChd9ORclBvN1_R_1box-7sh8Pq6M7Ly3VmuXMq4nzegVXp1veu4E3Q/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Sport Gloves | Superconductor (Field-Tested)",
                price: 448.87,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eO6nYeDg8j2P67UqWZU7Mxkh9bN9J7yjRqy_0RkYGjwddCTJA5qM1iF_lHrku7nh5676p7BnHRqv3Mrt3nZnxWwn1gSOSn3eWSL/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ StatTrak™ Gut Knife | Doppler (Factory New)",
                price: 105.01,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP09i5hJCHkuXLI7PQhW4C18l4jeHVyoD0mlOx5UpkYmv0cY_DJgRoZVzSrFHqlO_rhZHu7p7LnXJk6HVz7XiOmxazgB1SLrs4HmoGyDM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Medusa (Minimal Wear)",
                price: 793.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR7eO3g5C0m_7zO6-fxj5SvsMkib-W9N7zilLjr0NoYW_wI4OTelRvYwmC-FTrxeq915a074OJlyVOUzvCjQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Specialist Gloves | Crimson Kimono (Field-Tested)",
                price: 510.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDLDYm2Rf5_p1g-jM-oLxm2umrhcDPjynfcPIHVpvIw-F5AW7ku_p0J6_vciYnyY3vyUi5yzUyxCx1E1FO-I90P3NSFueBKdLT6ScRi2HjGqdP_k/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Re-Entry (Factory New)",
                price: 0.79,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhh3szcdD4b086zkIKHluTgDLfYkWNF18lwmO7Eu9zz0FCx_EZrYG6gd4WQI1U_NVnUqQe5xeftgZ6_tMmYzSZk63Iq4XbD30vg4jvN4E0/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Hypnotic (Factory New)",
                price: 11.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLJTitH_si_k4-0m_7zO6_ummpD78A_0rzApNrw3FayqUs-YjqgIoWccVVvZAzQqVfqwr_u0JDpup3LynFhuT5iuyj9I0M0JQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLJTitH_si_k4-0m_7zO6_ummpD78A_0rzApNrw3FayqUs-YjqgIoWccVVvZAzQqVfqwr_u0JDpup3LynFhuT5iuyj9I0M0JQ/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AUG | Hot Rod (Factory New)",
                price: 62.14,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAZu7OHNdQJO5du-gL-HluXzNvWIl29TsJwljLmT9Irz3wPsrRU6amj7LNeXdlNrMFmG-gK2k-jpg565ot2XnjMC3WBZ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AUG | Chameleon (Factory New)",
                price: 2.86,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJB5N27kYyOmPn1OqnUqWdY781lteXA54vwxlWw-hduNW_xcIeRegc3YlmE8gS8wrvv1MS86s-dzSdk6yYj5HzYyRKpwUYb8NvXBjQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Doppler Black Pearl (Factory New)",
                price: 804.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJA4N21n5COluX4DLbQhGld7cxrj-3--YXygED6rxVtMWmgJ4fDJ1U_aA6EqFC5w7vujMO9uJrIzCdg6HMgs3mMlxe-0wYMMLLYtmuUHw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Lore (Minimal Wear)",
                price: 819.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Igsj5aoTTl3Ju5Mpjj9bN_Iv9nBq2_xE6Mmv1cIOSclI6ZViFr1XtwertgZK6vJiYwXNjuSEr5XaJzhfhn1gSOWAjuI7h/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Nitro (Battle-Scarred)",
                price: 0.64,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOlm7-Ehfb6NL7ul2hS7ctlmdbJ8I3jkWu4qgE7Nnf1dY6XIVA5Z16G8lTsku-90561vZzLnyZnsyIk4HuIyUO-hB1Fbbdom7XAHusE464T/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "XM1014 | Seasons (Factory New)",
                price: 1.02,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PLZTiVP09CzlYa0kfbwNoTdn2xZ_It33byS99333wXkqktsYWqmJo-cJgc3YFCDq1C7wbzrh5K0v86YyCE3pGB8sheESime/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PLZTiVP09CzlYa0kfbwNoTdn2xZ_It33byS99333wXkqktsYWqmJo-cJgc3YFCDq1C7wbzrh5K0v86YyCE3pGB8sheESime/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "AUG | Ricochet (Minimal Wear)",
                price: 0.43,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAZt7PLddgJI-dG0mIW0m_7zO6_ummpD78A_jrGXrNykiQDmrUFvaj2nd4WcIVI4ZV2E-AC_xuznhJ60vcucynU3vz5iuyiL80cXxw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Road Rash (Factory New)",
                price: 10.72,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnMrXVhmpB7dd0jtbN_Iv9nGu4qgE7Nnf7cNOccgFoNAzSrlG-wui6hcW675yfynBl6SIi7H7Yyh2zhxpOabRom7XAHmwNQX_f/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Evil Daimyo (Factory New)",
                price: 3.56,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09mgnYy0k_b9PqLeqWdY781lteXA54vwxlfm-0s-Mmv2JtWVJg43YVqDqwC3xu2-g5W478-fmHtnvyUi7S7anhOpwUYbM4iiQZo/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Dragon Lore (Field-Tested)",
                price: 1180.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5cB1g_zMu9zw3g2yrkVtZ2r6IoSVdAU-ZVrY_lS6lb_ogsDqu57NmCQ27iJx53nD30vgUTXWscs/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Huntsman Knife | Marble Fade (Factory New)",
                price: 345.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlY20mvbmMbfUqW1Q7MBOhuDG_Zi721GyqERqZG_3d4fEIwA8ZV_XrATrxbzr0cC97Z7BySBiuyV04H7dnAv330-db6QRxg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Urban Masked (Battle-Scarred)",
                price: 54.37,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTi5S08i3hIW0guX2MrXunm5Q_txOhujT8om7iVCw_EJqYGygddKSI1U_NVqFrlbvw--6gpS8vJjOwCBlu3Eltn_Ungv330_hbfuoMQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Elite Build (Battle-Scarred)",
                price: 3.4,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqP_xMq3IqWdQ-sJ0xLmVoI_x3Ffj_EtqYW-hIoGSIVBtNF-G-FG8xu-8gpW_vZiaynBj7ig8pSGKDudPz_I/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | BOOM (Field-Tested)",
                price: 19.8,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PHEcDB9_9W7hIyOqPrxN7LEm1Rd6dd2j6eVptis2gTsqBc_N2inJ4-ddlNsMFGCqAS9l7--hMfqvc-awHowvHJz-z-DyEDRzNPB/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AUG | Torque (Minimal Wear)",
                price: 0.86,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJS_tOxhoWYhP7iDLfYkWNF18lwmO7Eu4qi2Qa2qhVlYWzwdtKWdwFtZlmB-1S8xLq-1pO96Z7Jy3tr6Skn5nrD30vgYhMJ-CM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Doppler (Factory New)",
                price: 151.73,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eOym5Cbm_LmDKvZl3hUu_p9g-7J4bP5iUazrl0_ZWD7cIPBdFdsMwnZ-1Xqye67h5--6M-bynI173Ih4H6MmBO_1xtPcKUx0uQwW0b2/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Urban DDPAT (Field-Tested)",
                price: 0.09,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszMdS1D-OOjhoK0mvLwOq7cqWdQ-sJ0xLqZrdihjATn_0toa2qgcdXGcAU7M13R-wW6levpgZ_uv5TPyyBi7ic8pSGKJ7UZZrQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ M4A4 | 龍王 (Dragon King) (Field-Tested)",
                price: 13.22,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW0924l4WYg-X1P4Tck29Y_chOhujT8om7jgex_RVkNWqlcYaSdgVoZljWqFnrkOrpjMK5tZ7MziQ36XYi7H6Lywv3308dOff4vw/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW0924l4WYg-X1P4Tck29Y_chOhujT8om7jgex_RVkNWqlcYaSdgVoZljWqFnrkOrpjMK5tZ7MziQ36XYi7H6Lywv3308dOff4vw/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Mecha Industries (Minimal Wear)",
                price: 14.47,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDLbUlWNQ18x_jvzS4Z78jUeLpxo7Oy2ceNfXJVMgY1HX-QLoxL2-jMK9uZTLnXRlvyJws37Zzka_iEofOu1qjPbKTQqeVrsJQvdPcVsWZg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Pit Viper (Field-Tested)",
                price: 0.7,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957ODGcDZH_9e_mr-GkvP9JrbummpD78A_0-iZrI702le1qkQ4ZGClLdOSJwE-NF3Y_lHtw7q5gZK6vpnBznsw6z5iuyixL7hzgA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Water Elemental (Minimal Wear)",
                price: 4.16,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRd4cJ5ntbN9J7yjRrl_kI5amz3cdKRI1NoY1CDqQK7xLrv1se47pnKmHU3syYm4SnemUTkn1gSOYPIEaei/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Boreal Forest (Minimal Wear)",
                price: 130.12,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4iSqPH7Ib7CglRT59d0i-X--YXygECLpxIuNDztco6UdQI2YgzRr1S9k-jmjJe17ZWYyHNgvilw5XjYzBew1RBEbOw9hOveFwsNLW2Vcg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Royal Legion (Well-Worn)",
                price: 0.41,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4Tck29Y_chOhujT8om721DjqBU4YW72IoTAdwdqMFvY_1W3ye_sgpa878jPy3o27HUr5yuLyQv3308XfsBUmA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "FAMAS | Survivor Z (Minimal Wear)",
                price: 0.24,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf0Ob3dzxP7c-JmIWFg_bLP7LWnn9u5MRjjeyPoo333QTsqkdsZDz2ItfHdwI_NQmF-1O5lLjq08W6uMvJwCRl63Ui7WGdwUJj4iqdBQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Jaguar (Field-Tested)",
                price: 12.19,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYcDNW5Nmkq4GAw6DLPr7Vn35c18lwmO7Eu46lilXm-kQ4YmHxdoeddVVqY1vU-lO7lb3vg57uu5rIzCMw7nZ35i3D30vgFhd2p1E/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Desolate Space (Battle-Scarred)",
                price: 7.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU1810i__YyoD0mlOx5UBvYmH0dtfGdA9tZV6BqFi4l7rrgJe078nInCFg7CUi4H-Mm0bj001SLrs43bAgams/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Urban Masked (Minimal Wear)",
                price: 75.52,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJR_OOilZCOqOLmMbrfqWdY781lteXA54vwxlaw-hBsZ2r6IdPEcgQ6MAuC8le9kL29g5S07sian3Vk73R24SrZykepwUYbeo-ROcg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glove Case Key",
                price: 2.64,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOievwZVQ51qSfd2pButjnxdTbkaD2YbjTwD4BuZR32uzF9t3w0ALl-kRqN2jtZNjCOd6cueQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Gamma Doppler Emerald (Factory New)",
                price: 3890.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20kvrxIbrdklRc6ddzhuzI74nxt1i9rBsofT-ld9LDJgVsY1nX-QLtlejqg5bu7Zydm3Q1uSVzsXmOmUe3ghFKauBxxavJdWR7Gog/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Buzz Kill (Field-Tested)",
                price: 12.82,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW08-zl5SEhcj5Nr_Yg2Zu5MRjjeyPpoig0Vbi8kNoZWvwIIbHclVrZ1yFrAe6k-3rg5C56cnNznpgvSB35GGdwULzGcHXfg/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW08-zl5SEhcj5Nr_Yg2Zu5MRjjeyPpoig0Vbi8kNoZWvwIIbHclVrZ1yFrAe6k-3rg5C56cnNznpgvSB35GGdwULzGcHXfg/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Damascus Steel (Field-Tested)",
                price: 137.88,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KhsjwMrbQhWhE-_oo2tbM8Ij8nVmLpxIuNDztLNeSI1dqZgrQq1TslOznjJ6-uc7BnyA3vCAitnffmUay0h9Ia7M50-veFwtumQFifw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Snake Camo (Minimal Wear)",
                price: 8.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7ODGcDZH09C_k4ifqPv1IbzU2GgB6pYj3e2Yo9z0jgzhqEpkZDumcI-RdgQ2ZlHT_wfsxbzp1JG0vMzXiSw0vjF63Ps/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Five-SeveN | Monkey Business (Minimal Wear)",
                price: 6.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTTl2VQ5sROhuDG_ZjKhFWmrBZyYT30LNeTdAc6MgrT-Fjvlb_njJXvtMnJy3o26CVx5y3ZlxDhgx4abvsv26JQCfbOCA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Slaughter (Factory New)",
                price: 355.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20jfL2IbrummJW4NFOhujT8om70Azg_kQ6MTygdYKXJw9qMlnX_Fa3ye28gpC-vZSdynYxviZztyncmwv330_7Rx0jNA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Asiimov (Battle-Scarred)",
                price: 26.91,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0n_L1JaLummpD78A_3rmTodTwiwzkqUNoN236cteWcwFtY13RqADql7q8h5PttZzJwHdgvz5iuyif2YhKbw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Tiger Tooth (Factory New)",
                price: 89.3,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxM08i_k4WZqPjmMrXWk1Rd4cJ5ntbN9J7yjRrg_kpsN2qiLYCTdAdtZA3V_gDowuzngMXuvp7OyXVk7HMk5ivZlxPln1gSOddL0hWc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Fade (Factory New)",
                price: 317.36,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0vL3dzxG6eO6nYeDg8j4MqnWkyUHucB1ieqXrIrz2gHmr0ZvZDj3cNKUdlQ-YF6DqAS2w-i8h5Dt6Zib1zI97Ycw1ud8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P90 | Elite Build (Factory New)",
                price: 0.87,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIQJP7c-ikZKSqPv9NLPFqWdQ-sJ0xO-UrYrz3AztqEpuNT-iLNWTJwJtZVrY-1XskLrvhMW_uZ-dn3Iy6CY8pSGK7PES7n8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Neo-Noir (Field-Tested)",
                price: 19.9,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLPbTYhFRc7cF4n-SP9o2mjA3hqBJlZGGmdYCRegY-ZwmFrFC5xufuhpK5vcuayXYxsyVz4GGdwUJGz70rjQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLPbTYhFRc7cF4n-SP9o2mjA3hqBJlZGGmdYCRegY-ZwmFrFC5xufuhpK5vcuayXYxsyVz4GGdwUJGz70rjQ/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Vulcan (Factory New)",
                price: 72.19,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj4OrzZglRd6dd2j6eUrd-jiwfsr0BsYG6iIdeUJA8-Nw6EqVntyLrv15-4v5vOmiNr73Z2-z-DyAddTn8e/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P2000 | Chainmail (Factory New)",
                price: 3.56,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zJfAJB5N2_mo2KnvvLP7LWnn9u5MRjjeyPp9rw0FDhrkNtMW-ico7BIQ47Mw3T_gLowOjnhpbp6pvLwXJivCZ0sWGdwULfMeVBVg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "UMP-45 | Primal Saber (Minimal Wear)",
                price: 5.48,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3ZDBSuImJhJKCmvb4ILrTk3lu5Mx2gv3--Y3nj1H6_UQ-Nj_6JdeRcQE9ZQzW_1W7wOi5g5PvuJ_BwXViu3Ig4HiJnRWziAYMMLJag8KlOQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3ZDBSuImJhJKCmvb4ILrTk3lu5Mx2gv3--Y3nj1H6_UQ-Nj_6JdeRcQE9ZQzW_1W7wOi5g5PvuJ_BwXViu3Ig4HiJnRWziAYMMLJag8KlOQ/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Guardian (Field-Tested)",
                price: 3.66,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuk2dU78R_ntbM8Ij8nVmLpxIuNDztIoHGIA42aFjTrlW9l7_sg5K0vpTOzXUwvHYmti2IzB2y1UxFZuRs1OveFwsVDJalZw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Steel Disruption (Factory New)",
                price: 0.97,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73dTlS7ciykY6YksjnOrfHk3lu5Mx2gv3--Y3nj1H6_xdkYDrzdYbHewM2MwrR_we4yOq8gpa4u5TAzycw7yUrs3uPyhWy0AYMMLIxVOW_RQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Sawed-Off | The Kraken (Minimal Wear)",
                price: 3.21,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cih9_92hkYSEkfHLPLjFmXtE5dVOhuDG_ZjKhFWmrBZyZG_ycNCQewc_NA6D_AC3x-7phMW77p7NnHZi6yJ0s3mIzBO21B1EPPsv26Kzq1aSUw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Doppler Ruby (Factory New)",
                price: 1025.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eOkgYKSqPr1Ibndk2JL7cFOhuDG_Zi7jgLtqkVpZjrwJNKSdVVrMl7U_gLvw72-0Ze5u56bnXJgsyBws3bblgv33087zklSXg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Urban DDPAT (Minimal Wear)",
                price: 0.56,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszMdS1D-OOjhoK0m_7zO6_ummpD78A_3erE8d2j2Qbkr0ZoMTqnd4TDI1c4ZwzS-1TvlObuhZK97c_LyiAwvj5iuyg9kreMiA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SSG 08 | Dragonfire (Field-Tested)",
                price: 14.4,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJkJKKkPj6NbLDk1RC68phj9bM8Ij8nVmLpxIuNDztd9TEcgdoaFjRqwS3xbvsh5K6tM6aynpjs3Mj7HrdmhGzgR5OPONs1-veFwvQ4RWGTQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Atomic Alloy (Field-Tested)",
                price: 2.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-Gw_alfqjul2dd59xOhfvA-4vwt1mxrxopPgavdcTCJxg8Z12F-lO6lby51JS47ZzJwXJn7ih27H2OzEbl1UxEauw51PPISwiWGeUXS05UIj81/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Blue Laminate (Field-Tested)",
                price: 2.97,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KHgvLLPr7Vn35c18lwmO7Eu9vw2FHh8hJoZG3zcYSVdlBtaAuCqFi7kO7s1568vJjJwSRrsycksXfD30vgSXhu9Rc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Shadow Case Key",
                price: 2.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiePrKF4wi6aaIGwStN_jl4bSzvXwMO6AwDlSvsYoiOiZ8dij3QbtqkU9ZnezetFWWxusZg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Isaac (Minimal Wear)",
                price: 0.49,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b092lnYmGmOHLP7LWnn9u5MRjjeyPrI2hjlbtqRE6ZT_zJYSVe1Q2NwzTrwfolLq-hMPp78uayCdm6ylz5mGdwUJXtvY84A/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Fever Dream (Factory New)",
                price: 12.74,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJS_8W1nI-bluP8DLfYkWNFppQgj7yV9Nqi2Fbj_Eo5Ym72I9XGJwc2NAnS_1Pqxu6615W575uYznd9-n51iddPieY/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJS_8W1nI-bluP8DLfYkWNFppQgj7yV9Nqi2Fbj_Eo5Ym72I9XGJwc2NAnS_1Pqxu6615W575uYznd9-n51iddPieY/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ AWP | Hyper Beast (Minimal Wear)",
                price: 118.75,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tdn2xZ_Pp9i_vG8MKijFDm_UVvZDz7cIOVIFU_Y1GE-FTrk7q905XpusjNyHJquycq5XeIgVXp1saKgIkM/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tdn2xZ_Pp9i_vG8MKijFDm_UVvZDz7cIOVIFU_Y1GE-FTrk7q905XpusjNyHJquycq5XeIgVXp1saKgIkM/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Case Hardened (Field-Tested)",
                price: 27.96,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszHeDFH6OO7kYSCgvrLP7rDkW4fuZEk37mYpNun3FXtqUpvMGymIYLEd1U3YF-Eq1S5kOfoh5-_vpiYmGwj5HetcqhLqw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ StatTrak™ Karambit | Marble Fade (Factory New)",
                price: 765.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20mvbmMbfUqW1Q7MBOhuDG_ZjKhFWmrBZyNmynJNCRdQdtMlyBqwW2lbq7g8Po6ZnLwCM17yhxsX2JlxXkgEsabPsv26LDJQinCA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Medusa (Well-Worn)",
                price: 536.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR7eO3g5C0mvLwOq7c2DkAvJQg27iT9NWm2VK3rkU6YmmiI4SVJAQ9MljUr1O5ku7ug8K1usnXiSw07gvX0uU/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Corticera (Minimal Wear)",
                price: 6.34,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PXJZzhO7eO3g5C0m_7zO6_ummpD78A_3rqTrI-l3AOxqkJkamClJ46RdFc_MFDR_1K3k7_t1JS7upvMmHdn7z5iuygrdWg_VA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Golden Coil (Field-Tested)",
                price: 10.75,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITCmGpa7cd4nuz-8oP5jGu5rhc1JjSceNfXJVMgaVmB_QO-wLi5h5HovZ_Kn3A27HR24HrcnRC3g0lJbOFthPKcHwjIUrsJQvfN77TKZw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Point Disarray (Factory New)",
                price: 26.54,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18l4jeHVyoD0mlOx5RE9Yz_1d9XBIVQ3YF-Bq1Pslbvt0MC8v5zLmndk7ick5i7bnkG0hRlSLrs4iEgtRw4/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18l4jeHVyoD0mlOx5RE9Yz_1d9XBIVQ3YF-Bq1Pslbvt0MC8v5zLmndk7ick5i7bnkG0hRlSLrs4iEgtRw4/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Moto Gloves | Spearmint (Field-Tested)",
                price: 405.51,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDLbYmH9u_Nd4i-fG-YnKhVGwogYxDDWiZtHAbFBqYV2BqFm8k-3n1JPv6c_OyyMw7nQm4HuLnBHlhU1MZuA6gPaYH1yAR_seFZ1ThSM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SSG 08 | Necropos (Minimal Wear)",
                price: 0.24,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJmoWIhfjkPKjummJW4NFOhujT8om7i1DmrUBuMjjzJ4KcJ1JtMAzTqwTokLvnhcS5vJSfmndqvCJz5y3enwv330_MO8kGzA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Torque (Factory New)",
                price: 0.85,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbTWhG5C-8xnteXI8oTht1i1uRQ5fWDyd9LAdQ4_MgzQqVm7wey918TuupufynUw6Sd05C2MyRfmgBgfbuBxxavJa8F12Qc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Cartel (Battle-Scarred)",
                price: 3.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV09-3hpSOm8j8NrrHj1Rd6dd2j6eR84jz3FW1-EpoZGDzLNLDcABvYF3Qr1W8xuvuh5e_v5qbzXIyu3Qj-z-DyKvXwz18/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Five-SeveN | Hyper Beast (Factory New)",
                price: 49.93,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTZj3tU-sd0i_rVyoD8j1yglB89IT6mOtKXJ1A_aQrV_QO-k-bthJC-uMjNy3pgunV34SzZmEC1hRkZOuFrgvOACQLJPmu_S9c/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Moto Gloves | Eclipse (Field-Tested)",
                price: 168.83,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDLnQhWJS18d9i-rKyoHwjF2hpiwwMiukcZicegQ9NwmF-VfvkLvu08C9tJ7Lmidk73R2t3eLyUPigxBNOOY70fTPVxzAULnApTN1/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DeXEl7NwdOtbagFABs3OXNYgJP48i5hoOSlPvxDLnQhWJS18d9i-rKyoHwjF2hpiwwMiukcZicegQ9NwmF-VfvkLvu08C9tJ7Lmidk73R2t3eLyUPigxBNOOY70fTPVxzAULnApTN1/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Sport Gloves | Superconductor (Minimal Wear)",
                price: 711.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eO6nYeDg8j2P67UqWdY781lteXA54vwxlWw_EM-MW-hIIPHJwJqNVGGrwfswOe70Me-tJzAnyAyuCcit3jdnRepwUYbcIIuwIc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P250 | Valence (Minimal Wear)",
                price: 0.15,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhhwszYI2gS09-5mpSEguXLP7LWnn9u5MRjjeyP843z3Vbn-0Y_ZWGnLNPEcAU2YFzR_FLswb_pjMLt6szOynNr6Cgj7WGdwUK-H5W5kA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Stainless (Factory New)",
                price: 5.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ092nq5WYh8jnJ7rYmGdU-9ZOhuDG_ZjKhFWmrBZyYD_1cdLHelNsNVzR-Vm5xezqhZK0uZScySZg7ydx4H6MnRbkghEYPPsv26JVZyAeTQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Phobos (Minimal Wear)",
                price: 1.78,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6_ummpD78A_jOrArNqki1ft8hBrY22lJI_GdgJrZw3Y-FK5yersgcPqvMjLy3JrvT5iuyisReGAWQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Boreal Forest (Field-Tested)",
                price: 54.61,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjVb09q5hoWYg8j2PKnUl2du5cB1g_zMyoD0mlOx5UVtYmDyLNPEdwVtaV-Cq1S6lO_mjJ-07szAmiQyuCQqtn7dmBO0gk1SLrs4R_gpvnA/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjVb09q5hoWYg8j2PKnUl2du5cB1g_zMyoD0mlOx5UVtYmDyLNPEdwVtaV-Cq1S6lO_mjJ-07szAmiQyuCQqtn7dmBO0gk1SLrs4R_gpvnA/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Boreal Forest (Battle-Scarred)",
                price: 89.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4iSqPH7Ib7CglRT59d0i-X-_Yn0nk2LpxIuNDztdYLEIQM4M1qG8wO-kLu6jZXv7pTJyXZjuCR04H2JmhyxiUsdOuRqguveFwufX92zKQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Redline (Battle-Scarred)",
                price: 5.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqP_xMq3IqWdQ-sJ0xOvHrdSn2lW2qkRuZ2vxIYbAcQ5vYQrT-1e7xuq715e4uJrJn3dnuSk8pSGKnsgeKcY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Redline (Field-Tested)",
                price: 11.47,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJB496klb-GkvP9JrbummpD78A_3LGXrI-i31fm_Uc5MW_3I4LDelc2YQmF-FPtl7_uh8PtupTMn3pnvD5iuyj-_v0pRA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Boreal Forest (Battle-Scarred)",
                price: 81.02,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zAaAJE486zh5S0lfjmNrrdqWNU6dNoteXA54vwxgDhrxJtMGj7II7GcVI5MgqE-gDsyObng5W_vM-bmyFi6CkitnbayRKpwUYbBWXvKcI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Stained (Field-Tested)",
                price: 60.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxT09q5hoOOk8j5Nr_Yg2Zu5MRjjeyPotqg2gDgrUU5Zm-nJdKVdg5vNAyG8wTvwum5hMXptJnAnHZi7nIitmGdwUII6z1SkA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Electric Hive (Minimal Wear)",
                price: 12.63,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PvBZzh94NWxnJS0m_bmNL6fxDoJsZwk0uyT9Ir02lfi8hA6MD2nLIaScwQ6MlrX8wC-lOjrgJC-uYOJlyVQbQuu3g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Wasteland Rebel (Well-Worn)",
                price: 8.4,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teTE8YXghWu4qgE7Nnf2cIDHJFRoMArX_ALql-fpgsTp6pidznpquCV3tiyLnByxhExLa7E7m7XAHufXctEb/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Boreal Forest (Field-Tested)",
                price: 77.98,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zAaAJE486zh5S0lfjmNrrdqWZU7Mxkh9bN9J7yjRrl_kFrYGjxcNOWewQ3MAmE-FG2yOe7gpW0uZyam3A2siVw7S6MzR3in1gSOUa5wz9E/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ Glock-18 | Water Elemental (Field-Tested)",
                price: 11.69,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRc7cF4n-T--Y3nj1H68kVvYTvzJYacIA42MFHW-QLtl7vr0ZS_vpiYm3pi7HYl5CrUy0a00AYMMLI3Fd_03w/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRc7cF4n-T--Y3nj1H68kVvYTvzJYacIA42MFHW-QLtl7vr0ZS_vpiYm3pi7HYl5CrUy0a00AYMMLI3Fd_03w/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Caiman (Field-Tested)",
                price: 3.42,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq4uKnvr1PYTck29Y_chOhujT8om72Ay2_ENuY26ncoDBd1I_MlCBrgW5ye_u1sC_vJ6YyXtgsiYh7HnUywv330-jy4MGQg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Sandstorm (Minimal Wear)",
                price: 0.21,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b08-3moSYg_jmPoTdn2xZ_Pp9i_vG8MLw2wy2-xc9MjqhJ9fEd1I2N17Z-AC7lLvvgMfouM-ayXprvygi7SyJgVXp1mC692Rx/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Blue Fissure (Field-Tested)",
                price: 0.47,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf2-r3ci9D_cmzmJWZksj5Nr_Yg2Zu5MRjjeyPoY6g2AOx-0M_ZmDzJ4WddAJoY1GG-1LtxO_mgMO87c_KzXtn7CAl4GGdwUIRYMFhhg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Phobos (Field-Tested)",
                price: 1.6,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0mvLwOq7cqWdQ-sJ0xOyUpI-g2gOx-RJkZjymItSUew4_aVrS8wXsw7i60JC_v5jNmHBmuHM8pSGKiOi1TiY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Hyper Beast (Minimal Wear)",
                price: 15.09,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoD8j1yglB89IT6mOoWUegM-aFvX_Fe_yO3q1Ja6vsnMn3Q163YntH6Lnxfh1UpFbrdng_SACQLJQIlmyYc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Business Class (Factory New)",
                price: 19.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq4yekPD1NL7ug3hBpdZOhuDG_ZjKhFWmrBZyYDind9eWIQ47N12Br1PswebsgZ617ZzJzHs2uyIn4XvcmEPhhhsfZvsv26JmmzmVIg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Safari Mesh (Minimal Wear)",
                price: 91.86,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zbYQJP6c--q5SKmcj4OrzZglRd6dd2j6fHpY-kigPlrRduYmmhI4LHdgRqMw7X8lO7wuvqg8O77szAmHtq7iEn-z-DyIB9jWZF/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Huntsman Knife | Fade (Factory New)",
                price: 181.49,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlYG0kfbwNoTdn2xZ_Pp9i_vG8MKjjgbl_UA_MDz3ctCUcwA8Y1yG8lG3w-7v1p_ptZ_BnSA17yFx7H2MgVXp1l4ye9bA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Lore (Factory New)",
                price: 1405.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJl5W0nPbmMrbummRD7fp9g-7J4cKi2A3kqhY9Zm6hJ9eXI1RqaVqF-ljowb271564vMyaznA1viF2s3jegVXp1uIYPzxv/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ SSG 08 | Ghost Crusader (Field-Tested)",
                price: 2.18,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f1OD3Yi5FvISJlZKGlvT7Ib7um25V4dB8teXA54vwxg22qBJuMT_wLdOccQI5NFGF-FPvlLvqjce-6J3ByCYxvClwtnvayUepwUYb3qurOD8/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f1OD3Yi5FvISJlZKGlvT7Ib7um25V4dB8teXA54vwxg22qBJuMT_wLdOccQI5NFGF-FPvlLvqjce-6J3ByCYxvClwtnvayUepwUYb3qurOD8/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Asiimov (Field-Tested)",
                price: 53.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJQJD_9W7m5a0mvLwOq7cqWdQ-sJ0xOvEpIj0jAbkqEE_ZD3xctLGJAE_Zw7U-QTowefth8TpvM_InHZh6XQ8pSGKWYJAoJI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Blood Tiger (Factory New)",
                price: 0.95,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09Svq5KOk-P9NL7DqWdY781lteXA54vwxgGw_ERkNW_zJ4bBJwI3Y1HWrFK6yO7nhJG0vcnBzSc1uCEntHaPlhWpwUYby7pd3Ws/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Torque (Field-Tested)",
                price: 0.47,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbTWhG5C-8xnteTE8YXghWu4qgE7Nnf0d4-UcQY-NFnX-FC-kuu71JPu6J6Yn3Rm63N34yrdl0fmhUlEbrM8m7XAHqZWJnsT/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Crimson Web (Minimal Wear)",
                price: 7.48,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PvRTipH7s-JkIGZnPLmDLfYkWNF18lwmO7Eu9v30Ve2-ko-Mjr2JtPHJwFtZVGF-QDslbi9hcW4vJ2cmHBmuHZ3s3fD30vg7NYdUho/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Pink DDPAT (Minimal Wear)",
                price: 13.14,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PfMYTxW08y_mou0m_7zO6_ummpD78A_i7mR94n3jVWw_0VrMm7yJICVdAQ-ZFDZ8lPvwLjng5O978vPz3Ex6T5iuygQtJIFKA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Gamma Doppler Emerald (Factory New)",
                price: 1940.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJH4dmklYyPqPr1Ibndk2JL7cFOhuDG_Zi72VDh8kduZW37JIeWJ1Q9Yl2G8gToxrrmhpfvtZ6YynI1siRw7HbVmwv330-du9HHOA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Gamma Doppler (Factory New)",
                price: 122.5,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP09u3mY2KqPP7I6vdk3lu-M1wmeyQyoD8j1yglB89IT6mOtfEclNrZwzU-VG2wOq9h5C5up7Pn3ZjvnFw7XrYmhbihhkabeFqhaGACQLJ1bmr7Us/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SG 553 | Aerial (Factory New)",
                price: 0.23,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0Ob3YjoXuY-JlYWZnvb4DLfYkWNF18lwmO7Eu42k2gfs_EdsamyiLYDEewRvMAmDrlHox-q-gcDp6pjNnyNnvyV37X3D30vg15lPbYY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Boreal Forest (Field-Tested)",
                price: 0.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-NmOXxIK_ulGRD7cR9teTE8YXghWu4qgE7Nnf2ctWSIA82N17V8lK6ybq7gce4uZuczHRmsikns33Umhbm0BhEbORmm7XAHq4bWHSW/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AUG | Torque (Field-Tested)",
                price: 0.58,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJS_tOxhoWYhP7iDLbUkmJE5fp9i_vG8MKh2w3i-BY6az31LIWTdwRoYAvT81K7wO-51JTtupqcnHVqsyl24X-IgVXp1thL5cUB/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Icarus Fell (Factory New)",
                price: 43.54,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-ClPbmJqjummJW4NFOhujT8om73FWy-xJlMWjyJoSRdQc2YF7S_lO4we_vhJXouJrBmCY2vHEi43bazQv330_2CgpYYg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P90 | Asiimov (Field-Tested)",
                price: 5.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIXBD_9W_mY-dqPrxN7LEm1Rd6dd2j6eV8Yijilfi-xJoMGv7LI7Hd1Q4Y1HV-VS8lOnmjJXvu87MzHsyv3Nw-z-DyMkIAv9h/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Sun in Leo (Minimal Wear)",
                price: 2.53,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957OnHdTRD746JmImMn-PLP7rDkW4fvpJ1i7ySod-n2gfi-kZqajunLYCWdQA2aQrX-lXsxOnthpS5vpSfmGwj5HcW608dkQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Electric Hive (Factory New)",
                price: 14.41,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PvBZzh94NWxnJS0m_bmNL6fxDoJsZwk0uyT9Ir02lfi8hA6MD2nLIaScwQ6MlrX8wC-lOjrgJC-uYOJlyVQbQuu3g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Five-SeveN | Hyper Beast (Field-Tested)",
                price: 15.28,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTZj3tU-sd0i_rVyoHwjF2hpiwwMiukcZjGegU8M1_Qr1i5ye_sh5_otM7OzHFrvCEm43jZnxLm100ZaLBqgfybVxzAULwEhsV8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Phobos (Factory New)",
                price: 2.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6_ummpD78A_jOrArNqki1ft8hBrY22lJI_GdgJrZw3Y-FK5yersgcPqvMjLy3JrvT5iuyisReGAWQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Desolate Space (Factory New)",
                price: 24.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18l4jeHVyoD0mlOx5UI6MDunIdOUcAJvNF-D_1Xtl-_t0JDqu5uazXFi7yYk4n6MmBa_hR1SLrs43QiD0nI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Rust Coat (Battle-Scarred)",
                price: 94.9,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJYAJR-NmzmL-Amf7yNoTZk2pH8fp9i_vG8MLx2wTs-RU5YmmhIoaUdQ49NV3Q8li-wLzthZ7utMjNwSRjuSJw53ragVXp1ir4a_TV/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Vulcan (Field-Tested)",
                price: 25.75,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj5Nr_Yg2Zu5MRjjeyPoN6k0ATi8hJuZDqmLY7Ed1M7YVzY-Qe4xLzu1p68vc_BmiRjviQn7WGdwUJ150pPUQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Marble Fade (Factory New)",
                price: 100.51,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP09G3hoKHksjyMr_UqWdY781lteXA54vwxgzhrUI_Mj3xJtTEdlM4ZlnW-lW7levs0J_pvM6fzHZmsyck5SvcmhepwUYbBOFy9O0/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AUG | Chameleon (Field-Tested)",
                price: 1.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJB5N27kYyOmPn1OqnUqWZU7Mxkh9bN9J7yjRqxrUNua2H6J4SSJAZvNwmF8gC7xOrrjMLp6pvBz3Bm7ykk4XvZmUDhn1gSOYJAEb79/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Kumicho Dragon (Minimal Wear)",
                price: 6.43,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxDLDEm2JS4Mp1mOjG-oLKhF2zowcDPzixc9OLcw82ZlyF8wC8wb251MW4tcifmydi7CEn4HiPlhyy1BxJbeNshqPIHELeWfJvK5CfiA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Redline (Minimal Wear)",
                price: 25.28,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPv9NLPFqWdQ-sJ0xL6VrNj3jlCy_0tpZj-nINOTIwRqMwzZ8lLrle6-h5K_75XJnCRruSA8pSGKEtwySt8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Hyper Beast (Field-Tested)",
                price: 8.68,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoHwjF2hpiwwMiukcZiQJAJvMwqGrAW-wubnjJe4uZXMwCRq6yIgsXyMnEPhiE4ZbOBs0aeeVxzAUEeAasNQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "FAMAS | Survivor Z (Factory New)",
                price: 0.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf0Ob3dzxP7c-JmIWFg_bLP7LWnn9u5MRjjeyPoo333QTsqkdsZDz2ItfHdwI_NQmF-1O5lLjq08W6uMvJwCRl63Ui7WGdwUJj4iqdBQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Hyper Beast (Minimal Wear)",
                price: 35.63,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tdn2xZ_Ismju2To9qm31Hsr0ZsMTryJo_BcANrMwyCrFLrx7vrhJa1vZrByXo2pGB8sr2_Epwm/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Doppler Ruby (Factory New)",
                price: 2127.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjmJrnIqWZQ-sd9j-Db8IjKhF2zowdyYzjyLIGSIAA8YguCqVK9lOa-1JW5vprBz3EyviB07SveyhfkhklNP_sv26JLM0iiyQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Asiimov (Field-Tested)",
                price: 37.73,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ-sJ0xOzAot-jiQa3-hBqYzvzLdSVJlQ3NQvR-FfsxL3qh5e7vM6bzSA26Sg8pSGKJUPeNtY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Desolate Space (Well-Worn)",
                price: 8.32,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18h0juDU-LP5iUazrl1kazqmJY-dIFRrY1iB_gK7xOa6h8S6vZrJnCMy6SBx4ynfyRPj00odcKUx0jz3Bze9/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Hyper Beast (Factory New)",
                price: 41.95,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoD8j1yglB89IT6mOoWUegM-aFvX_Fe_yO3q1Ja6vsnMn3Q163YntH6Lnxfh1UpFbrdng_SACQLJQIlmyYc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Royal Legion (Factory New)",
                price: 2.63,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4Tdn2xZ_Pp9i_vG8MKk0Qy3-xc_Zm_wJI-SclQ_N1uCqALswu7o1Je_vZXOzXcw6yAi4yragVXp1hC1mqlk/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Hand Wraps | Badlands (Field-Tested)",
                price: 179.43,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8jyMrnDn2hu59dwhO7Eyo_0hVuLphY4OiyuS9rEMFFrfwrV_1a8lLvmh8Tu6pXLzHEx7yEi5SyOmxDj1R5OPew9h_bNHQqfU_NXXP7VG7anfgw/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8jyMrnDn2hu59dwhO7Eyo_0hVuLphY4OiyuS9rEMFFrfwrV_1a8lLvmh8Tu6pXLzHEx7yEi5SyOmxDj1R5OPew9h_bNHQqfU_NXXP7VG7anfgw/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Doppler Ruby (Factory New)",
                price: 295.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP086jlpm0mvbmMbfUn3FU7Pp9g-7J4cKm2QHiqkY6ZGD1LIfEJlA6MFqG8lG7lLy70ce7vcufzCBis3EksSregVXp1kbC88_z/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Desolate Space (Minimal Wear)",
                price: 13.26,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18l4jeHVyoD0mlOx5UI6MDunIdOUcAJvNF-D_1Xtl-_t0JDqu5uazXFi7yYk4n6MmBa_hR1SLrs43QiD0nI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Caiman (Minimal Wear)",
                price: 3.86,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq4uKnvr1PYTdn2xZ_Pp9i_vG8MKtjVDl_UtoZGGmJ4aTIFI9aVqB81Hvl7zu15G97cnAn3VmvyFw5nvfgVXp1oe126ve/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Specialist Gloves | Foundation (Field-Tested)",
                price: 254.81,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDLTDl2VW7fpmguDV8LP4jVC9vh4DPzixc9OLcAVoM1rS-AS5xuzu18PvvJnKy3oyunErtiuImhTh0x1JOOxvgfGdTULeWfIwShm6MA/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDLTDl2VW7fpmguDV8LP4jVC9vh4DPzixc9OLcAVoM1rS-AS5xuzu18PvvJnKy3oyunErtiuImhTh0x1JOOxvgfGdTULeWfIwShm6MA/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AUG | Chameleon (Minimal Wear)",
                price: 1.9,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJB5N27kYyOmPn1OqnUqWdY781lteXA54vwxlWw-hduNW_xcIeRegc3YlmE8gS8wrvv1MS86s-dzSdk6yYj5HzYyRKpwUYb8NvXBjQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Black Laminate (Minimal Wear)",
                price: 9.96,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KcqPv9NLPFqWdQ-sJ0xOqUpdj2iVbm_Es9Z2D2IdOccAQ7ZA2F-FG8w-3rhcTpvsnJwHph6yQ8pSGKy_qypRo/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Brass (Field-Tested)",
                price: 2.26,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3cy9D_8-JmYWPnuL5DLfQhGxUpp0k076U9NrxiQ3krRFrNmynIYfHcAA8ZF7Rrlfqw-juhpS9u52dzSN9-n51v3yyNRs/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Emerald Pinstripe (Minimal Wear)",
                price: 1.81,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYeDNR-M6_hIW0lvygZITdn2xZ_Pp9i_vG8MKn2Qbn_0FtMmv1ctTAdAE9NA2B_QK-w-3n1pG4uJyYwXExsydztH7agVXp1jpY8DLO/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Basilisk (Minimal Wear)",
                price: 1.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3hb-Gw_alIITTl3hY5MxigdbN_Iv9nGu4qgE7NnfyLIWSclI4ZF3X_1G-wunp0Je_u87On3Qxuidx4iqJmxPkiEwfPbNtm7XAHjQFcBpg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ M4A1-S | Cyrex (Field-Tested)",
                price: 21.97,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp8j-3I4IHKhFWmrBZyYDz2IobGcwdoYFCG8lW4l7jnjMC6vZybyHVk7CEjtHaMyh20iBsdbfsv26IzXLrUVA/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp8j-3I4IHKhFWmrBZyYDz2IobGcwdoYFCG8lW4l7jnjMC6vZybyHVk7CEjtHaMyh20iBsdbfsv26IzXLrUVA/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AWP | Medusa (Factory New)",
                price: 1960.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMyJYfwHGFLNfY_Qt5DfgACA6_IkzAdTg8e4Ffwu-ttSUZbd4MNxOGcPXX_CONFj_uxk6hfRZK8fboCK8w223bTwVQGOm/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Twilight Galaxy (Minimal Wear)",
                price: 9.15,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73cCxX7eOwmIWInOTLP7LWnn9u5MRjjeyP8Nvx3AW3rkc4MT_zd9KXe1A_NArTrgDvxL26hcTuu5jKmCA3uyki5mGdwULO2eKnFg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Wasteland Rebel (Field-Tested)",
                price: 18.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszcYzRA-cizq4GAw6DLPr7Vn35c18lwmO7Eu9mhiwLnr0RvMWnxLdedIwY4YFCC_lnrk-28h5K675rIyntj6ygl4HnD30vgkRiUzqw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Royal Legion (Battle-Scarred)",
                price: 0.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4TZk2pH8fp9i_vG8ML22A2xrRE4a2qgLdKWJAdoZFyD_gXsyOjq15K_7sydyHVi7idx4XmIgVXp1sVNgxwq/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Elite Build (Well-Worn)",
                price: 0.78,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LPr7Vn35c18lwmO7Eu4ih0VDi80drZ276JtfBdQE4ZA3S8gXoxebogZ-57ZiYmCFlvyIi5HjD30vgrWhS6dA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Redline (Field-Tested)",
                price: 7.11,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEm1Rd6dd2j6eQ9N2t2wK3-ENsZ23wcIKRdQE2NwyD_FK_kLq9gJDu7p_KyyRr7nNw-z-DyIFJbNUz/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Elite Build (Minimal Wear)",
                price: 1.31,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LP7LWnn9u5MRjjeyPod-l3VfkqRJoMWnxd9OQcQdoMljYqVO5xLi-g8e16JXOnSNh6XYlsGGdwUI-f1fsZg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Lore (Factory New)",
                price: 1405.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Igsj5aoTTl3Ju5Mpjj9bN_Iv9nBq2_xE6Mmv1cIOSclI6ZViFr1XtwertgZK6vJiYwXNjuSEr5XaJzhfhn1gSOWAjuI7h/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Blood Tiger (Minimal Wear)",
                price: 1.45,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-ZkvPgOrzUhFRd4cJ5ntbN9J7yjRrkqUdsMmzydoaVcAZoMFnX8lDqlbzohpC06Z6bynswuiMg43yPnUHjn1gSOeB59EOh/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Lore (Field-Tested)",
                price: 390.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Igsj5aoTTl3Ju5Mpjj9bM8Ij8nVn6qkRuYGH7I4STdldqZFCG-QS-xOy7gpW7vJ2bnSdn6XIg4X2OzkHlgAYMMLIs05iQHg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Safari Mesh (Well-Worn)",
                price: 0.2,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q42Ok_7hPoTdl3lW7Yt3iOuRrdT32wPk-UI9YW_xJo_HewJoZwuE8lbryejsh5bv7ZmYmiFjpGB8shCX1QG8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Bloodsport (Field-Tested)",
                price: 41.15,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV0966m4-PhOf7Ia_um25V4dB8xO3Hpdn22lWxqUc9Zmr0J9XBIw89M1GGqFC8ybzvgMLvvJ6azSE1viM8pSGK5KY2J5A/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV0966m4-PhOf7Ia_um25V4dB8xO3Hpdn22lWxqUc9Zmr0J9XBIw89M1GGqFC8ybzvgMLvvJ6azSE1viM8pSGK5KY2J5A/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Bunsen Burner (Field-Tested)",
                price: 0.22,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79fnzL-Nm_b5NqjulGdE7fp8j-3I4IHKhFWmrBZyY23zctKQdFU6Zg2EqwC7xe680cO8uZufyCAx63Eg7X_emUfliUtEb_sv26ID4uMQqQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Chantico's Fire (Minimal Wear)",
                price: 22.57,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j_v--YXygECLpxIuNDztIoOSIFM9YFrYrgK8l-rnjJPpuZzJnCFiviQqt3nay0SxgRBFabdqgeveFwuw6cQQkw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SSG 08 | Blood in the Water (Factory New)",
                price: 21.9,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3YjVD_teJmImMn-PLP7rDkW4fuJUp27vCp9z00A3i80drY2jwdobEcA8_YgnR_Ffox7y-h5S87Z_MwWwj5Hf8twPTSw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P2000 | Fire Elemental (Minimal Wear)",
                price: 5.65,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJSvozmxL-NnuXxDL7dk2ZU5tFwhtbN_Iv9nGu4qgE7NnfycYOSJgJqaA7RqVS_lOjuhsW9tZ_KynVk63En4CmMzRHlgUkeb7c8m7XAHtIREKva/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Ultraviolet (Minimal Wear)",
                price: 250.58,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJh4-0h-LmI7fUqWdY781lteXA54vwxlfn-xdqMG_ycY_AIQRraVjYqFm6xLrqjJLtupzMnHZluCN24HmIyhCpwUYbxnUlics/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Boreal Forest (Field-Tested)",
                price: 100.7,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4iSqPH7Ib7CglRT59d0i-X--InxgUG5lB89IT6mOo_HIA44Y1iD_Qfswe3ngcS4vZ2cmCRmvCMk7HvZm0O1gkwfZuY8g_WACQLJNbmeHFc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Ultraviolet (Minimal Wear)",
                price: 132.75,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zbfgJS-c6mmIW0m_7zO6_ummpD78A_ib7HpdT2igXsrUY_MG76JteXdVM_aV6Fr1e9wejugcS1v87KzHBjuj5iuyiOIho-lQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "UMP-45 | Riot (Factory New)",
                price: 0.28,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3ZDBSuImJgZCZmPbmDLfYkWNF18lwmO7Eu9yhi1Ds_0BuYzr3J4GVIFVrNVnUq1K3yee9hcO9uJyanyRlvXVx7XfD30vggrNaWnM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Sun in Leo (Factory New)",
                price: 3.67,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957OnHdTRD746JmImMn-PLP7rDkW4fvpJ1i7ySod-n2gfi-kZqajunLYCWdQA2aQrX-lXsxOnthpS5vpSfmGwj5HcW608dkQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Doppler Sapphire (Factory New)",
                price: 3100.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOT1I6vZn3lU18hwmOvN8IXvjVCLqSwwOj6rYJiRdg42NAuE-lW5kri5hpbuvM7AzHtmsnMh4imPzUa3gB4aaOw9hfCeVxzAUJ5TOTzr/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Lore (Minimal Wear)",
                price: 153.58,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTj5X09ujgL-HmOXxDLfYkWNF18lwmO7Eu9n2jgG1_ERlZGH1I4PHJgVqY1_Wq1m4we_o0JDovcuamCE3vXJ05X_D30vgSo6bU-Y/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Crimson Web (Factory New)",
                price: 47.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PvRTipH7s-JkIGZnPLmDLfYkWNF18lwmO7Eu9v30Ve2-ko-Mjr2JtPHJwFtZVGF-QDslbi9hcW4vJ2cmHBmuHZ3s3fD30vg7NYdUho/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Doppler Sapphire (Factory New)",
                price: 1447.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJR7cymnImZksj5MqnTmm5Y8sB1teXI8oThxlHtrkNoMWyhItDDcFJoaFjW_Vm7yL2-18W6uc6ayHcwuCQntH-Om0SpwUYb_FLG0qs/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Griffin (Field-Tested)",
                price: 2.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09uknYaNnvnLPr7Vn35c18lwmO7Eu96kiVCx_kBlY26lJ9eUJlc_MFHW-Ae9l-vogpO5vZTPyHNnuXQitinD30vgHP9iLbw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Doppler Sapphire (Factory New)",
                price: 351.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP08-3hJCDnuXxDLbQhGld7cxrj-3--YXygED6_BVlZDv3IYLGJAE2aQvX_wW5xLzrhsDqvp7Pynpkv3Ui7XnUzhHmhAYMMLIU9_4nhg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ USP-S | Cyrex (Field-Tested)",
                price: 6.41,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRc7cF4n-T--Y3nj1H68xU4YG-mdtPEdQ9tMFrX-AXtxL_vhpfptcvMzHVrviFw433emEGzhgYMMLLdmCIa3w/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRc7cF4n-T--Y3nj1H68xU4YG-mdtPEdQ9tMFrX-AXtxL_vhpfptcvMzHVrviFw433emEGzhgYMMLLdmCIa3w/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | 龍王 (Dragon King) (Minimal Wear)",
                price: 6.89,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW0924l4WYg-X1P4Tdn2xZ_Pp9i_vG8ML2ilDt_EBuZWH6coKXIAFvNAvZ-wPqk-fug5DuvciczXNnsycmti3agVXp1u5gA4zt/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Aquamarine Revenge (Well-Worn)",
                price: 14.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWZU7Mxkh9bN9J7yjRrhrUFuazjzJteVJlQ6NVHTrFe3wObs15G06picwHFnvid25C3bnhSzn1gSOQz0szG-/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Reactor (Factory New)",
                price: 3.67,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73fyhB4Nm3hr-bluPgNqnfx1RW5MpygdbN_Iv9nGu4qgE7NnfzJdOcc1I8aFvQr1G6lersh5e57siam3tjviQlt32IzUDkgEseZrFmm7XAHtr3Zeyq/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Desert-Strike (Field-Tested)",
                price: 2.61,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszceClD4s-im5KGqPrxN7LEm1Rd6dd2j6eS8Nzz2g23rkpqNjv1JdXGJAZqYA2D-VK7xO7u0ZPqvJucy3FrsiMh-z-DyGXDA0xQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Aquamarine Revenge (Field-Tested)",
                price: 16.44,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWZU7Mxkh9bN9J7yjRrhrUFuazjzJteVJlQ6NVHTrFe3wObs15G06picwHFnvid25C3bnhSzn1gSOQz0szG-/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P2000 | Imperial Dragon (Factory New)",
                price: 3.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zPYgJSvozmxL-CmufxIbLQmlRV-sR2hef--YXygECLpxIuNDztd9WdcFRtZ1vV-QC-lOa80J-6v8vPm3IxvCAi7H_YyxHj0htLPLNr1OveFwurwpmPNg/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zPYgJSvozmxL-CmufxIbLQmlRV-sR2hef--YXygECLpxIuNDztd9WdcFRtZ1vV-QC-lOa80J-6v8vPm3IxvCAi7H_YyxHj0htLPLNr1OveFwurwpmPNg/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Aquamarine Revenge (Battle-Scarred)",
                price: 12.21,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWNU6dNoteXA54vwxgCyqRVvZzrxItTDewY7NwvS_gW2x7y-h5a9vp3KnXZh63Ug4yyJyUepwUYbPABm4j8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Huntsman Knife | Scorched (Field-Tested)",
                price: 62.58,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJh5C0k_bkI7fUqWZU7Mxkh9bN9J7yjRqxqEA-ZT36cYbAIwE8NQzX-wDowe_ngsLu6J2anyRr7yhx5S7UnUe2n1gSOQmkY0Ip/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Golden Coil (Battle-Scarred)",
                price: 7.84,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITCmGpa7cd4nuz-8oP5jGu8rhIqKgavdcTCJxg-YV6G8ge8lObu1MC9uZzIyCA2vyQg4S6PmkC3101PbO1pgPbLSA2eGeUXS8Mf-SFe/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Graphite (Factory New)",
                price: 38.6,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZt7PDaZDBS4NmJlpKKgfjLP7LWnn9u5MRjjeyPoIqg0VCx-UFrN2v7JNCWIQVsYlGGqwS5lOrm1MW9uJ7Kynow6yVw52GdwULDeIeGVQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Asiimov (Battle-Scarred)",
                price: 19.1,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJQJD_9W7m5a0n_L1JaLummpD78A_2OyYoN6l2AfmrhFqZGGgIIHDdFdoZFjUqFC8w-a9hZ69vp3AmHRn7j5iuyjeBbY3oQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Brass (Factory New)",
                price: 15.86,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3cy9D_8-JmImMn-PLP7rDkW4f65x3iOuZodSmi1XjqUZkZmClddDGcVU2Nw3U81TswrrsjJC-vJidnWwj5Hebbg86gA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "UMP-45 | Primal Saber (Field-Tested)",
                price: 2.96,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3ZDBSuImJhJKCmvb4ILrTk3lu5cB1g_zMyoD0mlOx5RFqN2ylLILGe1VtMg3W_APoxunqgpa7u8zNmndiunYm5irflkHm0hlSLrs4t3JJVc8/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3ZDBSuImJhJKCmvb4ILrTk3lu5cB1g_zMyoD0mlOx5RFqN2ylLILGe1VtMg3W_APoxunqgpa7u8zNmndiunYm5irflkHm0hlSLrs4t3JJVc8/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Black Laminate (Factory New)",
                price: 520.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Igsj5aoTTl3Ju-9F-hOzW9J_9t1i9rBsoDDWiZtHAbFdqNQ2Crge8kO-615e_6ZnJnyRkuyAgsHiMlhS_1RlNaONqhvGfTQ6AR_seYQFe0Lg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Marble Fade (Factory New)",
                price: 479.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Kmsj5MqnTmm5u7sR1j9bN_Iv9nBrj-EE-YTrzcYXGcA85aF7YqQLtwb3o0MXo6Z3Nynoy6Ckr4CnUmBe3n1gSOfoXRhVR/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Shadow Daggers | Urban Masked (Field-Tested)",
                price: 57.06,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJR_OOilZCOqOLmMbrfqWdY781lteXA54vwxlbg_0BvZmDxLITHcFVsMl_VqVPtkunpgMfqtM7AmHJj7yRw5yuLy0epwUYba3Jf2fM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Guardian (Field-Tested)",
                price: 0.66,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jxP77Wl2VF18h0juDU-LP5iUazrl05Zjzyd9KWcwU2MFnV_le-yem81MS4uZXOyyFm7CRzty6JyRHkhEsZcKUx0qcUSTBJ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Safari Mesh (Field-Tested)",
                price: 61.27,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJR_OO7kZODqOP1PYTck29Y_chOhujT8om72VXkr0E4Z2r3J9CRIQ9tNArWq1S_lOrug8Xv7sjJwXVruyUl5XqOmQv330_24dUqqg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Guardian (Factory New)",
                price: 5.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuk2dU78R_ntbN_Iv9nGu4qgE7NnfyddXHIAY-Z1jW_lm-yO--1pO_vsmcz3ow7HQl53-PmETjiBBMa-Nrm7XAHnr9YjkW/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | X-Ray (Minimal Wear)",
                price: 6.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszQYzxb09Hiq4yCkP_gDLfQhGxUpsAo2LDD99-s0QywrUdlY2ugJtTBdFA4NwqC_Va7kru8hZG9uZjBmyN9-n51YAq6eTE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Huntsman Knife | Tiger Tooth (Factory New)",
                price: 229.88,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlY60g_7zNqnumXlQ5sJ0teXI8oThxg3i-hBrZjrxLIHBd1VsMFjY_1jrl-_s0MK06c_Pyno3vSAlt37cnRypwUYbNzTTgSE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Water Elemental (Field-Tested)",
                price: 3.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRc7cF4n-T--Y3nj1H68kVvYTvzJYacIA42MFHW-QLtl7vr0ZS_vpiYm3pi7HYl5CrUy0a00AYMMLI3Fd_03w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Pink DDPAT (Field-Tested)",
                price: 9.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PfMYTxW08y_mou0mvLwOq7cqWdQ-sJ0xL7ErI2gilDnrhBoYWnxJdXBJFNsM16G-QK3k7rqgJa6uMzIync37yM8pSGKhWHULvA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Reactor (Minimal Wear)",
                price: 2.21,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73fyhB4Nm3hr-bluPgNqnfx1RW5MpygdbN_Iv9nGu4qgE7NnfzJdOcc1I8aFvQr1G6lersh5e57siam3tjviQlt32IzUDkgEseZrFmm7XAHtr3Zeyq/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Blue Laminate (Factory New)",
                price: 3.95,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KHgvLLP7LWnn9u5MRjjeyPrIqtjVfh-kNvNj-iIdSSIwZsYlHR8wC_wrzr0cO7tMjImyZluyJz5WGdwUKTUQkCog/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Master Piece (Field-Tested)",
                price: 22.94,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuhWJd7ctyj9bM8Ij8nVmLpxIuNDztI4GdJFA5Z1uCqVW9k-a7gJa1752cn3ZhvHMjsy7fm0Gy0xlEb7Np0eveFwskUAkWKQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Cartel (Minimal Wear)",
                price: 3.53,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV09-3hpSOm8j4OrzZglRd6dd2j6eT8Nv3jQ2y_xBrMT2iJ4aRJARvZgvT_VW8x-67jJPt6suamHtg7CBw-z-DyAdS0pUi/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Tiger Tooth (Factory New)",
                price: 160.22,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4uOinYeOhcj7IbrfkW5u5Mx2gv3--Y3nj1H6_0dtMGmnJtXDdgQ5NVHQrAO-xue6jZTt6p2dyXVn6SFwsy6JnhbihQYMMLJJD10GFg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Gamma Doppler (Factory New)",
                price: 441.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjzMrbcl1RV59VhhuzTypz9iUex-iwwOj6rYJiRew4-MgrSqAO-yLvujMe4tMzJzSM2uylz5SrbnBC0hRpKO-1u1qbLVxzAUNEUr2p2/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Elite Build (Factory New)",
                price: 11.55,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqPv9NLPFqWdQ-sJ0xL-Qoomm2wHk_0A6YWzzd9LHe1I4MFyD_Vi2lO7ogMTptZjPySE37iQ8pSGKluvjCzA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Asiimov (Well-Worn)",
                price: 37.73,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJQJD_9W7m5a0mvLwOq7cqWdQ-sJ0xOvEpIj0jAbkqEE_ZD3xctLGJAE_Zw7U-QTowefth8TpvM_InHZh6XQ8pSGKWYJAoJI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Chantico's Fire (Well-Worn)",
                price: 12.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j_v--InxgUG5lB89IT6mOtSUcFVvaFHR_QXrkOi808O1uJ6czCQyuXUhtC7cmkSx0BpPb-Nu0_yACQLJ3UbJPy4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Crimson Web (Field-Tested)",
                price: 116.83,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zAaAJV6d6lq42Ok_7hPoTdl3lW7Yt00rDC992giQyw8xBqYm_0dobEe1VrMgzY-lK3kurohJG4ucnLwXVlpGB8ssQqSA2k/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Weasel (Minimal Wear)",
                price: 0.98,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-ckvbnNrfummJW4NFOhujT8om7jQTmrkU5Zmj6ItPHJlNrZV-D_1i7xufm08C8vZydnXRnvyEm4nrdmgv3309W5awQKQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Blue Laminate (Minimal Wear)",
                price: 3.12,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KHgvLLP7LWnn9u5MRjjeyPrIqtjVfh-kNvNj-iIdSSIwZsYlHR8wC_wrzr0cO7tMjImyZluyJz5WGdwUKTUQkCog/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Huntsman Knife | Urban Masked (Field-Tested)",
                price: 63.65,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJh5C0g_bkNoTEhGlQ5vp8j-3I4IG70QC1_kBtMmH6cICcd1doNVrSqAW-xrq90Z-7tZTMz3BjsiIl5CyLlgv330-HeU8VYw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Stainless (Minimal Wear)",
                price: 2.32,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ092nq5WYh8jnJ7rYmGdU-9ZOhuDG_ZjKhFWmrBZyYD_1cdLHelNsNVzR-Vm5xezqhZK0uZScySZg7ydx4H6MnRbkghEYPPsv26JVZyAeTQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Howl (Field-Tested)",
                price: 845.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09S5g4yCmfDLPr7Vn35cppYo0riZp4-t3Q2x_UVpYGr6LIXHJABrYVGB_QS5k72905S_75ycm3t9-n51e4WtYjg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | BOOM (Minimal Wear)",
                price: 23.69,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PHEcDB9_9W7hIyOqPv9NLPFqWdQ-sJ0xOzFpN2h0QDj_0ttNmnwIoDHcFVqNFjZ-AC2lbq-1pLou5_MyXVkv3I8pSGK_P3OCnU/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Fade (Factory New)",
                price: 100.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxD09q3kIW0m_7zO6_ummpD78A_3OyZrI-n2wPk_RY9NTrwINOSdQc9MlrW_gfqlbu9jJK4uJmYwCBlvT5iuyhGHAgcYg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Chantico's Fire (Factory New)",
                price: 65.89,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j_v--YXygECLpxIuNDztIoOSIFM9YFrYrgK8l-rnjJPpuZzJnCFiviQqt3nay0SxgRBFabdqgeveFwuw6cQQkw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MP9 | Pandora's Box (Factory New)",
                price: 4.87,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAZh7OPJfzlN_t2JmImMn-PLP7rDkW4fsJYmj-iTrd6j2Abh-RJtNW_2INWXdQQ8aVHQ-lbvlO28gcW_6Zqcmmwj5HdtheOh8g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "PP-Bizon | Judgement of Anubis (Factory New)",
                price: 7.36,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0Ob3czRY49KJl5WZhPLLP7LWnn9u5MRjjeyP9t2si1Lh80c4YDzxLNLHdg8_ZQzR_1S3krrsjZG1tZTNzHVqviR27WGdwUJIurA39A/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Doppler Sapphire (Factory New)",
                price: 1078.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eOllZCbn_7mNoTcl3lT5MB4kOzFyoD8j1yg5UBuazj3cYKQJwA5ZwnVrla_yLi5hcPp6szPwHZqvnVx5n_Vyhzjgh1SLrs4EHv5ZcQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Emerald Pinstripe (Well-Worn)",
                price: 1.29,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYeDNR-M6_hIW0lvygZITck29Y_chOhujT8om72gK2qUJoNmCiJYDHJFA8ZFHW8lS8xrzog5C7vMvOyyM1unMl4X7bygv3308LPTeH-g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Isaac (Field-Tested)",
                price: 0.29,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b092lnYmGmOHLPr7Vn35c18lwmO7Eu9ii3Vfhr0Foazj2I9CTJAVvaVGCrFLvyLu8gp_ttZ6dzSRiv3VwsX3D30vgmI_45mM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Kumicho Dragon (Field-Tested)",
                price: 3.86,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxDLDEm2JS4Mp1mOjG-oLKhVGwogYxDDWiZtHAbFNqNwnX_wftw73nh8S46Jufz3M36HQl5CvcmRLjhhFNPbdohvyaHwmAR_seHMtxE0s/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Road Rash (Field-Tested)",
                price: 5.27,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnMrXVhmpB7dd0jtbM8Ij8nVmLpxIuNDztJIbEc1VqZQnW-wLsxe7qjZ-46p2dznRkvXEjtH6PlxXkhR4abeFojOveFwtiSjRcyw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Five-SeveN | Urban Hazard (Factory New)",
                price: 0.4,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTEhGlQ5vp5i_PA54jKhF2zowcDPzixc9OLdgM4aF7WrlO9l7-5hJa_uM7MyCBruyMit3iMmBW1iBwdOOVngvWcT0LeWfIFPrcKKw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Grinder (Minimal Wear)",
                price: 0.6,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79eJl4-Cm_LwDLfYkWNF18lwmO7Eu4ihjFe2rUM4YW73I4_HewNvZQmE_lLtwui5hsS_6p6dmnpk6HJ27XvD30vg-FaCZJg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MP7 | Nemesis (Factory New)",
                price: 4.83,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAR17P7YJgJM6dGlnZO0m_7zO6_ummpD78A_3buRotjw3wW1-URkYW6lIIfBIQNqZw7V-1Dqw7jvhZXvvc_PySZr6z5iuyjpCFO7dg/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAR17P7YJgJM6dGlnZO0m_7zO6_ummpD78A_3buRotjw3wW1-URkYW6lIIfBIQNqZw7V-1Dqw7jvhZXvvc_PySZr6z5iuyjpCFO7dg/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Forest DDPAT (Field-Tested)",
                price: 54.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjVb09iyhIGfqPrxN7LEm1Rd6dd2j6eQod7wjAKw_UVvYGH2JYLDIQA9ZFmF_wW-wui80ZK_vp3Ln3Rq7nYi-z-DyOnWDwct/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Twilight Galaxy (Field-Tested)",
                price: 9.16,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73cCxX7eOwmIWInOTLPr7Vn35c18lwmO7Eu9_x3A3krxBlZj-hIoSQegVvNV_W8wS5lefmjcS8vpubyXZjvCMnsHfD30vgAFM70Bs/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Elite Build (Battle-Scarred)",
                price: 0.76,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LO77QgHJu5MRjjeyP89vwigznqRA_N26mI9KWdQU7ZgnQ8lLvlevvgcK-6MnKzXRj6SkksWGdwULURAAVxw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Fire Serpent (Factory New)",
                price: 895.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzRyTQLLE6VNWecq8Qb4NiY5vJBcVsW34bQ5JVW47MbYOrMlMI1LSZTQU_fTNwGs6k87hPcJLZSNo3_vjH6_OjoPDxK5qDgNn_jH5OUPCfKL8g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Wasteland Rebel (Battle-Scarred)",
                price: 6.52,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teHE9Jrst1i1uRQ5fW6hLIaWcgI8ZVzZqAO2w7_m0ZO66Z3KzXE2vCR24HeOmEazgBBLZuZxxavJJ8PMv-k/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Lead Conduit (Minimal Wear)",
                price: 0.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09ulq5WYh8jiPLfFl2xU18l4jeHVyoD0mlOx5UJtNm3zdoLBdlBtYVHQ_lLqxbi-gJe_6p7AyHEw6yYnsymOyUflhRlSLrs4lxDcE7E/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Doppler Black Pearl (Factory New)",
                price: 1310.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20lfv1MLDBk2pD5Pp8i_vD-Yn8klGwlB81NDG3OtWTJAdsNVCG-Vjvwrvsh8Dv6szBznVivSMnt3eOlx22hhhNbu1o0PaACQLJyiL9rI8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Autotronic (Minimal Wear)",
                price: 372.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-MhMj5aoTTl3Ju6dBlhf3T-oL8i2u4ohQ0JwavdcTCJxhoaVmG_Fnoxua9hcS4vJrIznRjuHZx7XeLmRflhUxLP7NsgfPNTV-eGeUXSwZKyJQd/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Elite Build (Field-Tested)",
                price: 0.93,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LPr7Vn35c18lwmO7Eu4ih0VDi80drZ276JtfBdQE4ZA3S8gXoxebogZ-57ZiYmCFlvyIi5HjD30vgrWhS6dA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Desert-Strike (Minimal Wear)",
                price: 4.22,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszceClD4s-im5KGqPv9NLPFqWdQ-sJ0xOiQo93zjgKxqkFvMj_xcI_HIFJtYQnX_1boxO_phsDtvcydwXUyuSA8pSGKJZ_JCy4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Doppler (Factory New)",
                price: 355.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRB4MRij7r--YXygECLpxIuNDztJ46SJwdsaFjSqVi3l7i9hJe47p_JzCdkvCMmtHaInhywhxBJbLFvgeveFwvEsgm-vQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Cobalt Disruption (Factory New)",
                price: 8.42,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTjlG_N2ikIWFhPLLI77QlWRS4_p9g-7J4bP5iUazrl09Z2H1cNSWcwA-MwuEqQe4k73q1JfotJzOwCFnvyBw5X2LmRe3gB1NcKUx0r3Iy7zp/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTjlG_N2ikIWFhPLLI77QlWRS4_p9g-7J4bP5iUazrl09Z2H1cNSWcwA-MwuEqQe4k73q1JfotJzOwCFnvyBw5X2LmRe3gB1NcKUx0r3Iy7zp/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Master Piece (Factory New)",
                price: 104.53,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuhWJd7ctyj9bN_Iv9nGu4qgE7NnemII7BcgA5aVuF_wK4kufm15TqupidzyFruCgr5CyIlhK0iE5Mb-1um7XAHhVEIznY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Medusa (Field-Tested)",
                price: 652.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR7eO3g5C0mvLwOq7c2DkAvJQg27iT9NWm2VK3rkU6YmmiI4SVJAQ9MljUr1O5ku7ug8K1usnXiSw07gvX0uU/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Fade (Factory New)",
                price: 332.36,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GKqPH1N77ummJW4NFOhujT8om7igW1qUY6MWqmcIadcw47MFrW_FK9xbzpgZ607Z7PzSAxuXYg53-Llwv330-D9XTwcQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | 龍王 (Dragon King) (Factory New)",
                price: 12.3,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW0924l4WYg-X1P4Tdn2xZ_Pp9i_vG8ML2ilDt_EBuZWH6coKXIAFvNAvZ-wPqk-fug5DuvciczXNnsycmti3agVXp1u5gA4zt/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Para Green (Factory New)",
                price: 0.99,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ08-5q4uDlvz9DLzDk25f18l4jeHVyoD0mlOx5UZoZTvwcdSddwBsMw7SqwTrkrvtjMO-tJjLz3pr7nRzsH7emha20x9SLrs4LhAglGw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Hand Wraps | Slaughter (Field-Tested)",
                price: 272.27,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8jmNr_uhWdQ_cJ5nuzTyoHwjF2hpiwwMiukcZiTcQ82NF3Q_FLqx-a505W4vJ3ByXEyuCAg53mOmEa-1x8abuBo1PWfVxzAUGFOgq-F/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8jmNr_uhWdQ_cJ5nuzTyoHwjF2hpiwwMiukcZiTcQ82NF3Q_FLqx-a505W4vJ3ByXEyuCAg53mOmEa-1x8abuBo1PWfVxzAUGFOgq-F/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Blood Tiger (Factory New)",
                price: 2.02,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-ZkvPgOrzUhFRd4cJ5ntbN9J7yjRrkqUdsMmzydoaVcAZoMFnX8lDqlbzohpC06Z6bynswuiMg43yPnUHjn1gSOeB59EOh/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Freehand (Factory New)",
                price: 340.26,
                image: "http://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20mvbmOL7VqX5B18N4hOz--YXygECLpxIuNDztLI6Udlc9aQmGq1O9ye3rjZ_tu5_KyXNq7HMrsHmImxbhgRpNOOVrguveFwu3UI9Gug/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Guardian (Factory New)",
                price: 1.14,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jxP77Wl2VF18l4jeHVyoD0mlOx5UdtZT_1JIHGIQNoMA2C_1PslO65h5Tpvc_AwXZmuiMr5CnZmhfm0hpSLrs4U9WKdHc/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P250 | Muertos (Factory New)",
                price: 3.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS09G3moSKm_bLP7LWnn9u5MRjjeyPpY32igHl_0VoMD30JoCRcVU4MFmGrwfvl-bohpC-tJWcm3c3uiJ04mGdwUJxLpw2dQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS09G3moSKm_bLP7LWnn9u5MRjjeyPpY32igHl_0VoMD30JoCRcVU4MFmGrwfvl-bohpC-tJWcm3c3uiJ04mGdwUJxLpw2dQ/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Falchion Knife | Scorched (Field-Tested)",
                price: 56.5,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1fLEcjVL49KJh5C0k_bkI7fUqWZU7Mxkh9bN9J7yjRqw_kY-Nzz6dYTEd1M8ZA6G_lC_lbq61J_v75ibyHYxsnIi533czhTln1gSOXltM7sI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | 龍王 (Dragon King) (Field-Tested)",
                price: 4.85,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW0924l4WYg-X1P4Tck29Y_chOhujT8om7jgex_RVkNWqlcYaSdgVoZljWqFnrkOrpjMK5tZ7MziQ36XYi7H6Lywv3308dOff4vw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Doppler (Factory New)",
                price: 84.74,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP09i5hJCHkuXLI7PQhW4C18l4jeHVyoD0mlOx5UpkYmv0cY_DJgRoZVzSrFHqlO_rhZHu7p7LnXJk6HVz7XiOmxazgB1SLrs4HmoGyDM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Urban Masked (Field-Tested)",
                price: 78.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zbYQJW7cyzq5WZlfb6DLbUkmJE5fp9i_vG8MKijQTl_Bc_ZT3wI4KdJ1M2Mw6ErgLqkr3n1Ja1vZTLn3FmsnQh4H_fgVXp1kJdzvEN/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "UMP-45 | Blaze (Factory New)",
                price: 12.7,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0vL3dzFD4dmlq4yCkP_gDLfQhGxUppUi2bGW89j02FXgqhBqNTz1JIKWdVNtaFHYr1i9lbvv15W16ZSbwSB9-n51WUDG5CE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Grinder (Factory New)",
                price: 0.77,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79eJl4-Cm_LwDLfYkWNF18lwmO7Eu4ihjFe2rUM4YW73I4_HewNvZQmE_lLtwui5hsS_6p6dmnpk6HJ27XvD30vg-FaCZJg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Specialist Gloves | Forest DDPAT (Field-Tested)",
                price: 130.22,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDL_VhmpF18Jjj-zPyo_0hVuLphY4OiyuS9rEMFFrf1qG_lbokLzn08O56szNz3Fh6CEltnnUyhCy00lJOORrgaeWQAicVa1XXP7VNJB_Nmc/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDL_VhmpF18Jjj-zPyo_0hVuLphY4OiyuS9rEMFFrf1qG_lbokLzn08O56szNz3Fh6CEltnnUyhCy00lJOORrgaeWQAicVa1XXP7VNJB_Nmc/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Nitro (Minimal Wear)",
                price: 1.25,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOlm7-Ehfb6NL7ul2hS7ctlmdbN_Iv9nGu4qgE7Nnf1JoPDdw5tNQvV_FW_l-rrhcXv6p-fnHplvHMh5HrfzRC_gRsYb7Ntm7XAHueE-po5/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Lead Conduit (Factory New)",
                price: 1.34,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09ulq5WYh8jiPLfFl2xU18l4jeHVyoD0mlOx5UJtNm3zdoLBdlBtYVHQ_lLqxbi-gJe_6p7AyHEw6yYnsymOyUflhRlSLrs4lxDcE7E/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Sport Gloves | Pandora's Box (Battle-Scarred)",
                price: 458.32,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eOmgZKbm_LLO77QgHJu5MRjjeyPo46i0A3lqhJsYzr6dYHDdgc_N16G_1C7l7jpg8O_vs6fzHcx6SV0tGGdwUINRWWZ1w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Slaughter (Factory New)",
                price: 236.56,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJY6d6klb-HnvD8J4Tdl3lW7Ysj2LqVpdqh2wLm-UNoNmH0cdeQIVM9N1HZ_QXtx-fu0Z64uMnAyHRrpGB8stNTCQHv/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Howl (Minimal Wear)",
                price: 1099.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09S5g4yCmfDLP7LWnn8f65Mli7DH9tXziQTgqUY4YmmnINSUJwQ-YVnT_wS7yOzngMW07ZrOmmwj5HeObpQQtA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Weasel (Field-Tested)",
                price: 0.5,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-ckvbnNrfum25V4dB8teXA54vwxgDh-kZpYG6gJ9SSe1M4MF7V_lHslLzm05S1vcnKmnsyvXJws3zclxCpwUYbcgMYmVM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Doppler Sapphire (Factory New)",
                price: 2554.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20hPbkI7PYhG5u5cRjiOXE_JbwjGu4ohQ0J3egI4ORcQNqYw3W8la5w-frgJK77ZXKwCQysyVwtnbayxKzhxlIarRum7XAHvqFh2jA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Elite Build (Well-Worn)",
                price: 3.69,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqPrxN7LEm1Rd6dd2j6fDrNzz3lXmqENlY2yiIoecdg48YlCBqFW_l-a708C96Z_KzCdl7HF2-z-DyCGf5u7A/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Evil Daimyo (Field-Tested)",
                price: 1.68,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09mgnYy0k_b9PqLeqWZU7Mxkh9bN9J7yjRqw_kJuam30INXHJFc7aAvR_gW_k-q5g5HovprPzHViuiAl5XncyUayn1gSOeN9uncr/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Poseidon (Factory New)",
                price: 214.74,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszYfi5H5di5mr-HnvD8J4Tdl3lW7YsijuuUo9StiQG2_0Q-N2z0JobAdQU2ZQmCrFC9kurqh5W97Z6amnJgpGB8sqTzmbCH/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Golden Koi (Factory New)",
                price: 14.61,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTi5B7dCzh7-JhfbiPITdn2xZ_Pp9i_vG8MKji1a1_0VqamymI4LEelRrNFHT-ATvyO680Me-uMjIzXQw6HV04CragVXp1igFofN6/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTi5B7dCzh7-JhfbiPITdn2xZ_Pp9i_vG8MKji1a1_0VqamymI4LEelRrNFHT-ATvyO680Me-uMjIzXQw6HV04CragVXp1igFofN6/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Marble Fade (Factory New)",
                price: 588.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPr1Ibndk1RX6cF0teXI8oThxlft-kRsMTqhLIORJwNqYg2E-ge9kOzt18fptMzNzHNg7HQm43bYm0SpwUYb_LdKp9c/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPr1Ibndk1RX6cF0teXI8oThxlft-kRsMTqhLIORJwNqYg2E-ge9kOzt18fptMzNzHNg7HQm43bYm0SpwUYb_LdKp9c/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "★ Shadow Daggers | Tiger Tooth (Factory New)",
                price: 126.91,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD4uOinYeOhcj7IbrfkW5u5Mx2gv2P8Y-mjVDk-0JoMW6hJoaXdlc5NwqDqwDvkr_u08Tu6sycynFguych4GGdwUKPWgFGtQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Caiman (Factory New)",
                price: 5.52,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq4uKnvr1PYTdn2xZ_Pp9i_vG8MKtjVDl_UtoZGGmJ4aTIFI9aVqB81Hvl7zu15G97cnAn3VmvyFw5nvfgVXp1oe126ve/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P250 | Valence (Factory New)",
                price: 0.41,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhhwszYI2gS09-5mpSEguXLP7LWnn9u5MRjjeyP843z3Vbn-0Y_ZWGnLNPEcAU2YFzR_FLswb_pjMLt6szOynNr6Cgj7WGdwUK-H5W5kA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Griffin (Factory New)",
                price: 5.6,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09uknYaNnvnLP7LWnn9u5MRjjeyPp9mgilDs-BU4YG3wcdedJw5qaVyB-wW7kufrjJO16J2by3Qw63ZzsGGdwUIIJNFlNw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Griffin (Minimal Wear)",
                price: 2.76,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09uknYaNnvnLP7LWnn9u5MRjjeyPp9mgilDs-BU4YG3wcdedJw5qaVyB-wW7kufrjJO16J2by3Qw63ZzsGGdwUIIJNFlNw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P2000 | Fire Elemental (Factory New)",
                price: 8.78,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJSvozmxL-NnuXxDL7dk2ZU5tFwhtbN_Iv9nGu4qgE7NnfycYOSJgJqaA7RqVS_lOjuhsW9tZ_KynVk63En4CmMzRHlgUkeb7c8m7XAHtIREKva/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Evil Daimyo (Minimal Wear)",
                price: 2.28,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09mgnYy0k_b9PqLeqWdY781lteXA54vwxlfm-0s-Mmv2JtWVJg43YVqDqwC3xu2-g5W478-fmHtnvyUi7S7anhOpwUYbM4iiQZo/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P2000 | Fire Elemental (Field-Tested)",
                price: 4.42,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJSvozmxL-NnuXxDL7dk2ZU5tFwhtbM8Ij8nVmLpxIuNDztLYGcJFVoZF3X-gO2x7y808K8vZ2cwHYxsigh4C7emkfm1BxOb7M80eveFwtKPv5lvA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Falchion Knife | Crimson Web (Field-Tested)",
                price: 86.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1fLEcjVL49KJnJm0gPL2IITck29Y_chOhujT8om7ilXh_ktoamqicoSUcQNqYQvY_FDvxbu51J677szAmHBmu3Nw4irbmAv330-KOycpNg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Lore (Minimal Wear)",
                price: 799.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJl5W0nPbmMrbummRD7fp9g-7J4cKi2A3kqhY9Zm6hJ9eXI1RqaVqF-ljowb271564vMyaznA1viF2s3jegVXp1uIYPzxv/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Gamma 2 Case Key",
                price: 2.63,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S0M7eXlxLd0pS7uijLQRl0qXKdG8QtdjmkNHdxPOsZ-yDw2hS7cEk0r7Fp9733gLi5QMyNJeNnHRE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Spectrum Case Key",
                price: 2.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOievzZVMy1aKeJG4R6YzgzNPclaCmN72ClDNQvJMmjLyVoY-mjQTi_EM9amztZNjCYKtxNio/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOievzZVMy1aKeJG4R6YzgzNPclaCmN72ClDNQvJMmjLyVoY-mjQTi_EM9amztZNjCYKtxNio/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Doppler (Factory New)",
                price: 210.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJG48ymmIWZqOf8MqjUxVRd4cJ5ntbN9J7yjRri-0M4azz3ddSTdwY3ZFGGqwK8yO2-g5Xo6prLmnNksnFw4HzYmRC2n1gSOWDhqnuE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Gamma Doppler (Factory New)",
                price: 330.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJF7dG7lb-PmOfkP77DqXtZ6dZ029bN_Iv9nGu4qgE7NnfzJtTHJFNtYF3Y-1Dsku_pgp-4u5TIyXUy7CBxs3qOmROyg01IbrNum7XAHrtnOF0c/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bloodhound Gloves | Bronzed (Field-Tested)",
                price: 231.85,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAR0hwIQFTibipJAhk2_zdfzl969C5goWYqPX4PLTVnmRE5sFOh-zV9ID5gVeLphY4OiyuS9rEMFFrf1vY_QDokL3mgpG47cvOyCExvnMitCrdmx3l1U4ZbeJt0PybTF7ID6JXXP7Vyjx_Thw/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAR0hwIQFTibipJAhk2_zdfzl969C5goWYqPX4PLTVnmRE5sFOh-zV9ID5gVeLphY4OiyuS9rEMFFrf1vY_QDokL3mgpG47cvOyCExvnMitCrdmx3l1U4ZbeJt0PybTF7ID6JXXP7Vyjx_Thw/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Huntsman Knife | Doppler (Factory New)",
                price: 345.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlY20k_jkI7fUhFRB4MRij73--YXygED6-xBrYzv7dtSVcgM6YgnZ_1S_k7q6jMS8vJrPnCY1uCBztyqLmUey1wYMMLLSJ9t1zA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MP9 | Deadly Poison (Minimal Wear)",
                price: 0.15,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAR17P7YKAJG6d2ymJm0h_j9ILTfqWdY781lteXA54vwxgTj_EVlZG-mI4acJ1U5M13Q-QXqxrvrgsS075TPy3FgsiYj4C3Yy0SpwUYb0AETg9w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Five-SeveN | Violent Daimyo (Field-Tested)",
                price: 0.11,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goW0hPLiNrXukmpY5dx-teTE8YXghWu4qgE7NnenctSRcA5sMFrZ_VO8wL3tjJG1v5uanHpr7iNz4XyLlxSyh0tJbeJtm7XAHhUtqxAV/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SSG 08 | Dragonfire (Minimal Wear)",
                price: 18.72,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJkJKKkPj6NbLDk1RC68phj9bN_Iv9nGu4qgE7Nnf3LISddw5taAzQ8lm6xOq9gZTpuZ6fyXA3syIltHffnxbkhxEYOLZtm7XAHgXm-xFt/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJkJKKkPj6NbLDk1RC68phj9bN_Iv9nGu4qgE7Nnf3LISddw5taAzQ8lm6xOq9gZTpuZ6fyXA3syIltHffnxbkhxEYOLZtm7XAHgXm-xFt/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Fire Serpent (Minimal Wear)",
                price: 308.89,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszOeC9H_9mkhIWFg8j1OO-GqWlD6dN-teXI8oThxg3n8kM5ZD-nJI-UJ1c2MFjU-VXolezugZXpvMyan3I3v3Qjty2OlhKpwUYbndZ_4hw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SSG 08 | Dragonfire (Factory New)",
                price: 24.26,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJkJKKkPj6NbLDk1RC68phj9bN_Iv9nGu4qgE7Nnf3LISddw5taAzQ8lm6xOq9gZTpuZ6fyXA3syIltHffnxbkhxEYOLZtm7XAHgXm-xFt/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Ultraviolet (Field-Tested)",
                price: 113.88,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-YmMjkJqnBmm5u5cB1g_zMyoD0mlOx5UVoMm-nJtKTJw87MliEqwTryL2-1Jbvv5rAyydn6yQg43jVnRbmiU1SLrs4mzHMj48/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P90 | Trigon (Field-Tested)",
                price: 2.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIQJW_tWxm460mvLwOq7cqWdQ-sJ0xOvD8Iim21ftqhE-a2qlItCQcwY5aV6C-VS-lb_nh5C5us_LmnRis3Y8pSGK3Ot8Ex8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Urban Masked (Field-Tested)",
                price: 135.23,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJh5C0g_bkNoTEhGlQ5vp8j-3I4IHKhFWmrBZyYWn6cYWTd1VtM1-C81e5l-7rgsO87Z-awHAwviBxsHrUnRHkghoZb_sv26KGa0e-bg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Tiger Tooth (Factory New)",
                price: 299.47,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmcjgOrzUhFRe-sR_jez--YXygECLpxIuNDztII_Bd1doM16E_Qe_xr29hcS_tJmbnHNnuyZz7HrenB2zgBlLarQ8gOveFwvcAFHlzA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Dual Berettas | Panther (Factory New)",
                price: 0.98,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJfwPz3YTxM-NSzhr-HnvD8J4Tdl3lW7Ysh27CVpt3321K3qkJkMWnxI9KVdVBrY1GE-gTrxry5jZ7o6prMzHVlpGB8sjtQiIKd/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Corticera (Factory New)",
                price: 12.18,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PXJZzhO7eO3g5C0m_7zO6_ummpD78A_3rqTrI-l3AOxqkJkamClJ46RdFc_MFDR_1K3k7_t1JS7upvMmHdn7z5iuygrdWg_VA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "CZ75-Auto | Xiangliu (Field-Tested)",
                price: 3.18,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf1OD3cid9_9K3n4WYqOfhIavdk1Rc7cF4n-SPrN70jlXi8xVtYz30Io6TdVNvNVGD-FO6wbru0JbpvpnNz3RgunV2sWGdwULqCIBbXA/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf1OD3cid9_9K3n4WYqOfhIavdk1Rc7cF4n-SPrN70jlXi8xVtYz30Io6TdVNvNVGD-FO6wbru0JbpvpnNz3RgunV2sWGdwULqCIBbXA/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Desolate Space (Field-Tested)",
                price: 9.43,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18h0juDU-LP5iUazrl1kazqmJY-dIFRrY1iB_gK7xOa6h8S6vZrJnCMy6SBx4ynfyRPj00odcKUx0jz3Bze9/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Lore (Factory New)",
                price: 728.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zLZAJA7cW5moWfqPv7Ib7ummJW4NE_2b6T9tvw2FG3_UZoNWqhcYPBdwVraV-DqAPvku2-15e6vM7BmnVl7z5iuyjsDymLtA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bowie Knife | Tiger Tooth (Factory New)",
                price: 220.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMrXugmJW7ddOhfvA-4vwt1i9rBsofTj7d9CXJAI8YFyD81S-l-vmgp-06pzMnXJjuyN04i7enECxiB9OOLRxxavJJ9-Xlfw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | X-Ray (Field-Tested)",
                price: 5.93,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszQYzxb09Hiq42Ok_7hPoTdl3lW7Yt027yYoo6h0QWx_hVrNmGld4aRJAc5MwnWrATswbrogMe9u5vBmCFlpGB8sp0wSwbi/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P90 | Asiimov (Minimal Wear)",
                price: 9.01,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIXBD_9W_mY-dqPv9NLPFqWdQ-sJ0xLnC9Nvz31K3-0BuMGD7d4PGIQM-ZwuDrgS3w7zshsO5tJ7PmHoysig8pSGKpkWB0BI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Falchion Case Key",
                price: 2.63,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOieLreQE4g_CfI20b7tjmzNXYxK-hYOmHkj9QvpIg2OyVpdus0AW1_EQ9MnezetGj61oqPA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Kill Confirmed (Battle-Scarred)",
                price: 23.66,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP9jVWisl1uNj3yIoWdJAc8YgrT_FK6yei71MS06M6cnXJg6HIg53zbzRTj0x9JcKUx0vl8_sxu/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Fever Dream (Field-Tested)",
                price: 8.16,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJS_8W1nI-bluP8DLbUkmJE5Ysji7vHrNjxjgKw_RVtazr3INWddQRsYljS-QLql-e9hJXt75ucm3BlpGB8snSRBTot/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJS_8W1nI-bluP8DLbUkmJE5Ysji7vHrNjxjgKw_RVtazr3INWddQRsYljS-QLql-e9hJXt75ucm3BlpGB8snSRBTot/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Atomic Alloy (Factory New)",
                price: 8.7,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-Gw_alfqjul2dd59xOhfvA-4vwt1i9rBsoDDWiZtHAbA48MwzS_VPqwezqg8C9u8ibwXRjuClz7SvcmxS20hwZa7c5h6fNQA-AR_seVEiZW-4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Doppler Black Pearl (Factory New)",
                price: 1190.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Kmsj2P7rSnXtU6dd9teTA5475jV2urhcDPzCkfMKLIwRvYwrWqVS8wezpjcS_78_Mn3Bruykj7HbfzhPm00xLOLc-jPXNHELeWfLcbrqw2A/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Man-o'-war (Minimal Wear)",
                price: 10.55,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZt7PLfYQJF4NOkjb-HnvD8J4Tdl3lW7Ysi3rHE9ImljgGw_xc9a2_0JY6ddA48Z17U8gXqxe_mgse1tJ_AyXtjpGB8srCcYzyi/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Worm God (Factory New)",
                price: 1.64,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZx7PLfYQJW-9W4kb-HnvD8J4Tdl3lW7Yt3076X9tikigyy8kRkN2uhLNKUcQE9ZQ7R_ge4xObpjJ6-6JXMwCRipGB8spTEjD1p/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Revolver Case Key",
                price: 2.56,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiev1ZVNkgqeRdWUV7o3kltLdzvOjauqCwDlUupAj0-rD843zjAbt_hVtMDjtZNjCJHQgy4g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Hyper Beast (Battle-Scarred)",
                price: 6.33,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoTwiUKtlB89IT6mOtTDdFA7M1-ErAe_xOnvhMDpv53KnXFqvyd2t3razUfliRsaZuxrgfCACQLJHLRQjkw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Gamma Doppler Emerald (Factory New)",
                price: 1210.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eOzmYWZlvvwDLbQhGld7cxrj-3--YXygED6-UBlZWGiIICVdQBoZFHR-Fftk7y8hsTotZjAmiFhuil2ti6ImkCwhQYMMLJIJJ_2Qw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Wasteland Rebel (Minimal Wear)",
                price: 9.65,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teXI8oTht1i1uRQ5fWv7II6ce1dsYl2F_wC8yL3p0MLuupmbyyM1uykmtiqInhzmgU0YZuxxxavJ__KWVeE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Doppler Black Pearl (Factory New)",
                price: 620.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eO0mIGInOfxMqndqWZQ-sd9j-Db8IjKhF2zowdyZz_yLIfGdAFvYguD-Fa9kOrp15G9vpifz3A26ycjt3qMzBDig05Lafsv26IspbmNiQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Shadow Daggers | Crimson Web (Field-Tested)",
                price: 87.81,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJK9eOhkYKYqPrxN7LEm1Rd6dd2j6eSpt7z3gLi_hY5Nm-mJ4GTIQc-ZFrU-VG4wuzp18Duvc_KmCE27iIk-z-DyP8GDskT/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Dual Berettas | Contractor (Field-Tested)",
                price: 0.03,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJfwPz3YTBB09GzkImemsj4MqnWkyUC6ZVw2bnHptil2APn-0s4ZTv0cNOcegY9MAvX-wO3w-m-0cfpvZzB1zI97dnKOYtA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Conspiracy (Factory New)",
                price: 3.02,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH7du6kb-KguXxJqjummJW4NFOhujT8om731K1_EVsZm6gdoaQJARtMArY-FjslOrrjcC9vp2YnHdnuicj4Cvdygv3308GE_1AfA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Doppler (Factory New)",
                price: 267.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjwPKvBmm5D19V5i_rEprP5gVO8vywwMiukcZicd1BtZFiG-gPqkLjm1JO56ZqYnXJl6SAhtHePm0G0g0lIO-VpjfHMVxzAUO3kMgPo/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Operation Wildfire Case Key",
                price: 2.61,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiev0ZVZl1vGQcGUTv9mww4bfwvOmZO_TzjwCv5Qm2-iYoN2j31Kx_xA4Yj3tZNjCXJdubss/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Five-SeveN | Case Hardened (Minimal Wear)",
                price: 4.62,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTjxT09O_mIWPqPv9NLPFqWdQ-sJ0xO_F9I2l0QHg_kBlZWyhJtTAewVoaQmB81HvlOrpjMK1vpufmCFn7yc8pSGKb-AzS44/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Marble Fade (Factory New)",
                price: 307.63,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJP7c60mIW0kfbwNoTdn2xZ_Pp9i_vG8ML0jFfm80U6YGCgLY7EewA9YV7S-gC3xubshMXtvsjMyXdjuCIrsSmLgVXp1iqhnkny/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P250 | Supernova (Factory New)",
                price: 0.71,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszKeClW6c6lg4WOg8j4OrzZglRd6dd2j6eZpo_x3Azt_Us4ZGD3JYTAclVoY1rT-QO2lO_ng5a-6svLzntj63Qm-z-DyIPWN4xl/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Golden Coil (Factory New)",
                price: 34.43,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITCmGpa7cd4nuz-8oP5jGu4ohQ0JwavdcTCJxg7ZlyBqQS5xrvuhZK46M-fyiNgsid053_dzRe_hx9Pbec6jPKaH1ueGeUXSzRAor56/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Marble Fade (Factory New)",
                price: 208.8,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eO7lZKJm_LLNbrVk1Rd4cJ5ntbN9J7yjRrh_BJlamqidoCTcQRsMArX_lPqkufp0J7p7sidn3trvichsy7YzRG_n1gSORYEYb_6/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ USP-S | Kill Confirmed (Minimal Wear)",
                price: 148.92,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP5gVO8vywwMiukcZjEcVc5M1CG-1jtyLi9jJW97pzBmnM27nQlsSvfnkGzhU1OPeY8h6CeVxzAUEsa6pHf/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP5gVO8vywwMiukcZjEcVc5M1CG-1jtyLi9jJW97pzBmnM27nQlsSvfnkGzhU1OPeY8h6CeVxzAUEsa6pHf/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Damascus Steel (Factory New)",
                price: 256.33,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlZG0k_b5MqjSg3hu5Mx2gv3--Y3nj1H6_0Q9ZG-lI46TIQc-NQuE8gS-kr-918C76J2fnyM26SkhsC7UlhO30AYMMLK-PHGgTA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Safari Mesh (Minimal Wear)",
                price: 66.98,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJR_OO7kZODqOP1PYTdn2xZ_Pp9i_vG8MKm3gW380dqMjr0dtXAdwc8N1_Q_Vbql-a9jcToup-dmHpgsnVwsH2IgVXp1ngZO2uX/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Bunsen Burner (Minimal Wear)",
                price: 0.3,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79fnzL-Nm_b5NqjulGdE7fp9g-7J4bP5iUazrl1pNTynJoXBd1c9Y1_Z-QK8xOfugcPp7pTAm3Zm7CFz5y3dzEe-1R4fcKUx0gkHdoQp/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MAC-10 | Fade (Factory New)",
                price: 2.16,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0vL3dzxG6eO6nYeDg8j4MqnWkyUHvsQj2r2R8NSj2VCxqRZqNmn1ctfEIFc_ZVvV8li4w-btgZ61vZTO1zI97epIxKWh/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Stainless (Field-Tested)",
                price: 1.32,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ092nq5WYh8jnJ7rYmGdU-9ZOh-zF_Jn4t1i1uRQ5fTv7JI_AdlVrYFyC-VHvx7u91JG1v52fnCc16XQi4nuOnUDmghAeaLBxxavJUAmH2MQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Marble Fade (Factory New)",
                price: 564.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20mvbmMbfUqW1Q7MBOhuDG_Zi7jQGw-xVoZGigd4LEI1I2NQyE_ATqlOrtjMfq6ZWanXA3siBx5CyLnQv3309Lv_QKkg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P2000 | Corticera (Factory New)",
                price: 3.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJE7cqzmIG0h6WkY-vummJW4NFOhujT8om7i1fg-xc-Zz32JIKdIQFqNQuGqFS8x-rt0Z-5uMjAyHZjunUn7H3Unwv330-Dajd6nw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P250 | Wingshot (Factory New)",
                price: 2.16,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhoyszYI2gS09-klYOAhP_7J4Tdn2xZ_Pp9i_vG8MKg2wy1-EA-MWGnI9fDeg86N1HW_1O7xr3sjMC6tZTIz3o2uyIntiuJgVXp1jDnul40/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Wasteland Rebel (Field-Tested)",
                price: 7.76,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teTE8YXghWu4qgE7Nnf2cIDHJFRoMArX_ALql-fpgsTp6pidznpquCV3tiyLnByxhExLa7E7m7XAHufXctEb/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Neon Revolution (Minimal Wear)",
                price: 30.97,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV0924lZKIn-7LP7LWnn9u5MRjjeyPo4ms0FLkqEU6MDv7JdfEJ1VvYVuD_1frlLrpjZ-6vsvMySFq73Yr4WGdwUIt-GQI9g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ StatTrak™ Bayonet | Fade (Factory New)",
                price: 307.55,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJcAJE7dizq4yCkP_gDLfQhGxUppBwib3Hod6n2ADnqUdkMW30cYKRdwVtMlrV-gK5yLi71JXpu5XBzHd9-n51Ga5qFJk/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJcAJE7dizq4yCkP_gDLfQhGxUppBwib3Hod6n2ADnqUdkMW30cYKRdwVtMlrV-gK5yLi71JXpu5XBzHd9-n51Ga5qFJk/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Falchion Knife | Marble Fade (Factory New)",
                price: 224.75,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1fLEcjVL49KJlY20mvbmMbfUqW1Q7MBOhuDG_Zi73gPk-RZsYjr1LdTHJlI-ZFiFrlO5yOjrhp656cyfzHU17ikksXralgv3308bb2-Obg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Sport Gloves | Arid (Field-Tested)",
                price: 208.61,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eO7nYyCg_bmKoTck29Y_chOhujT8om7jQK1_EVuMmv2do6RcwA5NAvTq1O-lebq1p67787PyHtquiAi5SqLyQv330-Ro46Jmw/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eO7nYyCg_bmKoTck29Y_chOhujT8om7jQK1_EVuMmv2do6RcwA5NAvTq1O-lebq1p67787PyHtquiAi5SqLyQv330-Ro46Jmw/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Shadow Daggers | Fade (Factory New)",
                price: 125.29,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD7eOwlYSOqPv9NLPFqWdQ-sJ0xO-Wpois2w21-EBpazjyJoDDJFRsZgrZ-QK3l-bo15_uu5WYzyFksnY8pSGKbPKwSf4/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Cyrex (Field-Tested)",
                price: 5.99,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp8j-3I4IHKhFWmrBZyYDz2IobGcwdoYFCG8lW4l7jnjMC6vZybyHVk7CEjtHaMyh20iBsdbfsv26IzXLrUVA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Cyrex (Factory New)",
                price: 11.35,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp9g-7J4bP5iUazrl1tZ22hIIaQcVNsZluC_gC6xrjnhJS06c-bySdruih27Srfl0Oy0xEfcKUx0knZQYH9/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Tec-9 | Nuclear Threat (Minimal Wear)",
                price: 27.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhzw8zGZDZH_8iknZCOqPDmNr7fqX9U65xOhuDG_ZjKhFWmrBZyY2n1I4WWcQA8ZAqG-1Dol7_mhsK7vJidnSdmvyNw4S3fzUOx1xBOPfsv26K75-WM4g/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Red Laminate (Minimal Wear)",
                price: 12.52,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4yCkP_gDLfQhGxUppQo07-TpYmt2Azh_EpqYGDxIoLGJAE7YgzQ_FS-xuzu15Lu75yfynV9-n512WUCzeM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MAC-10 | Neon Rider (Field-Tested)",
                price: 2.13,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0Ob3fDxBvYyJmoWEmeX9N77DqWZU7Mxkh9bN9J7yjRqy_EM5Y2j7ItDBdAY8ZlzZ-FK-lL3thp64uZ_LynNquXFx4CnZzRLln1gSOfeNbOAh/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Autotronic (Field-Tested)",
                price: 377.5,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJk5O0nPbmMrbul35F59FjhefI9rP4jVC9vh4DPzixc9OLdlJqN1mC_lC2xO670JbouJTAyXAxvSIjsHzdzkSy1UsZb7Y7hfacT0LeWfK7G5XVQA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P250 | Whiteout (Minimal Wear)",
                price: 4.51,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhz3MzfeTRW6dOjgL-HnvD8J4Tdl3lW7Yt3jO2X8Nqk3Fbi-BdvMj_xINeVdlc3N1_X-1HsxOvthJbtu8nJy3tlpGB8sifSTxxd/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhz3MzfeTRW6dOjgL-HnvD8J4Tdl3lW7Yt3jO2X8Nqk3Fbi-BdvMj_xINeVdlc3N1_X-1HsxOvthJbtu8nJy3tlpGB8sifSTxxd/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "AWP | Pit Viper (Minimal Wear)",
                price: 0.98,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957ODGcDZH_9e_mr-HnvD8J4Tdl3lW7Yt03OjF8Y733A21_ENuZz_7JIbEcQNtaA3Q8lC6wey-h8W0up7IyXBrpGB8sr1DtlQN/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "SSG 08 | Blood in the Water (Minimal Wear)",
                price: 14.85,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3YjVD_teJmImMn-PLP7rDkW4fuJUp27vCp9z00A3i80drY2jwdobEcA8_YgnR_Ffox7y-h5S87Z_MwWwj5Hf8twPTSw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Basilisk (Factory New)",
                price: 2.26,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3hb-Gw_alIITTl3hY5MxigdbN_Iv9nGu4qgE7NnfyLIWSclI4ZF3X_1G-wunp0Je_u87On3Qxuidx4iqJmxPkiEwfPbNtm7XAHjQFcBpg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Doppler Sapphire (Factory New)",
                price: 2538.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjnMqvBnmJD7fp8i_vD-Yn8klGwlB81NDG3OtSUJgY7YVvS-VfolLq7hsO5tZ_OnXo3uyhz7SyPnhGx0xoeb-dugKOACQLJ28w8Lgw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Catacombs (Factory New)",
                price: 0.32,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJkIWKg__gPLfdqWdY781lteXA54vwxleyqBBqMmj0JIWSIwU9MwqC_1O6kr_ujZO6753OmiRkvHR2tHvZlkGpwUYbVEIcxNs/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Royal Legion (Minimal Wear)",
                price: 0.81,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4Tdn2xZ_Pp9i_vG8MKk0Qy3-xc_Zm_wJI-SclQ_N1uCqALswu7o1Je_vZXOzXcw6yAi4yragVXp1hC1mqlk/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Gut Knife | Gamma Doppler Emerald (Factory New)",
                price: 429.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP09m7kZKKm_PLPrrDlGdU4d90jtbN_Iv9nBqxqRU5MG32ddeQIwdsaVqE_wTtkO66g5Hv7p6fzHprvidx4XiLzBezn1gSOQvdpryG/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Scorched (Field-Tested)",
                price: 80.85,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zbYQJG7cymmIW0mvLwOq7cqWdQ-sJ0xO_DrNil0AKx_xJpMWmmIoCXcQRoNVHRrFe9wee5jJW-usvMynY3syM8pSGKzDZP-os/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Blue Fissure (Minimal Wear)",
                price: 0.94,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf2-r3ci9D_cmzmJWZksj4OrzZglRd6dd2j6eZ8NWijVbl_BJsYjz0J9WRdVc2aFDX_Fm7lenrhcS_uJmYnCBh6XIq-z-DyEnn8nMM/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Reactor (Field-Tested)",
                price: 1.2,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73fyhB4Nm3hr-bluPgNqnfx1RW5MpygdbM8Ij8nVmLpxIuNDztLNeXegQ3YQzV-li9ye_pjZW0uJvJnCFguCAhtHvVzhG01U4fauZmg-veFwv4TERPOw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Dark Water (Minimal Wear)",
                price: 5.9,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-RkvXmMoTVl3la18l4jeHVyoD0mlOx5RVoa23wIo7EdgE2N12F-lPqwLzm0ZPpvpXIz3FmvnZ34n_YmhW01xtSLrs4m_P9LyY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Hot Rod (Factory New)",
                price: 66.56,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mr-ZkvPLPu_Qx3hu5Mx2gv3--Y3nj1H6rhBpajz6doacJwdraA7U_ADowOa70Me6ucicwHI2v3J2syrUykflgAYMMLJrS8Tuyw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Doppler Ruby (Factory New)",
                price: 2530.0,
                image: "https://steamimages.opskins.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOXhMaLum2pD6sl0g_PE8bP5gVO8v11kYjjzJ9KcIFI5YliDqAXoxbrsgpC9up_BmCM17nYh4SndzRLl1xwdcKUx0pRZROip/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Shadow Daggers | Boreal Forest (Field-Tested)",
                price: 54.28,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJK9eOwm5KOhOPLMbTDk2pd18h0juDU-MKn2wLhr0s5MG-iINLHew84NA2G_1TsyOi9jcLt6ZuYwXpq6XN35HffgVXp1pnZuys1/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Flip Knife | Gamma Doppler (Factory New)",
                price: 207.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eOxlY2GlsjwPKvBmm5D19V5i_rEpLP5gVO8vywwMiukcZiSIFA3YwvR-1a2xe-6gJO_v5nJmyFm6SB25X3bmUblhR1EPOxth_GXVxzAUArGpA2n/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bayonet | Damascus Steel (Factory New)",
                price: 138.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJYAJG7dG3h4OehMj4OrzZglRd6dd2j6fD8d7321bnrRA4ZGmlcNPGdQU4MF_Y-AfvxO_vjcPttZ_BzyZrvHEq-z-DyDvfktEk/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Wasteland Rebel (Factory New)",
                price: 12.49,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teXI8oTht1i1uRQ5fWv7II6ce1dsYl2F_wC8yL3p0MLuupmbyyM1uykmtiqInhzmgU0YZuxxxavJ__KWVeE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Water Elemental (Battle-Scarred)",
                price: 2.82,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRZ7cRnk9bN9J7yjRrkrkNqY2H6JoCTJw44NFzQ-1DqxOm8gp7vus_MznQ3uiAmsXiMzUbln1gSOYiYVsoU/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Oni Taiji (Field-Tested)",
                price: 35.91,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK7dK4jYG0mvLwOq7cqWdQ-sJ0xLuWpYql21W2r0A9N2r3d4PEdw86Mw2C_Afoxea8hJDo6J_Pn3ZjsyU8pSGKnbCLqT8/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Worm God (Field-Tested)",
                price: 1.01,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZx7PLfYQJW-9W4kb-GkvP9JrbummpD78A_2O-WrIqljgfjqEE6NjrwLdLDIwZqZg7W-gPrwrzrgpDqvJTKmyZlvj5iuyj_iFO2uA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Royal Paladin (Field-Tested)",
                price: 7.11,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW0865jYGHqOTlJrLDk1Rc7cF4n-T--Y3nj1H6r0tvYWzzJo6RdQQ2Zg6E-QS5xeno15C96JnJyiBk7HUj5C3fmxO1gwYMMLJ1i-HMUA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Glock-18 | Candy Apple (Factory New)",
                price: 0.49,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxfwPz3YzhG09C_k4ifqPv1IbzU2DoG6pQpi7qV9Njx0ADk8kNpZmH0cY-Uelc2ZFjQ_1a4lOfu15bv7pTXiSw0KjtfQAI/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Point Disarray (Minimal Wear)",
                price: 17.17,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18l4jeHVyoD0mlOx5RE9Yz_1d9XBIVQ3YF-Bq1Pslbvt0MC8v5zLmndk7ick5i7bnkG0hRlSLrs4iEgtRw4/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18l4jeHVyoD0mlOx5RE9Yz_1d9XBIVQ3YF-Bq1Pslbvt0MC8v5zLmndk7ick5i7bnkG0hRlSLrs4iEgtRw4/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Bowie Knife | Fade (Factory New)",
                price: 256.58,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMrrukGpV7fp9g-7J4bP5iUazrl06N2H2cYXBe1BsNVDX_wLvw-vqhMS_u5jBn3dgvSR35nyJnhOw10oacKUx0rse6B8s/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Jaguar (Battle-Scarred)",
                price: 10.52,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYcDNW5Nmkq4GAw6DLO77QgHJu5MRjjeyP9N2ijFK3qks9am2nIY-ddVU9MwvTqQe3wLu5jZ-07cjJmnVn6SYn7WGdwUIg7NlC-A/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Blueprint (Field-Tested)",
                price: 0.75,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLMbfEk3tD4ctlteTE8YXghWu4qgE7Nnf1d9CScQY3N1jTqFjqwezu08K57ZvJzSNnsid04nyLzUfmhkwaaOE6m7XAHjXf0ofS/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ M9 Bayonet | Urban Masked (Field-Tested)",
                price: 94.47,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Yh8jgMqvUqX5D6sR_teTE8YXghWu4qgE7Nnf7cYCXcA9tZ1DZ_QO3x-7sjZS7ucidwSM26XZ07HbczRO_hxoZPeA8m7XAHsJxu2aY/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Tiger Tooth (Factory New)",
                price: 410.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY60g_7zNqnumXlQ5sJ0teXI8oTht1i1uRQ5fTqnIdecJgFqMFmG-1TsxO3phcO0vpibziZruCYj537dzECwgB9KauZxxavJ_ct1ylw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "FAMAS | Roll Cage (Minimal Wear)",
                price: 6.07,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf1OD3dzxP7c-JhoGHm-7LP7LWnn9u5MRjjeyPoN-tilWxrkdoNjv0I4TBJw87YVrZr1W8x-m61J_vuJzIyXMx6HMr4WGdwUIVx7r5Nw/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf1OD3dzxP7c-JhoGHm-7LP7LWnn9u5MRjjeyPoN-tilWxrkdoNjv0I4TBJw87YVrZr1W8x-m61J_vuJzIyXMx6HMr4WGdwUIVx7r5Nw/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Driver Gloves | Diamondback (Field-Tested)",
                price: 125.78,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAX1R3LjtQurWzLhRfwP_BcjZ9_9K3n4WYnP76DKLUmmde__p8j-3I4IHKhFWmrBZyNmqlJ4bBewZsZA7TrADql7u8hZ--tMzJzCQ36Sgh7XrdmBK3hh9MbPsv26J_OCqpOQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAX1R3LjtQurWzLhRfwP_BcjZ9_9K3n4WYnP76DKLUmmde__p8j-3I4IHKhFWmrBZyNmqlJ4bBewZsZA7TrADql7u8hZ--tMzJzCQ36Sgh7XrdmBK3hh9MbPsv26J_OCqpOQ/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "StatTrak™ M4A1-S | Hyper Beast (Field-Tested)",
                price: 27.22,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoHwjF2hpiwwMiukcZiQJAJvMwqGrAW-wubnjJe4uZXMwCRq6yIgsXyMnEPhiE4ZbOBs0aeeVxzAUEeAasNQ/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoHwjF2hpiwwMiukcZiQJAJvMwqGrAW-wubnjJe4uZXMwCRq6yIgsXyMnEPhiE4ZbOBs0aeeVxzAUEeAasNQ/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "★ Karambit | Lore (Field-Tested)",
                price: 398.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJl5W0nPbmMrbummRD7fp8j-3I4IG72ADgrUJoazqhIYOccwZsaAvSrlHtlO6-jZPt78ufynZk7yggtnnanwv3308QSsudOA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Butterfly Knife | Damascus Steel (Factory New)",
                price: 244.39,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GaqPP1PrrClX5C15whteXI8oTht1i1uRQ5fT_1cdPGIQM4NFGE_Fi5xey7jZbt6J2bn3dqvCkntHfUzEe_1RFKZuFxxavJ4x2f9Kw/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GaqPP1PrrClX5C15whteXI8oTht1i1uRQ5fT_1cdPGIQM4NFGE_Fi5xey7jZbt6J2bn3dqvCkntHfUzEe_1RFKZuFxxavJ4x2f9Kw/360fx360f",
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Kumicho Dragon (Factory New)",
                price: 12.43,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxDLDEm2JS4Mp1mOjG-oLKhF2zowcDPzixc9OLcw82ZlyF8wC8wb251MW4tcifmydi7CEn4HiPlhyy1BxJbeNshqPIHELeWfJvK5CfiA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Desert Eagle | Blaze (Factory New)",
                price: 85.02,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLJTjtO7dGzh7-HnvD8J4Tdl3lW7Yt1jriVpY-migfh8hBtZTqgcI7Aewc2MgnWqwW-k-zph569uZyfnHMwpGB8slBfgSNs/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "MAC-10 | Neon Rider (Factory New)",
                price: 5.9,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0Ob3fDxBvYyJmoWEmeX9N77DqWdY781lteXA54vwxlHl8hc5Y2nxcYHGcFJoNFiB-FXslby8gJDq6svBwHI26SQntH-JmUepwUYbVDDJYDE/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Bloodsport (Factory New)",
                price: 54.93,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV0966m4-PhOf7Ia_ummJW4NE_3rnHpdujjgK28kE5Y2Gid9WWdQ44YVHS-VS9wr--jJG6tJrAzCBh6D5iuyjdE47G3Q/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV0966m4-PhOf7Ia_ummJW4NE_3rnHpdujjgK28kE5Y2Gid9WWdQ44YVHS-VS9wr--jJG6tJrAzCBh6D5iuyjdE47G3Q/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "AK-47 | Cartel (Factory New)",
                price: 6.79,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV09-3hpSOm8j4OrzZglRd6dd2j6eT8Nv3jQ2y_xBrMT2iJ4aRJARvZgvT_VW8x-67jJPt6suamHtg7CBw-z-DyAdS0pUi/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "P90 | Death by Kitty (Minimal Wear)",
                price: 35.25,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17PDJZS5J-dC6h7-bzqfLP7LWnn9u5MRjjeyPpYrz2lfhqEZvMm_6JdOXelJrYVqDrlbsxe66hp-56JjKnXowvCgg42GdwUIaw99WQg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Shadow Daggers",
                price: 83.12,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0nvUOGsx8DdQBJjIAVHubSaIAlp1fb3YShR5JLnx4bfx67yYejUwD4CuZUmibCRot2kjQG1qUFpazv2JtSUegFoN16B5BHglmGclzRb/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Mecha Industries (Field-Tested)",
                price: 8.82,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDLbUlWNQ18x_jvzS4Z78jUeLphY4OiyuS9rEMFFrf16DqALvl-_u05-6753JzCc3uSAntHjVnxCziEsZPLZo0KPNHQ2aAKBXXP7V3wxvJ98/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Worm God (Minimal Wear)",
                price: 1.11,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZx7PLfYQJW-9W4kb-HnvD8J4Tdl3lW7Yt3076X9tikigyy8kRkN2uhLNKUcQE9ZQ7R_ge4xObpjJ6-6JXMwCRipGB8spTEjD1p/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A4 | Poseidon (Minimal Wear)",
                price: 161.54,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszYfi5H5di5mr-HnvD8J4Tdl3lW7YsijuuUo9StiQG2_0Q-N2z0JobAdQU2ZQmCrFC9kurqh5W97Z6amnJgpGB8sqTzmbCH/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Bowie Knife | Marble Fade (Factory New)",
                price: 347.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMrbum2pD6sl0te_A8YnKhF2zowdyNjz1INCWewU9YArR-wO6w7jp0MC76Z3Jn3dkunJx5SuMnxzk1xgZO_sv26Is8TDGIA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Orion (Minimal Wear)",
                price: 9.03,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnI7LFkGJD7fp9g-7J4bP5iUazrl1ka2qhLIGSIw5vZF-D8wXqwO_tjcC-uZjJnSY3vCkmsXbYlkO0gB1McKUx0vNO72r1/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Master Piece (Well-Worn)",
                price: 16.25,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuhWJd7ctyj9bM8Ij8nVmLpxIuNDztI4GdJFA5Z1uCqVW9k-a7gJa1752cn3ZhvHMjsy7fm0Gy0xlEb7Np0eveFwskUAkWKQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Medusa (Battle-Scarred)",
                price: 521.0,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR7eO3g5C0n_L1JaKfkDNU7JYnj7rEodin2Aey-hZpMmz3doKQdAdqMFDQ-gW6xbi7jZG0voOJlyV6Gv6xpQ/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "★ Driver Gloves | Crimson Weave (Minimal Wear)",
                price: 832.5,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAX1R3LjtQurWzLhRfwP_BcjZ9_tmyq4yCkP_gDLfQhGxUppQi3b2UoIrx3gDs_RBpYD-mcoeQIwM8Yg7Y_AS8yOzngpK_6MjAzid9-n51DgI4TYA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Golden Coil (Well-Worn)",
                price: 9.7,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITCmGpa7cd4nuz-8oP5jGu5rhc1JjSceNfXJVMgaVmB_QO-wLi5h5HovZ_Kn3A27HR24HrcnRC3g0lJbOFthPKcHwjIUrsJQvfN77TKZw/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Guardian (Minimal Wear)",
                price: 3.93,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuk2dU78R_ntbN_Iv9nGu4qgE7NnfyddXHIAY-Z1jW_lm-yO--1pO_vsmcz3ow7HQl53-PmETjiBBMa-Nrm7XAHnr9YjkW/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "AWP | Hyper Beast (Field-Tested)",
                price: 24.68,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tck29Y_chOhujT8om7jQWwqhdoYmz0IIDEdgE7YFDTqQC7w-bs1Je6v8_AnCYxs3NzsCqPywv330-KxuSQ1w/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "Chroma 2 Case Key",
                price: 2.61,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOie3rKFRh16PKd2pDvozixtSOwaP2ar7SlzIA6sEo2rHCpdyhjAGxr0A6MHezetG0RZXdTA/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Stainless (Battle-Scarred)",
                price: 1.38,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ092nq5WYh8jnJ7rYmGdU-9ZOguzA45XKhFWmrBZyMGHxcIDHcABqaVmDqFHsx7i6g5-9u8uYmHpqsyZz4X3ZnBexhU5LOPsv26KLIAVePg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Mecha Industries (Factory New)",
                price: 25.66,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDLbUlWNQ18x_jvzS4Z78jUeLpxo7Oy2ceNfXJVMgY1HX-QLoxL2-jMK9uZTLnXRlvyJws37Zzka_iEofOu1qjPbKTQqeVrsJQvdPcVsWZg/520fx360f",
                
                
                
            }
        }, {
            weapon: {
                name: "USP-S | Neo-Noir (Factory New)",
                price: 42.08,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLPbTYhFRd4cJ5nqfE8dzz3Abg_hBtMWDzJ4fGdFI6YFjT-lHtlOi70Jfqvcifm3Vmvigj-z-DyA8aEmbE/520fx360f",
                "gfxDark": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLPbTYhFRd4cJ5nqfE8dzz3Abg_hBtMWDzJ4fGdFI6YFjT-lHtlOi70Jfqvcifm3Vmvigj-z-DyA8aEmbE/256fx256f",
                
                
            }
        }, {
            weapon: {
                name: "M4A1-S | Nitro (Field-Tested)",
                price: 0.63,
                image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOlm7-Ehfb6NL7ul2hS7ctlmdbM8Ij8nVmLpxIuNDztIoCXdANvY13Srli6xrvp0cXqv8jBmCZguHJ3sX3elhC3ghBPa-xvjOveFwvm_9yLhw/520fx360f",
                
                
                
            }
        }];*/

const items = [
    {
    name: "\u2605 Flip Knife | Gamma Doppler Emerald (Factory New)",
    "original_market_name": "\u2605 Flip Knife | Gamma Doppler (Factory New)",
    "paint_index": 568,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eOzmYWZlvvwDLbQhGld7cxrj-3--YXygED6-UBlZWGiIICVdQBoZFHR-Fftk7y8hsTotZjAmiFhuil2ti6ImkCwhQYMMLJIJJ_2Qw",
    price: 1270.5
}, {
    name: "Glock-18 | Wasteland Rebel (Factory New)",
    "original_market_name": "Glock-18 | Wasteland Rebel (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teXI8oThxgbs_0tlajihJ4PAd1c8aAvWrwXsx-q9h8fqvZTNmic2uylz5SqJlxypwUYbBM1DXmo",
    price: 13.11
}, {
    name: "\u2605 Butterfly Knife | Doppler Ruby (Factory New)",
    "original_market_name": "\u2605 Butterfly Knife | Doppler (Factory New)",
    "paint_index": 415,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOXhMaLum2pD6sl0g_PE8bP5gVO8v11kYjjzJ9KcIFI5YliDqAXoxbrsgpC9up_BmCM17nYh4SndzRLl1xwdcKUx0pRZROip",
    price: 2656.5
}, {
    "item_count": 2,
    name: "Glock-18 | Royal Legion (Minimal Wear)",
    "original_market_name": "Glock-18 | Royal Legion (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4Tdn2xZ_Isg07HCpYj23QLn-0prYzvycoXHIFVsYljXq1C9wObogZPv7Z3JzydkpGB8sj7oAKPM",
    price: 0.85
}, {
    "item_count": 3,
    name: "AWP | Sun in Leo (Minimal Wear)",
    "original_market_name": "AWP | Sun in Leo (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957OnHdTRD746JmImMn-O6ZezVlz4CvJYj2LqXpNmj0Vaw8kVvZG_7LNSScgJsZF_S-VO7w-e51Ij84srJoVgQJg",
    price: 2.66
}, {
    "item_count": 3,
    name: "Glock-18 | Candy Apple (Factory New)",
    "original_market_name": "Glock-18 | Candy Apple (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxfwPz3YzhG09C_k4if2aajMeqJlzgF6ZF10r2RrNyg3Qzjrkptazj7IYaVdwE4NFHRqFHtk-fxxcjr1j3fJ1k",
    price: 0.51
}, {
    "item_count": 4,
    name: "Chroma Case Key",
    "original_market_name": "Chroma Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA",
    price: 2.74
}, {
    "item_count": 2,
    name: "AK-47 | Blue Laminate (Field-Tested)",
    "original_market_name": "AK-47 | Blue Laminate (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KHgvLLPr7Vn35cppJ02uyUrI2h3wDkrkFsZz-gLdXHIA87MFjTqFm-wevvjcC0tZrPnXp9-n51Y5J6evE",
    price: 3.12
}, {
    "item_count": 2,
    name: "AWP | Electric Hive (Minimal Wear)",
    "original_market_name": "AWP | Electric Hive (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PvBZzh94NWxnJTFxaasauKEzm4D6cNw2OqXrI_zi1Cw80NrYmv3d4SSe1c-NF7U_1e8xPCv28G2xAySNA",
    price: 13.26
}, {
    "item_count": 3,
    name: "AWP | Elite Build (Battle-Scarred)",
    "original_market_name": "AWP | Elite Build (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqP_xMq3I2DsFvcZ13uqWotSj2gK2_URrMD-gcYHDcAY8ZlmD_VK9wOu8hpS86JXXiSw0nSjxJs4",
    price: 3.57
}, {
    "item_count": 3,
    name: "M4A4 | X-Ray (Minimal Wear)",
    "original_market_name": "M4A4 | X-Ray (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszQYzxb09Hiq4yCkP_gfb6IxDJT6pYo07HF89is2Aa3-RE4ZT_1ctTHdQE7Mg2D-la_xOvn18ei_MOeUwVqCl8",
    price: 6.38
}, {
    name: "M4A1-S | Basilisk (Factory New)",
    "original_market_name": "M4A1-S | Basilisk (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3hb-Gw_alIITTl3hY5MxigdbN_Iv9nBrl80BrYz31IYOSdwY-Yl_Wr1C9xr3o05DuvJqazic3viZx7CuOzEO1n1gSObrYfbsp",
    price: 2.37
}, {
    "item_count": 2,
    name: "Five-SeveN | Monkey Business (Minimal Wear)",
    "original_market_name": "Five-SeveN | Monkey Business (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTTl2VQ5sROhuDG_Zi72lDj8xJqZWj3d9SWcA9vNQnY81Ltybrvh57p7piayyBnsiV053mLnwv330_hwP2Y_Q",
    price: 6.38
}, {
    "item_count": 3,
    name: "M4A4 | Desolate Space (Battle-Scarred)",
    "original_market_name": "M4A4 | Desolate Space (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU1810i__Yu9-m2QzjqRI_ZWCgIIDEIA84NwzU_1C2krru0MW_6pjJzHIyvnN2tyrD30vgteaeMJk",
    price: 7.53
}, {
    "item_count": 3,
    name: "StatTrak\u2122 M4A4 | \u9f8d\u738b (Dragon King) (Field-Tested)",
    "original_market_name": "StatTrak\u2122 M4A4 | \u9f8d\u738b (Dragon King) (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW0924l4WYg-X1P4Tck29Y_cg_jLrEo4qtjgeyrkNrZ2qlI4aTIA5rMFzW8wW7yO3qgsDo78vJwHM17j5iuyiP9XXUyw",
    price: 13.88
}, {
    "item_count": 3,
    name: "AK-47 | Red Laminate (Minimal Wear)",
    "original_market_name": "AK-47 | Red Laminate (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4yCkP_gfeqIzz0DuMAp2rGUotWj2w3m_Uc_NW72J9KVdAM-ZlrRqFXsku-5hpGi_MOeuhMPC0E",
    price: 13.15
}, {
    "item_count": 3,
    name: "AWP | Corticera (Minimal Wear)",
    "original_market_name": "AWP | Corticera (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PXJZzhO7eO3g5C0m_7zO6-fwjgDscYh3r7E9N2t0Q2y-EtoZTjydY6UdwU3MwnSq1O5x-jq1JO46YOJlyV_32xwKg",
    price: 6.66
}, {
    "item_count": 3,
    name: "CZ75-Auto | Xiangliu (Field-Tested)",
    "original_market_name": "CZ75-Auto | Xiangliu (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZf1OD3cid9_9K3n4WYqOfhIavdk1Rc7cF4n-SPrN70jlXi8xVtYz30Io6TdVNvNVGD-FO6wbru0JbpvpnNz3RgunV2sWGdwULqCIBbXA",
    price: 3.34
}, {
    "item_count": 4,
    name: "AWP | Sun in Leo (Factory New)",
    "original_market_name": "AWP | Sun in Leo (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957OnHdTRD746JmImMn-O6ZezVlz4CvJYj2LqXpNmj0Vaw8kVvZG_7LNSScgJsZF_S-VO7w-e51Ij84srJoVgQJg",
    price: 3.85
}, {
    "item_count": 3,
    name: "AK-47 | Elite Build (Factory New)",
    "original_market_name": "AK-47 | Elite Build (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LP7LWnn8fvJYh3-qR942higTmqBZpYGild4adIQQ5ZA6B_AC3lebo0ce-78vOnGwj5HeAJ9sV6g",
    price: 3.74
}, {
    "item_count": 3,
    name: "M4A1-S | Hyper Beast (Minimal Wear)",
    "original_market_name": "M4A1-S | Hyper Beast (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoD8j1yg5UBta2zzLYWSdAA_aFvVq1G4w7rq05Dq7cvMmHM1uiJ0sS3Un0e_hxlSLrs4IEpMMwQ",
    price: 15.84
}, {
    "item_count": 3,
    name: "AK-47 | Aquamarine Revenge (Battle-Scarred)",
    "original_market_name": "AK-47 | Aquamarine Revenge (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWNU6dNoxL3H94qm3Ffm_RE6amn2ctWXdlI2ZwqB-FG_w-7s0ZK-7cjLzyE37HI8pSGKrIDGOAI",
    price: 12.82
}, {
    name: "AK-47 | Wasteland Rebel (Minimal Wear)",
    "original_market_name": "AK-47 | Wasteland Rebel (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszcYzRA-cizq4GAw6DLP7LWnn8f7pVyie_E8I2tiQDn-RJkYTqlINDHdVA-ZVnRq1a8xbq915K_uJjAmGwj5HcdAgaXHA",
    price: 26.32
}, {
    "item_count": 3,
    name: "USP-S | Lead Conduit (Minimal Wear)",
    "original_market_name": "USP-S | Lead Conduit (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09ulq5WYh8jiPLfFl2xU18l4jeHVu92kjQDkqUc4Zz-gJI-VdgVqZQ6B_1C9l-3mhJXv7ZvMnyQw7HJw4X7D30vgsvcMSkE",
    price: 0.41
}, {
    "item_count": 3,
    name: "M4A1-S | Hyper Beast (Well-Worn)",
    "original_market_name": "M4A1-S | Hyper Beast (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoHwjF2hpl1pNW2idtTDJFI-YlDY81C6xObqjMC17Z_LnXEyuXZ07CmInRC01UpMcKUx0jIDab7b",
    price: 7.53
}, {
    "item_count": 3,
    name: "M4A1-S | Nitro (Factory New)",
    "original_market_name": "M4A1-S | Nitro (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOlm7-Ehfb6NL7ul2hS7ctlmdbN_Iv9nBri-UY6ZmGgcNWQdAI_N1zU-gLtl-y50J66us7KyHdh6CUq5XyJnkO1n1gSOWcLwBkX",
    price: 2.66
}, {
    "item_count": 4,
    name: "USP-S | Torque (Minimal Wear)",
    "original_market_name": "USP-S | Torque (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbTWhG5C-8xnteXI8oThxg3lqBc5ZGHyd9KVIQ47YVqCqAPsx-i5hpHv75qfyCAy7CJz5H-OnxCpwUYbnuEcrvs",
    price: 0.68
}, {
    "item_count": 3,
    name: "SSG 08 | Dragonfire (Field-Tested)",
    "original_market_name": "SSG 08 | Dragonfire (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJkJKKkPj6NbLDk1RC68phj9bM8Ij8nVn6qBE9Y2ilLYaUI1M3ZQ3T-FW4yb28hp68tc7IwHdjvyQm5XnfzRO00wYMMLKcF6HpFw",
    price: 15.12
}, {
    "item_count": 2,
    name: "USP-S | Kill Confirmed (Battle-Scarred)",
    "original_market_name": "USP-S | Kill Confirmed (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP9jVWisl1uNj3yIoWdJAc8YgrT_FK6yei71MS06M6cnXJg6HIg53zbzRTj0x9JcKUx0vl8_sxu",
    price: 24.84
}, {
    "item_count": 2,
    name: "AK-47 | Aquamarine Revenge (Minimal Wear)",
    "original_market_name": "AK-47 | Aquamarine Revenge (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWdY781lxLuW8Njw31Dn8xc_YTqmJ4DDJFM2ZwqE_ATtx-u7g8C5vpjOzHM263E8pSGKJ1XuG9M",
    price: 24.96
}, {
    "item_count": 2,
    name: "AK-47 | Redline (Minimal Wear)",
    "original_market_name": "AK-47 | Redline (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPv9NLPF2G1UsZFw373Cp96kigbgrUBuY22nLIWUcgRvN17Y8lnrlbrm157quJ3XiSw0p7BLliM",
    price: 26.54
}, {
    "item_count": 3,
    name: "USP-S | Orion (Minimal Wear)",
    "original_market_name": "USP-S | Orion (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnI7LFkGJD7fp9g-7J4cKt0Ae280RrMmGiIYHGe1JqYFnS8ge8xOvv0cLoupTNnXtms3Yh5HrdgVXp1tiSOwO6",
    price: 9.48
}, {
    "item_count": 3,
    name: "AK-47 | Elite Build (Battle-Scarred)",
    "original_market_name": "AK-47 | Elite Build (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LO77QgHIf7pJ0iLGS94_2jAOx_BdvZGr2I9eVegVvNV3Q_gW8lbrsgZC875TPnWwj5HcWwWbOUQ",
    price: 0.8
}, {
    "item_count": 2,
    name: "AK-47 | Jaguar (Field-Tested)",
    "original_market_name": "AK-47 | Jaguar (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYcDNW5Nmkq4GAw6DLPr7Vn35cpschiOiTpNvx2QzmqUJkZDqnJoWRcgQ7NQvQ_FnsxunugMfv6MucyiB9-n51SuyeNcE",
    price: 12.8
}, {
    name: "Glove Case Key",
    "original_market_name": "Glove Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOievwZVQ51qSfd2pButjnxdTbkaD2YbjTwD4BuZR32uzF9t3w0ALl-kRqN2jtZNjCOd6cueQ",
    price: 2.77
}, {
    name: "UMP-45 | Blaze (Factory New)",
    "original_market_name": "UMP-45 | Blaze (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0vL3dzFD4dmlq4yCkP_gfeuCxTMG7pFw2uiV9I-jjlHi-0dvZDygLY-dJw89NQ3QqFK3lOe9jcSi_MOeUg1XNk4",
    price: 13.34
}, {
    name: "AK-47 | Redline (Battle-Scarred)",
    "original_market_name": "AK-47 | Redline (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqP_xMq3I2D0B65Jy2b7FrNqgjQXn8hVvazj3J4OdIFRsY1nYrgDtxO27h8W5uZvXiSw07ljG5dE",
    price: 5.43
}, {
    "item_count": 3,
    name: "AK-47 | Point Disarray (Field-Tested)",
    "original_market_name": "AK-47 | Point Disarray (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18h0juDU-MLx2gKy8xFqMDr2IIORcAU6MlnS_Vjtxu7rhcK-u5-cyXZqsiEg7HnUgVXp1kpd_x09",
    price: 12.89
}, {
    name: "P90 | Asiimov (Minimal Wear)",
    "original_market_name": "P90 | Asiimov (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIXBD_9W_mY-dqPv9NLPF2DtS6ZJ33e_Cpd-niw3sqEY_MGzzItXGJlM3YwrT-QS7ye3p1J7ttJXXiSw09F9GDzA",
    price: 9.46
}, {
    "item_count": 3,
    name: "AWP | Elite Build (Well-Worn)",
    "original_market_name": "AWP | Elite Build (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqPrxN7LEmyVTsZV33OiT9tys2AG1_UJlZ2HxJ47EIAI_N1CErAe_lOzsgMO66syd1zI97a8kXc4r",
    price: 3.87
}, {
    "item_count": 3,
    name: "M4A4 | Desolate Space (Factory New)",
    "original_market_name": "M4A4 | Desolate Space (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18l4jeHVu93zi1aw_hZtYW2icYHGdwJtN1nSr1foxui8gZW96ZvPznMyvSMq4XrD30vgc83x0v4",
    price: 25.61
}, {
    "item_count": 4,
    name: "AK-47 | Aquamarine Revenge (Field-Tested)",
    "original_market_name": "AK-47 | Aquamarine Revenge (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWZU7Mxkh6eU896n0FXk-RJsNzv3cI-WJAA3YFDTqFa2l-u6jJW4uJqdyCBluyEm-z-DyCua9lLK",
    price: 17.26
}, {
    "item_count": 3,
    name: "AWP | Worm God (Minimal Wear)",
    "original_market_name": "AWP | Worm God (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZx7PLfYQJW-9W4kb-HnvD8J_XXzzwH65EgiLHHrNutjAa28xdtYG7wINCUdlA4ZFDW81m8lebqjMC9ot2XnlThvpXE",
    price: 1.17
}, {
    "item_count": 3,
    name: "AK-47 | Frontside Misty (Battle-Scarred)",
    "original_market_name": "AK-47 | Frontside Misty (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08u_mpSOhcjnI7TDglRZ7cRnk6eYp4-gig2w_Uc9N26mIoCXdg5sMg2G_1O8le_nhp-6753AyHYxvSAn-z-DyG61se40",
    price: 8.66
}, {
    name: "StatTrak\u2122 Glock-18 | Water Elemental (Field-Tested)",
    "original_market_name": "StatTrak\u2122 Glock-18 | Water Elemental (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRc7cF4n-SPrNqm2lbk-kNlMWH7dY-TcVVtNw3UrlO9w-u-15696svOyCdq7nMhtGGdwUKQqhPPUw",
    price: 12.27
}, {
    "item_count": 3,
    name: "M4A4 | Buzz Kill (Field-Tested)",
    "original_market_name": "M4A4 | Buzz Kill (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW08-zl5SEhcj5Nr_Yg2Yfu8Ek0-uXrNyh3gbn_0M-YzqmIoLAJFA6M1vU_Fe7lLrrgp6_u52cyGwj5HcviqwPgQ",
    price: 13.46
}, {
    "item_count": 6,
    name: "Spectrum Case Key",
    "original_market_name": "Spectrum Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOievzZVMy1aKeJG4R6YzgzNPclaCmN72ClDNQvJMmjLyVoY-mjQTi_EM9amztZNjCYKtxNio",
    price: 2.75
}, {
    "item_count": 5,
    name: "M4A4 | Desolate Space (Well-Worn)",
    "original_market_name": "M4A4 | Desolate Space (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18h0juDU-MKt0Fex-kpkMTumJobEdlU7ZFCF-AO4wOnv0Mft752azyRh7CZ2ty2MgVXp1k8SoycS",
    price: 8.74
}, {
    "item_count": 2,
    name: "AK-47 | Cartel (Field-Tested)",
    "original_market_name": "AK-47 | Cartel (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV09-3hpSOm8j5Nr_Yg2Yf7ccnjOyVp92liwDg-BVoa236I9SWJgM3YV3TrFm3l-q61pS_7c7KyGwj5HcGMgDZeg",
    price: 3.13
}, {
    "item_count": 5,
    name: "AK-47 | Vulcan (Field-Tested)",
    "original_market_name": "AK-47 | Vulcan (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj5Nr_Yg2YfvZcg0rmXrI2n31ex8ks9Zjz2JIKdcVA4ZArRqVm-wLzn1sC8uJnMwWwj5HcoJjKuZA",
    price: 27.04
}, {
    name: "M4A1-S | Cyrex (Battle-Scarred)",
    "original_market_name": "M4A1-S | Cyrex (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp5j-jX7MKniwLiqkQ6ZGnzI4OSIw4_aVqE_wO_xO7vjMW0v5WcmHtmvHYjs3zdgVXp1tSngnNr",
    price: 6.79
}, {
    "item_count": 3,
    name: "Shadow Case Key",
    "original_market_name": "Shadow Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiePrKF4wi6aaIGwStN_jl4bSzvXwMO6AwDlSvsYoiOiZ8dij3QbtqkU9ZnezetFWWxusZg",
    price: 2.75
}, {
    name: "\u2605 Huntsman Knife | Doppler (Factory New)",
    "original_market_name": "\u2605 Huntsman Knife | Doppler (Factory New)",
    "paint_index": 420,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlY20k_jkI7fUhFRB4MRij7r--YXygED6qUVkNW_3IYCXdAc4ZwvZ8wTql-3vgcTq7cnOnXM1siUj537UnBblgQYMMLKO8np86Q",
    price: 362.25
}, {
    "item_count": 3,
    name: "Operation Wildfire Case Key",
    "original_market_name": "Operation Wildfire Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiev0ZVZl1vGQcGUTv9mww4bfwvOmZO_TzjwCv5Qm2-iYoN2j31Kx_xA4Yj3tZNjCXJdubss",
    price: 2.74
}, {
    "item_count": 3,
    name: "AK-47 | Emerald Pinstripe (Field-Tested)",
    "original_market_name": "AK-47 | Emerald Pinstripe (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYeDNR-M6_hIW0lvygZITck29Y_cg_2L_D992hjQ21-kU-NT_xIY-TegM8ZgrX_Fe5wbjoh8fqvM7OzXNl7z5iuyj7hHPqsg",
    price: 1.37
}, {
    "item_count": 3,
    name: "AWP | Fever Dream (Factory New)",
    "original_market_name": "AWP | Fever Dream (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJS_8W1nI-bluP8DLfYkWNFppQgj7yV9Nqi2Fbj_Eo5Ym72I9XGJwc2NAnS_1Pqxu6615W575uYznd9-n51iddPieY",
    price: 13.38
}, {
    "item_count": 3,
    name: "M4A4 | Desolate Space (Minimal Wear)",
    "original_market_name": "M4A4 | Desolate Space (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18l4jeHVu93zi1aw_hZtYW2icYHGdwJtN1nSr1foxui8gZW96ZvPznMyvSMq4XrD30vgc83x0v4",
    price: 13.92
}, {
    "item_count": 3,
    name: "P250 | Valence (Factory New)",
    "original_market_name": "P250 | Valence (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhhwszYI2gS09-5mpSEguXLP7LWnn8f7sR33-uSpdn23gyw8xY9YWr7JYKUdAVsYQnW8wXvl7_ohpe07pXIwWwj5HeF0_VeIQ",
    price: 0.43
}, {
    "item_count": 2,
    name: "\u2605 Flip Knife | Doppler Ruby (Factory New)",
    "original_market_name": "\u2605 Flip Knife | Doppler (Factory New)",
    "paint_index": 415,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eOkgYKSqPr1Ibndk2JL7cFOhuDG_Zi7jgLtqkVpZjrwJNKSdVVrMl7U_gLvw72-0Ze5u56bnXJgsyBws3bblgv33087zklSXg",
    price: 1076.25
}, {
    "item_count": 3,
    name: "Sawed-Off | The Kraken (Minimal Wear)",
    "original_market_name": "Sawed-Off | The Kraken (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbuyLgNv1fX3cih9_92hkYSEkfHLPLjFmXtE5dVOhuDG_Zi73wLlrxVpamjycdDGdFc3Z1jW-wK5k-3r0JK97Z-fn3Q26SYjsHrVzQv330-41vffvw",
    price: 3.37
}, {
    name: "\u2605 Sport Gloves | Hedge Maze (Field-Tested)",
    "original_market_name": "\u2605 Sport Gloves | Hedge Maze (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1JmMR1osbaqPQJz7ODYfi9W9eOxhoWOmcj5Nr_Yg2YfuJxy2LuU9NWgigHsrURlMW7wIIWQegA2YFyE-FPqyb3qh5W7vpzPz2wj5HcMw2bv5Q",
    price: 410.61
}, {
    name: "P250 | Mehndi (Factory New)",
    "original_market_name": "P250 | Mehndi (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS086zkomFkvPLP7LWnn8fscFw2bHD9tmj2Vbi_kRqZmz2doeScgZraA3R-gXqk73qh5-1uM7Pzmwj5HcyHuJxQg",
    price: 7.9
}, {
    name: "USP-S | Road Rash (Minimal Wear)",
    "original_market_name": "USP-S | Road Rash (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnMrXVhmpB7dd0jtbN_Iv9nBrsrxZlY26lcdKXJgY-Yl6F-gK4ku-5hpS675_JwHNm7ygm433fmESwn1gSOYQPCPgR",
    price: 7.14
}, {
    "item_count": 3,
    name: "USP-S | Cyrex (Minimal Wear)",
    "original_market_name": "USP-S | Cyrex (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRd4cJ5nqfC9Inz3VHtrRJrNmj6d4XEdlBqZw7R-VTqxr-6hJS-uJjAm3FnsnQi-z-DyGAd0sdD",
    price: 2.65
}, {
    name: "\u2605 Specialist Gloves | Emerald Web (Field-Tested)",
    "original_market_name": "\u2605 Specialist Gloves | Emerald Web (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3LAVbv6mxFABs3OXNYgJR_Nm1nYGHnuTgDL7ck3lQ5MFOnezDyoHwjF2hpl0_N2D0cNeUewVoNFDX_QXqlbjvgJS6tZSfznZqv3Ir43aOzBWwiBgYcKUx0nVYY5H7",
    price: 375.25
}, {
    "item_count": 3,
    name: "USP-S | Para Green (Minimal Wear)",
    "original_market_name": "USP-S | Para Green (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ08-5q4uDlvz9DLzDk25f18l4jeHVu9mh3lbnrhFkZm-hdtCXI1NrMg3S8wS8yevtg5606MmYnHNgvyMjt3jD30vgAX7g-h0",
    price: 0.41
}, {
    name: "USP-S | Orion (Factory New)",
    "original_market_name": "USP-S | Orion (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jnI7LFkGJD7fp9g-7J4cKt0Ae280RrMmGiIYHGe1JqYFnS8ge8xOvv0cLoupTNnXtms3Yh5HrdgVXp1tiSOwO6",
    price: 12.21
}, {
    "item_count": 4,
    name: "AWP | Pit Viper (Minimal Wear)",
    "original_market_name": "AWP | Pit Viper (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957ODGcDZH_9e_mr-HnvD8J_XUwGpV7Mdz3rDAotyn3FLs-0M9YGygLdOVegc6YVqB-AK2x-3uhZS0ot2XniAGuoRm",
    price: 1.03
}, {
    "item_count": 3,
    name: "Desert Eagle | Crimson Web (Minimal Wear)",
    "original_market_name": "Desert Eagle | Crimson Web (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PvRTipH7s-JkIGZnPLmDLfYkWNFppJz0-rDpNX3iVfh-RY-Nm6gII_AcVdsNQ6C-gK6we661JS5vsucn3p9-n51o0mKsnM",
    price: 7.85
}, {
    "item_count": 3,
    name: "M4A1-S | Chantico's Fire (Field-Tested)",
    "original_market_name": "M4A1-S | Chantico's Fire (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j_v--InxgUG55RFtYTqiLY-UdVJrMF6DrAS3xe26gMDtv8jKmCNiv3EktH3enhO21xFSLrs4RMuJRwY",
    price: 15.12
}, {
    name: "M4A1-S | Dark Water (Minimal Wear)",
    "original_market_name": "M4A1-S | Dark Water (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-RkvXmMoTVl3la18l4jeHVu4qh0ADn_Us9Z277coPAcgRqYArZrlTrw-bug5W5uMucznJmvyAhs3zD30vg05sSVoA",
    price: 6.2
}, {
    "item_count": 3,
    name: "M4A1-S | Mecha Industries (Minimal Wear)",
    "original_market_name": "M4A1-S | Mecha Industries (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDLbUlWNQ18x_jvzS4Z78jUeLpxo7Oy3tJo-ScVVoZAuB8wW_xOft0ZC6uZ-bn3Nn63Mq7C2Oyx2yiBsYarNv1OveFwt9ELX6XQ",
    price: 15.19
}, {
    "item_count": 2,
    name: "AWP | BOOM (Minimal Wear)",
    "original_market_name": "AWP | BOOM (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PHEcDB9_9W7hIyOqPv9NLPF2G5VuZQl072WodSkjQTn_UU-YTqncYaccFc2NQyBqVXqxuzqhZG7uc_XiSw0f3y6kYU",
    price: 24.87
}, {
    "item_count": 3,
    name: "M4A1-S | Hyper Beast (Field-Tested)",
    "original_market_name": "M4A1-S | Hyper Beast (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoHwjF2hpl1pNW2idtTDJFI-YlDY81C6xObqjMC17Z_LnXEyuXZ07CmInRC01UpMcKUx0jIDab7b",
    price: 9.11
}, {
    "item_count": 2,
    name: "\u2605 M9 Bayonet | Doppler (Factory New)",
    "original_market_name": "\u2605 M9 Bayonet | Doppler (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjwPKvBmm5D19V5i_rEpLP5gVO8v11tMmD6IobEdFRsMFmB8lPvlL-9hZbuvJ_JziBn7HYltnvfnES21xhKcKUx0sfosVEP",
    price: 280.35
}, {
    "item_count": 3,
    name: "M4A1-S | Mecha Industries (Field-Tested)",
    "original_market_name": "M4A1-S | Mecha Industries (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDLbUlWNQ18x_jvzS4Z78jUeLphY4OiyuOoDGIFVvN1nRrFi4ku7vgMPov53MmHVruiUm7CyIzUaw1E4fOrRrgvCACQLJVjkHgfg",
    price: 9.26
}, {
    "item_count": 3,
    name: "M4A1-S | Decimator (Factory New)",
    "original_market_name": "M4A1-S | Decimator (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDL_UlWJc6dF-mNbN_Iv9nBrhqhVkYTz6LYSScVBtMliB_gDqwuu9h5-7vc_PynVrvXV37HfUyxPmn1gSOa-1kwUB",
    price: 15.07
}, {
    name: "SSG 08 | Big Iron (Factory New)",
    "original_market_name": "SSG 08 | Big Iron (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJgIWIn_n9MLrdn39I18l4jeHVu9302AHjqkJoMDjyLYfGJwc8Z1rZr1G4w-_o1sTptJvJwHVnviRw5XzD30vgQmdxPxk",
    price: 6.1
}, {
    "item_count": 2,
    name: "Glock-18 | Wasteland Rebel (Minimal Wear)",
    "original_market_name": "Glock-18 | Wasteland Rebel (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teXI8oThxgbs_0tlajihJ4PAd1c8aAvWrwXsx-q9h8fqvZTNmic2uylz5SqJlxypwUYbBM1DXmo",
    price: 10.13
}, {
    name: "MP9 | Pandora's Box (Factory New)",
    "original_market_name": "MP9 | Pandora's Box (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAZh7OPJfzlN_t2JmImMn-O6a-iGk2oDsJcn2ruUp42kjgLh_xBuZGvxLI-VcgFvNFuD_gK9lOm61oj84spJBEff3Q",
    price: 5.11
}, {
    "item_count": 2,
    name: "M4A4 | Griffin (Field-Tested)",
    "original_market_name": "M4A4 | Griffin (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09uknYaNnvnLPr7Vn35cppcgi-3EoN-s2AOy-BJtNzjydY-TcFA9N13X_VS7wOfphJe4v8nJmiR9-n51W4Rymss",
    price: 2.24
}, {
    "item_count": 4,
    name: "AK-47 | Redline (Field-Tested)",
    "original_market_name": "AK-47 | Redline (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhLsvQz",
    price: 7.47
}, {
    "item_count": 3,
    name: "Chroma 2 Case Key",
    "original_market_name": "Chroma 2 Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOie3rKFRh16PKd2pDvozixtSOwaP2ar7SlzIA6sEo2rHCpdyhjAGxr0A6MHezetG0RZXdTA",
    price: 2.74
}, {
    "item_count": 4,
    name: "AWP | Worm God (Field-Tested)",
    "original_market_name": "AWP | Worm God (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZx7PLfYQJW-9W4kb-GkvP9JrafxG0GscMhjLqW9t7zjVfn8hc6MmmnI9CTclRrYgrU_Vfowefs18K6uIOJlyXpUGetdA",
    price: 1.06
}, {
    "item_count": 3,
    name: "AWP | Phobos (Factory New)",
    "original_market_name": "AWP | Phobos (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fkGhQsZMgieqYrI-i2ACy-0o_Z22mItOdcAU5aVzT_gTowbvth5a0u4OJlyU2Brz6WA",
    price: 2.51
}, {
    "item_count": 3,
    name: "Chroma 3 Case Key",
    "original_market_name": "Chroma 3 Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiev3ZV851qOaJ28RvInuxIWPw_WtMr-Gkz0FvZwh27mU8Yqm3APir0VrYm3tZNjC3MZhHzk",
    price: 2.75
}, {
    "item_count": 3,
    name: "AWP | Phobos (Minimal Wear)",
    "original_market_name": "AWP | Phobos (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fkGhQsZMgieqYrI-i2ACy-0o_Z22mItOdcAU5aVzT_gTowbvth5a0u4OJlyU2Brz6WA",
    price: 1.87
}, {
    "item_count": 2,
    name: "M4A4 | Evil Daimyo (Minimal Wear)",
    "original_market_name": "M4A4 | Evil Daimyo (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09mgnYy0k_b9PqLeqWdY781lxOqTpdT3iQbh-RBsN2H6JITGI1c3ZluB_FK6kry51J-4uZjJwSNkuyY8pSGKLxf1Y6o",
    price: 2.39
}, {
    "item_count": 2,
    name: "P90 | Trigon (Field-Tested)",
    "original_market_name": "P90 | Trigon (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIQJW_tWxm460mvLwOq7c2DgEvZcmjrGQrI72jQbsqkY5NTzwd9edJwQ4YgrUqVa-wrrog5W6u5XXiSw0DE-o2jE",
    price: 2.5
}, {
    "item_count": 3,
    name: "M4A4 | Hellfire (Field-Tested)",
    "original_market_name": "M4A4 | Hellfire (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09SzmIyNnuXxDLbUkmJE5Ytz3ruZ8dX02QXl_0M5NTz2JIWRIwZoYQ7T8lC7yezuhMC17cydzXMxpGB8su_FSKnX",
    price: 7.62
}, {
    "item_count": 2,
    name: "USP-S | Guardian (Minimal Wear)",
    "original_market_name": "USP-S | Guardian (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jxP77Wl2VF18l4jeHVu9Wh3gzlqRU6NmqhINXDelA9MliBr1O_kLjuh5Dt7sjLnyBlviJ0syvD30vgdbWoQSw",
    price: 0.88
}, {
    "item_count": 4,
    name: "SG 553 | Aerial (Factory New)",
    "original_market_name": "SG 553 | Aerial (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0Ob3YjoXuY-JlYWZnvb4DLfYkWNFpsQg2LqZotil0QG18kU9amuiddfGJgZoZ1yB_gfrl-vr08e4uZicwXB9-n51wGEO0Qg",
    price: 0.24
}, {
    "item_count": 3,
    name: "AK-47 | Wasteland Rebel (Field-Tested)",
    "original_market_name": "AK-47 | Wasteland Rebel (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszcYzRA-cizq4GAw6DLPr7Vn35cppAlib-S8dumigTm8hJkMmn1JY7Hdg5rM1uD-FW4kunuhp-87ZXOzHR9-n51D2UtsBM",
    price: 19.04
}, {
    "item_count": 2,
    name: "M4A1-S | Nitro (Minimal Wear)",
    "original_market_name": "M4A1-S | Nitro (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOlm7-Ehfb6NL7ul2hS7ctlmdbN_Iv9nBri-UY6ZmGgcNWQdAI_N1zU-gLtl-y50J66us7KyHdh6CUq5XyJnkO1n1gSOWcLwBkX",
    price: 1.31
}, {
    "item_count": 3,
    name: "StatTrak\u2122 USP-S | Cyrex (Field-Tested)",
    "original_market_name": "StatTrak\u2122 USP-S | Cyrex (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRc7cF4n-SPrYrx2wKxqRY9ZGCgdYSScFJtZAnQ-VDryLjqgJG0uJybz3BgvXQm4mGdwUKgJSXXOg",
    price: 6.73
}, {
    "item_count": 3,
    name: "M4A4 | Desolate Space (Field-Tested)",
    "original_market_name": "M4A4 | Desolate Space (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU18h0juDU-MKt0Fex-kpkMTumJobEdlU7ZFCF-AO4wOnv0Mft752azyRh7CZ2ty2MgVXp1k8SoycS",
    price: 9.9
}, {
    name: "FAMAS | Survivor Z (Minimal Wear)",
    "original_market_name": "FAMAS | Survivor Z (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf0Ob3dzxP7c-JmIWFg_bLP7LWnn8fv8Rz37mZ9Nil31Hh_RI-Zm3ycNfAcwQ5NA7VrAK4xbjvjMC67cjJwWwj5HfemqCEuw",
    price: 0.25
}, {
    "item_count": 3,
    name: "AK-47 | Point Disarray (Minimal Wear)",
    "original_market_name": "AK-47 | Point Disarray (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18l4jeHVu4702FLiqBA4MDv6JYHEIwRsNQ3Srwe-wu_t1pO76JrPyiNlu3Qh4X7D30vg5znacIE",
    price: 18.03
}, {
    "item_count": 3,
    name: "M4A1-S | Hyper Beast (Battle-Scarred)",
    "original_market_name": "M4A1-S | Hyper Beast (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIhm5D18d0i_rVyoTwiUKt5RE6ZT_2doHBJFA_ZF_Q-wfrwu7s0ZW1uZqdm3dk6HJw7XyLlxyzhR1SLrs4wJw9kOk",
    price: 6.65
}, {
    "item_count": 4,
    name: "USP-S | Blueprint (Field-Tested)",
    "original_market_name": "USP-S | Blueprint (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLMbfEk3tD4ctlteTE8YXghRriqBVrYGn6coaWIA9qYVrRrAW7kOjvgce4tJqfznE16HJz4iuLmRHin1gSOXundACm",
    price: 0.79
}, {
    "item_count": 2,
    name: "Falchion Case Key",
    "original_market_name": "Falchion Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOieLreQE4g_CfI20b7tjmzNXYxK-hYOmHkj9QvpIg2OyVpdus0AW1_EQ9MnezetGj61oqPA",
    price: 2.76
}, {
    "item_count": 4,
    name: "Glock-18 | Water Elemental (Field-Tested)",
    "original_market_name": "Glock-18 | Water Elemental (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRc7cF4n-SPrNqm2lbk-kNlMWH7dY-TcVVtNw3UrlO9w-u-15696svOyCdq7nMhtGGdwUKQqhPPUw",
    price: 3.33
}, {
    "item_count": 3,
    name: "AK-47 | Aquamarine Revenge (Well-Worn)",
    "original_market_name": "AK-47 | Aquamarine Revenge (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWZU7Mxkh6eU896n0FXk-RJsNzv3cI-WJAA3YFDTqFa2l-u6jJW4uJqdyCBluyEm-z-DyCua9lLK",
    price: 14.88
}, {
    "item_count": 3,
    name: "PP-Bizon | Judgement of Anubis (Factory New)",
    "original_market_name": "PP-Bizon | Judgement of Anubis (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0Ob3czRY49KJl5WZhPLLP7LWnn8f65Qoie-Urdjx21Hm8xc-Z2DyINKUdwM3MgzT8la3yOfrgJG1uJmdwWwj5Hfykm1Yuw",
    price: 7.73
}, {
    "item_count": 3,
    name: "StatTrak\u2122 Desert Eagle | Oxide Blaze (Field-Tested)",
    "original_market_name": "StatTrak\u2122 Desert Eagle | Oxide Blaze (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_9mkgL-OlvD4NoTSmXlD58F0hNbM8Ij8nVn680E_ZDvwdo-Re1RtYA3W_gLrk-rngMC8upTJmHFmsiErs3jfnxe11wYMMLJe6xiBeg",
    price: 1.2
}, {
    "item_count": 13,
    name: "Gamma 2 Case Key",
    "original_market_name": "Gamma 2 Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S0M7eXlxLd0pS7uijLQRl0qXKdG8QtdjmkNHdxPOsZ-yDw2hS7cEk0r7Fp9733gLi5QMyNJeNnHRE",
    price: 2.76
}, {
    "item_count": 4,
    name: "M4A1-S | Decimator (Field-Tested)",
    "original_market_name": "M4A1-S | Decimator (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDL_UlWJc6dF-mNbM8Ij8nVn6rhFtYmyiJ4SWJAc4NQvS8ge9xb3v1J65usmbnCY17CMr5CvYmkG1hgYMMLJencFQUA",
    price: 7.35
}, {
    name: "\u2605 Shadow Daggers | Doppler (Factory New)",
    "original_market_name": "\u2605 Shadow Daggers | Doppler (Factory New)",
    "paint_index": 420,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD4eOym5Cbm_LmDKvZl3hUu_p9g-7J4cLzjgW2-ktvZT_6dYfAdQI8YluE-wDtxe2505Do6Z_Oz3Rg7CJx5nqLgVXp1nwmojSb",
    price: 247.8
}, {
    name: "\u2605 Gut Knife | Stained (Well-Worn)",
    "original_market_name": "\u2605 Gut Knife | Stained (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxT09q5hoOOk8j5Nr_Yg2Yfv5Mk2L2V89rw3QKw-hdsZ2GicdLDe1NvYl-G-wLryerm0JK96M_Jmmwj5HdUe0_CMw",
    price: 64.49
}, {
    "item_count": 2,
    name: "\u2605 Gut Knife | Boreal Forest (Field-Tested)",
    "original_market_name": "\u2605 Gut Knife | Boreal Forest (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjVb09q5hoWYg8j2PKnUl2du5cB1g_zMu9qk2Q3l8xY9ZmqgLIHHIwM6NFnZ81i2k7_m1sDtvpnBmnNjvSYh5irD30vgdY6Wcxs",
    price: 57.34
}, {
    "item_count": 2,
    name: "M4A1-S | Golden Coil (Field-Tested)",
    "original_market_name": "M4A1-S | Golden Coil (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITCmGpa7cd4nuz-8oP5jGu5rhc1JjTtLIfEdVQ-YA6G-FbqwOzs05Tp6smdzHdiuCUi5y7YnRG1gB9OOLE50OveFwutvS5J8A",
    price: 11.29
}, {
    name: "Glock-18 | Reactor (Well-Worn)",
    "original_market_name": "Glock-18 | Reactor (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73fyhB4Nm3hr-bluPgNqnfx1RW5MpygdbM8Ij8nVn68xJua2v6JNKQcg89aVnW8lK2xejv0MW_vp3KmHZr6yQhsSmOmxa-hwYMMLLLWAsqTQ",
    price: 1.16
}, {
    "item_count": 2,
    name: "USP-S | Kill Confirmed (Well-Worn)",
    "original_market_name": "USP-S | Kill Confirmed (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh5yYGr7IoWVdABrYQ3Y-1m8xezp0ZTtvpjNmHpguCAhtnndzRW10x9KOvsv26KUE4Zjjg",
    price: 26.72
}, {
    name: "Desert Eagle | Hypnotic (Factory New)",
    "original_market_name": "Desert Eagle | Hypnotic (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLJTitH_si_k4-0m_7zO6-fzj5QuZN03uvH99T32Ve3_UBlYDqiIdKVIQBqYgnRr1frx-7thpW-v4OJlyUwDcxXZA",
    price: 11.55
}, {
    name: "M4A4 | X-Ray (Factory New)",
    "original_market_name": "M4A4 | X-Ray (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszQYzxb09Hiq4yCkP_gfb6IxDJT6pYo07HF89is2Aa3-RE4ZT_1ctTHdQE7Mg2D-la_xOvn18ei_MOeUwVqCl8",
    price: 8.16
}, {
    "item_count": 3,
    name: "AWP | Safari Mesh (Well-Worn)",
    "original_market_name": "AWP | Safari Mesh (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q42Ok_7hPvXXlGkBsJ1z2b6Rp9302gLm-Uo-am2lItXBegFraV7T-FHtkOq-1sW8ot2Xnl-RcvNU",
    price: 0.21
}, {
    "item_count": 2,
    name: "Desert Eagle | Kumicho Dragon (Factory New)",
    "original_market_name": "Desert Eagle | Kumicho Dragon (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxDLDEm2JS4Mp1mOjG-oLKhF2zowdyYmD7I4LAe1c8YQuGqwK6yLu518O96pzMzHUxsyknsHvYnBO0gk4aO_sv26LIOeeP5w",
    price: 13.05
}, {
    "item_count": 2,
    name: "Glock-18 | Wasteland Rebel (Field-Tested)",
    "original_market_name": "Glock-18 | Wasteland Rebel (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJg4GYg_L4MrXVqXlU6sB9teTE8YXghRrhr0U-NTulddSSdFVqN1HW_QPrl-u7gp61vpicmiE1uSkk4CvamkHjn1gSOWfdS3KX",
    price: 8.15
}, {
    "item_count": 3,
    name: "AK-47 | Elite Build (Field-Tested)",
    "original_market_name": "AK-47 | Elite Build (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LPr7Vn35cpsEl0-2Xrdii3APt-RI4ZG71IdOXelJoZVDX_li7kOu-1MW6uZ_JyHV9-n51hRUaMfs",
    price: 0.98
}, {
    "item_count": 3,
    name: "USP-S | Torque (Factory New)",
    "original_market_name": "USP-S | Torque (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbTWhG5C-8xnteXI8oThxg3lqBc5ZGHyd9KVIQ47YVqCqAPsx-i5hpHv75qfyCAy7CJz5H-OnxCpwUYbnuEcrvs",
    price: 0.89
}, {
    "item_count": 4,
    name: "M4A1-S | Atomic Alloy (Field-Tested)",
    "original_market_name": "M4A1-S | Atomic Alloy (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-Gw_alfqjul2dd59xOhfvA-4vwt1mxrxopPnfxIoPAcgQ6NQqGq1O6kO_vjZa46JWdwHAw6XNwsSvVmxzh0B4abLFnm7XAHsAw1GuT",
    price: 2.51
}, {
    "item_count": 3,
    name: "USP-S | Guardian (Field-Tested)",
    "original_market_name": "USP-S | Guardian (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jxP77Wl2VF18h0juDU-MLx3QS3_ko6Njj1cYfDIwY9aVzXr1G3lL_vh5Dp7cuawCBq6yRx4HeMgVXp1jC2QzVG",
    price: 0.69
}, {
    "item_count": 3,
    name: "M4A4 | Evil Daimyo (Field-Tested)",
    "original_market_name": "M4A4 | Evil Daimyo (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09mgnYy0k_b9PqLeqWZU7Mxkh6fFoN2n0QDj_xA-NTj2LdWUdlI_M1yG_Fbqw-npgJG9vJ3OyXRi7HMn-z-DyAyYxUni",
    price: 1.76
}, {
    "item_count": 2,
    name: "M4A4 | Urban DDPAT (Minimal Wear)",
    "original_market_name": "M4A4 | Urban DDPAT (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszMdS1D-OOjhoK0m_7zO6-fwWhU7JQn27uR8dmhilewqEE6Mjj1ItKXcwNvNFDR-lW_kLzthsTvuIOJlyVFp_EY2g",
    price: 0.59
}, {
    "item_count": 3,
    name: "Glock-18 | Royal Legion (Field-Tested)",
    "original_market_name": "Glock-18 | Royal Legion (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4Tck29Y_cg_2e2W9orx2gPh_UE5ZmindYWddwI3aVnT_VG-krvph57p6sjAyyY17D5iuyi-oMCxlg",
    price: 0.43
}, {
    "item_count": 3,
    name: "AWP | Elite Build (Factory New)",
    "original_market_name": "AWP | Elite Build (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqPv9NLPF2D0Av8Ai2byRod_z2gHkqBc-aj31dYLGdQ82NFjX_wPryOvphcXo6JnXiSw0NEnp7Nc",
    price: 12.13
}, {
    name: "StatTrak\u2122 SSG 08 | Ghost Crusader (Field-Tested)",
    "original_market_name": "StatTrak\u2122 SSG 08 | Ghost Crusader (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f1OD3Yi5FvISJlZKGlvT7Ib7um25V4dB8xLDD9o2nilLn8hZlYG30cY_AcARvNA3V8gC8le7nhMLuupSbmnZk7HI8pSGKxxHl5uI",
    price: 2.29
}, {
    "item_count": 3,
    name: "StatTrak\u2122 AK-47 | Redline (Field-Tested)",
    "original_market_name": "StatTrak\u2122 AK-47 | Redline (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhLsvQz",
    price: 27.29
}, {
    "item_count": 2,
    name: "AK-47 | Orbit Mk01 (Minimal Wear)",
    "original_market_name": "AK-47 | Orbit Mk01 (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJegJB49C5mpnbxsjmNr_ummJW4NE_iL-ZrYj03wLl_hFqNm71cteWdlA5Zl2F-FG-yO_r0cW4uMnMynFl6T5iuyjnxSwaOw",
    price: 6.26
}, {
    name: "AWP | Electric Hive (Factory New)",
    "original_market_name": "AWP | Electric Hive (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PvBZzh94NWxnJTFxaasauKEzm4D6cNw2OqXrI_zi1Cw80NrYmv3d4SSe1c-NF7U_1e8xPCv28G2xAySNA",
    price: 15.13
}, {
    "item_count": 2,
    name: "AWP | Pink DDPAT (Field-Tested)",
    "original_market_name": "AWP | Pink DDPAT (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PfMYTxW08y_mou0mvLwOq7c2DxUscQkiO2S8I-h2gTm-hA4NTyhdoDDcVU3MwzV_1G4xb_uhpPo6Z7XiSw03MaHlHE",
    price: 9.53
}, {
    name: "M4A4 | Evil Daimyo (Factory New)",
    "original_market_name": "M4A4 | Evil Daimyo (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09mgnYy0k_b9PqLeqWdY781lxOqTpdT3iQbh-RBsN2H6JITGI1c3ZluB_FK6kry51J-4uZjJwSNkuyY8pSGKLxf1Y6o",
    price: 3.74
}, {
    name: "\u2605 M9 Bayonet | Doppler Sapphire (Factory New)",
    "original_market_name": "\u2605 M9 Bayonet | Doppler (Factory New)",
    "paint_index": 416,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjnMqvBnmJD7fp8i_vD-Yn8klGwlB81NDG3OtSUJgY7YVvS-VfolLq7hsO5tZ_OnXo3uyhz7SyPnhGx0xoeb-dugKOACQLJ28w8Lgw",
    price: 2664.9
}, {
    "item_count": 2,
    name: "Glock-18 | Blue Fissure (Field-Tested)",
    "original_market_name": "Glock-18 | Blue Fissure (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf2-r3ci9D_cmzmJWZksj5Nr_Yg2YfvMck2r7Epdz23Q3k-EBkZW2lJo_DcwVtZFnZ_wS-kLzsgZ-46p3OzGwj5HeE1ZiPbA",
    price: 0.49
}, {
    "item_count": 3,
    name: "AWP | Elite Build (Minimal Wear)",
    "original_market_name": "AWP | Elite Build (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJP7c-ikZKSqPv9NLPF2D0Av8Ai2byRod_z2gHkqBc-aj31dYLGdQ82NFjX_wPryOvphcXo6JnXiSw0NEnp7Nc",
    price: 6.63
}, {
    "item_count": 3,
    name: "AWP | Redline (Field-Tested)",
    "original_market_name": "AWP | Redline (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJB496klb-GkvP9JrafwDMHscYm3eqTo9jwigLg_Ec6azj7JNfAcARtNwnR-ATvx-fq0564uoOJlyV-UZdEjg",
    price: 12.04
}, {
    "item_count": 3,
    name: "AWP | Corticera (Field-Tested)",
    "original_market_name": "AWP | Corticera (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PXJZzhO7eO3g5C0mvLwOq7c2DwEv51z3u2Sp9-mi1Xtr0I5Z26gcoOUJwBoNVrWrAO9ye7rjce57szXiSw0gjbftYY",
    price: 6.44
}, {
    "item_count": 3,
    name: "M4A1-S | Guardian (Factory New)",
    "original_market_name": "M4A1-S | Guardian (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuk2dU78R_ntbN_Iv9nBrlqhA-MWnzIoaTdg4-aFmBqVS9w7q6g57v6snOy3IxvXF27HfdmhOzn1gSOVYg1Yji",
    price: 5.65
}, {
    "item_count": 3,
    name: "AK-47 | Elite Build (Minimal Wear)",
    "original_market_name": "AK-47 | Elite Build (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LP7LWnn8fvJYh3-qR942higTmqBZpYGild4adIQQ5ZA6B_AC3lebo0ce-78vOnGwj5HeAJ9sV6g",
    price: 1.38
}, {
    "item_count": 2,
    name: "AK-47 | Jaguar (Well-Worn)",
    "original_market_name": "AK-47 | Jaguar (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYcDNW5Nmkq4GAw6DLPr7Vn35cpschiOiTpNvx2QzmqUJkZDqnJoWRcgQ7NQvQ_FnsxunugMfv6MucyiB9-n51SuyeNcE",
    price: 12.12
}, {
    name: "Five-SeveN | Urban Hazard (Factory New)",
    "original_market_name": "Five-SeveN | Urban Hazard (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTEhGlQ5vp5i_PA54jKhF2zowdyZ2z1LYCTJgQ9NwmG-1G9xb3qhMS0vZ7Jm3UyvSAg7HuMyRW_hhhOaPsv26Lv8Ntyjw",
    price: 0.42
}, {
    "item_count": 2,
    name: "Glock-18 | Water Elemental (Factory New)",
    "original_market_name": "Glock-18 | Water Elemental (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79f7mImagvLnML7fglRd4cJ5nqeQoN3w0QHgrhdoMjylJo7GIVU7ZAzQqQC6k-rs1JHotZvNzSRgvHFx-z-DyPzurK-U",
    price: 7.63
}, {
    "item_count": 4,
    name: "AWP | Safari Mesh (Minimal Wear)",
    "original_market_name": "AWP | Safari Mesh (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q4yCkP_gfeiHxjNS6sBz0-vDpNqmilKw-RE5MDv3cdTGIVM8ZF_WqFjtkOnn0Z-i_MOe5x-cbmw",
    price: 0.34
}, {
    name: "M4A1-S | Chantico's Fire (Minimal Wear)",
    "original_market_name": "M4A1-S | Chantico's Fire (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j_v--YXygED6_UZrMTzwJYSdJlU8N1zY81TrxO_v0MW9uJnBm3Rk7nEk5XfUmEeyhQYMMLIUhCYx0A",
    price: 23.7
}, {
    name: "M4A4 | Griffin (Minimal Wear)",
    "original_market_name": "M4A4 | Griffin (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09uknYaNnvnLP7LWnn8fupAkiO2Zporx2wDnrhJkNmGnLILEc1I7MlHU81S3le69h5Dv7cuYnGwj5HeWs6qHHw",
    price: 2.9
}, {
    "item_count": 2,
    name: "AWP | Sun in Leo (Field-Tested)",
    "original_market_name": "AWP | Sun in Leo (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957OnHdTRD746JmYWPnuL5feqBwD8Gvpcg3rDDrN30jlHl_kdka2j1JY-SewJoN1CC-lK8xOfrhZai_MOeIIc7ylQ",
    price: 1.41
}, {
    "item_count": 3,
    name: "Glock-18 | Catacombs (Factory New)",
    "original_market_name": "Glock-18 | Catacombs (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJkIWKg__gPLfdqWdY781lxOrH9o-jiQXj-0BrMmrwdtTHdwQ6MgnR8lS4ku7o1sC7usmdmHZns3Q8pSGK4NV4g5I",
    price: 0.34
}, {
    "item_count": 3,
    name: "AWP | Pit Viper (Field-Tested)",
    "original_market_name": "AWP | Pit Viper (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957ODGcDZH_9e_mr-GkvP9Jrafz2oJscdw2OrA9Nvx3w2y8hZrNm7zcYOddgZtYwyG_lW4w-rngp_v7YOJlyVPLSW-Rw",
    price: 0.74
}, {
    "item_count": 3,
    name: "AK-47 | Frontside Misty (Field-Tested)",
    "original_market_name": "AK-47 | Frontside Misty (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08u_mpSOhcjnI7TDglRc7cF4n-SPpI-iigLg80ZvZzryd4_GI1Q6Yg3VqFe4w-y90JLo753NzXtmsnEl4mGdwUIuRPhSEw",
    price: 11.54
}, {
    "item_count": 3,
    name: "Desert Eagle | Kumicho Dragon (Minimal Wear)",
    "original_market_name": "Desert Eagle | Kumicho Dragon (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxDLDEm2JS4Mp1mOjG-oLKhF2zowdyYmD7I4LAe1c8YQuGqwK6yLu518O96pzMzHUxsyknsHvYnBO0gk4aO_sv26LIOeeP5w",
    price: 6.75
}, {
    "item_count": 3,
    name: "Glock-18 | Bunsen Burner (Factory New)",
    "original_market_name": "Glock-18 | Bunsen Burner (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79fnzL-Nm_b5NqjulGdE7fp9g-7J4cKgjlGw-UA4ZjjwJoGccVU8ZFHR_gTrk-fm15K56pyYyyBj6XIrsXmOgVXp1s5QzU_K",
    price: 0.8
}, {
    "item_count": 3,
    name: "AWP | Asiimov (Field-Tested)",
    "original_market_name": "AWP | Asiimov (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2G9SupUijOjAotyg3w2x_0ZkZ2rzd4OXdgRoYQuE8gDtyL_mg5K4tJ7XiSw0WqKv8kM",
    price: 39.62
}, {
    "item_count": 3,
    name: "Tec-9 | Isaac (Minimal Wear)",
    "original_market_name": "Tec-9 | Isaac (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b092lnYmGmOHLP7LWnn8fscQljOuY947z3lLk-kFsajv7ctKWJ1BoNAyB-wTrkri8hMO57ZSYymwj5HfRdvOI1A",
    price: 0.51
}, {
    "item_count": 2,
    name: "Glock-18 | Grinder (Factory New)",
    "original_market_name": "Glock-18 | Grinder (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79eJl4-Cm_LwDLfYkWNFpsEljurD89zx2gPg_Eo-amyiINfBdgVtYl6G-QO9l-271p677s-dwXZ9-n51WfGqKvY",
    price: 0.81
}, {
    "item_count": 3,
    name: "AWP | Hyper Beast (Field-Tested)",
    "original_market_name": "AWP | Hyper Beast (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tck29Y_cg_j7jF9Iih2QHj_0U9Z272JY6WIVc7Y1DTq1C4wrzm0MLutc6YnCcx7j5iuyje78yNdQ",
    price: 25.91
}, {
    "item_count": 2,
    name: "USP-S | Stainless (Minimal Wear)",
    "original_market_name": "USP-S | Stainless (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ092nq5WYh8jnJ7rYmGdU-9ZOhuDG_Zi721Lirhc-azyhcIKUcQ45ZVrV-lW2xOe6hcK_6ZqazHMyuCNx5naJzQv330_GtPNhtQ",
    price: 2.44
}, {
    "item_count": 2,
    name: "M4A1-S | Basilisk (Minimal Wear)",
    "original_market_name": "M4A1-S | Basilisk (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3hb-Gw_alIITTl3hY5MxigdbN_Iv9nBrl80BrYz31IYOSdwY-Yl_Wr1C9xr3o05DuvJqazic3viZx7CuOzEO1n1gSObrYfbsp",
    price: 1.13
}, {
    name: "\u2605 Huntsman Knife | Marble Fade (Factory New)",
    "original_market_name": "\u2605 Huntsman Knife | Marble Fade (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlY20mvbmMbfUqW1Q7MBOhuDG_Zi721GyqERqZG_3d4fEIwA8ZV_XrATrxbzr0cC97Z7BySBiuyV04H7dnAv330-db6QRxg",
    price: 362.25
}, {
    name: "\u2605 Bayonet | Tiger Tooth (Factory New)",
    "original_market_name": "\u2605 Bayonet | Tiger Tooth (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfwJW5duzhr-Ehfb6NL7ummJW4NE_3bGR84qmiQHsr0NtMm7wcILBdVI5ZF2BrgPqkr_rg5K0v8nIyiQy7D5iuyj6nUSP2A",
    price: 245.53
}, {
    name: "Glock-18 | Steel Disruption (Factory New)",
    "original_market_name": "Glock-18 | Steel Disruption (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73dTlS7ciykY6YksjnOrfHk3lu5Mx2gv2PoYit21fkqkM-amz7dtSUd1A4aFyD_VG6xufmg8Pv6ZjAn3Yx7yAntGGdwUKGy9wICw",
    price: 1.02
}, {
    "item_count": 3,
    name: "AK-47 | Cartel (Minimal Wear)",
    "original_market_name": "AK-47 | Cartel (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV09-3hpSOm8j4OrzZgiUD7ZJzj7DHoY-iilC1-ENoNWuiI9WWdQI8Z1iE81Tvl7i81J-_6p2b1zI97XPwFCE_",
    price: 3.71
}, {
    "item_count": 4,
    name: "AWP | Fever Dream (Field-Tested)",
    "original_market_name": "AWP | Fever Dream (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJS_8W1nI-bluP8DLbUkmJE5Ysji7vHrNjxjgKw_RVtazr3INWddQRsYljS-QLql-e9hJXt75ucm3BlpGB8snSRBTot",
    price: 8.57
}, {
    name: "Glock-18 | Blue Fissure (Minimal Wear)",
    "original_market_name": "Glock-18 | Blue Fissure (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf2-r3ci9D_cmzmJWZksj4OrzZgiUJ7Zwmj-uQoo2l2VHj-BBoZDj7LY6SdA47NV_U-gO9xeq-0MS-78_B1zI97YdssEhj",
    price: 0.99
}, {
    "item_count": 3,
    name: "Glock-18 | Candy Apple (Minimal Wear)",
    "original_market_name": "Glock-18 | Candy Apple (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxfwPz3YzhG09C_k4if2aajMeqJlzgF6ZF10r2RrNyg3Qzjrkptazj7IYaVdwE4NFHRqFHtk-fxxcjr1j3fJ1k",
    price: 0.38
}, {
    "item_count": 2,
    name: "\u2605 M9 Bayonet | Tiger Tooth (Factory New)",
    "original_market_name": "\u2605 M9 Bayonet | Tiger Tooth (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmcjgOrzUhFRe-sR_jez--YXygED6_0o4ZjildoDBdVA_ZguC-gO9yeq90Je4vZuYwHdguSgm5H7am0TkhAYMMLKzxtQfiA",
    price: 314.44
}, {
    "item_count": 3,
    name: "USP-S | Guardian (Factory New)",
    "original_market_name": "USP-S | Guardian (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jxP77Wl2VF18l4jeHVu9Wh3gzlqRU6NmqhINXDelA9MliBr1O_kLjuh5Dt7sjLnyBlviJ0syvD30vgdbWoQSw",
    price: 1.2
}, {
    "item_count": 2,
    name: "AWP | Pink DDPAT (Minimal Wear)",
    "original_market_name": "AWP | Pink DDPAT (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PfMYTxW08y_mou0m_7zO6-flzsB6sBzj-jFodqiiQPl-0VsZWvzIY6cegRvYA7Y_FS_krjpg5Xu74OJlyXUk8gSnw",
    price: 13.8
}, {
    name: "AUG | Ricochet (Minimal Wear)",
    "original_market_name": "AUG | Ricochet (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAZt7PLddgJI-dG0mIW0m_7zO6-fkjMHsZUgi72T896m0VCwqEBlMD31IIPBcFc_ZlrY-1m2wLi6hpHouYOJlyUksb3lzA",
    price: 0.45
}, {
    "item_count": 3,
    name: "Glock-18 | Bunsen Burner (Minimal Wear)",
    "original_market_name": "Glock-18 | Bunsen Burner (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79fnzL-Nm_b5NqjulGdE7fp9g-7J4cKgjlGw-UA4ZjjwJoGccVU8ZFHR_gTrk-fm15K56pyYyyBj6XIrsXmOgVXp1s5QzU_K",
    price: 0.32
}, {
    "item_count": 2,
    name: "P90 | Asiimov (Field-Tested)",
    "original_market_name": "P90 | Asiimov (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIXBD_9W_mY-dqPrxN7LEmyUF7MEniOqXpY2hiwbs80s-Zjv1Jo-QcQM8NF_Z81Ltxr3qgJ_tuc6b1zI97XT1Ujq3",
    price: 5.43
}, {
    "item_count": 3,
    name: "Tec-9 | Ice Cap (Minimal Wear)",
    "original_market_name": "Tec-9 | Ice Cap (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhh3szcdD59teOlkYG0hPb4J4Tdn2xZ_Ism2L_HotTzjAzj-RI9YTqgctXEIA9vYV3RqFXsxue8hpe46JjJmHY2pGB8srWWYKT2",
    price: 0.12
}, {
    name: "\u2605 Bowie Knife | Marble Fade (Factory New)",
    "original_market_name": "\u2605 Bowie Knife | Marble Fade (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMrbum2pD6sl0te_A8YnKhF2zowdyNjz1INCWewU9YArR-wO6w7jp0MC76Z3Jn3dkunJx5SuMnxzk1xgZO_sv26Is8TDGIA",
    price: 364.35
}, {
    name: "AWP | Hyper Beast (Factory New)",
    "original_market_name": "AWP | Hyper Beast (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tdn2xZ_Ismju2To9qm31Hsr0ZsMTryJo_BcANrMwyCrFLrx7vrhJa1vZrByXo2pGB8sr2_Epwm",
    price: 57.44
}, {
    name: "\u2605 M9 Bayonet | Lore (Field-Tested)",
    "original_market_name": "\u2605 M9 Bayonet | Lore (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Igsj5aoTTl3Ju5Mpjj9bM8Ij8nVn6qkRuYGH7I4STdldqZFCG-QS-xOy7gpW7vJ2bnSdn6XIg4X2OzkHlgAYMMLIs05iQHg",
    price: 409.5
}, {
    "item_count": 5,
    name: "AWP | Safari Mesh (Field-Tested)",
    "original_market_name": "AWP | Safari Mesh (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q42Ok_7hPvXXlGkBsJ1z2b6Rp9302gLm-Uo-am2lItXBegFraV7T-FHtkOq-1sW8ot2Xnl-RcvNU",
    price: 0.13
}, {
    name: "P90 | Elite Build (Minimal Wear)",
    "original_market_name": "P90 | Elite Build (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17OORIQJP7c-ikZKSqPv9NLPF2G0EsMN33rGY9tWnjlK18xBqNm2gIISdcwJsMAzQ-wK9xOy705bt7pvXiSw0wcJJWjY",
    price: 0.21
}, {
    "item_count": 2,
    name: "AK-47 | Vulcan (Factory New)",
    "original_market_name": "AK-47 | Vulcan (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj4OrzZgiUEsJYnibqZ8d-l2wO1_hJtNWDzctDBIQ5taAzQqFi6wujo1se06cud1zI97ZAmS4pT",
    price: 75.8
}, {
    name: "\u2605 Karambit | Lore (Factory New)",
    "original_market_name": "\u2605 Karambit | Lore (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJl5W0nPbmMrbummRD7fp9g-7J4cKi2A3kqhY9Zm6hJ9eXI1RqaVqF-ljowb271564vMyaznA1viF2s3jegVXp1uIYPzxv",
    price: 1475.25
}, {
    "item_count": 2,
    name: "USP-S | Stainless (Field-Tested)",
    "original_market_name": "USP-S | Stainless (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ092nq5WYh8jnJ7rYmGdU-9ZOh-zF_Jn4xlbs-0o5ZzqmJYLHcQZvZw2Cq1a3wu650MPq78nJznYwuHVz5nePmUCpwUYbxrKWk3g",
    price: 1.39
}, {
    name: "\u2605 Huntsman Knife | Fade (Factory New)",
    "original_market_name": "\u2605 Huntsman Knife | Fade (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlYG0kfbwNoTdn2xZ_IsnjLuQo9_2i1HgrRVtYm_xJoLDegY3Y1jQqVjryOzn0cTq6ZyawHAypGB8svBLbDE1",
    price: 190.56
}, {
    "item_count": 3,
    name: "M4A4 | Desert-Strike (Field-Tested)",
    "original_market_name": "M4A4 | Desert-Strike (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszceClD4s-im5KGqPrxN7LEmyUC7ZV32LDC8NWjjVbi-hA_NWmnJdPGcQU7ZFjRrlTowei6h5W0tJ7K1zI97Qdxs-_G",
    price: 2.74
}, {
    name: "AK-47 | Vulcan (Well-Worn)",
    "original_market_name": "AK-47 | Vulcan (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj5Nr_Yg2YfvZcg0rmXrI2n31ex8ks9Zjz2JIKdcVA4ZArRqVm-wLzn1sC8uJnMwWwj5HcoJjKuZA",
    price: 23.31
}, {
    name: "\u2605 Karambit | Lore (Minimal Wear)",
    "original_market_name": "\u2605 Karambit | Lore (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJl5W0nPbmMrbummRD7fp9g-7J4cKi2A3kqhY9Zm6hJ9eXI1RqaVqF-ljowb271564vMyaznA1viF2s3jegVXp1uIYPzxv",
    price: 838.95
}, {
    name: "\u2605 Bayonet | Lore (Factory New)",
    "original_market_name": "\u2605 Bayonet | Lore (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zLZAJA7cW5moWfqPv7Ib7ummJW4NE_2b6T9tvw2FG3_UZoNWqhcYPBdwVraV-DqAPvku2-15e6vM7BmnVl7z5iuyjsDymLtA",
    price: 764.4
}, {
    name: "AWP | Snake Camo (Minimal Wear)",
    "original_market_name": "AWP | Snake Camo (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7ODGcDZH09C_k4if2fSkMeiDwW8IvpVwjLGU9tWt31axr0poZ2v7I4-Wd1BsZQrWq1a2wb_xxcjrod6PdbI",
    price: 8.48
}, {
    "item_count": 3,
    name: "AUG | Torque (Minimal Wear)",
    "original_market_name": "AUG | Torque (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJS_tOxhoWYhP7iDLfYkWNFpsMm27vD9Iqs2gHnqRdvZm6gI4fEcwM8ZAyBqVS_lO3vh5-075TMynd9-n51xJ7ya_c",
    price: 0.9
}, {
    name: "\u2605 StatTrak\u2122 M9 Bayonet | Crimson Web (Minimal Wear)",
    "original_market_name": "\u2605 StatTrak\u2122 M9 Bayonet | Crimson Web (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-DjsjjNrnCqWdY781lxLzD8I6s0AK2rkE_Yz-nJdeTJlJrZwuD-Qe9x-6515ftuM_OznphuXQ8pSGKLNyhYhs",
    price: 888.3
}, {
    name: "\u2605 Butterfly Knife | Doppler Sapphire (Factory New)",
    "original_market_name": "\u2605 Butterfly Knife | Doppler (Factory New)",
    "paint_index": 619,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOT1I6vZn3lU18hwmOvN8IXvjVCLqSwwOj6rYJiRdg42NAuE-lW5kri5hpbuvM7AzHtmsnMh4imPzUa3gB4aaOw9hfCeVxzAUJ5TOTzr",
    price: 3255
}, {
    "item_count": 3,
    name: "M4A1-S | Cyrex (Field-Tested)",
    "original_market_name": "M4A1-S | Cyrex (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp8j-3I4IG721Hh_UM_YmilJY7DegI4Nw7Y8we4wO-9hJG76pzImHsy7ygh7HyMnAv330-QA3A95Q",
    price: 6.29
}, {
    name: "Glock-18 | Royal Legion (Battle-Scarred)",
    "original_market_name": "Glock-18 | Royal Legion (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4TZk2pH8Yty2rDE847x0Ae38hdvNWilIYLGdlJsaF7VqFW9k7-7hJG96JqazXQ2pGB8srW2FRoN",
    price: 0.41
}, {
    name: "SSG 08 | Necropos (Factory New)",
    "original_market_name": "SSG 08 | Necropos (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJmoWIhfjkPKjummJW4NE_ie2T89-niVXk-EdlNj2gddKWI1NoMA3Y-gO7wee51pO1up-YyyBguj5iuygJJGQRng",
    price: 1.07
}, {
    name: "\u2605 Bayonet | Doppler (Factory New)",
    "original_market_name": "\u2605 Bayonet | Doppler (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJG48ymmIWZqOf8MqjUxVRd4cJ5nqeXpdzx0FHgqhFqZmn6IY_DI1U8aFuB_FLql-nt1pe7tMybzHFmvCUj-z-DyAETkzcY",
    price: 220.5
}, {
    name: "M4A1-S | Master Piece (Battle-Scarred)",
    "original_market_name": "M4A1-S | Master Piece (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alfqjuhWJd7ctyj9bJ8I3jkRrl-0o-ajilcNeUcgNoYV7Q-AO8k-y8gMDtvprKn3swuChx4nmJyUG0n1gSOdizUYPn",
    price: 14.6
}, {
    name: "FAMAS | Roll Cage (Minimal Wear)",
    "original_market_name": "FAMAS | Roll Cage (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf1OD3dzxP7c-JhoGHm-7LP7LWnn8fvZYpiOjE8NihjVbj_EE4NmD2JIScJwI8Z1-Fq1jtxe_uhZfu7s7AzWwj5HcX23zPaA",
    price: 6.37
}, {
    name: "\u2605 Flip Knife | Doppler Black Pearl (Factory New)",
    "original_market_name": "\u2605 Flip Knife | Doppler (Factory New)",
    "paint_index": 417,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eO0mIGInOfxMqndqWZQ-sd9j-Db8IjKhF2zowdyZz_yLIfGdAFvYguD-Fa9kOrp15G9vpifz3A26ycjt3qMzBDig05Lafsv26IspbmNiQ",
    price: 651
}, {
    name: "AK-47 | Vulcan (Battle-Scarred)",
    "original_market_name": "AK-47 | Vulcan (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV086jloKOhcj8NrrHjyVQ6cAji7rEo9v2jlKw-RdoN2r6LY-ddQ4-aQzV8wS7lO7o0ZXp6s_B1zI97ecvvlG_",
    price: 14.69
}, {
    name: "AWP | Dragon Lore (Minimal Wear)",
    "original_market_name": "AWP | Dragon Lore (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5Mx2gv2P9o6migzl_Us5ZmCmLYDDJgU9NA6B81S5yezvg8e-7cycnXJgvHZx5WGdwUJqz1Tl4g",
    price: 1848
}, {
    name: "AWP | Medusa (Field-Tested)",
    "original_market_name": "AWP | Medusa (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR7eO3g5C0mvLwOq7c2DkAvJQg27iT9NWm2VK3rkU6YmmiI4SVJAQ9MljUr1O5ku7ug8K1usnXiSw07gvX0uU",
    price: 684.6
}, {
    name: "M4A4 | Howl (Factory New)",
    "original_market_name": "M4A4 | Howl (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09S5g4yCmfDLP7LWnn8f65Mli7DH9tXziQTgqUY4YmmnINSUJwQ-YVnT_wS7yOzngMW07ZrOmmwj5HeObpQQtA",
    price: 1900.5
}, {
    name: "AWP | Dragon Lore (Factory New)",
    "original_market_name": "AWP | Dragon Lore (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5Mx2gv2P9o6migzl_Us5ZmCmLYDDJgU9NA6B81S5yezvg8e-7cycnXJgvHZx5WGdwUJqz1Tl4g",
    price: 2597.7
}, {
    name: "AK-47 | Fire Serpent (Factory New)",
    "original_market_name": "AK-47 | Fire Serpent (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszOeC9H_9mkhIWFg8j1OO-GqWlD6dN-teXI8oThxg3n8kM5ZD-nJI-UJ1c2MFjU-VXolezugZXpvMyan3I3v3Qjty2OlhKpwUYbndZ_4hw",
    price: 939.75
}, {
    name: "AWP | Medusa (Factory New)",
    "original_market_name": "AWP | Medusa (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR7eO3g5C0m_7zO6-fxj5SvsMkib-W9N7zilLjr0NoYW_wI4OTelRvYwmC-FTrxeq915a074OJlyVOUzvCjQ",
    price: 2058
}, {
    "item_count": 2,
    name: "Revolver Case Key",
    "original_market_name": "Revolver Case Key",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiev1ZVNkgqeRdWUV7o3kltLdzvOjauqCwDlUupAj0-rD843zjAbt_hVtMDjtZNjCJHQgy4g",
    price: 2.69
}, {
    name: "Glock-18 | Weasel (Field-Tested)",
    "original_market_name": "Glock-18 | Weasel (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-ckvbnNrfum25V4dB8xL2UpNmg2wO3-BFrajz1dYCQdgZsNArZrFO3wLrs1p_tu8-bn3FisiU8pSGK6x7va44",
    price: 0.53
}, {
    "item_count": 4,
    name: "AWP | Phobos (Field-Tested)",
    "original_market_name": "AWP | Phobos (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0mvLwOq7c2G4EucYk2L7Ep42t3VGx_RFtamHyLISXe1JsYw6Fr1e9wuvr1JS5vs7XiSw0S4ZJl1o",
    price: 1.68
}, {
    "item_count": 3,
    name: "AWP | Worm God (Factory New)",
    "original_market_name": "AWP | Worm God (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZx7PLfYQJW-9W4kb-HnvD8J_XXzzwH65EgiLHHrNutjAa28xdtYG7wINCUdlA4ZFDW81m8lebqjMC9ot2XnlThvpXE",
    price: 1.72
}, {
    "item_count": 3,
    name: "AWP | Asiimov (Battle-Scarred)",
    "original_market_name": "AWP | Asiimov (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0n_L1JaKfzzoGuJJ02e2W8d6m2gztrkRoZmigItDGcgA_N1iFqwC-xr_m1J-57YOJlyVerprbwA",
    price: 28.26
}, {
    name: "M4A1-S | Mecha Industries (Factory New)",
    "original_market_name": "M4A1-S | Mecha Industries (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDLbUlWNQ18x_jvzS4Z78jUeLpxo7Oy3tJo-ScVVoZAuB8wW_xOft0ZC6uZ-bn3Nn63Mq7C2Oyx2yiBsYarNv1OveFwt9ELX6XQ",
    price: 26.94
}, {
    "item_count": 3,
    name: "AK-47 | Neon Revolution (Field-Tested)",
    "original_market_name": "AK-47 | Neon Revolution (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV0924lZKIn-7LPr7Vn35cppwl3OyVp9Txi1Gy_0Y9MDjyd4fGJFVsZFGG-gC5xLvo1pfouJ3Bzyd9-n51-K95osI",
    price: 23.61
}, {
    "item_count": 4,
    name: "USP-S | Torque (Field-Tested)",
    "original_market_name": "USP-S | Torque (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbTWhG5C-8xnteTE8YXghRrjqEptYGnzcYeScAc-Ml2Eq1Tsle2-05C57c6czydjsnJz4S7Vn0Pkn1gSOT9DXxAV",
    price: 0.49
}, {
    name: "\u2605 Shadow Daggers | Tiger Tooth (Factory New)",
    "original_market_name": "\u2605 Shadow Daggers | Tiger Tooth (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJD4uOinYeOhcj7IbrfkW5u5Mx2gv2P8Y-mjVDk-0JoMW6hJoaXdlc5NwqDqwDvkr_u08Tu6sycynFguych4GGdwUKPWgFGtQ",
    price: 133.26
}, {
    "item_count": 2,
    name: "Tec-9 | Isaac (Field-Tested)",
    "original_market_name": "Tec-9 | Isaac (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoor-mcjhjxszcdD4b092lnYmGmOHLPr7Vn35cppEm3-qU8d6h0FXh_BVqNWqiLI_HJAVvaA2D_VjvyO27gcC9ucibnXB9-n51miX7j58",
    price: 0.3
}, {
    "item_count": 3,
    name: "AK-47 | Cartel (Factory New)",
    "original_market_name": "AK-47 | Cartel (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV09-3hpSOm8j4OrzZgiUD7ZJzj7DHoY-iilC1-ENoNWuiI9WWdQI8Z1iE81Tvl7i81J-_6p2b1zI97XPwFCE_",
    price: 7.13
}, {
    "item_count": 2,
    name: "AK-47 | Elite Build (Well-Worn)",
    "original_market_name": "AK-47 | Elite Build (Well-Worn)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09G3h5SOhe7LPr7Vn35cpsEl0-2Xrdii3APt-RI4ZG71IdOXelJoZVDX_li7kOu-1MW6uZ_JyHV9-n51hRUaMfs",
    price: 0.82
}, {
    name: "Five-SeveN | Urban Hazard (Minimal Wear)",
    "original_market_name": "Five-SeveN | Urban Hazard (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goWYkuHxPYTEhGlQ5vp5i_PA54jKhF2zowdyZ2z1LYCTJgQ9NwmG-1G9xb3qhMS0vZ7Jm3UyvSAg7HuMyRW_hhhOaPsv26Lv8Ntyjw",
    price: 0.34
}, {
    name: "FAMAS | Survivor Z (Factory New)",
    "original_market_name": "FAMAS | Survivor Z (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf0Ob3dzxP7c-JmIWFg_bLP7LWnn8fv8Rz37mZ9Nil31Hh_RI-Zm3ycNfAcwQ5NA7VrAK4xbjvjMC67cjJwWwj5HfemqCEuw",
    price: 0.41
}, {
    "item_count": 5,
    name: "M4A1-S | Boreal Forest (Field-Tested)",
    "original_market_name": "M4A1-S | Boreal Forest (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-NmOXxIK_ulGRD7cR9teTE8YXghRrhrRBrMWD7coCQegU6aQyE_gC6xOi6gJC5tJTMn3BqvyNztH_VnRS-n1gSOeVXeHpm",
    price: 0.08
}, {
    "item_count": 2,
    name: "M4A4 | Hellfire (Factory New)",
    "original_market_name": "M4A4 | Hellfire (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09SzmIyNnuXxDLfYkWNFpsEi3L6UrdiljFXlr0VsNmj6dteXdFBtYFnV-VjryO3qhMe86c7BwHB9-n51JK1M_qQ",
    price: 20.18
}, {
    name: "\u2605 Gut Knife | Gamma Doppler Emerald (Factory New)",
    "original_market_name": "\u2605 Gut Knife | Gamma Doppler (Factory New)",
    "paint_index": 568,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxP09m7kZKKm_PLPrrDlGdU4d90jtbN_Iv9nBqxqRU5MG32ddeQIwdsaVqE_wTtkO66g5Hv7p6fzHprvidx4XiLzBezn1gSOQvdpryG",
    price: 450.45
}, {
    name: "SCAR-20 | Bloodsport (Factory New)",
    "original_market_name": "SCAR-20 | Bloodsport (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7PTbTi5B7c7kxL-Jm_j7N6jBmXlF18l4jeHVu4jx0Q2yrhA_MWrycITAIQQ3ZwqDrle8wb-90Z60ucjPnydmunQm4SrD30vg_ZtSLog",
    price: 2.97
}, {
    "item_count": 2,
    name: "AK-47 | Bloodsport (Field-Tested)",
    "original_market_name": "AK-47 | Bloodsport (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV0966m4-PhOf7Ia_um25V4dB8xO3Hpdn22lWxqUc9Zmr0J9XBIw89M1GGqFC8ybzvgMLvvJ6azSE1viM8pSGK5KY2J5A",
    price: 43.21
}, {
    "item_count": 2,
    name: "Glock-18 | Royal Legion (Factory New)",
    "original_market_name": "Glock-18 | Royal Legion (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf1OD3djFN79fnzL-KgPbmN4Tdn2xZ_Isg07HCpYj23QLn-0prYzvycoXHIFVsYljXq1C9wObogZPv7Z3JzydkpGB8sj7oAKPM",
    price: 2.76
}, {
    name: "MAC-10 | Neon Rider (Minimal Wear)",
    "original_market_name": "MAC-10 | Neon Rider (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0Ob3fDxBvYyJmoWEmeX9N77DqWdY781lxOyQrIjw2ATmrkQ_YT2lcYbEcAJsNQqD_1fol7jnjJbp75nMmHI3vHI8pSGKtEQei0M",
    price: 3.68
}, {
    "item_count": 3,
    name: "AK-47 | Emerald Pinstripe (Minimal Wear)",
    "original_market_name": "AK-47 | Emerald Pinstripe (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszYeDNR-M6_hIW0lvygZITdn2xZ_Isj27uSod6kiQbirRE5ZW7wcdPEdVU-Y1vYqVa6xe--jZXutZqYmHNkpGB8sorXHHb4",
    price: 1.9
}, {
    "item_count": 3,
    name: "USP-S | Kill Confirmed (Field-Tested)",
    "original_market_name": "USP-S | Kill Confirmed (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh5yYGr7IoWVdABrYQ3Y-1m8xezp0ZTtvpjNmHpguCAhtnndzRW10x9KOvsv26KUE4Zjjg",
    price: 30.03
}, {
    "item_count": 3,
    name: "M4A4 | Urban DDPAT (Field-Tested)",
    "original_market_name": "M4A4 | Urban DDPAT (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszMdS1D-OOjhoK0mvLwOq7c2DgJsJEljrmSodSh0Ae3rhA_YWr2doOUc1I6NV3W_ljswufph8S96JrXiSw0sGdhRtI",
    price: 0.09
}, {
    name: "AK-47 | Fire Serpent (Minimal Wear)",
    "original_market_name": "AK-47 | Fire Serpent (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszOeC9H_9mkhIWFg8j1OO-GqWlD6dN-teXI8oThxg3n8kM5ZD-nJI-UJ1c2MFjU-VXolezugZXpvMyan3I3v3Qjty2OlhKpwUYbndZ_4hw",
    price: 324.33
}, {
    "item_count": 2,
    name: "AUG | Ricochet (Field-Tested)",
    "original_market_name": "AUG | Ricochet (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAZt7PLddgJI-dG0mIW0mvLwOq7c2DNTupUj3LDAodSjilXsrxBpYWj6JNCccgE-ZlDT-wK4leu-15_vvZ7XiSw0zEbi2WM",
    price: 0.22
}, {
    name: "M4A1-S | Cyrex (Factory New)",
    "original_market_name": "M4A1-S | Cyrex (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp9g-7J4cKk3AC2_0NpYDyhI4XHdlc6Zg7Y-1O2lLy9hcO0vJWdwSdhsnYnt3aOgVXp1hcjOJd2",
    price: 11.92
}, {
    name: "AWP | Electric Hive (Field-Tested)",
    "original_market_name": "AWP | Electric Hive (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957PvBZzh94dmynZWG2a-hZLrQw29Uu8cki7HE9N6h2w22-ENkYGH3JdKddwdsYFDQ_wS9xrrxxcjrUHmhGtE",
    price: 10.56
}, {
    name: "AK-47 | Black Laminate (Minimal Wear)",
    "original_market_name": "AK-47 | Black Laminate (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KcqPv9NLPF2GgEuJFyi-uTotT03A3h_hZlYWv2IdPAcAY8Y1vU-gPrw7rvjJ6-7ZnXiSw034A6uhk",
    price: 10.46
}, {
    name: "SSG 08 | Dragonfire (Minimal Wear)",
    "original_market_name": "SSG 08 | Dragonfire (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJkJKKkPj6NbLDk1RC68phj9bN_Iv9nBrg80FkZmGgLdKVeg46ZFyC_lPrxO25hZTotZ_OmHphuiNx43aJyUa1n1gSOaKu3f6c",
    price: 19.66
}, {
    "item_count": 2,
    name: "MP7 | Urban Hazard (Minimal Wear)",
    "original_market_name": "MP7 | Urban Hazard (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAR17P7YJnBB49G7lY6PkuXLP7LWnn8fupMhjrrHp9uj3Vfs-BVrZjyicNfGd1dsNV6FrFW_yem61JTvvp3BwGwj5HdMYFr9GQ",
    price: 0.12
}, {
    "item_count": 2,
    name: "M4A1-S | Atomic Alloy (Minimal Wear)",
    "original_market_name": "M4A1-S | Atomic Alloy (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-Gw_alfqjul2dd59xOhfvA-4vwt1i9rBsofWHxdtKXdQRqYVrV_Ae_xru9jZC8vpSYwSZiviEjtnuImkfhg0ofZ7ZxxavJioUkVPc",
    price: 3.9
}, {
    name: "\u2605 Falchion Knife | Scorched (Field-Tested)",
    "original_market_name": "\u2605 Falchion Knife | Scorched (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1fLEcjVL49KJh5C0k_bkI7fUqWZU7Mxkh6fFoNn3jFHtqkE9ZjzxIdDDdgc_NQyFq1jtkuu9hJLutM_Jy3Bi6yFw-z-DyM3JHoc_",
    price: 59.33
}, {
    name: "USP-S | Caiman (Minimal Wear)",
    "original_market_name": "USP-S | Caiman (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq4uKnvr1PYTdn2xZ_Ispj-2Qo9Sh3wyx-ENqMT3wLITEewZvNwrRqFa_kLrm05G5uZybynZhpGB8srszwr4w",
    price: 4.05
}, {
    name: "AK-47 | Fuel Injector (Minimal Wear)",
    "original_market_name": "AK-47 | Fuel Injector (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV08-jhIWZlP_1IbzUklRd4cJ5nqeZ9Nzx3Qex80c-ZGn3LYWTdFc9NFuEqAO8xLrtjMC4u56dznQ36XVw-z-DyK64IMQ5",
    price: 44.07
}, {
    name: "AWP | Redline (Minimal Wear)",
    "original_market_name": "AWP | Redline (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJB496klb-HnvD8J_XSkDkB68Ani-qQpNmkigC1-EM4azj7IIadc1NtZVvX-QLsl7-7gce4ot2XngYgmyTY",
    price: 18.15
}, {
    "item_count": 2,
    name: "AWP | Hyper Beast (Battle-Scarred)",
    "original_market_name": "AWP | Hyper Beast (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4TZk2pH8YtwiO_Hot2j2w22qBZoYz-icoGUdwFoZ1jT-ATolb3th5G5v87BznFgpGB8skUUNh9c",
    price: 15.41
}, {
    name: "\u2605 Shadow Daggers | Urban Masked (Field-Tested)",
    "original_market_name": "\u2605 Shadow Daggers | Urban Masked (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJR_OOilZCOqOLmMbrfqWZU7Mxkh6eXpojzjAax-BI_ZG2idoXHdQdoY1CF-lG7xrrqg8Xp6p3KnCNjsyAg-z-DyHD6fTd_",
    price: 59.91
}, {
    name: "FAMAS | Mecha Industries (Minimal Wear)",
    "original_market_name": "FAMAS | Mecha Industries (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf1OD3dzxP7c-JmYWIn_bLP7LWnn8f65cnjrrH9o_22QHirRZuZTuiJ4WXd1NqZluC-Fi-yOy9hsO9tJ3Aymwj5Hdve0dwuA",
    price: 2.79
}, {
    "item_count": 2,
    name: "USP-S | Royal Blue (Field-Tested)",
    "original_market_name": "USP-S | Royal Blue (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09Svq4mFk_7zPITEhXtu5cB1g_zMu9ugi1K3_xY_YDumctSWdwU-N1qD81S5wui6hZG66ZXBnHA36HMn5XvD30vgUqJ0Q-w",
    price: 0.4
}, {
    name: "UMP-45 | Primal Saber (Field-Tested)",
    "original_market_name": "UMP-45 | Primal Saber (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0Ob3ZDBSuImJhJKCmvb4ILrTk3lu5cB1g_zMu46jjAGy80c_ajqgd9OTdFRoZl_V_VG5xr_r1pO9vMvNyidhs3Rztn7D30vgvDNIovc",
    price: 3.11
}, {
    "item_count": 2,
    name: "P250 | Valence (Minimal Wear)",
    "original_market_name": "P250 | Valence (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhhwszYI2gS09-5mpSEguXLP7LWnn8f7sR33-uSpdn23gyw8xY9YWr7JYKUdAVsYQnW8wXvl7_ohpe07pXIwWwj5HeF0_VeIQ",
    price: 0.16
}, {
    name: "AK-47 | Frontside Misty (Minimal Wear)",
    "original_market_name": "AK-47 | Frontside Misty (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08u_mpSOhcjnI7TDglRd4cJ5nqeSrY_x2VDlqBZrZTr2LIfAe1RvYgzW_Va6kL3u0JG8vJ7NyyQwunEj-z-DyIN9IvW2",
    price: 16.17
}, {
    name: "SSG 08 | Necropos (Minimal Wear)",
    "original_market_name": "SSG 08 | Necropos (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJmoWIhfjkPKjummJW4NE_ie2T89-niVXk-EdlNj2gddKWI1NoMA3Y-gO7wee51pO1up-YyyBguj5iuygJJGQRng",
    price: 0.25
}, {
    "item_count": 3,
    name: "MAC-10 | Fade (Factory New)",
    "original_market_name": "MAC-10 | Fade (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0vL3dzxG6eO6nYeDg7miZbqDxj8B7Z0n2-3E94mjjQTirRI9MTjyIIWQeg84Y1DS_lm3wOfom9bi6-g13CfU",
    price: 2.27
}, {
    "item_count": 2,
    name: "AK-47 | Blue Laminate (Minimal Wear)",
    "original_market_name": "AK-47 | Blue Laminate (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhoyszJemkV4N27q4KHgvLLP7LWnn8fscMpj-qUpNymjVK1_hFrMmmhJ4-Ue1c_YgrUrgS5ybvu18K6vZ-YyWwj5HdyMRX4FA",
    price: 3.28
}, {
    name: "Desert Eagle | Conspiracy (Factory New)",
    "original_market_name": "Desert Eagle | Conspiracy (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH7du6kb-KguXxJqjummJW4NE_3e_Aotql3QO3qUNpNWugddSdcA9sNFzU8ge_w-6-0JO4vJrIzCZj7z5iuygmT5QrCQ",
    price: 3.17
}, {
    "item_count": 3,
    name: "Glock-18 | Bunsen Burner (Field-Tested)",
    "original_market_name": "Glock-18 | Bunsen Burner (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3djFN79fnzL-Nm_b5NqjulGdE7fp8j-3I4IG72ADkrRdpZTr3I9PBI1c7ZViDrgS-xOi5hMTu7czLwXJgvHJw7SzVngv3308koXSX8A",
    price: 0.23
}, {
    "item_count": 3,
    name: "Five-SeveN | Violent Daimyo (Field-Tested)",
    "original_market_name": "Five-SeveN | Violent Daimyo (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTj5X09q_goW0hPLiNrXukmpY5dx-teTE8YXghRqwrRFoYWGhdYScdQQ8YAvS81a3wui80J606J6YzXE1siEn4yzYnBK1n1gSOVzaIvOT",
    price: 0.12
}, {
    name: "\u2605 M9 Bayonet | Marble Fade (Factory New)",
    "original_market_name": "\u2605 M9 Bayonet | Marble Fade (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Kmsj5MqnTmm5u7sR1j9bN_Iv9nBrj-EE-YTrzcYXGcA85aF7YqQLtwb3o0MXo6Z3Nynoy6Ckr4CnUmBe3n1gSOfoXRhVR",
    price: 502.95
}, {
    name: "AUG | Chameleon (Factory New)",
    "original_market_name": "AUG | Chameleon (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJB5N27kYyOmPn1OqnUqWdY781lxLiW9Nr2iwzh_xFpMW70cYeXIQE4ZwnR-wW5w--9gZPuvpjMziNrvyk8pSGK5tyGFpE",
    price: 3
}, {
    name: "Desert Eagle | Cobalt Disruption (Factory New)",
    "original_market_name": "Desert Eagle | Cobalt Disruption (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTjlG_N2ikIWFhPLLI77QlWRS4_p9g-7J4cL03AzirxFvYm_zdtXBIVA4MwvVq1Dqye_ojMW4uZ2byXA1vCIi5HrcgVXp1tntQJzL",
    price: 8.84
}, {
    "item_count": 2,
    name: "P250 | Asiimov (Minimal Wear)",
    "original_market_name": "P250 | Asiimov (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS092lnYmGmOHLP7LWnn8fv8ZyjL2XoIqijFfh_hduN2D1JIKTd1I6YVyD-1Htk73n1pK4vs6cnGwj5Hc6h7wWIQ",
    price: 12.71
}, {
    name: "\u2605 Gut Knife | Urban Masked (Battle-Scarred)",
    "original_market_name": "\u2605 Gut Knife | Urban Masked (Battle-Scarred)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTi5S08i3hIW0guX2MrXunm5Q_tw_i-3Fot2j2wG3qhdrMjrycITAJgFvY1mF_VO-wevojMS6vczOmnJquz5iuyijCKrkeA",
    price: 57.09
}, {
    name: "\u2605 Flip Knife | Gamma Doppler (Factory New)",
    "original_market_name": "\u2605 Flip Knife | Gamma Doppler (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYQJD4eOxlY2GlsjwPKvBmm5D19V5i_rEpLP5gVO8v11rMT_6JtWUcwE2ZVmF_1S9wurv18W5752dyXBlvHNw4XrVzRy1gxxFcKUx0qdLIRFw",
    price: 217.35
}, {
    name: "XM1014 | Seasons (Factory New)",
    "original_market_name": "XM1014 | Seasons (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07PLZTiVP09CzlYa0kfbwNoTdn2xZ_It33byS99333wXkqktsYWqmJo-cJgc3YFCDq1C7wbzrh5K0v86YyCE3pGB8sheESime",
    price: 1.07
}, {
    name: "\u2605 Karambit | Autotronic (Field-Tested)",
    "original_market_name": "\u2605 Karambit | Autotronic (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJk5O0nPbmMrbul35F59FjhefI9rP4jVC9vh5yZz2ncofHdgc2ZFiEr1HqxefmhZTuu5_InHFj63EnsSyInkbjgRtOaPsv26Ja_-NxNA",
    price: 396.38
}, {
    name: "Glock-18 | Weasel (Factory New)",
    "original_market_name": "Glock-18 | Weasel (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-ckvbnNrfummJW4NE_j7mT8Nrw3QXt_RY-NzymIIHGdw87ZlHZrAe-wO-70ZC4uZzNzndjvz5iuyhP0kvddA",
    price: 3.27
}, {
    name: "M4A1-S | Atomic Alloy (Factory New)",
    "original_market_name": "M4A1-S | Atomic Alloy (Factory New)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO3mb-Gw_alfqjul2dd59xOhfvA-4vwt1i9rBsofWHxdtKXdQRqYVrV_Ae_xru9jZC8vpSYwSZiviEjtnuImkfhg0ofZ7ZxxavJioUkVPc",
    price: 9.14
}, {
    name: "Glock-18 | Twilight Galaxy (Field-Tested)",
    "original_market_name": "Glock-18 | Twilight Galaxy (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73cCxX7eOwmIWInOTLPr7Vn35cppZ13rCR8Y-s3VK2_UFpa2qicIGTe1M5NVHZ8gO-w-i9hZK8up7MnHp9-n51Eln3nAQ",
    price: 9.62
}, {
    name: "P2000 | Fire Elemental (Minimal Wear)",
    "original_market_name": "P2000 | Fire Elemental (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJSvozmxL-NnuXxDL7dk2ZU5tFwhtbN_Iv9nBrlrkZrN22nLdCUIQM_NF7R-QK_yOzshpG77czMzCQy6CRw5S6Pnkfkn1gSOQPxEiVv",
    price: 5.93
}, {
    name: "StatTrak\u2122 M4A1-S | Cyrex (Field-Tested)",
    "original_market_name": "StatTrak\u2122 M4A1-S | Cyrex (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITSj3lU8Pp8j-3I4IG721Hh_UM_YmilJY7DegI4Nw7Y8we4wO-9hJG76pzImHsy7ygh7HyMnAv330-QA3A95Q",
    price: 23.07
}, {
    name: "AUG | Chameleon (Field-Tested)",
    "original_market_name": "AUG | Chameleon (Field-Tested)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFAR17PLddgJB5N27kYyOmPn1OqnUqWZU7Mxkh6eX99-ljVCx-hc4MGj7cISQelNsN13VqAPsl7q5hMe9v5WfzHAyvXQh-z-DyCf7NJoR",
    price: 1.7
}, {
    name: "SSG 08 | Blood in the Water (Minimal Wear)",
    "original_market_name": "SSG 08 | Blood in the Water (Minimal Wear)",
    "paint_index": 0,
    image: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3YjVD_teJmImMn-O6Y-uJxzlSupVw0rCXrdii2AXnqUM9YWDyJ9eUdABoZwqB-FO-kOzqjYj84sqeBRQLNw",
    price: 15.59
}];

//ItemArray
const itemArray = [
    {
        name: '★ Butterfly Knife | Doppler Sapphire (Factory New)',
        price: 0
    },
    {
        name: '★ M9 Bayonet | Doppler Sapphire (Factory New)',
        price: 0
    },
    {
        name: '★ Butterfly Knife | Doppler Ruby (Factory New)',
        price: 0
    },
    {
        name: 'AWP | Dragon Lore (Factory New)',
        price: 0
    },
    {
        name: 'AWP | Medusa (Factory New)',
        price: 0
    },
    {
        name: 'M4A4 | Howl (Factory New)',
        price: 0
    },
    {
        name: 'AWP | Dragon Lore (Minimal Wear)',
        price: 0
    },
    {
        name: '★ Karambit | Lore (Factory New)',
        price: 0
    },
    {
        name: '★ Flip Knife | Gamma Doppler Emerald (Factory New)',
        price: 0
    },
    {
        name: 'AWP | Dragon Lore (Field-Tested)',
        price: 0
    },
    {
        name: '★ Flip Knife | Doppler Ruby (Factory New)',
        price: 0
    },
    {
        name: 'AK-47 | Fire Serpent (Factory New)',
        price: 0
    },
    {
        name: '★ StatTrak™ M9 Bayonet | Crimson Web (Minimal Wear)',
        price: 0
    },
    {
        name: '★ Karambit | Lore (Minimal Wear)',
        price: 0
    },
    {
        name: '★ Bayonet | Lore (Factory New)',
        price: 0
    },
    {
        name: 'AWP | Medusa (Field-Tested)',
        price: 0
    },
    {
        name: '★ Flip Knife | Doppler Black Pearl (Factory New)',
        price: 0
    },
    {
        name: '★ Butterfly Knife | Marble Fade (Factory New)',
        price: 0
    },
    {
        name: '★ Gut Knife | Gamma Doppler Emerald (Factory New)',
        price: 0
    },
    {
        name: '★ Sport Gloves | Hedge Maze (Field-Tested)',
        price: 0
    },
    {
        name: '★ M9 Bayonet | Lore (Field-Tested)',
        price: 0
    },
    {
        name: '★ Karambit | Autotronic (Field-Tested)',
        price: 0
    },
    {
        name: '★ Specialist Gloves | Emerald Web (Field-Tested)',
        price: 0
    }
];

this.items = items;

async.eachOf(this.items, (item, key, callback) => {
    connection.query('SELECT * FROM items WHERE name = '+connection.escape(item.name), (err, result) => {
        if(err){
            throw err;
        }
        if(result.length > 0){
            const itemDb = result[0];
            this.items[key].price = itemDb.price;
            callback();
        } else {
            const itemData = {
                name: item.name,
                image: item.image,
                price: item.price
            };
            connection.query('INSERT INTO items SET ?', itemData, (err, result) => {
                if(err){
                    throw err;
                } else {
                    callback();
                }
            });
        }
    })
});
//Roulette Init
const rouletteSettings = {
    length: 30000
};

const rouletteInitState = {
    id: null,
    hash: null,
    salt: null,
    roll: null,
    players: {
        red: [],
        black: [],
        blue: []
    },
    endTime: null,
    timeLeft: null
};

this.roulette = rouletteInitState;
const timerR = new NanoTimer();
initRoulette();

function startRouletteTimer(){
    timerR.setInterval(timer,'', '1s');
}

function initRoulette(){ //Initial Server loads game.
    this.roulette = rouletteInitState;
    connection.query('SELECT * FROM roulette WHERE played = false', (err, result) => {
        if(result.length <= 0){
            newGame();
        } else {
            this.roulette.id = result[0].id;
            this.roulette.hash = result[0].hash;
            this.roulette.salt = result[0].secret;
            this.roulette.endTime = result[0].endTime;
            this.roulette.roll = result[0].roll;

            connection.query('SELECT * FROM roulettePlayers WHERE rouletteId = '+this.roulette.id, (err, results) => {
                if(err){
                    console.log(err);
                } else if(results.length !== 0){
                    const players = results;
                    for(let p=0; p < players.length; p++){
                        if(players[p].side === 'red'){
                            for (let dp = 0; dp < players.length; dp++) {

                                const dataPlayer = players[dp];
                                let existingPlayer = false;

                                for (let sp = 0; sp < this.roulette.players.red.length; sp++) {

                                    let statePlayer = this.roulette.players.red[sp];

                                    if (dataPlayer.steamid === statePlayer.steamid) {

                                        existingPlayer = true;

                                        statePlayer.amount += dataPlayer.amount;

                                        this.roulette.players.red[sp] = statePlayer;
                                    }

                                }

                                if (!existingPlayer) {
                                    this.roulette.players.red.push(dataPlayer);
                                }
                            }
                        } else if(players[p].side === 'black'){
                            for (let dp = 0; dp < players.length; dp++) {

                                const dataPlayer = players[dp];
                                let existingPlayer = false;

                                for (let sp = 0; sp < this.roulette.players.black.length; sp++) {

                                    let statePlayer = this.roulette.players.black[sp];

                                    if (dataPlayer.steamid === statePlayer.steamid) {

                                        existingPlayer = true;

                                        statePlayer.amount += dataPlayer.amount;

                                        this.roulette.players.black[sp] = statePlayer;
                                    }

                                }

                                if (!existingPlayer) {
                                    this.roulette.players.black.push(dataPlayer);
                                }
                            }
                        } else if(players[p].side === 'blue'){
                            for (let dp = 0; dp < players.length; dp++) {

                                const dataPlayer = players[dp];
                                let existingPlayer = false;

                                for (let sp = 0; sp < this.roulette.players.blue.length; sp++) {

                                    let statePlayer = this.roulette.players.blue[sp];

                                    if (dataPlayer.steamid === statePlayer.steamid) {

                                        existingPlayer = true;

                                        statePlayer.amount += dataPlayer.amount;

                                        this.roulette.players.blue[sp] = statePlayer;
                                    }

                                }

                                if (!existingPlayer) {
                                    this.roulette.players.blue.push(dataPlayer);
                                }
                            }
                        }
                    }
                }
            });

            //See if game needs to be rolled.
            const currentTime = new Date().getTime();
            const elapsedTime = this.roulette.endTime - currentTime;

            if(elapsedTime < 0){
                rollGame();
            } else {
                io.sockets.emit('event', {action: 'roulette', data: {
                    id: this.roulette.id,
                    hash: this.roulette.hash,
                    players: this.roulette.players,
                    timeEnd: this.roulette.endTime
                }});
                startRouletteTimer();
            }
        }
    })
}

function timer(){
    const currentTime = new Date().getTime();
    const elapsedTime = this.roulette.endTime - currentTime;
    this.roulette.timeLeft = elapsedTime;
    console.log(elapsedTime);
    if(elapsedTime < 0){
        timerR.clearInterval();
        rollGame();
    }
}


function newGame(){
    const time = new Date().getTime();
    const endTime = time + rouletteSettings.length;
    const random = Math.random() * (0 - 1);
    const secret = crypto.createHmac('md5', 'fjdksjiow').update(time.toString()).digest('hex');
    const hash = crypto.createHmac('md5', 'fjdksjiow').update(secret+ ':' + random).digest('hex');
    const roll = Math.floor(helper.hexdec(hash) % 15) + 1;

    this.roulette.hash = hash;
    this.roulette.salt = secret;
    this.roulette.roll = roll;
    this.roulette.endTime = endTime;
    this.roulette.players = {
        red: [],
        black: [],
        blue: []
    };


    const data = {hash, secret, roll, endTime};

    connection.query('INSERT INTO roulette SET ?',data, (err, result) => {
        if(err){
            console.log(err);
        } else {
            this.roulette.id = result.insertId;
            connection.query('SELECT * FROM roulettePlayers WHERE rouletteId = '+this.roulette.id, (err, results) => {
                if(results.length !== 0){
                    const players = results;
                    for(let p=0; p < players.length; p++){
                        if(players[p].side === 'red'){
                            for (let dp = 0; dp < players.length; dp++) {

                                const dataPlayer = players[dp];
                                let existingPlayer = false;

                                for (let sp = 0; sp < this.roulette.players.red.length; sp++) {

                                    let statePlayer = this.roulette.players.red[sp];

                                    if (dataPlayer.steamid === statePlayer.steamid) {

                                        existingPlayer = true;

                                        statePlayer.amount += dataPlayer.amount;

                                        this.roulette.players.red[sp] = statePlayer;
                                    }

                                }

                                if (!existingPlayer) {
                                    this.roulette.players.red.push(dataPlayer);
                                }
                            }
                        } else if(players[p].side === 'black'){
                            for (let dp = 0; dp < players.length; dp++) {

                                const dataPlayer = players[dp];
                                let existingPlayer = false;

                                for (let sp = 0; sp < this.roulette.players.black.length; sp++) {

                                    let statePlayer = this.roulette.players.black[sp];

                                    if (dataPlayer.steamid === statePlayer.steamid) {

                                        existingPlayer = true;

                                        statePlayer.amount += dataPlayer.amount;

                                        this.roulette.players.black[sp] = statePlayer;
                                    }

                                }

                                if (!existingPlayer) {
                                    this.roulette.players.black.push(dataPlayer);
                                }
                            }
                        } else if(players[p].side === 'blue'){
                            for (let dp = 0; dp < players.length; dp++) {

                                const dataPlayer = players[dp];
                                let existingPlayer = false;

                                for (let sp = 0; sp < this.roulette.players.blue.length; sp++) {

                                    let statePlayer = this.roulette.players.blue[sp];

                                    if (dataPlayer.steamid === statePlayer.steamid) {

                                        existingPlayer = true;

                                        statePlayer.amount += dataPlayer.amount;

                                        this.roulette.players.blue[sp] = statePlayer;
                                    }

                                }

                                if (!existingPlayer) {
                                    this.roulette.players.blue.push(dataPlayer);
                                }
                            }
                        }
                    }
                    io.sockets.emit('event', {action: 'roulette', data: {
                        id: this.roulette.id,
                        hash: this.roulette.hash,
                        players: this.roulette.players
                    }});
                    startRouletteTimer();
                } else {
                    this.roulette.id = result.insertId;
                    io.sockets.emit('event', {action: 'roulette', data: {
                        id: this.roulette.id,
                        hash: this.roulette.hash,
                        players: this.roulette.players
                    }});
                    startRouletteTimer();
                }
            });
        }
    })
}

function addPlayer(steamid, side, amount, items) {
    let user = null;
    if (amount < 0.01) {
        io.sockets.in(steamid).emit('event', {
            action: 'error',
            data: {title: 'Roulette Error', message: 'Value must be more then 0.01 Credits'}
        });
    } else if (side !== 'black' && side !== 'red' && side !== 'blue') {
        io.sockets.in(steamid).emit('event', {
            action: 'error',
            data: {title: 'Roulette Error', message: 'Not a valid color selection'}
        });
    }

    let itemValue = 0;
    let item = null;

    async.each(items, (listItem, callback) => {
        if(listItem.price < amount && listItem.price > itemValue){
            item = listItem;
            itemValue = listItem.price;
            callback();
        } else {
            callback();
        }
    }, (err) => {
        console.log(item);
        connection.beginTransaction((err) => {
            if (err) {
                throw err;
            }

            connection.query('SELECT * FROM users WHERE steamid = ' + steamid, (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        throw err;
                    })
                } else if(amount > result[0].balance){
                    io.sockets.in(steamid).emit('event', {
                        action: 'error',
                        data: {title: 'Roulette Error', message: 'Not enough credits!'}
                    });
                    return connection.rollback();
                }
                user = result[0];
                let data = null;
                if(this.roulette.timeLeft < 3000){
                    data = {rouletteId: this.roulette.id + 1, steamid: steamid, name: user.username, avatar: user.avatar, amount: amount, side: side};
                } else {
                    data = {rouletteId: this.roulette.id, steamid: steamid, name: user.username, avatar: user.avatar, amount: amount, side: side};
                }

                connection.query('UPDATE users SET balance = (balance - ' + amount + ') WHERE steamid = ' + steamid, (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            throw err;
                        })
                    }
                    connection.query('INSERT INTO roulettePlayers SET ?', data, (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                throw err;
                            })
                        }

                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    throw err;
                                })
                            }
                            const playersData = [{
                                steamid,
                                name: user.username,
                                avatar: user.avatar,
                                amount,
                                side
                            }];
                            if(side === 'red') {
                                for (let dp = 0; dp < playersData.length; dp++) {

                                    const dataPlayer = playersData[dp];
                                    let existingPlayer = false;

                                    for (let sp = 0; sp < this.roulette.players.red.length; sp++) {

                                        let statePlayer = this.roulette.players.red[sp];

                                        if (dataPlayer.steamid === statePlayer.steamid) {

                                            existingPlayer = true;

                                            statePlayer.amount += dataPlayer.amount;

                                            this.roulette.players.red[sp] = statePlayer;
                                        }

                                    }

                                    if (!existingPlayer) {
                                        this.roulette.players.red.push(dataPlayer);
                                    }
                                }
                            } else if(side === 'black'){
                                for (let dp = 0; dp < playersData.length; dp++) {

                                    const dataPlayer = playersData[dp];
                                    let existingPlayer = false;

                                    for (let sp = 0; sp < this.roulette.players.black.length; sp++) {

                                        let statePlayer = this.roulette.players.black[sp];

                                        if (dataPlayer.steamid === statePlayer.steamid) {

                                            existingPlayer = true;

                                            statePlayer.amount += dataPlayer.amount;

                                            this.roulette.players.black[sp] = statePlayer;
                                        }

                                    }

                                    if (!existingPlayer) {
                                        this.roulette.players.black.push(dataPlayer);
                                    }
                                }
                            } else if(side === 'blue'){
                                for (let dp = 0; dp < playersData.length; dp++) {

                                    const dataPlayer = playersData[dp];
                                    let existingPlayer = false;

                                    for (let sp = 0; sp < this.roulette.players.blue.length; sp++) {

                                        let statePlayer = this.roulette.players.blue[sp];

                                        if (dataPlayer.steamid === statePlayer.steamid) {

                                            existingPlayer = true;

                                            statePlayer.amount += dataPlayer.amount;

                                            this.roulette.players.blue[sp] = statePlayer;
                                        }

                                    }

                                    if (!existingPlayer) {
                                        this.roulette.players.blue.push(dataPlayer);
                                    }
                                }
                            }

                            io.sockets.emit('event', {
                                action: 'roulette',
                                data: {
                                    id: this.roulette.id,
                                    hash: this.roulette.hash,
                                    players: playersData
                                }
                            })
                        })
                    })

                })
            })
        })
    });
}

function updateWinners(roll, players, callback){
    console.log(roll);
    if(roll === 15){
        //blue
        for(let p=0; p < players.blue.length; p++){
            const player = players.blue[p];
            console.log(player);
            connection.beginTransaction((err) => {
                if(err){
                    throw err;
                }
                const userWinnings = parseFloat(player.amount * 14).toFixed(2);
                connection.query('UPDATE users SET balance = (balance + '+userWinnings+') WHERE steamid = '+player.steamid, (err, result) => {
                    if(err){
                        return connection.rollback(() => {
                            throw err;
                        })
                    }
                    connection.commit((err) => {
                        if(err){
                            return connection.rollback(() => {
                                throw err;
                            })
                        }
                    })
                });
            })
        }
    } else if((roll % 2) === 0){
        //red
        for(let p=0; p < players.red.length; p++){
            const player = players.red[p];
            console.log(player);
            connection.beginTransaction((err) => {
                if(err){
                    throw err;
                }
                const userWinnings = parseFloat(player.amount * 2).toFixed(2);
                connection.query('UPDATE users SET balance = (balance + '+userWinnings+') WHERE steamid = '+player.steamid, (err, result) => {
                    if(err){
                        return connection.rollback(() => {
                            throw err;
                        })
                    }
                    connection.commit((err) => {
                        if(err){
                            return connection.rollback(() => {
                                throw err;
                            })
                        }
                    })
                });
            })
        }
    } else {
        //black
        for(let p=0; p < players.black.length; p++){
            const player = players.black[p];
            console.log(player);
            connection.beginTransaction((err) => {
                if(err){
                    throw err;
                }
                const userWinnings = parseFloat(player.amount * 2).toFixed(2);
                connection.query('UPDATE users SET balance = (balance + '+userWinnings+') WHERE steamid = '+player.steamid, (err, result) => {
                    if(err){
                        return connection.rollback(() => {
                            throw err;
                        })
                    }
                    connection.commit((err) => {
                        if(err){
                            return connection.rollback(() => {
                                throw err;
                            })
                        }
                    })
                });
            })
        }
    }
}

function rollGame() {
    updateWinners(this.roulette.roll, this.roulette.players);
    timerR.setTimeout(() => {
        connection.query('UPDATE roulette SET played = true WHERE id = '+this.roulette.id, (err, result) => {
            if(err){
                console.log(err);
            } else {
                newGame();
            }
        });
    }, '', '2s');
    io.sockets.emit('event', {action: 'roulette', data: {id: this.roulette.id, hash: this.roulette.hash, roll: this.roulette.roll, players: this.roulette.players}});
}






let online = 0;

onlineInt = setInterval(() => {
    io.sockets.emit('event', {action: 'online', online});
}, 20000);

io.on('connection', (socket) => {
    ++online;
    const cookies = cookie.parse(socket.handshake.headers['cookie']);
    console.log(this.roulette);
    if(!cookies.auth){
        //Not Logged in Send State
        socket.emit('event', {
            action: 'state',
            data: {
                roulette: {
                    id: this.roulette.id,
                    hash: this.roulette.hash,
                    players: this.roulette.players,
                    timeEnd: this.roulette.endTime
                },
                cf: {},
                jackpot: {
                    small: {},
                    medium: {},
                    large: {}
                },
                online
            }
        })
    } else {
        jwt.verify(cookies.auth, secret, (err, token) => {
            if(err){
                //Old Token, needs to login again.
                socket.emit('event', {
                    action: 'state',
                    data: {
                        roulette: {
                            id: this.roulette.id,
                            hash: this.roulette.hash,
                            players: this.roulette.players,
                            timeEnd: this.roulette.endTime
                        },
                        cf: {},
                        jackpot: {
                            small: {},
                            medium: {},
                            large: {}
                        },
                        online
                    }
                })
            } else {
                //Logged in
                socket.join(token.steamid);
                connection.query('SELECT * FROM users WHERE steamid = '+token.steamid, (err, result) => {
                    socket.emit('event', {
                        action: 'state',
                        data: {
                            auth: result[0],
                            roulette: {
                                id: this.roulette.id,
                                hash: this.roulette.hash,
                                players: this.roulette.players,
                                timeEnd: this.roulette.endTime
                            },
                            cf: {},
                            jackpot: {
                                small: {},
                                medium: {},
                                large: {}
                            },
                            online
                        }
                    });
                });
            }
        });
    }

    socket.on('roulette_addPlayer', (data) => {
        addPlayer(data.steamid, data.side, data.amount, this.items);
    });

    socket.on('disconnect', () => {
        --online;
    })
});

