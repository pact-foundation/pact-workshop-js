# Diffs


1. master/package.json = all steps bar step1

        diff master/package.json step1/package.json 
        6,8c6,7
        <     "postinstall": "concurrently \"npm ci --prefix consumer\" \"npm ci --prefix provider\"",
        <     "start": "concurrently \"npm start --prefix consumer\" \"npm start --prefix provider\"",
        <     "lint": "concurrently \"cd consumer/ && npx eslint .\" \"cd provider/ && npx eslint .\""
        ---
        >     "postinstall": "npm ci --prefix consumer",
        >     "start": "npm start --prefix consumer"

2. diff master against step1

        diff master step1
        Common subdirectories: master/consumer and step1/consumer
        Only in master: package-lock.json
        diff --color master/package.json step1/package.json
        6,8c6,7
        <     "postinstall": "concurrently \"npm ci --prefix consumer\" \"npm ci --prefix provider\"",
        <     "start": "concurrently \"npm start --prefix consumer\" \"npm start --prefix provider\"",
        <     "lint": "concurrently \"cd consumer/ && npx eslint .\" \"cd provider/ && npx eslint .\""
        ---
        >     "postinstall": "npm ci --prefix consumer",
        >     "start": "npm start --prefix consumer"
        Only in master: provider

3. diff master against step12

        diff master step12
        Common subdirectories: master/consumer and step12/consumer



react-router 

6.3.0 -> 6.16.0

react-router-dom

6.3.0 -> 6.16.0
