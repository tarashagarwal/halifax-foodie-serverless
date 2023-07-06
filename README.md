
![Serverless Architecture-Request Logic](https://github.com/tarashagarwal/halifax-foodie-serverless/assets/10708684/9ed378b5-12e8-48ba-8286-183f61e28cb8)

docker stop $(docker ps -q -a) && docker rm $(docker ps -q -a) && docker build -t halifaxfoodie . && docker run -d -p 8080:80 halifaxfoodie
