#!/usr/bin/env python3
"""Generates expanded seed_database.py with 45+ plants and 65+ diseases"""
import os
import json
import json

PLANTS = [
    # Cereals
    ('rice','Rice','Oryza sativa','cereals','Cereal Crops','Staple cereal grain crop grown in flooded fields'),
    ('wheat','Wheat','Triticum aestivum','cereals','Cereal Crops','Major cereal grain used for bread and pasta'),
    ('corn','Corn/Maize','Zea mays','cereals','Cereal Crops','Versatile cereal crop for food, feed, industry'),
    ('barley','Barley','Hordeum vulgare','cereals','Cereal Crops','Hardy cereal grain used for brewing and animal feed'),
    ('sorghum','Sorghum','Sorghum bicolor','cereals','Cereal Crops','Drought-tolerant cereal grain for food and fodder'),
    ('millets','Millets','Pennisetum glaucum','cereals','Cereal Crops','Small-seeded grains rich in nutrients'),
    ('oats','Oats','Avena sativa','cereals','Cereal Crops','Nutritious cereal grain used for oatmeal and animal feed'),
    # Vegetables
    ('tomato','Tomato','Solanum lycopersicum','vegetables','Vegetable Crops','Popular fruit vegetable rich in vitamins'),
    ('potato','Potato','Solanum tuberosum','vegetables','Vegetable Crops','Starchy tuber vegetable and important food crop'),
    ('onion','Onion','Allium cepa','vegetables','Vegetable Crops','Pungent vegetable grown for its edible bulb'),
    ('chili','Chili Pepper','Capsicum annuum','vegetables','Vegetable Crops','Spicy fruit used as spice and vegetable'),
    ('cabbage','Cabbage','Brassica oleracea var. capitata','vegetables','Vegetable Crops','Leafy vegetable used in salads and cooking'),
    ('cauliflower','Cauliflower','Brassica oleracea var. botrytis','vegetables','Vegetable Crops','White flowering vegetable rich in vitamins'),
    ('spinach','Spinach','Spinacia oleracea','vegetables','Vegetable Crops','Nutrient-dense leafy green vegetable'),
    ('broccoli','Broccoli','Brassica oleracea var. italica','vegetables','Vegetable Crops','Cruciferous vegetable rich in vitamins C and K'),
    ('peas','Peas','Pisum sativum','vegetables','Vegetable Crops','Legume vegetable high in protein and fiber'),
    ('beans','Beans','Phaseolus vulgaris','vegetables','Vegetable Crops','Common legume crop rich in protein'),
    ('cucumber','Cucumber','Cucumis sativus','vegetables','Vegetable Crops','Refreshing vine vegetable used in salads'),
    ('pumpkin','Pumpkin','Cucurbita pepo','vegetables','Vegetable Crops','Nutritious squash used in cooking and decoration'),
    ('carrot','Carrot','Daucus carota','vegetables','Vegetable Crops','Root vegetable rich in beta-carotene'),
    ('garlic','Garlic','Allium sativum','vegetables','Vegetable Crops','Pungent bulb used as flavoring and medicine'),
    ('eggplant','Eggplant/Brinjal','Solanum melongena','vegetables','Vegetable Crops','Purple-skinned fruit vegetable'),
    ('lettuce','Lettuce','Lactuca sativa','vegetables','Vegetable Crops','Leafy green used primarily for salads'),
    # Fruits
    ('apple','Apple','Malus domestica','fruits','Fruit Crops','Popular tree fruit rich in fiber and vitamins'),
    ('mango','Mango','Mangifera indica','fruits','Fruit Crops','Tropical stone fruit known as king of fruits'),
    ('banana','Banana','Musa acuminata','fruits','Fruit Crops','Elongated edible fruit from herbaceous plants'),
    ('citrus','Citrus','Citrus spp.','fruits','Fruit Crops','Fruits including oranges, lemons, and limes'),
    ('grape','Grape','Vitis vinifera','fruits','Fruit Crops','Fruit grown on vines for juice, wine, table use'),
    ('strawberry','Strawberry','Fragaria ananassa','fruits','Fruit Crops','Sweet red berry fruit grown close to ground'),
    ('papaya','Papaya','Carica papaya','fruits','Fruit Crops','Tropical fruit rich in vitamins and enzymes'),
    ('pomegranate','Pomegranate','Punica granatum','fruits','Fruit Crops','Antioxidant-rich fruit with juicy seed sacs'),
    ('guava','Guava','Psidium guajava','fruits','Fruit Crops','Tropical fruit extremely rich in vitamin C'),
    ('watermelon','Watermelon','Citrullus lanatus','fruits','Fruit Crops','Large refreshing fruit with high water content'),
    ('pineapple','Pineapple','Ananas comosus','fruits','Fruit Crops','Tropical fruit with sweet-tart flavor'),
    ('coconut','Coconut','Cocos nucifera','fruits','Fruit Crops','Tropical palm fruit used for water, oil, meat'),
    ('peach','Peach','Prunus persica','fruits','Fruit Crops','Stone fruit with fuzzy skin and sweet flesh'),
    # Cash Crops
    ('cotton','Cotton','Gossypium hirsutum','cash_crops','Cash Crops','Soft fiber grown around seeds of cotton plants'),
    ('soybean','Soybean','Glycine max','cash_crops','Cash Crops','Leguminous crop rich in protein and oil'),
    ('sugarcane','Sugarcane','Saccharum officinarum','cash_crops','Cash Crops','Tall perennial grass for sugar and ethanol'),
    ('tea','Tea','Camellia sinensis','cash_crops','Cash Crops','Evergreen shrub cultivated for beverage production'),
    ('coffee','Coffee','Coffea arabica','cash_crops','Cash Crops','Tropical shrub cultivated for coffee beans'),
    ('tobacco','Tobacco','Nicotiana tabacum','cash_crops','Cash Crops','Broad-leaf plant of the nightshade family'),
    ('groundnut','Groundnut','Arachis hypogaea','cash_crops','Cash Crops','Legume crop grown for edible seeds (peanuts)'),
    ('mustard','Mustard','Brassica juncea','cash_crops','Cash Crops','Oilseed crop used for oil and condiment production'),
    ('rubber','Rubber','Hevea brasiliensis','cash_crops','Cash Crops','Tropical tree cultivated for latex production'),
    ('jute','Jute','Corchorus capsularis','cash_crops','Cash Crops','Fiber crop used for making burlap and rope'),
]

# (disease_name, description, severity, pathogen, pathogen_type, plant_id, symptoms_list, treatments_list)
# symptoms: [(category, description, severity, stage), ...]
# treatments: [(type, method, description, effectiveness, timing, precautions), ...]

DISEASES = [
    # Rice
    ('Rice Blast','Destructive disease causing lesions on leaves, nodes, panicles','High','Pyricularia oryzae','Fungal','rice',
     [('leaf','Spindle-shaped spots with grey center and brown margin','moderate','early'),('leaf','Lesions may coalesce causing leaf death','severe','late'),('stem','Node infection causing stem breakage','severe','middle')],
     [('chemical','Fungicide spray','Apply tricyclazole or carbendazim','high','At first sign of symptoms','Follow label dosage'),('cultural','Water management','Avoid excessive nitrogen and maintain proper water levels','medium','Throughout growing season','Monitor field drainage'),('organic','Neem oil spray','Apply neem oil solution weekly','medium','Early morning or evening','Test on small area first')]),
    ('Bacterial Leaf Blight','Serious bacterial disease causing wilting and leaf drying','High','Xanthomonas oryzae','Bacterial','rice',
     [('leaf','Water-soaked lesions along leaf margins','mild','early'),('leaf','Yellow to brown stripes with wavy margins','moderate','middle'),('leaf','Entire leaf may turn yellow and die','severe','late')],
     [('chemical','Copper-based bactericide','Apply copper oxychloride or copper hydroxide','high','At first symptoms','Avoid during flowering'),('cultural','Resistant varieties','Plant resistant rice varieties','high','At planting','Choose varieties for local conditions')]),
    ('Rice Sheath Blight','Fungal disease causing oval lesions on leaf sheaths','Medium','Rhizoctonia solani','Fungal','rice',
     [('stem','Oval or irregular greenish-grey lesions on sheaths','moderate','early'),('leaf','Lesions enlarge and coalesce causing leaf dieback','severe','middle')],
     [('chemical','Fungicide application','Apply validamycin or hexaconazole','high','At tillering stage','Rotate fungicides'),('cultural','Spacing','Maintain proper plant spacing for air circulation','medium','At planting','Avoid dense planting')]),
    # Wheat
    ('Wheat Rust (Leaf Rust)','Common fungal disease with orange-brown pustules','High','Puccinia triticina','Fungal','wheat',
     [('leaf','Small circular orange-brown pustules','moderate','early'),('leaf','Pustules break through epidermis exposing orange spores','severe','middle'),('leaf','Leaves turn yellow and die prematurely','severe','late')],
     [('chemical','Fungicide application','Apply triazoles or strobilurins','high','At first appearance','Ensure thorough coverage'),('cultural','Resistant varieties','Grow varieties with genetic resistance','high','Before planting','New races can overcome resistance')]),
    ('Wheat Powdery Mildew','White powdery fungal growth on wheat leaves','Medium','Blumeria graminis','Fungal','wheat',
     [('leaf','White powdery patches on upper leaf surfaces','moderate','early'),('leaf','Patches turn grey-brown as disease progresses','moderate','middle'),('stem','Can spread to stems and heads','severe','late')],
     [('chemical','Fungicide spray','Apply sulfur-based or triazole fungicides','high','At first symptoms','Apply preventively in humid conditions'),('cultural','Ventilation','Avoid overcrowding for better air circulation','medium','At planting','Proper row spacing')]),
    # Corn
    ('Corn Leaf Blight','Northern corn leaf blight causing cigar-shaped lesions','High','Exserohilum turcicum','Fungal','corn',
     [('leaf','Cigar-shaped grey-green lesions 1 to 6 inches long','moderate','early'),('leaf','Lesions turn tan as they mature','severe','middle'),('whole','Significant yield reduction if upper leaves affected','severe','late')],
     [('chemical','Foliar fungicide','Apply azoxystrobin or propiconazole','high','At tasseling if conditions are favorable','Use resistant hybrids first'),('cultural','Crop rotation','Rotate with non-host crops','medium','Yearly','Remove crop debris')]),
    ('Corn Smut','Fungal disease producing large grey galls on ears','Medium','Ustilago maydis','Fungal','corn',
     [('fruit','Large grey-white galls on ears and tassels','severe','middle'),('stem','Galls can form on stalks and leaves','moderate','middle'),('whole','Galls rupture releasing black spores','severe','late')],
     [('cultural','Resistant hybrids','Plant smut-resistant corn hybrids','high','At planting','Check local recommendations'),('cultural','Sanitation','Remove and destroy galls before they rupture','medium','During growth','Do not compost infected material')]),
    # Barley
    ('Barley Net Blotch','Common foliar disease with net-like lesions','Medium','Pyrenophora teres','Fungal','barley',
     [('leaf','Dark brown net-like pattern on leaves','moderate','early'),('leaf','Leaves turn yellow and die back','severe','middle')],
     [('chemical','Fungicide spray','Apply propiconazole or pyraclostrobin','high','At early symptoms','Rotate fungicide groups'),('cultural','Crop rotation','Rotate with non-cereal crops for 2 years','high','Planning phase','Remove barley stubble')]),
    # Sorghum
    ('Sorghum Anthracnose','Major disease affecting leaves and grain','High','Colletotrichum sublineola','Fungal','sorghum',
     [('leaf','Small circular to elliptical spots with tan centers','moderate','early'),('fruit','Grain mold with discolored and shriveled kernels','severe','late')],
     [('chemical','Fungicide application','Apply azoxystrobin or propiconazole','high','At boot to heading stage','Follow label rates'),('cultural','Resistant varieties','Plant anthracnose-resistant sorghum varieties','high','At planting','Rotate varieties')]),
    # Millets
    ('Downy Mildew (Millets)','Systemic disease causing stunting and leaf symptoms','High','Sclerospora graminicola','Fungal','millets',
     [('leaf','Chlorotic streaks running parallel to veins','moderate','early'),('leaf','White downy growth on leaf undersides','severe','middle'),('whole','Stunted growth with malformed heads','severe','late')],
     [('chemical','Seed treatment','Treat seeds with metalaxyl','high','Before planting','Use recommended dosage'),('cultural','Resistant varieties','Grow downy mildew resistant cultivars','high','At planting','Use certified seeds')]),
    # Oats
    ('Oat Crown Rust','Most important disease of oats causing orange pustules','High','Puccinia coronata','Fungal','oats',
     [('leaf','Orange-yellow pustules on leaf surfaces','moderate','early'),('leaf','Severely infected leaves turn yellow and die','severe','late')],
     [('chemical','Fungicide spray','Apply triazole fungicides','high','At flag leaf emergence','Monitor fields regularly'),('cultural','Resistant varieties','Plant crown rust-resistant oat varieties','high','At planting','Check regional recommendations')]),
    # Tomato
    ('Early Blight (Tomato)','Common fungal disease with concentric ring spots','Medium','Alternaria solani','Fungal','tomato',
     [('leaf','Brown spots with concentric rings (bulls eye)','moderate','early'),('leaf','Lower leaves affected first, yellowing around spots','moderate','middle'),('fruit','Dark sunken spots on fruit near stem end','severe','late')],
     [('chemical','Fungicide spray','Apply chlorothalonil or mancozeb','high','Preventively or at first symptoms','Rotate fungicide classes'),('cultural','Crop rotation','Rotate with non-solanaceous crops for 2-3 years','high','Next growing season','Avoid tomatoes, potatoes, peppers in same area'),('organic','Baking soda spray','Mix 1 tsp baking soda per quart water','medium','Weekly applications','Test on small area first')]),
    ('Late Blight (Tomato)','Devastating disease that rapidly kills plants','High','Phytophthora infestans','Oomycete','tomato',
     [('leaf','Water-soaked spots that turn brown and black','severe','early'),('leaf','White fuzzy growth on undersides of leaves','severe','middle'),('fruit','Brown greasy-looking spots on fruit','severe','late')],
     [('chemical','Systemic fungicide','Apply metalaxyl or dimethomorph','high','Preventively in high-risk conditions','Apply before rain'),('cultural','Remove infected plants','Immediately remove and destroy infected plants','high','As soon as symptoms appear','Do not compost')]),
    ('Tomato Mosaic Virus','Viral disease causing mottled and distorted leaves','Medium','Tobacco mosaic virus','Viral','tomato',
     [('leaf','Light and dark green mottled pattern on leaves','moderate','early'),('leaf','Leaves may curl, distort, or become fern-like','moderate','middle'),('fruit','Fruits may show uneven ripening and internal browning','moderate','late')],
     [('cultural','Sanitation','Remove infected plants, wash hands and tools','high','Immediately on detection','Avoid tobacco products near plants'),('cultural','Resistant varieties','Plant TMV-resistant tomato varieties','high','At planting','Check seed catalog for resistance')]),
    # Potato
    ('Early Blight (Potato)','Fungal disease affecting foliage and tubers','Medium','Alternaria solani','Fungal','potato',
     [('leaf','Brown spots with concentric rings on older leaves','moderate','early'),('tuber','Dark sunken spots on tuber surface','moderate','middle'),('stem','Brown lesions on stems and petioles','moderate','middle')],
     [('chemical','Preventive fungicide','Apply mancozeb or chlorothalonil regularly','high','Start when plants are 6 inches tall','Continue every 7-14 days'),('cultural','Proper nutrition','Maintain adequate potassium, avoid excess nitrogen','medium','Throughout growing season','Soil test for nutrient needs')]),
    ('Late Blight (Potato)','Devastating oomycete disease of potatoes','High','Phytophthora infestans','Oomycete','potato',
     [('leaf','Water-soaked dark green to black lesions','severe','early'),('tuber','Reddish-brown granular rot extending into tuber flesh','severe','late'),('stem','Dark brown to black stem lesions','severe','middle')],
     [('chemical','Systemic fungicide','Apply metalaxyl-M or cymoxanil','high','Preventively during high risk','Apply before wet weather'),('cultural','Resistant varieties','Plant blight-resistant potato varieties','high','At planting','Monitor for new pathogen strains')]),
    # Onion
    ('Purple Blotch','Major fungal disease of onion leaves','Medium','Alternaria porri','Fungal','onion',
     [('leaf','Small water-soaked lesions with purple centers','moderate','early'),('leaf','Lesions enlarge with concentric zones','moderate','middle'),('leaf','Leaves may break or die back from tip','severe','late')],
     [('chemical','Fungicide spray','Apply Mancozeb or Chlorothalonil','high','Preventive or at first symptoms','Rotate fungicides'),('cultural','Crop rotation','Rotate with non-host crops like cereals','high','Yearly','Avoid planting near infected fields')]),
    ('Onion Downy Mildew','Causes pale green to yellowish patches','Medium','Peronospora destructor','Oomycete','onion',
     [('leaf','Pale green elongated patches on leaves','moderate','early'),('leaf','Violet-grey fuzzy growth in humid conditions','severe','middle')],
     [('chemical','Fungicide spray','Apply metalaxyl or copper-based fungicides','high','At first detection','Apply in dry conditions'),('cultural','Air circulation','Improve spacing and drainage','medium','At planting','Avoid overhead irrigation')]),
    # Chili
    ('Chili Anthracnose','Causes fruit rot and leaf spots in chili peppers','High','Colletotrichum capsici','Fungal','chili',
     [('fruit','Sunken circular lesions with concentric rings on fruits','severe','middle'),('leaf','Small brown spots on leaves','moderate','early'),('fruit','Fruits shrivel and dry up','severe','late')],
     [('chemical','Fungicide spray','Apply carbendazim or mancozeb','high','At flowering and fruit set','Alternate fungicides'),('cultural','Seed treatment','Use disease-free certified seeds','high','Before planting','Hot water seed treatment')]),
    # Cabbage
    ('Black Rot (Cabbage)','Bacterial disease causing V-shaped yellow lesions','High','Xanthomonas campestris','Bacterial','cabbage',
     [('leaf','V-shaped yellow to tan lesions from leaf margins','moderate','early'),('leaf','Veins within lesions turn black','severe','middle'),('whole','Head may rot and become unmarketable','severe','late')],
     [('cultural','Certified seed','Use hot-water treated, disease-free seed','high','Before planting','Treat at 50°C for 30 minutes'),('chemical','Copper spray','Apply copper hydroxide','medium','Preventively','Limited effectiveness once established')]),
    ('Clubroot','Soil-borne disease causing swollen distorted roots','High','Plasmodiophora brassicae','Protist','cabbage',
     [('root','Swollen club-shaped roots','severe','middle'),('leaf','Wilting during hot days even with adequate moisture','moderate','early'),('whole','Stunted growth and yellowing of leaves','severe','late')],
     [('cultural','Lime application','Raise soil pH above 7.2 with lime','high','Before planting','Test soil pH regularly'),('cultural','Long rotation','Rotate with non-brassica crops for 7+ years','high','Planning phase','Soil pathogen persists for years')]),
    # Cauliflower
    ('Cauliflower Downy Mildew','Causes purplish-brown spots on leaves','Medium','Peronospora parasitica','Oomycete','cauliflower',
     [('leaf','Purplish-brown irregular spots on upper leaf surface','moderate','early'),('leaf','White-grey downy growth on undersides','moderate','middle')],
     [('chemical','Fungicide spray','Apply metalaxyl or mancozeb','high','At first signs','Use preventively in cool wet weather'),('cultural','Spacing','Improve air circulation with wider spacing','medium','At planting','Avoid overhead irrigation')]),
    # Spinach
    ('Spinach Downy Mildew','Yellow patches with purple-grey mold','Medium','Peronospora farinosa','Oomycete','spinach',
     [('leaf','Yellow patches on upper leaf surface','moderate','early'),('leaf','Purple-grey fuzzy mold on leaf undersides','moderate','middle')],
     [('cultural','Resistant varieties','Plant downy mildew resistant spinach cultivars','high','At planting','New races may overcome resistance'),('chemical','Fungicide spray','Apply copper-based fungicides','medium','At first detection','Follow pre-harvest interval')]),
    # Broccoli
    ('Broccoli Head Rot','Bacterial soft rot of broccoli heads','Medium','Erwinia spp.','Bacterial','broccoli',
     [('fruit','Soft watery brown rot on florets','severe','middle'),('fruit','Foul odor from infected heads','severe','late')],
     [('cultural','Drainage','Ensure good field drainage','medium','At planting','Avoid overhead irrigation'),('cultural','Harvest timing','Harvest at proper maturity','high','At harvest','Do not delay harvest in wet weather')]),
    # Peas
    ('Pea Powdery Mildew','White powdery coating on leaves and pods','Medium','Erysiphe pisi','Fungal','peas',
     [('leaf','White powdery patches on leaves, stems, pods','moderate','middle'),('fruit','Pods may be distorted and discolored','moderate','late')],
     [('chemical','Fungicide spray','Apply sulfur or triadimefon','high','At first symptoms','Apply to both sides of leaves'),('cultural','Resistant varieties','Plant powdery mildew resistant pea varieties','high','At planting','Early planting reduces risk')]),
    # Beans
    ('Bean Rust','Orange-brown pustules on bean leaves','Medium','Uromyces appendiculatus','Fungal','beans',
     [('leaf','Small reddish-brown to rust pustules on undersides','moderate','early'),('leaf','Upper surface shows yellow spots corresponding to pustules','moderate','middle')],
     [('chemical','Fungicide spray','Apply triazole or strobilurin fungicides','high','At first symptoms','Repeat every 7-14 days'),('cultural','Resistant varieties','Plant rust-resistant bean varieties','high','At planting','Rotate varieties')]),
    ('Bean Anthracnose','Dark sunken lesions on pods and stems','Medium','Colletotrichum lindemuthianum','Fungal','beans',
     [('fruit','Dark sunken lesions with pink spore masses on pods','severe','middle'),('stem','Dark streaks on stems','moderate','early')],
     [('cultural','Certified seed','Use disease-free seed','high','At planting','Avoid saving seed from infected crops'),('chemical','Fungicide spray','Apply mancozeb or chlorothalonil','high','Preventively','Start before flowering')]),
    # Cucumber
    ('Cucumber Downy Mildew','Yellow angular spots on cucumber leaves','High','Pseudoperonospora cubensis','Oomycete','cucumber',
     [('leaf','Yellow angular spots limited by leaf veins','moderate','early'),('leaf','Purple-grey fuzzy growth on undersides','severe','middle'),('leaf','Leaves turn brown and die rapidly','severe','late')],
     [('chemical','Fungicide spray','Apply mancozeb or metalaxyl','high','At first symptoms','Apply every 5-7 days in wet weather'),('cultural','Resistant varieties','Plant downy mildew resistant varieties','high','At planting','Look for DMR varieties')]),
    ('Cucumber Mosaic Virus','Viral disease causing leaf mottling and distortion','Medium','Cucumber mosaic virus','Viral','cucumber',
     [('leaf','Green and yellow mottled mosaic pattern on leaves','moderate','early'),('fruit','Warty misshapen fruits','moderate','late'),('whole','Stunted plant growth','moderate','middle')],
     [('cultural','Aphid control','Control aphid vectors with reflective mulches','medium','Throughout season','Monitor aphid populations'),('cultural','Remove infected plants','Rogue out infected plants immediately','high','On detection','Do not touch healthy plants after handling infected ones')]),
    # Pumpkin
    ('Powdery Mildew (Pumpkin)','White powdery growth on pumpkin leaves','Medium','Podosphaera xanthii','Fungal','pumpkin',
     [('leaf','White powdery spots that expand to cover leaf surfaces','moderate','early'),('leaf','Leaves yellow, then brown and die','severe','late')],
     [('chemical','Fungicide spray','Apply sulfur or myclobutanil','high','At first symptoms','Repeat every 7-10 days'),('organic','Milk spray','Spray 40% milk solution','medium','Weekly','Apply in morning')]),
    # Carrot
    ('Carrot Leaf Blight','Brown lesions on carrot leaves and petioles','Medium','Alternaria dauci','Fungal','carrot',
     [('leaf','Small dark brown lesions on leaf margins','moderate','early'),('leaf','Leaves curl, turn yellow and die back','severe','middle')],
     [('chemical','Fungicide spray','Apply chlorothalonil or iprodione','high','At first symptoms','Begin applications early'),('cultural','Crop rotation','Rotate with non-umbelliferous crops','medium','Yearly','3-year minimum rotation')]),
    # Garlic
    ('Garlic White Rot','Devastating soil-borne fungal disease of garlic','High','Sclerotium cepivorum','Fungal','garlic',
     [('root','White fluffy mycelium on roots and bulb base','severe','middle'),('leaf','Yellowing and wilting of oldest leaves first','moderate','early'),('whole','Bulbs rot and plants collapse','severe','late')],
     [('cultural','Long rotation','Do not plant alliums for 15+ years in infected soil','high','Planning','Pathogen survives decades in soil'),('cultural','Clean planting material','Use certified disease-free cloves','high','At planting','Inspect cloves carefully')]),
    # Eggplant
    ('Eggplant Wilt','Bacterial wilt causing rapid plant death','High','Ralstonia solanacearum','Bacterial','eggplant',
     [('leaf','Lower leaves wilt first, then entire plant','severe','early'),('stem','Brown discoloration of vascular tissue inside stem','severe','middle'),('whole','Rapid death of entire plant','severe','late')],
     [('cultural','Resistant rootstocks','Graft onto resistant rootstock','high','At transplanting','Use certified rootstock'),('cultural','Soil solarization','Cover moist soil with plastic for 4-6 weeks','medium','Before planting','Works best in hot sunny weather')]),
    # Lettuce
    ('Lettuce Drop','White mold disease causing plant collapse','Medium','Sclerotinia sclerotiorum','Fungal','lettuce',
     [('stem','Water-soaked lesions at stem base','moderate','early'),('whole','White cottony mold on stem and leaves','severe','middle'),('whole','Plant collapses and dies','severe','late')],
     [('chemical','Fungicide soil drench','Apply iprodione or boscalid','medium','At planting','Limited effectiveness'),('cultural','Crop rotation','Rotate with non-host crops like cereals','medium','Yearly','Remove crop debris thoroughly')]),
    # Apple
    ('Apple Scab','Major fungal disease with scabby lesions','Medium','Venturia inaequalis','Fungal','apple',
     [('leaf','Olive-green to brown circular spots on leaves','moderate','early'),('fruit','Dark scabby spots on fruit surface','severe','middle'),('leaf','Premature leaf drop in severe cases','severe','late')],
     [('chemical','Fungicide program','Apply captan, myclobutanil or strobilurin fungicides','high','Start at green tip stage','Follow spray schedule'),('cultural','Resistant varieties','Plant scab-resistant apple varieties','high','At planting','Choose for local climate'),('cultural','Sanitation','Remove fallen leaves and infected fruit','medium','Fall cleanup','Destroy infected material')]),
    ('Fire Blight (Apple)','Bacterial disease causing blackened shoots','High','Erwinia amylovora','Bacterial','apple',
     [('flower','Blossoms wilt and turn brown-black','severe','early'),('stem','Shoots bend into shepherds crook shape','severe','middle'),('stem','Cankers with bacterial ooze on branches','severe','late')],
     [('chemical','Antibiotic spray','Apply streptomycin during bloom','high','At 60-70% bloom','Follow resistance management'),('cultural','Pruning','Cut infected branches 12 inches below symptoms','high','During dry weather','Sterilize tools between cuts')]),
    # Mango
    ('Anthracnose (Mango)','Most common mango disease with black spots','High','Colletotrichum gloeosporioides','Fungal','mango',
     [('leaf','Small brown spots that coalesce into larger lesions','moderate','early'),('fruit','Sunken black spots on ripening fruit','severe','late'),('flower','Blighting of flower panicles','severe','middle')],
     [('chemical','Copper spray','Apply copper-based fungicides','high','Pre-flowering and fruit set','Avoid excessive spray in hot weather'),('cultural','Pruning','Remove dead branches and thin canopy','medium','After harvest','Sterilize pruning tools')]),
    ('Mango Powdery Mildew','White powdery growth on flowers and young fruits','Medium','Oidium mangiferae','Fungal','mango',
     [('flower','White powdery coating on flower panicles','moderate','early'),('fruit','Young fruits affected and may drop','severe','middle'),('leaf','White patches on young leaves','moderate','early')],
     [('chemical','Sulfur spray','Apply wettable sulfur','high','At first flowering','Avoid spraying in temperatures above 35°C'),('organic','Neem oil','Apply 2% neem oil solution','medium','At flowering','Repeat every 10-15 days')]),
    # Banana
    ('Panama Disease','Fusarium wilt causing banana plant death','High','Fusarium oxysporum f.sp. cubense','Fungal','banana',
     [('leaf','Yellowing of older leaves starting from margins','moderate','early'),('stem','Splitting of pseudostem base','severe','middle'),('stem','Reddish-brown discoloration of vascular tissue','severe','middle')],
     [('cultural','Resistant varieties','Plant Fusarium wilt resistant varieties like Cavendish','high','At planting','TR4 can overcome Cavendish resistance'),('cultural','Clean planting material','Use tissue culture plantlets','high','At planting','Quarantine measures essential')]),
    ('Banana Sigatoka','Leaf spot disease reducing photosynthesis','High','Mycosphaerella musicola','Fungal','banana',
     [('leaf','Small yellow-green streaks on upper leaf surface','moderate','early'),('leaf','Streaks enlarge to brown oval spots with grey centers','severe','middle'),('leaf','Extensive leaf death reducing bunch weight','severe','late')],
     [('chemical','Fungicide spray','Apply propiconazole or mancozeb','high','At early symptoms','Rotate fungicide groups'),('cultural','Leaf removal','Remove severely infected leaves','medium','Throughout season','Destroy removed leaves')]),
    # Citrus
    ('Citrus Canker','Bacterial disease with raised corky lesions','High','Xanthomonas citri','Bacterial','citrus',
     [('leaf','Yellow halo surrounding small raised corky lesions','moderate','early'),('fruit','Scabby crater-like lesions on fruit skin','severe','middle'),('stem','Raised lesions on twigs and young branches','moderate','middle')],
     [('chemical','Copper bactericide','Frequent sprays of copper-based compounds','medium','During high humidity periods','Does not cure existing cankers'),('cultural','Eradication','Remove and destroy infected trees','high','Immediately on detection','Essential for preventing spread')]),
    ('Citrus Greening (HLB)','Devastating bacterial disease spread by psyllids','High','Candidatus Liberibacter','Bacterial','citrus',
     [('leaf','Blotchy mottling with yellow patches asymmetric on leaf','severe','early'),('fruit','Lopsided small fruits with aborted seeds','severe','middle'),('fruit','Fruits remain green at stem end when ripe','moderate','late')],
     [('cultural','Psyllid control','Control Asian citrus psyllid vectors','high','Year-round','Use systemic insecticides'),('cultural','Remove infected trees','Remove and destroy HLB-positive trees','high','On diagnosis','No cure exists currently')]),
    # Grape
    ('Downy Mildew (Grape)','Important disease attacking all green vine parts','High','Plasmopara viticola','Oomycete','grape',
     [('leaf','Yellowish oily spots on upper leaf surface','moderate','early'),('leaf','White cottony fungal growth on underside','severe','middle'),('fruit','Berries turn brown, wither and drop off','severe','late')],
     [('chemical','Fungicide spray','Apply copper-based or systemic fungicides','high','Before bloom and during high humidity','Follow pre-harvest intervals'),('cultural','Canopy management','Prune for better air circulation and sunlight','medium','Dormant season and early growth','Remove infected debris')]),
    ('Powdery Mildew (Grape)','White powdery growth on grape leaves and fruits','Medium','Erysiphe necator','Fungal','grape',
     [('leaf','White powdery patches on upper leaf surfaces','moderate','early'),('fruit','White coating on berries causing cracking','severe','middle')],
     [('chemical','Sulfur spray','Apply micronized sulfur or myclobutanil','high','From bud break through veraison','Avoid sulfur in temperatures above 35°C'),('cultural','Canopy management','Open canopy for sunlight and air movement','medium','Throughout season','Leaf pulling in fruit zone')]),
    # Strawberry
    ('Strawberry Grey Mold','Causes soft rot of strawberry fruits','High','Botrytis cinerea','Fungal','strawberry',
     [('fruit','Soft light brown rot covered with grey fuzzy mold','severe','middle'),('flower','Blossoms turn brown and wilt','moderate','early')],
     [('chemical','Fungicide spray','Apply captan or fenhexamid at bloom','high','At bloom and fruit set','Rotate fungicide classes'),('cultural','Spacing','Allow good air circulation between plants','medium','At planting','Remove infected fruit promptly')]),
    # Papaya
    ('Papaya Ringspot Virus','Viral disease causing ring spots on fruit','High','Papaya ringspot virus','Viral','papaya',
     [('leaf','Mosaic pattern with yellow-green mottling','moderate','early'),('fruit','Dark green ring-shaped spots on fruit surface','severe','middle'),('leaf','Leaves become shoe-string shaped','severe','late')],
     [('cultural','Resistant varieties','Plant PRSV-resistant transgenic varieties','high','At planting','Use cross-protection with mild strains'),('cultural','Aphid control','Control aphid vectors','medium','Throughout season','Use reflective mulches')]),
    # Pomegranate
    ('Bacterial Blight (Pomegranate)','Causes dark lesions and fruit rot','High','Xanthomonas axonopodis','Bacterial','pomegranate',
     [('leaf','Dark brown to black irregular spots on leaves','moderate','early'),('fruit','Oily dark spots on fruit that enlarge and crack','severe','middle')],
     [('chemical','Copper spray','Apply copper oxychloride or Bordeaux mixture','medium','At first symptoms','Repeat every 15 days during monsoon'),('cultural','Pruning','Remove and destroy infected branches','high','After harvest','Sterilize tools between cuts')]),
    # Guava
    ('Guava Wilt','Wilting disease causing tree decline and death','High','Fusarium oxysporum','Fungal','guava',
     [('leaf','Yellowing and wilting of leaves on one side first','moderate','early'),('stem','Black discoloration of roots and stem base','severe','middle'),('whole','Entire tree dies within weeks to months','severe','late')],
     [('cultural','Resistant rootstocks','Use wilt-resistant rootstock','high','At planting','Limited availability'),('cultural','Soil treatment','Apply Trichoderma-enriched compost','medium','Before planting and annually','Improves soil health')]),
    # Watermelon
    ('Fusarium Wilt (Watermelon)','Soil-borne disease causing plant wilting','High','Fusarium oxysporum f.sp. niveum','Fungal','watermelon',
     [('leaf','Leaves wilt during midday then recover at night initially','moderate','early'),('stem','Brown discoloration of vascular tissue','severe','middle'),('whole','Complete permanent wilting and plant death','severe','late')],
     [('cultural','Resistant varieties','Plant Fusarium wilt resistant varieties','high','At planting','Check race-specific resistance'),('cultural','Grafting','Graft onto resistant rootstock','high','At transplanting','Effective against multiple races')]),
    # Pineapple
    ('Pineapple Heart Rot','Causes rotting of central growing point','Medium','Phytophthora cinnamomi','Oomycete','pineapple',
     [('leaf','Central leaves turn yellow and can be easily pulled out','moderate','early'),('stem','Soft foul-smelling rot of growing point','severe','middle')],
     [('chemical','Fungicide drench','Apply phosphorous acid or metalaxyl','high','At planting and during wet season','Drench into crown'),('cultural','Drainage','Ensure excellent soil drainage','high','At field preparation','Raised beds help')]),
    # Coconut
    ('Coconut Bud Rot','Destruction of terminal bud and crown','High','Phytophthora palmivora','Oomycete','coconut',
     [('leaf','Youngest leaves turn pale and wilt','moderate','early'),('stem','Rotting of terminal bud with foul smell','severe','middle'),('whole','Crown falls off and palm dies','severe','late')],
     [('chemical','Bordeaux paste','Apply Bordeaux paste to cut surfaces','medium','At first symptoms','Prevent water entry into crown'),('cultural','Crown protection','Protect crown from rain water accumulation','medium','During monsoon','Place plastic cap over crown')]),
    # Peach
    ('Peach Leaf Curl','Distorted reddish leaves in spring','Medium','Taphrina deformans','Fungal','peach',
     [('leaf','Leaves thicken, pucker and curl with reddish color','moderate','early'),('leaf','White powdery coating as spores develop','moderate','middle'),('fruit','Fruit may be malformed and drop early','moderate','late')],
     [('chemical','Dormant spray','Apply copper fungicide or chlorothalonil','high','During dormancy before bud swell','Single application usually sufficient'),('cultural','Sanitation','Remove and destroy fallen infected leaves','medium','After leaf drop','Reduce overwintering spores')]),
    # Cotton
    ('Cotton Wilt','Serious soil-borne wilting disease','High','Fusarium oxysporum','Fungal','cotton',
     [('leaf','Yellowing and wilting of lower leaves first','moderate','early'),('stem','Browning of vascular tissues inside stem','severe','middle'),('whole','Complete wilting and death of plant','severe','late')],
     [('cultural','Crop rotation','Rotate with non-host crops for 3-4 years','high','Planning phase','Avoid cross-contamination of tools'),('cultural','Resistant varieties','Plant wilt-resistant cotton cultivars','high','Planting','Check local recommendations')]),
    ('Cotton Leaf Curl Virus','Viral disease spread by whiteflies','High','Begomovirus','Viral','cotton',
     [('leaf','Upward or downward curling of leaves','moderate','early'),('leaf','Thickening of leaf veins','moderate','middle'),('whole','Stunted plant with reduced boll formation','severe','late')],
     [('cultural','Whitefly control','Control whitefly vector with insecticides','high','Throughout season','Use neonicotinoid seed treatment'),('cultural','Resistant varieties','Plant leaf curl resistant varieties','high','At planting','Best management strategy')]),
    # Soybean
    ('Soybean Rust','Aggressive foliar fungal disease','High','Phakopsora pachyrhizi','Fungal','soybean',
     [('leaf','Small tan to dark brown lesions on lower leaves first','moderate','early'),('leaf','Pustules on undersides of leaves with spores','severe','middle'),('leaf','Premature defoliation and yield loss','severe','late')],
     [('chemical','Fungicide spray','Apply triazole + strobilurin combination','high','At first detection','Scout fields regularly for early detection'),('cultural','Early planting','Plant early-maturing varieties','medium','At planting','Escape late-season rust pressure')]),
    # Sugarcane
    ('Red Rot','Cancer of sugarcane with internal reddening','High','Colletotrichum falcatum','Fungal','sugarcane',
     [('leaf','Reddish spots on leaf midrib','mild','early'),('stem','Internal reddening of stalk with white cross bands','severe','middle'),('whole','Stalks produce sour smell and dry up','severe','late')],
     [('cultural','Healthy setts','Use disease-free planting material','high','At planting','Treat setts with hot water'),('cultural','Crop rotation','Rotate with crops like rice or legumes','high','Planning phase','Drain field well')]),
    ('Sugarcane Smut','Whip-like structure from growing point','High','Sporisorium scitamineum','Fungal','sugarcane',
     [('whole','Long black whip-like structure emerging from top','severe','middle'),('stem','Thin and spindly shoots','moderate','early')],
     [('cultural','Resistant varieties','Plant smut-resistant sugarcane varieties','high','At planting','Roguing of infected stools'),('cultural','Healthy setts','Use certified disease-free seed cane','high','At planting','Hot water treat setts at 52°C for 30 min')]),
    # Tea
    ('Tea Blister Blight','Major disease causing blister-like lesions on tea leaves','High','Exobasidium vexans','Fungal','tea',
     [('leaf','Small translucent spots on young leaves','moderate','early'),('leaf','Spots enlarge into white convex blisters on undersides','severe','middle'),('leaf','Blisters turn brown and dry, causing leaf distortion','severe','late')],
     [('chemical','Copper fungicide','Apply copper oxychloride spray','high','Every 7-10 days during wet season','Observe pre-harvest waiting period'),('cultural','Pruning','Regular pruning and plucking to remove infected shoots','medium','Throughout season','Destroy pruned material')]),
    # Coffee
    ('Coffee Leaf Rust','Devastating disease causing premature defoliation','High','Hemileia vastatrix','Fungal','coffee',
     [('leaf','Yellow-orange powdery spots on undersides of leaves','moderate','early'),('leaf','Spots enlarge and coalesce','severe','middle'),('leaf','Premature leaf drop reducing yields significantly','severe','late')],
     [('chemical','Fungicide spray','Apply copper-based or triazole fungicides','high','At start of rainy season','Repeat every 3-4 weeks'),('cultural','Shade management','Maintain optimum shade to reduce disease pressure','medium','Permanent','Use shade trees')]),
    ('Coffee Berry Disease','Serious disease causing berry rot and loss','High','Colletotrichum kahawae','Fungal','coffee',
     [('fruit','Dark sunken lesions on green berries','severe','early'),('fruit','Berries mummify and turn black','severe','late')],
     [('chemical','Fungicide spray','Apply copper or carbendazim','high','At flowering and berry development','Repeat at 3-week intervals'),('cultural','Sanitation','Remove and destroy infected berries','medium','Throughout season','Reduces inoculum')]),
    # Tobacco
    ('Tobacco Mosaic','Viral disease causing leaf mottling and stunting','Medium','Tobacco mosaic virus','Viral','tobacco',
     [('leaf','Light and dark green mosaic pattern on leaves','moderate','early'),('leaf','Leaves may become distorted and blistered','moderate','middle'),('whole','Stunted growth and reduced leaf quality','moderate','late')],
     [('cultural','Hygiene','Wash hands with milk or soap before handling plants','high','Always','TMV is extremely stable and infectious'),('cultural','Resistant varieties','Plant TMV-resistant tobacco varieties','high','At planting','Most modern varieties have resistance')]),
    # Groundnut
    ('Groundnut Leaf Spot','Most common disease of groundnuts','Medium','Cercospora arachidicola','Fungal','groundnut',
     [('leaf','Small dark brown circular spots on leaflets','moderate','early'),('leaf','Spots enlarge with yellow halos, premature defoliation','severe','middle')],
     [('chemical','Fungicide spray','Apply chlorothalonil or mancozeb','high','At 30-35 days after sowing','Repeat at 14-day intervals'),('cultural','Crop rotation','Rotate with cereals or other non-host crops','medium','Yearly','2-3 year rotation recommended')]),
    # Mustard
    ('Alternaria Blight (Mustard)','Dark spot disease of mustard','Medium','Alternaria brassicae','Fungal','mustard',
     [('leaf','Dark brown circular to irregular spots on leaves','moderate','early'),('stem','Dark elongated lesions on stems and siliquae','moderate','middle'),('fruit','Dark spots on pods reducing seed quality','severe','late')],
     [('chemical','Fungicide spray','Apply mancozeb or iprodione','high','At first symptoms','Spray at 15-day intervals'),('cultural','Clean seed','Use disease-free certified seed','high','At planting','Seed treatment with thiram')]),
    # Rubber
    ('Rubber Leaf Fall','Abnormal leaf fall disease of rubber trees','Medium','Phytophthora spp.','Oomycete','rubber',
     [('leaf','Water-soaked lesions on leaves during refoliation','moderate','early'),('leaf','Extensive defoliation within days','severe','middle')],
     [('chemical','Copper fungicide','Aerial spraying of copper oxychloride','medium','During refoliation period','Timing is critical'),('cultural','Clonal selection','Plant disease-tolerant clones','high','At planting','Long-term management')]),
    # Jute
    ('Jute Stem Rot','Devastating disease of jute plants','High','Macrophomina phaseolina','Fungal','jute',
     [('stem','Dark brown to black lesions on stem base','severe','early'),('stem','Shredding of bark tissue','severe','middle'),('whole','Plants wilt and die','severe','late')],
     [('cultural','Seed treatment','Treat seeds with carbendazim','high','Before sowing','Use 2g per kg seed'),('cultural','Crop rotation','Rotate with rice or other crops','medium','Yearly','Avoid continuous jute cultivation')]),
    # New Popular Diseases added:
    ('Tomato Yellow Leaf Curl', 'Highly destructive viral disease causing leaf curl and severe stunting', 'High', 'Tomato yellow leaf curl virus', 'Viral', 'tomato',
     [('leaf', 'Upward curling and crumpling of leaves', 'severe', 'early'),
      ('leaf', 'Yellowing of leaf margins and interveinal areas', 'moderate', 'middle'),
      ('whole', 'Severe stunting of the plant with bushy appearance', 'severe', 'late')],
     [('chemical', 'Insecticide application', 'Apply systemic insecticides targeting whitefly vectors', 'high', 'At first sighting of whiteflies', 'Observe pre-harvest interval'),
      ('cultural', 'Physical barriers', 'Use fine mesh screens in greenhouses or row covers', 'medium', 'Before transplanting', 'Ensure no pests are trapped inside'),
      ('organic', 'Neem oil spray', 'Spray neem oil weekly to deter whitefly vectors', 'medium', 'Early morning or evening', 'Test on small leaf section first')]),
    ('Potato Common Scab', 'Bacterial disease causing raised corky lesions on potato tuber skin', 'Medium', 'Streptomyces scabies', 'Bacterial', 'potato',
     [('tuber', 'Raised brown corky lesions or spots on tuber surface', 'moderate', 'middle'),
      ('tuber', 'Pitted or dark sunken lesions extending into tuber flesh', 'severe', 'late')],
     [('cultural', 'Soil pH management', 'Apply sulfur to lower soil pH below 5.2', 'high', 'Before planting', 'Monitor soil pH level'),
      ('cultural', 'Irrigation management', 'Keep soil adequately moist during tuber development', 'medium', 'During tuberization', 'Avoid waterlogging'),
      ('chemical', 'Seed piece treatment', 'Treat seed pieces with mancozeb or fludioxonil', 'high', 'Prior to planting', 'Wear protective equipment')]),
    ('Apple Powdery Mildew', 'Fungal disease characterized by white powdery coating on leaves and shoots', 'Medium', 'Podosphaera leucotricha', 'Fungal', 'apple',
     [('leaf', 'White to light grey powdery patches on leaves and young shoots', 'moderate', 'early'),
      ('leaf', 'Leaves curling upward, becoming narrow and stiff', 'moderate', 'middle'),
      ('stem', 'Stunted shoot growth and bud distortion', 'severe', 'late')],
     [('chemical', 'Fungicide program', 'Apply sulfur or triazole (myclobutanil) fungicides', 'high', 'At tight cluster stage through petal fall', 'Ensure uniform coverage'),
      ('cultural', 'Pruning', 'Prune out infected shoots and powdery buds during winter dormancy', 'high', 'During winter pruning', 'Burn or destroy pruned twigs'),
      ('organic', 'Potassium bicarbonate spray', 'Apply potassium bicarbonate solution to leaves', 'medium', 'At first sign of symptoms', 'Avoid applying in hot direct sun')]),
    ('Citrus Melanose', 'Fungal disease causing sand-papery raised dark spots on citrus leaves and fruit', 'Medium', 'Diaporthe citri', 'Fungal', 'citrus',
     [('leaf', 'Small, raised, dark brown to black spots on leaves', 'moderate', 'early'),
      ('leaf', 'Leaves feeling rough like sandpaper when touched', 'moderate', 'middle'),
      ('fruit', 'Crusty brown lesions or tear-stain patterns on fruit skin', 'severe', 'late')],
     [('chemical', 'Copper fungicide spray', 'Apply copper oxychloride or copper hydroxide', 'high', 'Post-bloom at petal fall', 'Avoid spraying during extreme heat'),
      ('cultural', 'Pruning deadwood', 'Prune and remove dead twigs and branches within canopy', 'high', 'During dry season', 'Sterilize pruning tools')]),
    ('Brown Spot of Rice', 'Fungal disease causing oval brown spots on leaves, associated with nutrient-deficient soils', 'Medium', 'Bipolaris oryzae', 'Fungal', 'rice',
     [('leaf', 'Small circular or oval dark brown spots on leaves', 'mild', 'early'),
      ('leaf', 'Lesions enlarge with yellow halos and grey-white centers', 'moderate', 'middle'),
      ('fruit', 'Discolored grains and black spots on glumes', 'severe', 'late')],
     [('cultural', 'Soil nutrition', 'Apply balanced fertilizers, especially adequate potassium and nitrogen', 'high', 'Throughout crop cycle', 'Conduct soil tests beforehand'),
      ('chemical', 'Seed treatment', 'Treat seeds with thiram or captan fungicides', 'high', 'Before sowing', 'Handle chemical seeds with care'),
      ('chemical', 'Foliar spray', 'Spray propiconazole or hexaconazole fungicides', 'high', 'At tillering or booting stage', 'Observe safety rules')]),
    ('Wheat Loose Smut', 'Systemic fungal disease where grain heads are replaced by black powdery spores', 'High', 'Ustilago nuda', 'Fungal', 'wheat',
     [('flower', 'Ears emerge earlier and are covered with olive-black spore masses', 'severe', 'early'),
      ('whole', 'Spores blow away leaving only the bare central stalk (rachis)', 'severe', 'middle')],
     [('chemical', 'Systemic seed dressing', 'Dress seed with carboxin or tebuconazole fungicides', 'high', 'Prior to sowing', 'Observe seed treating safety'),
      ('cultural', 'Certified seed', 'Use certified clean, disease-free seed only', 'high', 'At planting', 'Avoid saving seeds from infected fields')]),
]

def main():
    lines = []
    lines.append('#!/usr/bin/env python3')
    lines.append('"""Database seeding script for PlantCare Pro - Expanded"""')
    lines.append('')
    lines.append('import os, sys')
    lines.append('sys.path.insert(0, os.path.dirname(__file__))')
    lines.append('')
    lines.append('from main import app')
    lines.append('from models.plant import Plant, Disease, Symptom, Treatment')
    lines.append('from models.user import db')
    lines.append('')
    lines.append('def seed_database():')
    lines.append('    with app.app_context():')
    lines.append('        db.drop_all()')
    lines.append('        db.create_all()')
    lines.append('')

    # Plants
    lines.append('        plants_data = [')
    for p in PLANTS:
        lines.append(f"            {{'id': {repr(p[0])}, 'name': {repr(p[1])}, 'scientific_name': {repr(p[2])}, 'category': {repr(p[3])}, 'category_label': {repr(p[4])}, 'description': {repr(p[5])}, 'image_path': '/assets/images/{p[3]}/{p[0]}_healthy.jpg'}},")
    lines.append('        ]')
    lines.append('')
    lines.append('        for pd in plants_data:')
    lines.append('            db.session.add(Plant(**pd))')
    lines.append('        db.session.commit()')
    lines.append('        print("Plants added")')
    lines.append('')

    # Diseases
    lines.append('        diseases_data = [')
    for d in DISEASES:
        name, desc, sev, pathogen, ptype, pid, symptoms, treatments = d
        syms = []
        for s in symptoms:
            syms.append(f"{{'category': {repr(s[0])}, 'description': {repr(s[1])}, 'severity': {repr(s[2])}, 'stage': {repr(s[3])}}}")
        treats = []
        for t in treatments:
            treats.append(f"{{'treatment_type': {repr(t[0])}, 'method': {repr(t[1])}, 'description': {repr(t[2])}, 'effectiveness': {repr(t[3])}, 'application_timing': {repr(t[4])}, 'precautions': {repr(t[5])}}}")
        lines.append(f"            {{'name': {repr(name)}, 'description': {repr(desc)}, 'severity': {repr(sev)}, 'pathogen': {repr(pathogen)}, 'pathogen_type': {repr(ptype)}, 'plant_id': {repr(pid)}, 'symptoms': [{', '.join(syms)}], 'treatments': [{', '.join(treats)}]}},")
    lines.append('        ]')
    lines.append('')
    lines.append('        for dd in diseases_data:')
    lines.append('            disease = Disease(name=dd["name"], description=dd.get("description",""), severity=dd.get("severity","Medium"), pathogen=dd["pathogen"], pathogen_type=dd["pathogen_type"], plant_id=dd["plant_id"])')
    lines.append('            db.session.add(disease)')
    lines.append('            db.session.flush()')
    lines.append('            for sd in dd["symptoms"]:')
    lines.append('                db.session.add(Symptom(disease_id=disease.id, **sd))')
    lines.append('            for td in dd["treatments"]:')
    lines.append('                db.session.add(Treatment(disease_id=disease.id, **td))')
    lines.append('        db.session.commit()')
    lines.append('')
    lines.append('        pc = Plant.query.count()')
    lines.append('        dc = Disease.query.count()')
    lines.append('        sc = Symptom.query.count()')
    lines.append('        tc = Treatment.query.count()')
    lines.append('        print(f"Database Summary: Plants={pc}, Diseases={dc}, Symptoms={sc}, Treatments={tc}")')
    lines.append('        print("Database seeding completed!")')
    lines.append('')
    lines.append("if __name__ == '__main__':")
    lines.append('    seed_database()')

    with open(os.path.join(os.path.dirname(__file__), 'seed_database.py'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"Generated seed_database.py with {len(PLANTS)} plants and {len(DISEASES)} diseases")

if __name__ == '__main__':
    main()
