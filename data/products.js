/* products.js — барааны өгөгдөл: өнгө, ангилал, хэмжээ, жагсаалт */
'use strict';

/* өнгөний нэр → hex */
const COL={Black:'#151515',White:'#ffffff',Red:'#d6001c',Blue:'#1e4fd8',Green:'#1a9b4b',Grey:'#8a8a8a',Orange:'#ff6a00',Yellow:'#ffd400',Navy:'#14213d',Pink:'#ff7eb6'};

/* өнгө солиход зурагт өгөх CSS filter */
const FILT={Black:'grayscale(1) brightness(.55) contrast(1.2)',White:'grayscale(1) brightness(1.25) contrast(.85)',Grey:'grayscale(1)',Red:'hue-rotate(-25deg) saturate(1.5)',Blue:'hue-rotate(170deg) saturate(1.3)',Green:'hue-rotate(95deg) saturate(1.3)',Orange:'hue-rotate(15deg) saturate(1.4)',Yellow:'hue-rotate(50deg) saturate(1.5)',Navy:'hue-rotate(190deg) brightness(.7)',Pink:'hue-rotate(-60deg) saturate(1.2) brightness(1.1)'};

const CATS=['basketball','volleyball','running','football','tennis','training','lifestyle','walking'];

/* ангилал бүрийн EU хэмжээ */
const SZ={basketball:[41,42,43,44,45,46,47],volleyball:[38,39,40,41,42,43,44,45],running:[39,40,41,42,43,44,45,46],football:[39,40,41,42,43,44,45],tennis:[38,39,40,41,42,43,44,45],training:[39,40,41,42,43,44,45,46],lifestyle:[38,39,40,41,42,43,44,45,46],walking:[38,39,40,41,42,43,44,45]};

/* [id, нэр, брэнд, ангилал, үнэ, хямдрал %, борлуулалт, нэмсэн огноо, unsplash зургийн id, өнгөнүүд]
   Өөрийн зургийг ашиглах бол зургийн id-г солино (эсвэл img/ хавтсанд хийгээд js/helpers.js доторх IMG-г засна) */
const RAW=[
[1,'Air Hoop Pro','Nike','basketball',140,0,860,'2025-05-28','1542291026-7eec264c27ff',['Red','Black','White']],
[2,'Dunk Rise Mid','Adidas','basketball',130,20,640,'2025-03-12','1549298916-b41d501d3772',['Black','Orange','Blue']],
[3,'Flow Surge 3','Under Armour','basketball',150,0,310,'2025-05-15','1595950653106-6c9ebd614d3a',['Grey','Black']],
[4,'Wave Spike FF','Mizuno','volleyball',120,15,420,'2025-02-02','1491553895911-0055eca6402d',['White','Blue','Pink']],
[5,'Sky Elite Pro','ASICS','volleyball',135,0,380,'2025-05-30','1460353581641-37baddab0fa2',['Navy','White','Yellow']],
[6,'Spike Air Court','Adidas','volleyball',110,25,270,'2025-01-20','1514989940723-e8e51635b782',['White','Green']],
[7,'Air Stride 40','Nike','running',160,0,1240,'2025-06-02','1600185365926-3a2ce3cdb9eb',['Orange','Black','Grey']],
[8,'Fresh Tempo v5','New Balance','running',145,10,980,'2025-04-18','1606107557195-0e29a4b5b4aa',['Grey','Blue','Pink']],
[9,'Velocity Run Nitro','Puma','running',125,30,720,'2025-02-25','1608231387042-66d1773070a5',['Yellow','Black','White']],
[10,'Future Strike FG','Puma','football',170,0,540,'2025-05-20','1525966222134-fcfa99b8ae77',['Orange','Black']],
[11,'Pitch Control X','Adidas','football',180,15,460,'2025-03-30','1556906781-9a412961c28c',['Blue','White','Yellow']],
[12,'Mercury Blaze Elite','Nike','football',195,0,610,'2025-06-01','1552346154-21d32810aba3',['Green','Black','Orange']],
[13,'Court Ace Clay','ASICS','tennis',130,0,350,'2025-04-02','1543508282-6319a3e2621f',['White','Blue']],
[14,'Club Serve Classic','Reebok','tennis',95,20,440,'2024-12-10','1579338559194-a162d19bf842',['White','Navy','Green']],
[15,'Rally Court 996','New Balance','tennis',120,0,290,'2025-05-05','1597045566677-8cf032ed6634',['Grey','White']],
[16,'HOVR Train Pro','Under Armour','training',115,10,510,'2025-04-25','1539185441755-769473a23570',['Black','Red','Grey']],
[17,'Nano Force 9','Reebok','training',135,0,400,'2025-05-22','1560769629-975ec94e6a86',['Black','White','Orange']],
[18,'Gym Flex TR','Nike','training',110,35,670,'2025-01-08','1575537302964-96cd47c06b1b',['Pink','Black','Blue']],
[19,'Street Classic OG','Adidas','lifestyle',100,0,1100,'2025-03-05','1587563871167-1ee9c731aefb',['White','Black','Green']],
[20,'Suede Retro 78','Puma','lifestyle',90,20,760,'2025-02-14','1603808033192-082d6919d3e1',['Red','Navy','Grey']],
[21,'Heritage 574 Core','New Balance','lifestyle',105,0,930,'2025-05-12','1491897554428-130a60dd4757',['Grey','Navy','Green']],
[22,'Walk Ease Comfort','Reebok','walking',85,25,330,'2025-01-30','1511556532299-8f662fc26c06',['Black','White']],
[23,'Stride Walk Lite','Mizuno','walking',95,0,260,'2025-05-26','1520256862855-398228c41684',['Grey','Blue','Black']],
[24,'Gel Stroll Cloud','ASICS','walking',100,10,300,'2025-06-03','1588361861040-ac9b1018f6d5',['White','Pink','Navy']],
[25,'Court Jump Elite','Nike','basketball',125,0,200,'2025-06-05','1542291026-7eec264c27ff',['Black','Blue']],
[26,'Hardwood Flash','Puma','basketball',140,0,428,'2025-02-18','1549298916-b41d501d3772',['Green','Yellow']],
[27,'Slam Dunk High','Adidas','basketball',155,0,656,'2025-03-22','1595950653106-6c9ebd614d3a',['Navy','White']],
[28,'Rim Rocket 2','Under Armour','basketball',155,0,884,'2025-06-04','1542291026-7eec264c27ff',['Red','Grey']],
[29,'Net Blaze Pro','Nike','volleyball',115,0,748,'2025-03-22','1491553895911-0055eca6402d',['Red','Grey']],
[30,'Block Master FF','Mizuno','volleyball',130,0,976,'2025-06-04','1460353581641-37baddab0fa2',['Orange','Pink']],
[31,'Serve Zone','ASICS','volleyball',130,0,304,'2025-06-05','1514989940723-e8e51635b782',['Black','Blue']],
[32,'Libero Swift','Adidas','volleyball',145,0,532,'2025-02-18','1491553895911-0055eca6402d',['Green','Yellow']],
[33,'Road Racer 5','ASICS','running',140,0,396,'2025-06-05','1600185365926-3a2ce3cdb9eb',['Green','Yellow']],
[34,'Cloud Pace Max','New Balance','running',140,0,624,'2025-02-18','1606107557195-0e29a4b5b4aa',['Navy','White']],
[35,'Tempo Boost X','Adidas','running',155,0,852,'2025-03-22','1608231387042-66d1773070a5',['Red','Grey']],
[36,'Marathon Pulse','Nike','running',170,0,1080,'2025-06-04','1600185365926-3a2ce3cdb9eb',['Orange','Pink']],
[37,'Turf Master Pro','Adidas','football',150,0,944,'2025-03-22','1525966222134-fcfa99b8ae77',['Orange','Pink']],
[38,'Goal Hunter FG','Nike','football',165,0,272,'2025-06-04','1556906781-9a412961c28c',['Black','Blue']],
[39,'Striker Edge','Puma','football',180,0,500,'2025-06-05','1552346154-21d32810aba3',['Green','Yellow']],
[40,'Aero Kick Elite','Mizuno','football',180,0,728,'2025-02-18','1525966222134-fcfa99b8ae77',['Navy','White']],
[41,'Baseline Pro','Nike','tennis',110,0,592,'2025-06-05','1543508282-6319a3e2621f',['Navy','White']],
[42,'Ace Smash Court','Adidas','tennis',125,0,820,'2025-02-18','1579338559194-a162d19bf842',['Red','Grey']],
[43,'Volley Spirit','ASICS','tennis',125,0,1048,'2025-03-22','1597045566677-8cf032ed6634',['Orange','Pink']],
[44,'Grand Slam 2','Reebok','tennis',140,0,376,'2025-06-04','1543508282-6319a3e2621f',['Black','Blue']],
[45,'Iron Grip TR','Under Armour','training',120,0,240,'2025-03-22','1539185441755-769473a23570',['Black','Blue']],
[46,'Power Lift Pro','Reebok','training',120,0,468,'2025-06-04','1560769629-975ec94e6a86',['Green','Yellow']],
[47,'Cross Fit Edge','Nike','training',135,0,696,'2025-06-05','1575537302964-96cd47c06b1b',['Navy','White']],
[48,'Flex Burn 3','Puma','training',150,0,924,'2025-02-18','1539185441755-769473a23570',['Red','Grey']],
[49,'Urban Walk 90','Nike','lifestyle',95,0,788,'2025-06-05','1587563871167-1ee9c731aefb',['Red','Grey']],
[50,'Retro Runner 82','New Balance','lifestyle',110,0,1016,'2025-02-18','1603808033192-082d6919d3e1',['Orange','Pink']],
[51,'City Low Classic','Adidas','lifestyle',125,0,344,'2025-03-22','1491897554428-130a60dd4757',['Black','Blue']],
[52,'Canvas Street','Puma','lifestyle',125,0,572,'2025-06-04','1587563871167-1ee9c731aefb',['Green','Yellow']],
[53,'Soft Step Daily','New Balance','walking',90,0,436,'2025-03-22','1511556532299-8f662fc26c06',['Green','Yellow']],
[54,'Park Stroll Air','Nike','walking',105,0,664,'2025-06-04','1520256862855-398228c41684',['Navy','White']],
[55,'Comfort Trail','Reebok','walking',105,0,892,'2025-06-05','1588361861040-ac9b1018f6d5',['Red','Grey']],
[56,'Easy Glide Walk','ASICS','walking',120,0,220,'2025-02-18','1511556532299-8f662fc26c06',['Orange','Pink']],
[57,'Fast Break Low','Under Armour','basketball',95,20,180,'2025-06-06','1549298916-b41d501d3772',['Black','Green','Navy']],
[58,'Paint King Mid','Mizuno','basketball',118,0,410,'2025-03-15','1595950653106-6c9ebd614d3a',['Blue','Yellow','White']],
[59,'Hoop Legacy','Reebok','basketball',99,15,640,'2025-01-25','1542291026-7eec264c27ff',['Orange','Black','Green']],
[60,'Smash Pro Lite','Under Armour','volleyball',89,10,699,'2025-04-12','1460353581641-37baddab0fa2',['Orange','Black','Green']],
[61,'Spike Wing 2','Mizuno','volleyball',99,25,929,'2025-02-09','1514989940723-e8e51635b782',['Pink','Blue','Yellow']],
[62,'Court Glide','Puma','volleyball',92,0,359,'2025-05-02','1491553895911-0055eca6402d',['Red','Orange','Black']],
[63,'Sprint Lite UA','Under Armour','running',79,30,418,'2025-06-06','1606107557195-0e29a4b5b4aa',['Red','Orange','Black']],
[64,'Wave Rider Neo','Mizuno','running',139,0,648,'2025-03-15','1608231387042-66d1773070a5',['Grey','Pink','Blue']],
[65,'Easy Mile 3','Reebok','running',72,20,878,'2025-01-25','1600185365926-3a2ce3cdb9eb',['Navy','Red','Orange']],
[66,'Pitch Rocket','Under Armour','football',129,10,937,'2025-04-12','1556906781-9a412961c28c',['Navy','Red','Orange']],
[67,'Morelia Turf','Mizuno','football',145,0,367,'2025-02-09','1552346154-21d32810aba3',['White','Grey','Pink']],
[68,'Dribble Zone FG','Reebok','football',99,25,597,'2025-05-02','1525966222134-fcfa99b8ae77',['Green','Navy','Red']],
[69,'Serve Master UA','Under Armour','tennis',89,15,656,'2025-06-06','1579338559194-a162d19bf842',['Green','Navy','Red']],
[70,'Wave Court Pro','Mizuno','tennis',115,0,886,'2025-03-15','1597045566677-8cf032ed6634',['Yellow','White','Grey']],
[71,'Net Rush','Puma','tennis',79,30,316,'2025-01-25','1543508282-6319a3e2621f',['Black','Green','Navy']],
[72,'Rush Train 5','Under Armour','training',99,0,375,'2025-04-12','1560769629-975ec94e6a86',['Black','Green','Navy']],
[73,'Gym Wave TR','Mizuno','training',92,20,605,'2025-02-09','1575537302964-96cd47c06b1b',['Blue','Yellow','White']],
[74,'Core Burn','New Balance','training',85,25,835,'2025-05-02','1539185441755-769473a23570',['Orange','Black','Green']],
[75,'Daily Street UA','Under Armour','lifestyle',72,15,894,'2025-06-06','1603808033192-082d6919d3e1',['Orange','Black','Green']],
[76,'Sportstyle Wave','Mizuno','lifestyle',88,0,324,'2025-03-15','1491897554428-130a60dd4757',['Pink','Blue','Yellow']],
[77,'Old School Low','Reebok','lifestyle',68,30,554,'2025-01-25','1587563871167-1ee9c731aefb',['Red','Orange','Black']],
[78,'Easy Path UA','Under Armour','walking',78,0,613,'2025-04-12','1520256862855-398228c41684',['Red','Orange','Black']],
[79,'Wave Walk Soft','Mizuno','walking',92,10,843,'2025-02-09','1588361861040-ac9b1018f6d5',['Grey','Pink','Blue']],
[80,'Trail Calm','Puma','walking',70,25,273,'2025-05-02','1511556532299-8f662fc26c06',['Navy','Red','Orange']]
];

/* массивыг объект болгох */
const P=RAW.map(r=>({id:r[0],name:r[1],brand:r[2],cat:r[3],price:r[4],disc:r[5],sales:r[6],added:r[7],img:r[8],colors:r[9],sizes:SZ[r[3]],ci:null}));

const BRANDS=[...new Set(P.map(p=>p.brand))].sort();
const byId=id=>P.find(p=>p.id==id);
const sale=p=>Math.round(p.price*(100-p.disc))/100;   /* хямдарсан үнэ */

/* хуудас бүрийн жагсаалт */
const NEWL=[...P].sort((a,b)=>b.added.localeCompare(a.added)).slice(0,8);   /* New Arrivals */
const BESTL=[...P].sort((a,b)=>b.sales-a.sales).slice(0,8);                 /* Best Sellers */
const SALEL=P.filter(p=>p.disc>0).sort((a,b)=>b.disc-a.disc);               /* Special Offers */
const NEWS=new Set(NEWL.map(p=>p.id)),BESTS=new Set(BESTL.map(p=>p.id));
