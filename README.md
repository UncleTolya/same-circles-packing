Run battery

docker build . -t cr.yandex/crpbo2pe37vojj7u86hg/battery

docker push cr.yandex/crpbo2pe37vojj7u86hg/battery

ssh -i ~/.ssh/id_egor_yc admin@62.84.122.212

sudo docker pull cr.yandex/crpbo2pe37vojj7u86hg/battery

sudo docker stop battery2 && sudo docker rm battery2us

sudo docker run --name battery -p 8080:8080 -p 8100:8100 -d cr.yandex/crpbo2pe37vojj7u86hg/battery

