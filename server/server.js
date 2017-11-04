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
    async = require('async'),
    _ = require('underscore'),
    Promise = require('bluebird');

const port = process.env.PORT || 5000;


const secret = 'joaa2ssd';

const pool = require('node-querybuilder').QueryBuilder({
    host: "localhost",
    user: "root",
    password: "password",
    database: "hyperdraft",
    pool_size: 20
}, 'mysql', 'pool');

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'hyperdraft'
    },
    pool: {
        min: 0,
        max: 20
    }
});

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hyperdraft',
    connectionLimit: 20
});

const app = express();

const helper = require('./general')(connection, knex);
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

function addPlayer(steamid, side, amount, itemNames, items) {

    let user = null;
    let itemWinValue = 0;
    let itemWin = null;
    let potentialWinnings = 0;
    let userItemsValue = 0;
    let hasItems = false;


    if(amount === '' || amount === undefined){
        amount = 0;
    } else {
        if (isNaN(amount) && amount < 0.01) {
            io.sockets.in(steamid).emit('event', {
                action: 'error',
                data: {title: 'Roulette Error', message: 'Value must be more then 0.01 Credits'}
            });
        }
    }
    if (side !== 'black' && side !== 'red' && side !== 'blue') {
        io.sockets.in(steamid).emit('event', {
            action: 'error',
            data: {title: 'Roulette Error', message: 'Not a valid color selection'}
        });
    } else if(!_.isArray(itemNames)){
        io.sockets.in(steamid).emit('event', {
            action: 'error',
            data: {title: 'Roulette Error', message: 'Invalid State'}
        });
    }
    knex('users').select('*').where({steamid})
        .then(row => {
            const balance = row[0].balance;
            user = row[0];
            if(amount > balance){
                io.sockets.in(steamid).emit('event', {
                    action: 'error',
                    data: {title: 'Roulette Error', message: 'Not enough credits!'}
                });
            } else {
                if(itemNames.length > 0) {
                    knex.select('name').from('backpack').where({steamid, status: 'owned'}).whereIn('name', itemNames)
                        .then(rows => {
                            let hasItems = true;
                            const backpackItems = _.pluck(rows, 'name');
                            console.log(backpackItems);
                            async.each(itemNames, (item, callback) => {
                                const index = backpackItems.indexOf(item);
                                if(index === -1){
                                    hasItems = false;
                                }
                                callback();
                            }, err => {
                                console.log(hasItems);
                                if (!hasItems) {
                                    io.sockets.in(steamid).emit('event', {
                                        action: 'error',
                                        data: {title: 'Roulette Error', message: 'Skins not available!'}
                                    });
                                } else {
                                    knex.select('*').from('items').whereIn('name', itemNames)
                                        .then(rows => {
                                            Promise.each(rows, row => {
                                                userItemsValue += row.price;
                                            })
                                                .then(() => {
                                                    knex.select('*').from('roulettePlayers').where({
                                                        steamid: steamid,
                                                        rouletteId: this.roulette.id,
                                                        side: side
                                                    })
                                                        .then(rows => {
                                                            if (rows.length <= 0) {
                                                                const totalBet = parseFloat(amount) + parseFloat(userItemsValue);
                                                                if (side === 'blue') {
                                                                    potentialWinnings = totalBet * 14;
                                                                } else {
                                                                    potentialWinnings = totalBet * 2;
                                                                }
                                                                Promise.each(items, item => {
                                                                    if (item.price < potentialWinnings && item.price > itemWinValue) {
                                                                        itemWin = item;
                                                                        itemWinValue = item.price;
                                                                    }
                                                                })
                                                                    .then(() => {
                                                                        helper.roulleteTransaction(this.roulette, user, steamid, balance, totalBet, itemNames, amount, side, itemWin, (data) => {
                                                                            if (data.success) {
                                                                                const playersData = [{
                                                                                    steamid,
                                                                                    name: user.username,
                                                                                    avatar: user.avatar,
                                                                                    amount,
                                                                                    totalBet,
                                                                                    side,
                                                                                    itemNames,
                                                                                    item: itemWin.name,
                                                                                    itemPrice: itemWin.price
                                                                                }];
                                                                                if (side === 'red') {
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
                                                                                } else if (side === 'black') {
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
                                                                                } else if (side === 'blue') {
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
                                                                            } else {
                                                                                io.sockets.emit('event', {
                                                                                    action: 'error',
                                                                                    data: {
                                                                                        title: 'Roulette Error',
                                                                                        message: 'There was an error placing your bet, please try again'
                                                                                    }
                                                                                });
                                                                            }
                                                                        })
                                                                    })
                                                                    .catch(err => {
                                                                        console.log(err);
                                                                    })
                                                            } else {

                                                            }
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        })
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                })
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    const totalBet = amount;
                    if (side === 'blue') {
                        potentialWinnings = totalBet * 14;
                    } else {
                        potentialWinnings = totalBet * 2;
                    }
                    Promise.each(items, item => {
                        if (item.price < potentialWinnings && item.price > itemWinValue) {
                            itemWin = item;
                            itemWinValue = item.price;
                        }
                    })
                        .then(() => {
                            helper.roulleteTransaction(this.roulette, user, steamid, balance, totalBet, itemNames, amount, side, itemWin, (data) => {
                                if (data.success) {
                                    const playersData = [{
                                        steamid,
                                        name: user.username,
                                        avatar: user.avatar,
                                        amount,
                                        totalBet,
                                        side,
                                        itemNames,
                                        item: itemWin.name,
                                        itemPrice: itemWin.price
                                    }];
                                    if (side === 'red') {
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
                                    } else if (side === 'black') {
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
                                    } else if (side === 'blue') {
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
                                } else {
                                    io.sockets.emit('event', {
                                        action: 'error',
                                        data: {
                                            title: 'Roulette Error',
                                            message: 'There was an error placing your bet, please try again'
                                        }
                                    });
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function updateWinners(roll, players, callback){
    console.log(roll);
    if(roll === 15){
        //blue
        for(let p=0; p < players.blue.length; p++){
            const player = players.blue[p];
            console.log(player);

            const userWinnings = (parseFloat(player.totalBet * 14) - player.itemPrice).toFixed(2);

            helper.processRouletteWinner(player, userWinnings, data => {
                if(!data.success){
                    console.log('blue winner error');
                }
            })
        }
    } else if((roll % 2) === 0){
        //red
        for(let p=0; p < players.red.length; p++){
            const player = players.red[p];
            console.log(player);

            const userWinnings = (parseFloat(player.totalBet * 2) - player.itemPrice).toFixed(2);

            helper.processRouletteWinner(player, userWinnings, data => {
                if(!data.success){
                    console.log('red winner error');
                }
            });
        }
    } else {
        //black
        for(let p=0; p < players.black.length; p++){
            const player = players.black[p];
            console.log(player);

            const userWinnings = (parseFloat(player.totalBet * 2) - player.itemPrice).toFixed(2);

            helper.processRouletteWinner(player, userWinnings, data => {
                if(!data.success){
                    console.log('black winner error');
                }
            });
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
    const limit = 3000; //ms
    let points = 0;
    const heartBeat = setInterval(() => {
        if(points !== 0){
            --points;
        }
    }, limit);
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
        if(points === 0) {
            ++points;
            addPlayer(data.steamid, data.side, data.amount, data.items, this.items);
        } else {
            socket.emit('event', {action: 'error', data: {title: 'Roulette Error', message: 'You may only bet once every 3 seconds'}});
        }
    });

    socket.on('disconnect', () => {
        --online;
    })
});

