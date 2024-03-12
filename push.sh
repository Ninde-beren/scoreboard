#!/bin/bash
#!/usr/bin/expect -f
# Push script
# Run ./push.sh {env}
if [ "$1" = 'dev' ]; then
    echo 'Pushing on dev'
    npm run build:dev
    scp -r -p 22 ssh build ionos:~/scoreboard/newbuild/
    ssh  -i ~/.ssh/id_rsa_pro ionos -p 22 '~/scoreboard/update_script.sh'
#!/bin/bash
elif [ "$1" = 'release' ]; then
    echo 'Pushing on release'
    npm run build:release
    scp -r -P 9022 -v -i ~/.ssh/id_rsa build ubuntu@51.77.205.168:/var/www/mt/release-front/mtv3/newBuild
    ssh -v -i ~/.ssh/id_rsa ubuntu@51.77.205.168 -p 9022 '/var/www/mt/release-front/mtv3/script.sh'
elif [ "$1" = 'prod' ]; then
    echo 'Pushing on prod'
    npm run build:prod
    scp -r -P 9022 -v -i ~/.ssh/id_rsa build ubuntu@51.77.205.168:/var/www/mt/prod-front/mtv3/newBuild
    ssh -v -i ~/.ssh/id_rsa ubuntu@51.77.205.168 -p 9022 '/var/www/mt/prod-front/mtv3/script.sh'
else
    echo 'Missing parameter'
    echo 'Syntax without npm: ./push.sh dev | release | demo | prod'
    echo 'Syntax with npm: npm run push-dev | push-release | push-prod | push-demo'
fi
